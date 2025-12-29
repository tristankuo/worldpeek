
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

async function updateWebcams() {
  console.log(`Starting validation for ${webcams.length} webcams...`);
  
  const youtubeWebcams = webcams.filter(w => w.provider === 'YouTube');
  
  // Batch IDs into groups of 50
  const chunks = [];
  for (let i = 0; i < youtubeWebcams.length; i += 50) {
    chunks.push(youtubeWebcams.slice(i, i + 50));
  }

  const deadWebcams = [];

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
        deadWebcams.push(webcam);
      }
    }
  }

  console.log(`\nSummary:`);
  console.log(`Checked: ${youtubeWebcams.length}`);
  console.log(`Dead: ${deadWebcams.length}`);

  if (deadWebcams.length > 0) {
    const reportPath = path.join(__dirname, '../dead_streams_report.md');
    const reportContent = `
# 🚨 Invalid Webcam Streams Report

The following ${deadWebcams.length} webcams appear to be offline or invalid:

${deadWebcams.map(w => `- **${w.name}** (ID: \`${w.id}\`)\n  - City: ${w.city}, ${w.country}\n  - [Link](https://youtu.be/${w.id})`).join('\n')}

Please update these IDs in \`webcams.config.json\`.
    `.trim();

    fs.writeFileSync(reportPath, reportContent);
    console.log(`Report written to ${reportPath}`);
    
    // Set output for GitHub Actions
    if (process.env.GITHUB_OUTPUT) {
      fs.appendFileSync(process.env.GITHUB_OUTPUT, `has_dead_streams=true\n`);
    }
  }
}

updateWebcams();
