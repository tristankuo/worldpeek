import fs from 'fs';
import https from 'https';

// Read the webcams file
const content = fs.readFileSync('src/data/webcams.ts', 'utf8');

// Remove block comments (/* ... */) before parsing
const uncommentedContent = content.replace(/\/\*[\s\S]*?\*\//g, '');

// Regex to find IDs
const idRegex = /id:\s*['"]([a-zA-Z0-9_-]{11})['"]/g;
let match;
const ids = [];

while ((match = idRegex.exec(uncommentedContent)) !== null) {
    ids.push(match[1]);
}

console.log(`Found ${ids.length} webcams. Checking status...`);

const checkUrl = (id) => {
    return new Promise((resolve) => {
        const url = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`;
        https.get(url, (res) => {
            resolve({ id, status: res.statusCode });
        }).on('error', (e) => {
            resolve({ id, status: 500 });
        });
    });
};

async function checkAll() {
    const broken = [];
    // Check in batches of 5 to avoid rate limiting
    for (let i = 0; i < ids.length; i += 5) {
        const batch = ids.slice(i, i + 5);
        const results = await Promise.all(batch.map(checkUrl));
        
        results.forEach(r => {
            if (r.status !== 200) {
                console.log(`❌ Broken: ${r.id} (Status: ${r.status})`);
                broken.push(r.id);
            } else {
                // console.log(`✅ OK: ${r.id}`);
            }
        });
        
        process.stdout.write(`\rChecked ${Math.min(i + 5, ids.length)}/${ids.length}`);
    }
    console.log('\nDone.');
    console.log(`Found ${broken.length} broken streams.`);
    console.log(JSON.stringify(broken));
}

checkAll();
