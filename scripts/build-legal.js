// Build de la page légale combinée ("Politiques & Mentions légales").
// Stratégie : SSR le composant React via renderToString, puis injecte le HTML
// dans dist/legal/politique-mentions.html avec le même template (CSS, meta tags)
// que index.html, tout en conservant le bundle JS compilé pour que React puisse
// s'hydrater (sinon les boutons "Fermer" / "Retour" de la modale seraient morts).
//
// Usage : node scripts/build-legal.js  (lancé après `vite build && prerender`)
//
// Pourquoi ce nouveau build :
//   - Le composant LegalCombined rend une modale pilotée par l'événement
//     `chaudrel:open-legal`. Pour qu'une URL directe partageable fonctionne
//     (et pour le SEO), on génère une page HTML statique qui déclenche
//     l'ouverture au chargement via ce même événement.

import { readFileSync, writeFileSync, existsSync, unlinkSync, mkdtempSync, mkdirSync, readdirSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';
import { execSync } from 'node:child_process';
import esbuild from 'esbuild';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const distDir = resolve(root, 'dist');

function fail(msg) {
  console.error('[legal-build] ' + msg);
  process.exit(1);
}

function findCssHref(html) {
  const m = html.match(/href="(\/assets\/index-[^"]+\.css)"/);
  return m ? m[1] : null;
}

function findJsEntry() {
  const assetsDir = join(distDir, 'assets');
  if (!existsSync(assetsDir)) fail('dist/assets introuvable. Lance `vite build` avant.');
  const files = readdirSync(assetsDir);
  const entry = files.find((f) => /^index-[^/]+\.js$/.test(f));
  if (!entry) fail('Bundle JS entry introuvable dans dist/assets/.');
  return entry;
}

function buildPage({ entryPath, pageTitle, pageDescription, canonicalPath, baseHref, indexTemplate, jsEntry }) {
  const ssrEntry = [
    "import React from 'react';",
    "import { renderToString } from 'react-dom/server';",
    'import Page from ' + JSON.stringify(entryPath) + ';',
    "const html = renderToString(React.createElement(Page));",
    "process.stdout.write('___SSR_OUT_START___' + html + '___SSR_OUT_END___');",
  ].join('\n');

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

  const tmpDir = mkdtempSync(join(tmpdir(), 'ssr-legal-'));
  const bundlePath = join(tmpDir, 'ssr.cjs');
  writeFileSync(bundlePath, result.outputFiles[0].text);

  let stdout;
  try {
    stdout = execSync('node "' + bundlePath + '"', {
      cwd: root,
      encoding: 'utf8',
      env: Object.assign({}, process.env, { NODE_ENV: 'production' }),
    });
  } catch (e) {
    fail('SSR exec failed pour ' + pageTitle + ':\n' + (e.stderr || e.message));
  } finally {
    try { unlinkSync(bundlePath); } catch (_) {}
  }

  const m = stdout.match(/___SSR_OUT_START___([\s\S]*)___SSR_OUT_END___/);
  if (!m) fail('Pattern SSR introuvable pour ' + pageTitle + '.');
  const renderedHtml = m[1];

  let template = indexTemplate;

  template = template
    .replace(/<title>[\s\S]*?<\/title>/, '<title>' + pageTitle + '</title>')
    .replace(/<meta name="description" content="[^"]*"\s*\/>/, '<meta name="description" content="' + pageDescription + '" />')
    .replace(/<link rel="canonical" href="[^"]*"\s*\/>/, '<link rel="canonical" href="https://chaudrel.be' + canonicalPath + '" />')
    .replace(/<meta property="og:title" content="[^"]*"\s*\/>/, '<meta property="og:title" content="' + pageTitle + '" />')
    .replace(/<meta property="og:description" content="[^"]*"\s*\/>/, '<meta property="og:description" content="' + pageDescription + '" />')
    .replace(/<meta property="og:url" content="[^"]*"\s*\/>/, '<meta property="og:url" content="https://chaudrel.be' + canonicalPath + '" />')
    .replace(/<meta name="twitter:title" content="[^"]*"\s*\/>/, '<meta name="twitter:title" content="' + pageTitle + '" />')
    .replace(/<meta name="twitter:description" content="[^"]*"\s*\/>/, '<meta name="twitter:description" content="' + pageDescription + '" />')
    .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/g, '')
    .replace(/<div id="root"[^>]*>[\s\S]*?<\/div>/, '<div id="root" data-ssr>' + renderedHtml + '</div>')
    .replace(
      /<script type="module" src="\/src\/main\.jsx"><\/script>/,
      '<script type="module" src="' + baseHref + 'assets/' + jsEntry + '"></script>'
    )
    .replace(/(href|src)="\//g, '$1="' + baseHref);
  // Note : l'ouverture de la modale sur la page standalone est déclenchée par
  // LegalCombined via window.location.pathname (/legal/*) — plus de script inline,
  // la CSP peut donc rester sans 'unsafe-inline' pour script-src.

  return template;
}

function main() {
  const indexPath = resolve(distDir, 'index.html');
  if (!existsSync(indexPath)) fail('dist/index.html introuvable. Lance `vite build` avant.');

  const sourceIndexPath = resolve(root, 'index.html');
  const cssFile = readFileSync(indexPath, 'utf8').match(/href="(\/assets\/index-[^"]+\.css)"/)?.[1];
  if (!cssFile) fail('Feuille de style buildée introuvable dans dist/index.html.');

  // Le template source ne contient aucun <link rel="stylesheet"> (Vite l'injecte
  // au build) : on insère donc le CSS buildé explicitement avant </head>.
  let template = readFileSync(sourceIndexPath, 'utf8');
  template = template.replace(
    '</head>',
    '    <link rel="stylesheet" href="' + cssFile + '" />\n  </head>'
  );

  const jsEntry = findJsEntry();

  const pages = [
    {
      entryPath: resolve(root, 'src/components/landing/LegalCombined.jsx'),
      pageTitle: 'Politiques & Mentions légales — Chaudrel',
      pageDescription: "Identité officielle de Chaudrel Rénovation SRL (BCE / BNB), hébergeur, propriété intellectuelle, et politique de traitement des données personnelles (RGPD).",
      canonicalPath: '/legal/politique-mentions',
      output: 'legal/politique-mentions.html',
    },
  ];

  for (const page of pages) {
    const html = buildPage(Object.assign({}, page, { baseHref: '../', indexTemplate: template, jsEntry }));
    const outPath = resolve(distDir, page.output);
    mkdirSync(dirname(outPath), { recursive: true });
    writeFileSync(outPath, html);
    const words = html.replace(/<[^>]+>/g, ' ').trim().split(/\s+/).filter(Boolean).length;
    console.log('[legal-build] ' + page.output + ' — ' + html.length + ' chars, ~' + words + ' mots');
  }
  console.log('[legal-build] OK');
}

main();