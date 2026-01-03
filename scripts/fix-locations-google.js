
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CONFIG_PATH = path.join(__dirname, '../webcams.config.json');
const API_KEY = process.env.GOOGLE_MAPS_API_KEY;

if (!API_KEY) {
    console.error('Error: GOOGLE_MAPS_API_KEY environment variable is not set.');
    process.exit(1);
}

const webcams = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function cleanQuery(text) {
    // Remove emojis
    text = text.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '');
    // Remove text in brackets (often contains channel info or 'Live')
    text = text.replace(/【.*?】/g, ' ').replace(/\[.*?\]/g, ' ').replace(/\(.*?\)/g, ' ');
    // Remove common keywords that confuse geocoders
    text = text.replace(/Live Cam|Live Stream|Webcam|4K|24\/7|HD|High Definition|Live|Camera|Ramen|News/gi, ' ');
    // Collapse whitespace
    return text.replace(/\s+/g, ' ').trim();
}

async function geocode(query) {
    try {
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(query)}&key=${API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.status === 'OK' && data.results.length > 0) {
            return data.results[0];
        } else {
            console.warn(`   ⚠️ API Status: ${data.status} ${data.error_message || ''}`);
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

async function main() {
    console.log('Starting geolocation fix using Google Maps API...');
    let updatedCount = 0;

    for (let i = 0; i < webcams.length; i++) {
        const webcam = webcams[i];

        // Only target items with 0,0 coordinates
        if (webcam.coordinates.lat === 0 && webcam.coordinates.lng === 0) {
            console.log(`\nProcessing [${i + 1}/${webcams.length}]: ${webcam.name}`);

            let query = cleanQuery(webcam.name);

            // If name is very short, append description for better context, 
            // but only if description defaults to title (often the case) or provides real info
            if (query.length < 5 && webcam.description) {
                query += " " + cleanQuery(webcam.description);
            }

            console.log(`   Query: "${query}"`);

            const result = await geocode(query);

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

                // Update Category Logic
                // If it was added automatically, we try to guess a better category
                if (webcam.category === 'added-automatically') {
                    const types = result.types;
                    if (types.includes('natural_feature') || types.includes('park')) {
                        webcam.category = 'nature';
                    } else if (types.includes('establishment') || types.includes('point_of_interest')) {
                        webcam.category = 'landmark';
                    } else {
                        webcam.category = 'city'; // Default to city for general locations
                    }
                }

                // Update Description if it was just the title
                if (webcam.description === webcam.name || webcam.description.includes('Live Cam')) {
                    webcam.description = `Live view of ${query} in ${webcam.city || 'Unknown'}, ${webcam.country || 'Unknown'}.`;
                }

                console.log(`   ✅ Found: ${result.formatted_address} (${loc.lat}, ${loc.lng})`);
                updatedCount++;
            } else {
                console.log(`   ❌ Not found`);
            }

            // Short sleep to prevent hitting rate limits too hard (though Google allows more QPS)
            await sleep(200);
        }
    }

    if (updatedCount > 0) {
        fs.writeFileSync(CONFIG_PATH, JSON.stringify(webcams, null, 2));
        console.log(`\nSuccess! Updated ${updatedCount} webcams.`);
    } else {
        console.log('\nNo updates needed.');
    }
}

main().catch(console.error);
