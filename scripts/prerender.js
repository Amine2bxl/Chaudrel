// Pre-rend dist/index.html avec React SSR pour le SEO.
// Bots qui n'exécutent pas JS voient le contenu, le H1, les liens internes.
//
// Usage: node scripts/prerender.js  (lancé après `vite build`)
// Effet: remplace <div id="root"></div> dans dist/index.html par le HTML rendu.

import { readFileSync, writeFileSync, existsSync, unlinkSync, mkdtempSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';
import { execSync } from 'node:child_process';
import esbuild from 'esbuild';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const distDir = resolve(root, 'dist');
const appEntry = resolve(root, 'src/App.jsx');

function fail(msg) {
  console.error(`[prerender] ${msg}`);
  process.exit(1);
}

function main() {
  const indexPath = resolve(distDir, 'index.html');
  if (!existsSync(indexPath)) fail('dist/index.html introuvable. Lance `vite build` avant.');

  // 1) Bundle SSR (CommonJS, exécution Node)
  const ssrEntry = `
import React from 'react';
import { renderToString } from 'react-dom/server';
import App from ${JSON.stringify(appEntry)};
const html = renderToString(React.createElement(App));
process.stdout.write('___SSR_OUT_START___' + html + '___SSR_OUT_END___');
`;

  const result = esbuild.buildSync({
    stdin: { contents: ssrEntry, resolveDir: root, loader: 'jsx' },
    bundle: true,
    format: 'cjs',
    platform: 'node',
    target: 'es2020',
    jsx: 'automatic',
    alias: { '@': resolve(root, './src') },
    define: { 'process.env.NODE_ENV': '"production"' },
    logLevel: 'silent',
    write: false,
  });

  // 2) Écrire le bundle dans un fichier temp (la CLI `-e` tronque sur les gros bundles)
  const tmpDir = mkdtempSync(join(tmpdir(), 'ssr-'));
  const bundlePath = join(tmpDir, 'ssr.cjs');
  writeFileSync(bundlePath, result.outputFiles[0].text);

  let stdout;
  try {
    stdout = execSync(`node "${bundlePath}"`, {
      cwd: root,
      encoding: 'utf8',
      env: { ...process.env, NODE_ENV: 'production' },
    });
  } catch (e) {
    fail(`SSR exec failed:\n${e.stderr || e.message}`);
  } finally {
    try { unlinkSync(bundlePath); } catch {}
  }

  const m = stdout.match(/___SSR_OUT_START___([\s\S]*)___SSR_OUT_END___/);
  if (!m) fail('Pattern SSR introuvable dans stdout.');
  const renderedHtml = m[1];

  // 3) Injecter dans dist/index.html
  let html = readFileSync(indexPath, 'utf8');
  html = html.replace(
    '<div id="root"></div>',
    `<div id="root" data-ssr>${renderedHtml}</div>`
  );
  writeFileSync(indexPath, html);

  const words = renderedHtml.replace(/<[^>]+>/g, ' ').trim().split(/\s+/).filter(Boolean).length;
  console.log(`[prerender] OK — ${renderedHtml.length} chars, ~${words} mots injectés dans dist/index.html`);
}

main();
