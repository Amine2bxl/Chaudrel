/**
 * Rend les images de repli de la maquette 3D à partir de la scène elle-même.
 *
 * Ces images servent de premier affichage (avant le chargement du moteur) et
 * de version statique (sans WebGL, mouvement réduit, économie de données).
 * Elles sortent du même moteur, au même cadrage : le passage image → canvas
 * ne se voit pas.
 *
 * Usage : lancer `npm run dev`, puis `node scripts/render-posters.mjs [url]`.
 * À relancer après toute modification de la maquette ou du storyboard.
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
let chromium;
try {
  ({ chromium } = require('playwright'));
} catch {
  ({ chromium } = createRequire('/')('playwright'));
}

const out = resolve(dirname(fileURLToPath(import.meta.url)), '../public/experience');
const url = process.argv[2] || 'http://localhost:5173/';

/* [fichier, largeur CSS, hauteur CSS, position dans le film] - rendu en 2x. */
const SHOTS = [
  ['maquette.webp', 1200, 600, 0],
  ['maquette-portrait.webp', 540, 810, 0],
  ['maquette-finie.webp', 1200, 600, 1],
];

mkdirSync(out, { recursive: true });
const browser = await chromium.launch({
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'],
});

for (const [file, width, height, at] of SHOTS) {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 2 });
  await page.addInitScript(() => {
    window.__XP_HQ = true;
  });
  await page.goto(url, { waitUntil: 'load' });
  await page.waitForFunction(() => window.__chaudrelXP, null, { timeout: 120000 });
  const data = await page.evaluate((p) => window.__chaudrelXP.captureAt(p, 'image/webp', 0.9), at);
  writeFileSync(resolve(out, file), Buffer.from(data.split(',')[1], 'base64'));
  console.log(`[posters] ${file}`);
  await page.close();
}
await browser.close();
