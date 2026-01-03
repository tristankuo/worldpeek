
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
  // Remove emojis
  text = text.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '');
  
  // Remove specific keywords (English, Japanese, Chinese)
  text = text.replace(/Live Cam|Live Stream|Webcam|4K|24\/7|HD|High Definition|Live|Camera|Ramen|News|Stream|View/gi, ' ');
  text = text.replace(/ライブカメラ|ライブ配信|生中継|実況|配信|カメラ/g, ' ');
  text = text.replace(/即時影像|直播|實況|攝影機/g, ' ');

  // Replace brackets with spaces (keep content)
  text = text.replace(/[【】\[\]\(\)（）]/g, ' ');
  
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
    const testCases = [
        "International Space Station",
        "レインボーブリッジ①　お台場東京　ライブ配信【ちんあなご】Livestream- RainbowBridge tokyo Japan",
        "善光寺LIVEカメラ（Zenkoji Live Cam)　INC長野ケーブルテレビ",
        "成田山新勝寺ライブカメラ",
        "【LIVE】京都 北野天満宮前付近ライブ中継カメラ（京都市観光協会公式）／Kitano Tenmangu Shrine, Kyoto Live camera",
        "錦帯橋ライブカメラ　Kintaikyo Bridge Live Stream",
        "ライブカメラ　輪島市（石川県）Wajima , Ishikawa , Japan - Live Camera #輪島市 #輪島 #石川県 #石川",
        "【LIVE】出雲市内カメラ",
        "[4K Live] 桜島 ライブカメラ 鹿児島県 垂水市 Sakurajima Living Volcano Kagoshima Japan"
    ];

    for (const name of testCases) {
        console.log("\n--- Testing:", name);
        
        // Test Clean Query
        let query = cleanQuery(name);
        console.log("Cleaned:", query);

        // Test Split Strategy
        if (name.match(/[|\/／\-｜]/)) {
            const parts = name.split(/[|\/／\-｜]/);
            console.log("Split Parts:", parts.map(p => cleanQuery(p)));
        }

        // Test English Extraction Strategy
        const englishText = name.replace(/[^\x00-\x7F]+/g, ' ').trim();
        const cleanedEnglish = cleanQuery(englishText);
        if (cleanedEnglish.length > 3) {
            console.log("English Strategy:", cleanedEnglish);
        }
    }
}

debug();
