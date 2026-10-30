/**
 * Genera la imagen para compartir (Open Graph, 1200×630) en public/og/default.png.
 * Es la tarjeta que muestran LinkedIn, WhatsApp y X al pegar el enlace del sitio.
 *
 *   npm run og
 *
 * Usa el Chromium de Playwright (npx playwright install chromium, una sola vez).
 * Toma nombre y cargo de resume.es.json, así que se regenera si cambian.
 */
import { chromium } from 'playwright';
import { readFile, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';

const resume = JSON.parse(await readFile(resolve('src/data/resume.es.json'), 'utf8'));
const font = (await readFile(resolve('node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2'))).toString('base64');
const escape = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

const html = `<!doctype html><html><head><style>
@font-face { font-family: Inter; src: url(data:font/woff2;base64,${font}) format('woff2'); font-weight: 100 900; }
* { margin: 0; box-sizing: border-box; }
body { width: 1200px; height: 630px; font-family: Inter, sans-serif; background: #0b0b0d; color: #fafafa;
  display: flex; flex-direction: column; justify-content: space-between; padding: 72px 80px; }
.top { display: flex; align-items: center; gap: 20px; font-size: 26px; color: #a1a1aa; font-weight: 500; }
.logo { width: 64px; height: 64px; border-radius: 14px; background: #fafafa; color: #0b0b0d; display: grid;
  place-items: center; font-weight: 700; font-size: 26px; letter-spacing: -1px; }
h1 { font-size: 76px; line-height: 1.05; letter-spacing: -2.5px; font-weight: 700; }
p { margin-top: 24px; font-size: 32px; color: #a1a1aa; line-height: 1.35; max-width: 980px; }
.foot { display: flex; justify-content: space-between; font-size: 24px; color: #8c8c95; }
.dot { display: inline-block; width: 12px; height: 12px; border-radius: 50%; background: #4ade80; margin-right: 12px; }
</style></head><body>
<div class="top"><div class="logo">JJ</div>jeikdeveloper</div>
<div><h1>${escape(resume.basics.name)}</h1><p>${escape(resume.basics.label)}</p></div>
<div class="foot"><span><span class="dot"></span>Bogotá, Colombia</span><span>${escape(resume.basics.url.replace('https://', ''))}</span></div>
</body></html>`;

await mkdir(resolve('public/og'), { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(html, { waitUntil: 'load' });
await page.screenshot({ path: resolve('public/og/default.png') });
await browser.close();
console.log('✓ public/og/default.png');
