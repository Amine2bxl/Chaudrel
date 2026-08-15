/**
 * Pré-rend chaque route en HTML statique dans dist/.
 *
 * - Le contenu est rendu par React (StaticRouter) : les bots voient le H1,
 *   les textes et les liens internes sans exécuter de JS.
 * - Les métadonnées (title, description, canonical, OG, JSON-LD) proviennent
 *   de src/lib/seo.js — source unique partagée avec le runtime.
 * - Génère également public/sitemap.xml -> dist/sitemap.xml.
 *
 * Usage : node scripts/prerender.js  (après `vite build`)
 */

import { readFileSync, writeFileSync, existsSync, unlinkSync, mkdtempSync, mkdirSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';
import { execSync } from 'node:child_process';
import esbuild from 'esbuild';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const distDir = resolve(root, 'dist');

function fail(msg) {
  console.error(`[prerender] ${msg}`);
  process.exit(1);
}

const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function renderAll() {
  const ssrEntry = `
import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import App from ${JSON.stringify(resolve(root, 'src/App.jsx'))};
import { allRoutes, metaFor } from ${JSON.stringify(resolve(root, 'src/lib/seo.js'))};

const out = allRoutes().map((path) => ({
  path,
  meta: metaFor(path),
  html: renderToString(React.createElement(StaticRouter, { location: path }, React.createElement(App))),
}));
process.stdout.write('___SSR_OUT_START___' + JSON.stringify(out) + '___SSR_OUT_END___');
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

  const tmpDir = mkdtempSync(join(tmpdir(), 'ssr-'));
  const bundlePath = join(tmpDir, 'ssr.cjs');
  writeFileSync(bundlePath, result.outputFiles[0].text);

  let stdout;
  try {
    stdout = execSync(`node "${bundlePath}"`, {
      cwd: root,
      encoding: 'utf8',
      maxBuffer: 64 * 1024 * 1024,
      env: { ...process.env, NODE_ENV: 'production' },
    });
  } catch (e) {
    fail(`SSR exec failed:\n${e.stderr || e.message}`);
  } finally {
    try {
      unlinkSync(bundlePath);
    } catch {
      /* fichier temporaire */
    }
  }

  const m = stdout.match(/___SSR_OUT_START___([\s\S]*)___SSR_OUT_END___/);
  if (!m) fail('Pattern SSR introuvable dans stdout.');
  return JSON.parse(m[1]);
}

/** Remplace les métadonnées du template par celles de la route. */
function applyMeta(template, meta, html) {
  let out = template;

  const replaceTag = (regex, replacement) => {
    out = regex.test(out) ? out.replace(regex, replacement) : out.replace('</head>', `    ${replacement}\n  </head>`);
  };

  out = out.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(meta.title)}</title>`);
  replaceTag(/<meta name="description" content="[^"]*"\s*\/?>/, `<meta name="description" content="${esc(meta.description)}" />`);
  replaceTag(/<meta name="robots" content="[^"]*"\s*\/?>/, `<meta name="robots" content="${esc(meta.robots)}" />`);
  replaceTag(/<link rel="canonical" href="[^"]*"\s*\/?>/, `<link rel="canonical" href="${esc(meta.canonical)}" />`);
  replaceTag(/<meta property="og:title" content="[^"]*"\s*\/?>/, `<meta property="og:title" content="${esc(meta.title)}" />`);
  replaceTag(
    /<meta property="og:description" content="[^"]*"\s*\/?>/,
    `<meta property="og:description" content="${esc(meta.description)}" />`
  );
  replaceTag(/<meta property="og:url" content="[^"]*"\s*\/?>/, `<meta property="og:url" content="${esc(meta.canonical)}" />`);
  replaceTag(/<meta property="og:image" content="[^"]*"\s*\/?>/, `<meta property="og:image" content="${esc(meta.image)}" />`);
  replaceTag(/<meta name="twitter:title" content="[^"]*"\s*\/?>/, `<meta name="twitter:title" content="${esc(meta.title)}" />`);
  replaceTag(
    /<meta name="twitter:description" content="[^"]*"\s*\/?>/,
    `<meta name="twitter:description" content="${esc(meta.description)}" />`
  );
  replaceTag(/<meta name="twitter:image" content="[^"]*"\s*\/?>/, `<meta name="twitter:image" content="${esc(meta.image)}" />`);

  // JSON-LD : on retire ceux du template et on injecte ceux de la route
  out = out.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/g, '');
  const ld = meta.jsonLd
    .map((obj) => `<script type="application/ld+json" data-seo-ld>${JSON.stringify(obj).replace(/</g, '\\u003c')}</script>`)
    .join('\n    ');
  out = out.replace('</head>', `    ${ld}\n  </head>`);

  // Preload de l'image LCP uniquement sur la home
  if (meta.path !== '/') {
    out = out.replace(/<link\s+rel="preload"[\s\S]*?\/>/, '');
  }

  return out.replace(/<div id="root"><\/div>/, `<div id="root" data-ssr>${html}</div>`);
}

function writeSitemap(routes) {
  const today = new Date().toISOString().slice(0, 10);
  const urls = routes
    .map((path) => {
      const priority = path === '/' ? '1.0' : path.startsWith('/legal') ? '0.2' : '0.7';
      return `  <url>\n    <loc>https://chaudrel.be${path === '/' ? '/' : path}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  writeFileSync(resolve(distDir, 'sitemap.xml'), xml);
  writeFileSync(resolve(root, 'public/sitemap.xml'), xml);
  console.log(`[prerender] sitemap.xml — ${routes.length} URLs`);
}

function main() {
  const indexPath = resolve(distDir, 'index.html');
  if (!existsSync(indexPath)) fail('dist/index.html introuvable. Lance `vite build` avant.');

  const template = readFileSync(indexPath, 'utf8');
  const pages = renderAll();

  for (const page of pages) {
    const html = applyMeta(template, page.meta, page.html);
    const outPath =
      page.path === '/' ? indexPath : resolve(distDir, `${page.path.replace(/^\//, '')}/index.html`);
    mkdirSync(dirname(outPath), { recursive: true });
    writeFileSync(outPath, html);
  }

  console.log(`[prerender] OK — ${pages.length} pages générées`);
  writeSitemap(pages.map((p) => p.path));
}

main();
