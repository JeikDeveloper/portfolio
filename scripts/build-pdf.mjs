/**
 * Genera los PDF del CV a partir de las páginas /print/[lang]/[variant] del build.
 *
 *   npm run build      -> genera dist/
 *   npm run cv:pdf     -> genera dist/cv/*.pdf y public/cv/*.pdf
 *
 * Requiere Chromium una sola vez:  npx playwright install chromium
 *
 * El PDF nunca se edita a mano: sale de resume.<lang>.json, igual que el sitio.
 */
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFile, mkdir, copyFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, extname, resolve } from 'node:path';

// Con el adaptador de Vercel las páginas estáticas quedan en dist/client.
const DIST = existsSync(resolve('dist/client')) ? resolve('dist/client') : resolve('dist');
const OUT = join(DIST, 'cv');

const PUBLIC_OUT = resolve('public/cv');
const PORT = 4321;

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
};

const targets = [
  { lang: 'es', variant: 'visual', file: 'jeiber-jimenez-es.pdf' },
  { lang: 'es', variant: 'ats', file: 'jeiber-jimenez-es-ats.pdf' },
  { lang: 'en', variant: 'visual', file: 'jeiber-jimenez-en.pdf' },
  { lang: 'en', variant: 'ats', file: 'jeiber-jimenez-en-ats.pdf' },
];

function serve() {
  return new Promise((ok) => {
    const server = createServer(async (req, res) => {
      let path = join(DIST, decodeURIComponent(req.url.split('?')[0]));
      if (!extname(path)) path = join(path, 'index.html');
      try {
        const body = await readFile(path);
        res.writeHead(200, { 'Content-Type': TYPES[extname(path)] ?? 'application/octet-stream' });
        res.end(body);
      } catch {
        res.writeHead(404).end('not found');
      }
    });
    server.listen(PORT, () => ok(server));
  });
}

const server = await serve();
await mkdir(OUT, { recursive: true });
await mkdir(PUBLIC_OUT, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage();

for (const { lang, variant, file } of targets) {
  const url = `http://localhost:${PORT}/print/${lang}/${variant}/`;
  await page.goto(url, { waitUntil: 'networkidle' });
  const target = join(OUT, file);
  await page.pdf({
    path: target,
    format: 'A4',
    printBackground: variant === 'visual',
    margin: { top: '16mm', bottom: '16mm', left: '15mm', right: '15mm' },
  });
  // Copia a public/ para que el siguiente build ya lo sirva sin regenerar.
  await copyFile(target, join(PUBLIC_OUT, file));
  console.log(`✓ ${file}`);
}

await browser.close();
server.close();

if (!existsSync(join(OUT, targets[0].file))) {
  console.error('No se generó ningún PDF. ¿Corriste npm run build antes?');
  process.exit(1);
}
