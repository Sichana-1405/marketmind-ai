const fs = require('fs');
const path = require('path');

function readEnv() {
  const p = path.resolve(__dirname, '..', '.env');
  if (!fs.existsSync(p)) return null;
  const txt = fs.readFileSync(p, 'utf8');
  const m = txt.match(/VITE_GEMINI_API_KEY=(.+)/);
  return m ? m[1].trim() : null;
}

async function main(){
  const key = readEnv();
  if (!key) {
    console.error('No VITE_GEMINI_API_KEY found in .env');
    process.exit(2);
  }
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`;
  const payload = {
    contents: [{ parts: [{ text: 'MarketMind connectivity test: respond with a short OK message' }] }],
    generationConfig: { temperature: 0.2, maxOutputTokens: 50 }
  };
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    console.log('STATUS', res.status);
    const text = await res.text();
    console.log('BODY', text.substring(0, 4000));
  } catch (err) {
    console.error('FETCH_ERROR', err.message || err);
    process.exit(3);
  }
}

main();
