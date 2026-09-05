const fs = require('fs');
const path = require('path');
const fetch = globalThis.fetch || require('node-fetch');

function readEnv() {
  const p = path.resolve(__dirname, '..', '.env');
  if (!fs.existsSync(p)) return null;
  const txt = fs.readFileSync(p, 'utf8');
  const m = txt.match(/VITE_GEMINI_API_KEY=(.+)/);
  return m ? m[1].trim() : null;
}

async function tryModel(model){
  const key = readEnv();
  if (!key) { console.error('No VITE_GEMINI_API_KEY found'); process.exit(2); }
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
  const payload = { contents: [{ parts: [{ text: 'Connectivity test: please respond with {"ok":true} JSON' }] }], generationConfig: { temperature:0.2, maxOutputTokens:50 } };
  try {
    const res = await fetch(url, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(payload) });
    console.log(model, '=>', res.status);
    const body = await res.text();
    console.log(body.substring(0,4000));
  } catch (err) {
    console.error('ERROR', model, err.message || err);
  }
}

(async ()=>{
  await tryModel('gemini-2.0-flash');
  await tryModel('gemini-3.6-flash');
})();
