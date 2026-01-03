
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CONFIG_PATH = path.join(__dirname, '../webcams.config.json');
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

const webcams = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));

function cleanQuery(text) {
  if (!text) return '';
  text = text.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '');
  text = text.replace(/【.*?】/g, ' ').replace(/\[.*?\]/g, ' ').replace(/\(.*?\)/g, ' ').replace(/（.*?）/g, ' ');
  text = text.replace(/Live Cam|Live Stream|Webcam|4K|24\/7|HD|High Definition|Live|Camera|Ramen|News|Stream|View/gi, ' ');
  return text.replace(/\s+/g, ' ').trim();
}

async function geocode(query) {
  if (!MAPS_API_KEY || !query || query.length < 2) return null;
  try {
    console.log(`      Searching: "${query}"`);
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(query)}&key=${MAPS_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'OK' && data.results.length > 0) {
      return data.results[0];
    } else {
        console.log("Geocode failed:", data.status);
    }
  } catch (err) {
    console.error(`   ❌ Error geocoding "${query}":`, err.message);
  }
  return null;
}

async function debug() {
    const targetId = "fGOCRGXPgRY";
    const webcam = webcams.find(w => w.id === targetId);
    
    if (!webcam) {
        console.log("Webcam not found");
        return;
    }

    console.log("Processing:", webcam.name);
    
    let result = null;
    let usedQuery = '';

    // Strategy 1: Cleaned Name
    let query = cleanQuery(webcam.name);
    console.log("Strategy 1 Query:", query);
    if (query.length > 2) {
        result = await geocode(query);
        usedQuery = query;
    }

    // Strategy 2: Split by separators
    if (!result && webcam.name.match(/[|\/／\-]/)) {
        const parts = webcam.name.split(/[|\/／\-]/);
        for (let i = parts.length - 1; i >= 0; i--) {
            const partQuery = cleanQuery(parts[i]);
            console.log("Strategy 2 Part:", partQuery);
            if (partQuery.length > 3) {
                result = await geocode(partQuery);
                if (result) {
                    usedQuery = partQuery;
                    break;
                }
            }
        }
    }
    
    if (result) {
        console.log("Found location:", result.formatted_address);
    } else {
        console.log("Failed to find location");
    }
}

debug();
