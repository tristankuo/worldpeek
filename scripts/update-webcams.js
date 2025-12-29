
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CONFIG_PATH = path.join(__dirname, '../webcams.config.json');
const API_KEY = process.env.YOUTUBE_API_KEY;

if (!API_KEY) {
  console.error('Error: YOUTUBE_API_KEY is not set');
  process.exit(1);
}

const webcams = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));

async function batchCheckStatus(ids) {
  const idsString = ids.join(',');
  const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${idsString}&key=${API_KEY}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    return data.items || [];
  } catch (error) {
    console.error('Failed to fetch video status:', error);
    return [];
  }
}

async function searchNewVideo(query) {
  // Search for live videos matching the query
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&eventType=live&type=video&q=${encodeURIComponent(query)}&key=${API_KEY}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`Search API Error: ${response.status}`);
      return null;
    }
    const data = await response.json();
    if (data.items && data.items.length > 0) {
      return data.items[0].id.videoId;
    }
  } catch (error) {
    console.error('Failed to search for new video:', error);
  }
  return null;
}

async function updateWebcams() {
  console.log(`Starting update check for ${webcams.length} webcams...`);
  
  const youtubeWebcams = webcams.filter(w => w.provider === 'YouTube');
  const otherWebcams = webcams.filter(w => w.provider !== 'YouTube');
  
  // Batch IDs into groups of 50
  const chunks = [];
  for (let i = 0; i < youtubeWebcams.length; i += 50) {
    chunks.push(youtubeWebcams.slice(i, i + 50));
  }

  let updatedCount = 0;
  let deadCount = 0;

  for (const chunk of chunks) {
    const ids = chunk.map(w => w.id);
    const videos = await batchCheckStatus(ids);
    
    // Create a map of found videos
    const videoMap = new Map(videos.map(v => [v.id, v]));

    for (const webcam of chunk) {
      const video = videoMap.get(webcam.id);
      const isLive = video && video.snippet.liveBroadcastContent === 'live';

      if (!isLive) {
        console.log(`[DEAD] ${webcam.name} (${webcam.id})`);
        deadCount++;
        
        // Try to find a replacement
        // Use the name + "live cam" as search query
        const searchQuery = `${webcam.name} live cam`;
        console.log(`       Searching: "${searchQuery}"...`);
        
        const newId = await searchNewVideo(searchQuery);
        
        if (newId) {
          if (newId === webcam.id) {
             console.log(`       Found same ID (maybe it just came back online?): ${newId}`);
             // It was reported as not live in batch check, but search found it? 
             // Or maybe search returned a non-live video? (eventType=live should prevent this)
          } else {
            console.log(`       [REPLACED] Found new ID: ${newId}`);
            webcam.id = newId;
            webcam.streamUrl = `https://www.youtube.com/embed/${newId}?autoplay=1&mute=1`;
            webcam.thumbnailUrl = `https://i.ytimg.com/vi/${newId}/mqdefault_live.jpg`;
            updatedCount++;
          }
        } else {
          console.log(`       [FAILED] No replacement found.`);
        }
      }
    }
  }

  console.log(`\nSummary:`);
  console.log(`Checked: ${youtubeWebcams.length}`);
  console.log(`Dead: ${deadCount}`);
  console.log(`Updated: ${updatedCount}`);

  if (updatedCount > 0) {
    // Merge back
    // We modified objects in 'youtubeWebcams' which are references to objects in 'webcams' array?
    // Yes, filter returns a new array but elements are references.
    // So 'webcams' should be updated.
    
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(webcams, null, 2));
    console.log(`Saved changes to ${CONFIG_PATH}`);
  }
}

updateWebcams();
