
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CONFIG_PATH = path.join(__dirname, '../webcams.config.json');
const REPORT_PATH = path.join(__dirname, '../maintenance_report.md');
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
  const unfixableWebcams = [];
  const fixedWebcams = [];

  for (const chunk of chunks) {
    const ids = chunk.map(w => w.id);
    const videos = await batchCheckStatus(ids);
    const videoMap = new Map(videos.map(v => [v.id, v]));

    for (const webcam of chunk) {
      const video = videoMap.get(webcam.id);
      const isLive = video && video.snippet.liveBroadcastContent === 'live';

      if (!isLive) {
        console.log(`[DEAD] ${webcam.name} (${webcam.id})`);
        deadCount++;
        
        const searchQuery = `${webcam.name} live cam`;
        console.log(`       Searching replacement: "${searchQuery}"...`);
        
        const newId = await searchNewVideo(searchQuery);
        
        if (newId && newId !== webcam.id) {
            console.log(`       [FIXED] Found new ID: ${newId}`);
            webcam.id = newId;
            webcam.streamUrl = `https://www.youtube.com/embed/${newId}?autoplay=1&mute=1`;
            webcam.thumbnailUrl = `https://i.ytimg.com/vi/${newId}/mqdefault_live.jpg`;
            webcam.updatedAt = new Date().toISOString();
            updatedCount++;
            fixedWebcams.push({ name: webcam.name, oldId: webcam.id, newId: newId });
        } else {
          console.log(`       [FAILED] No replacement found.`);
          unfixableWebcams.push(webcam);
        }
      }
    }
  }

  console.log(`\nSummary:`);
  console.log(`Checked: ${youtubeWebcams.length}`);
  console.log(`Dead: ${deadCount}`);
  console.log(`Repaired: ${updatedCount}`);
  console.log(`Unfixable: ${unfixableWebcams.length}`);

  // Save updates
  if (updatedCount > 0) {
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(webcams, null, 2));
    console.log(`\n✅ Saved updates to webcams.config.json`);
  }

  // Generate Report
  let reportContent = '';
  
  if (unfixableWebcams.length > 0) {
    reportContent += `---
title: Dead Webcams Report
labels: maintenance
assignees: tristan
---

### ⚠️ Unfixable Webcams Detected

The following webcams are offline and no replacement could be found automatically. Please review them manually.

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
  } else {
      if (fs.existsSync(REPORT_PATH)) {
          fs.unlinkSync(REPORT_PATH);
      }
  }
}

maintainWebcams();
