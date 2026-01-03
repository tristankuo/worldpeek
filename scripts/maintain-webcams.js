
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CONFIG_PATH = path.join(__dirname, '../webcams.config.json');
const REPORT_PATH = path.join(__dirname, '../maintenance_report.md');
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

if (!YOUTUBE_API_KEY) {
  console.error('Error: YOUTUBE_API_KEY is not set');
  process.exit(1);
}

// Optional Maps API Key
if (!MAPS_API_KEY) {
  console.warn('Warning: GOOGLE_MAPS_API_KEY is not set. Geolocation fixes will be skipped.');
}

const webcams = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// --- Geolocation Helpers ---

function cleanQuery(text) {
  if (!text) return '';
  // Remove emojis
  text = text.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '');
  
  // Remove specific keywords (English, Japanese, Chinese)
  // Order matters! Longer phrases first to avoid partial matches (e.g. "Live Camera" vs "Live Cam")
  text = text.replace(/Live Camera|Live Cam|Live Stream|Webcam|4K|24\/7|HD|High Definition|Live|Camera|Ramen|News|Stream|View/gi, ' ');
  text = text.replace(/ライブカメラ|ライブ配信|生中継|実況|配信|カメラ/g, ' ');
  text = text.replace(/即時影像|直播|實況|攝影機/g, ' ');

  // Replace brackets with spaces (keep content) - this helps preserve English names inside brackets
  text = text.replace(/[【】\[\]\(\)（）]/g, ' ');
  
  return text.replace(/\s+/g, ' ').trim();
}

async function geocode(query) {
  if (!MAPS_API_KEY || !query || query.length < 2) return null;
  try {
    // console.log(`      Searching: "${query}"`);
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(query)}&key=${MAPS_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'OK' && data.results.length > 0) {
      return data.results[0];
    }
  } catch (err) {
    console.error(`   ❌ Error geocoding "${query}":`, err.message);
  }
  return null;
}

function getComponent(components, type) {
  const comp = components.find(c => c.types.includes(type));
  return comp ? comp.long_name : null;
}

// --- YouTube API Helpers ---

async function batchCheckStatus(ids) {
  if (ids.length === 0) return [];
  const idsString = ids.join(',');
  const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${idsString}&key=${YOUTUBE_API_KEY}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      const txt = await response.text();
      console.error(`API Error: ${response.status} ${txt}`);
      // Return null to indicate failure, not empty list (which means all dead)
      return null;
    }
    const data = await response.json();
    return data.items || [];
  } catch (error) {
    console.error('Failed to fetch video status:', error);
    return null;
  }
}

async function searchNewVideo(query) {
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&eventType=live&type=video&q=${encodeURIComponent(query)}&key=${YOUTUBE_API_KEY}`;

  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    const data = await response.json();
    if (data.items && data.items.length > 0) {
      return data.items[0]; // Return full item to get title/desc if needed
    }
  } catch (error) {
    console.error('Failed to search for new video:', error);
  }
  return null;
}

async function maintainWebcams() {
  console.log(`Starting maintenance for ${webcams.length} webcams...`);

  const youtubeWebcams = webcams.filter(w => w.provider === 'YouTube');

  // Batch IDs into groups of 50
  const chunks = [];
  for (let i = 0; i < youtubeWebcams.length; i += 50) {
    chunks.push(youtubeWebcams.slice(i, i + 50));
  }

  let updatedCount = 0;
  let deadCount = 0;
  let geolocatedCount = 0;
  const unfixableWebcams = [];
  const fixedWebcams = [];

  for (const chunk of chunks) {
    const ids = chunk.map(w => w.id);
    const videos = await batchCheckStatus(ids);
    
    // If API failed, skip this chunk to avoid deleting valid webcams
    if (videos === null) {
      console.warn(`Skipping chunk of ${ids.length} webcams due to API error.`);
      continue;
    }

    const videoMap = new Map(videos.map(v => [v.id, v]));

    for (const webcam of chunk) {
      // 1. Check Status
      const video = videoMap.get(webcam.id);
      const isLive = video && video.snippet.liveBroadcastContent === 'live';

      // 1.5 Update Metadata for New Webcams
      if (video && webcam.name.startsWith('New Webcam')) {
        console.log(`[UPDATE] Fetching details for new webcam: ${webcam.id}`);
        webcam.name = video.snippet.title;
        webcam.description = video.snippet.description;
        updatedCount++;
      }

      if (!isLive) {
        console.log(`[DEAD] ${webcam.name} (${webcam.id})`);
        deadCount++;

        // Try to replace
        let searchQuery = `${webcam.name} live cam`;
        if (webcam.city && webcam.city !== 'Unknown') searchQuery += ` ${webcam.city}`;

        console.log(`       Searching replacement: "${searchQuery}"...`);
        const item = await searchNewVideo(searchQuery);

        if (item && item.id.videoId && item.id.videoId !== webcam.id) {
          const newId = item.id.videoId;
          console.log(`       [FIXED] Found new ID: ${newId}`);
          webcam.id = newId;
          webcam.streamUrl = `https://www.youtube.com/embed/${newId}?autoplay=1&mute=1`;
          webcam.thumbnailUrl = `https://i.ytimg.com/vi/${newId}/mqdefault_live.jpg`;
          webcam.updatedAt = new Date().toISOString();

          // If name is totally generic, maybe update it? (Optional, skipping for now to be safe)

          updatedCount++;
          fixedWebcams.push({ name: webcam.name, oldId: webcam.id, newId: newId });
        } else {
          console.log(`       [FAILED] No replacement found. Marking for removal.`);
          webcam._remove = true;
          unfixableWebcams.push(webcam);
          continue; // Skip geolocation if we are removing it
        }
      }

      // 2. Check/Fix Geolocation (if MAPS API KEY present)
      const needsGeo = (webcam.coordinates.lat === 0 && webcam.coordinates.lng === 0) || !webcam.city || webcam.city === 'Unknown';
      
      if (MAPS_API_KEY && needsGeo) {
        console.log(`[GEO] Fixing location for: ${webcam.name}`);

        let result = null;
        let usedQuery = '';

        // Strategy 1: Cleaned Name
        let query = cleanQuery(webcam.name);
        if (query.length > 2) {
          result = await geocode(query);
          usedQuery = query;
        }

        // Strategy 2: Split by separators (often English part is separated)
        if (!result && webcam.name.match(/[|\/／\-｜]/)) {
           const parts = webcam.name.split(/[|\/／\-｜]/);
           // Try parts from end to start (often English is at the end)
           for (let i = parts.length - 1; i >= 0; i--) {
             const partQuery = cleanQuery(parts[i]);
             if (partQuery.length > 2) { // Reduced min length to 2 for short names like "Fuji"
               result = await geocode(partQuery);
               if (result) {
                 usedQuery = partQuery;
                 break;
               }
             }
           }
        }

        // Strategy 2.5: Extract English Text (for mixed language titles)
        if (!result) {
           const englishText = webcam.name.replace(/[^\x00-\x7F]+/g, ' ').trim();
           const englishQuery = cleanQuery(englishText);
           if (englishQuery.length > 3) {
             result = await geocode(englishQuery);
             if (result) {
               usedQuery = englishQuery;
             }
           }
        }

        // Strategy 3: Use description if name failed
        if (!result && webcam.description) {
           const descQuery = cleanQuery(webcam.description).substring(0, 50); // Limit length
           if (descQuery.length > 5) {
             result = await geocode(descQuery);
             usedQuery = descQuery;
           }
        }

        if (result) {
          const loc = result.geometry.location;
          webcam.coordinates.lat = loc.lat;
          webcam.coordinates.lng = loc.lng;

          // Extract City/Country
          const components = result.address_components;
          const city = getComponent(components, 'locality') ||
            getComponent(components, 'administrative_area_level_1') ||
            getComponent(components, 'postal_town');
          const country = getComponent(components, 'country');

          if (city) webcam.city = city;
          if (country) webcam.country = country;

          // Adjust Category if needed
          if (webcam.category === 'added-automatically' || !webcam.category) {
            const types = result.types;
            if (types.includes('natural_feature') || types.includes('park')) webcam.category = 'nature';
            else if (types.includes('point_of_interest')) webcam.category = 'landmark';
            else webcam.category = 'city';
          }

          // Fix Description if needed
          if (!webcam.description || webcam.description === webcam.name) {
            webcam.description = `Live view of ${usedQuery} in ${webcam.city || 'Unknown'}, ${webcam.country || 'Unknown'}.`;
          }

          console.log(`      -> Found: ${result.formatted_address} (via "${usedQuery}")`);
          geolocatedCount++;
          updatedCount++;
          // Sleep slightly to be polite
          await sleep(200);
        } else {
          console.log(`      -> Could not find location.`);
        }
      }
    }
  }

  // Filter out removed webcams
  const activeWebcams = webcams.filter(w => !w._remove);
  const removedCount = webcams.length - activeWebcams.length;

  // 3. Deduplicate Coordinates
  console.log('\nChecking for duplicate coordinates...');
  const coordMap = new Map();
  let jitterCount = 0;

  for (const webcam of activeWebcams) {
    // Skip if 0,0 (failed geolocation)
    if (webcam.coordinates.lat === 0 && webcam.coordinates.lng === 0) continue;

    // Use 4 decimal places for collision detection (approx 11m precision)
    const key = `${webcam.coordinates.lat.toFixed(4)},${webcam.coordinates.lng.toFixed(4)}`;
    
    if (coordMap.has(key)) {
      // Collision detected! Jitter it.
      // Offset by +/- 0.0005 to 0.0025 (approx 50m to 250m)
      const latOffset = (Math.random() * 0.002 + 0.0005) * (Math.random() > 0.5 ? 1 : -1);
      const lngOffset = (Math.random() * 0.002 + 0.0005) * (Math.random() > 0.5 ? 1 : -1);
      
      webcam.coordinates.lat += latOffset;
      webcam.coordinates.lng += lngOffset;
      
      jitterCount++;
      updatedCount++; // Ensure we save
    } else {
      coordMap.set(key, true);
    }
  }
  console.log(`Jittered ${jitterCount} overlapping locations.`);

  console.log(`\nSummary:`);
  console.log(`Checked: ${youtubeWebcams.length}`);
  console.log(`Dead: ${deadCount}`);
  console.log(`Repaired: ${fixedWebcams.length}`);
  console.log(`Removed: ${removedCount}`);
  console.log(`Geolocated: ${geolocatedCount}`);

  // Save updates if there are repairs, removals OR geolocations
  if (updatedCount > 0 || removedCount > 0) {
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(activeWebcams, null, 2));
    console.log(`\n✅ Saved updates to webcams.config.json`);
  }

  // Generate Report
  let reportContent = '';

  if (unfixableWebcams.length > 0) {
    reportContent += `---
title: 🗑️ Removed Dead Webcams Report
labels: maintenance
assignees: tristan
---

### ⚠️ Webcams Removed from Production

The following webcams were found to be dead and no replacement could be found automatically. **They have been removed from the configuration file**.

| Name | ID | City | Country |
|------|----|------|---------|
${unfixableWebcams.map(w => `| ${w.name} | \`${w.id}\` | ${w.city} | ${w.country} |`).join('\n')}

`;
  }

  if (fixedWebcams.length > 0) {
    reportContent += `
### ✅ Automatically Repaired Webcams

| Name | Old ID | New ID |
|------|--------|--------|
${fixedWebcams.map(w => `| ${w.name} | \`${w.oldId}\` | \`${w.newId}\` |`).join('\n')}
`;
  }

  if (reportContent) {
    fs.writeFileSync(REPORT_PATH, reportContent);
    console.log(`Report generated at ${REPORT_PATH}`);
  } else if (fs.existsSync(REPORT_PATH)) {
    fs.unlinkSync(REPORT_PATH);
  }
}

maintainWebcams();
