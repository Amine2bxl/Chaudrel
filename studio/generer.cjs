/**
 * Génère le kit de marque d'une entreprise à partir de son dossier marque :
 * `marque.json` (nom, contacts, couleurs, polices, textes) + les SVG de
 * `logo/` (<slug>-logo*.svg, <slug>-monogram*.svg, <slug>-app-icon.svg).
 *
 *   node studio/generer.cjs marque        (depuis la racine du dépôt)
 *
 * Nécessite Playwright + Chromium (`npm i -g playwright && npx playwright
 * install chromium` si absent) et une connexion pour Google Fonts (Prata,
 * Albert Sans). Rejouable : écrase les fichiers générés, ne touche ni aux
 * SVG sources ni au PDF Canva de la carte de visite.
 */
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const ROOT = path.resolve(process.argv[2] || 'marque');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const out = (p) => {
  const f = path.join(ROOT, p);
  fs.mkdirSync(path.dirname(f), { recursive: true });
  return f;
};

const M = JSON.parse(read('marque.json'));
const C = M.couleurs;
const T = M.polices.titre;
const S = M.polices.texte;
const gf = (f) => f.replace(/ /g, '+');
const FONTS = `<link href="https://fonts.googleapis.com/css2?family=${gf(S)}:wght@400;500;600&family=${gf(T)}&display=block" rel="stylesheet">`;

/* Logos : on garde les SVG tels quels et on change seulement leurs couleurs. */
const LOGO = {
  full: read(`logo/${M.slug}-logo.svg`),
  fullCream: read(`logo/${M.slug}-logo-cream.svg`),
  fullOr: read(`logo/${M.slug}-logo-or.svg`),
  fullCremeBronze: read(`logo/${M.slug}-logo-creme-bronze.svg`),
  fullNoir: read(`logo/${M.slug}-logo-noir.svg`),
  mono: read(`logo/${M.slug}-monogram.svg`),
  monoCream: read(`logo/${M.slug}-monogram-cream.svg`),
  monoOr: read(`logo/${M.slug}-monogram-or.svg`),
  monoCremeBronze: read(`logo/${M.slug}-monogram-creme-bronze.svg`),
  monoNoir: read(`logo/${M.slug}-monogram-noir.svg`),
  icon: read(`logo/${M.slug}-app-icon.svg`),
};
/* Sur fond sombre : le logo crème posé sur la nuit du site, marge comprise,
   prêt à envoyer tel quel (le crème seul disparaît sur un fond blanc). */
const onDark = (svg, pad = 0.12, square = false) => {
  let [x, y, w, h] = svg.match(/viewBox="([^"]+)"/)[1].trim().split(/\s+/).map(Number);
  const m = Math.max(w, h) * pad;
  [x, y, w, h] = [x - m, y - m, w + 2 * m, h + 2 * m];
  if (square) [x, y, w, h] = [x - (Math.max(w, h) - w) / 2, y - (Math.max(w, h) - h) / 2, Math.max(w, h), Math.max(w, h)];
  return svg
    .replace(/viewBox="[^"]+"/, `viewBox="${x} ${y} ${w} ${h}"`)
    .replace('</defs>', `</defs>\n<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${C.page}"/>`);
};
LOGO.fullSombre = onDark(LOGO.fullCream);
LOGO.monoSombre = onDark(LOGO.monoCream, 0.2, true);

/* Version « or métallisé » pour les maquettes : dégradé qui imite le reflet du métal. */
const metal = (svg, id) =>
  svg
    .replace(/<defs>[\s\S]*?<\/defs>/, '')
    .replace(
      '<title>',
      `<defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7A5A2E"/><stop offset=".32" stop-color="#E4C68E"/><stop offset=".5" stop-color="#A27D47"/><stop offset=".72" stop-color="#F1DCAA"/><stop offset="1" stop-color="#8A6A3A"/></linearGradient></defs><title>`
    )
    .replace(/fill="#B8945F"/g, `fill="url(#${id})"`);

const page = (body, css = '', w = 1000, h = 1000) => `<!doctype html><html lang="fr"><head><meta charset="utf-8">${FONTS}
<style>*{margin:0;padding:0;box-sizing:border-box}html,body{width:${w}px;height:${h}px;background:transparent}
svg{display:block}.logo svg{width:100%;height:auto}${css}</style></head><body>${body}</body></html>`;

/* ---------- T-shirt : coupe droite, taille L, à l'échelle 1 unité = 1 mm ----------
   Poitrine 560 mm, longueur 760 mm (col → ourlet). Les marquages se posent
   donc à leur taille réelle : cœur 90 mm, dos 280 mm. Coton rendu par un
   grain (feTurbulence) et des plis flous ; l'impression reçoit le même grain. */
const tee = (back, art, id) => `
<svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="${id}b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#242220"/><stop offset=".55" stop-color="#1b1a19"/><stop offset="1" stop-color="#141313"/></linearGradient>
    <radialGradient id="${id}v" cx="50%" cy="40%" r="70%"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".45"/></radialGradient>
    <filter id="${id}s" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="14"/></filter>
    <filter id="${id}g"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="7"/><feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 .55 0"/></filter>
    <clipPath id="${id}c"><path id="${id}p" d="M410 112 C${back ? '440 128 560 128' : '432 166 568 166'} 590 112 L700 140 C760 158 800 190 830 240 L898 368 C880 384 846 398 810 404 L778 360 C772 520 772 700 784 876 C620 900 380 900 216 876 C228 700 228 520 222 360 L190 404 C154 398 120 384 102 368 L170 240 C200 190 240 158 300 140 Z"/></clipPath>
  </defs>
  <ellipse cx="500" cy="905" rx="330" ry="22" fill="#000" opacity=".18" filter="url(#${id}s)"/>
  <g clip-path="url(#${id}c)">
    <rect width="1000" height="1000" fill="url(#${id}b)"/>
    <g filter="url(#${id}s)" fill="none" stroke-linecap="round">
      <path d="M300 420 C330 560 320 700 290 860" stroke="#000" stroke-opacity=".45" stroke-width="40"/>
      <path d="M700 420 C670 560 680 700 710 860" stroke="#000" stroke-opacity=".45" stroke-width="40"/>
      <path d="M420 230 C470 300 530 300 580 230" stroke="#fff" stroke-opacity=".05" stroke-width="60"/>
      <path d="M190 300 L230 380 M810 300 L770 380" stroke="#000" stroke-opacity=".5" stroke-width="26"/>
    </g>
    ${art}
    <rect width="1000" height="1000" filter="url(#${id}g)" opacity=".07"/>
    <rect width="1000" height="1000" fill="url(#${id}v)"/>
  </g>
  <path d="M410 112 C${back ? '440 128 560 128' : '432 166 568 166'} 590 112" fill="none" stroke="#2e2c2a" stroke-width="18" stroke-linecap="round"/>
  <path d="M222 360 L190 404 M778 360 L810 404" stroke="#0c0b0b" stroke-width="3" opacity=".6"/>
  <path d="M216 876 C380 900 620 900 784 876" fill="none" stroke="#0c0b0b" stroke-width="3" opacity=".5"/>
</svg>`;
const place = (svg, x, y, w) => {
  const inner = svg.replace(/^[\s\S]*?<svg[^>]*viewBox="([^"]+)"[^>]*>/, (m, vb) => `<svg x="${x}" y="${y}" width="${w}" viewBox="${vb}" preserveAspectRatio="xMidYMin meet">`);
  return inner;
};

async function main() {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ deviceScaleFactor: 1 });
  const p = await ctx.newPage();

  const png = async (file, html, w, h, transparent = true) => {
    await p.setViewportSize({ width: w, height: h });
    await p.setContent(html, { waitUntil: 'networkidle' });
    await p.evaluate(() => document.fonts.ready);
    await p.screenshot({ path: out(file), omitBackground: transparent });
    console.log('png ', file);
  };
  const pdf = async (file, html, opts) => {
    await p.setContent(html, { waitUntil: 'networkidle' });
    await p.evaluate(() => document.fonts.ready);
    await p.pdf({ path: out(file), printBackground: true, ...opts });
    console.log('pdf ', file);
  };

  /* 1. Logos en PNG transparent et en PDF vectoriel ---------------------- */
  fs.writeFileSync(out(`logo/${M.slug}-logo-sombre.svg`), LOGO.fullSombre);
  fs.writeFileSync(out(`logo/${M.slug}-monogram-sombre.svg`), LOGO.monoSombre);
  const logos = [
    [`${M.slug}-logo`, LOGO.full],
    [`${M.slug}-logo-cream`, LOGO.fullCream],
    [`${M.slug}-logo-or`, LOGO.fullOr],
    [`${M.slug}-logo-creme-bronze`, LOGO.fullCremeBronze],
    [`${M.slug}-logo-noir`, LOGO.fullNoir],
    [`${M.slug}-logo-sombre`, LOGO.fullSombre],
  ];
  for (const [name, svg] of logos) {
    await png(`logo/png/${name}-2400.png`, page(`<div class="logo">${svg}</div>`, '', 2400, 1500), 2400, 1500);
    await pdf(`logo/pdf/${name}.pdf`, page(`<div class="logo" style="width:200mm">${svg}</div>`, '@page{size:200mm 125mm;margin:0}', 756, 472), {
      width: '200mm',
      height: '125mm',
    });
  }
  const monos = [
    [`${M.slug}-monogram`, LOGO.mono],
    [`${M.slug}-monogram-cream`, LOGO.monoCream],
    [`${M.slug}-monogram-or`, LOGO.monoOr],
    [`${M.slug}-monogram-creme-bronze`, LOGO.monoCremeBronze],
    [`${M.slug}-monogram-noir`, LOGO.monoNoir],
  ];
  for (const [name, svg] of monos) {
    await png(`logo/png/${name}-1200.png`, page(`<div class="logo">${svg}</div>`, '', 1200, 938), 1200, 938);
  }
  await png(`logo/png/${M.slug}-monogram-sombre-1200.png`, page(`<div class="logo">${LOGO.monoSombre}</div>`, '', 1200, 1200), 1200, 1200);
  await png(`logo/png/${M.slug}-app-icon-1024.png`, page(`<div class="logo">${LOGO.icon}</div>`, '', 1024, 1024), 1024, 1024);

  /* 2. Vêtements : petit logo devant (cœur), grand logo au dos et le nom de
        domaine en bas du dos. Maquettes + fichiers d'impression. -------- */
  const variants = {
    'or-metallise': { mono: metal(LOGO.monoOr, 'gm'), full: metal(LOGO.fullOr, 'gf'), printMono: LOGO.monoOr, printFull: LOGO.fullOr, ink: C.or },
    'creme-bronze': { mono: LOGO.monoCremeBronze, full: LOGO.fullCremeBronze, printMono: LOGO.monoCremeBronze, printFull: LOGO.fullCremeBronze, ink: C.cremeLogo },
  };
  const domain = (M.domaineVetements || M.domaine).toUpperCase();
  for (const [name, v] of Object.entries(variants)) {
    const bg = `body{background:radial-gradient(80% 70% at 50% 40%,#EFEAE3,#D9D2C8);display:grid;place-items:center}.wrap{width:1000px;height:1000px}`;
    // Devant : monogramme ~9 cm sur le cœur (côté gauche du porteur, à droite à l'écran).
    await png(`vetements/maquette-${name}-face.png`, page(`<div class="wrap">${tee(false, place(v.mono, 565, 270, 90), 'f')}</div>`, bg, 1000, 1000), 1000, 1000, false);
    // Dos : logo complet ~28 cm sous le col, le domaine en bas du dos.
    const dos = place(v.full, 360, 205, 280) + `<text x="500" y="790" text-anchor="middle" font-family="${S}" font-weight="500" font-size="12" letter-spacing="3.8" fill="${v.ink}">${domain}</text>`;
    await png(`vetements/maquette-${name}-dos.png`, page(`<div class="wrap">${tee(true, dos, 'd')}</div>`, bg, 1000, 1000), 1000, 1000, false);
    // Impression : cœur en SVG (logo seul) ; dos en PDF 280 × 400 mm (logo + domaine, police incluse).
    const sized = (svg, wmm) => svg.replace('<svg ', `<svg width="${wmm}mm" `);
    fs.writeFileSync(out(`vetements/marquage-coeur-${name}-90mm.svg`), sized(v.printMono, 90));
    await pdf(
      `vetements/marquage-dos-${name}-280x400mm.pdf`,
      page(
        `<div class="logo" style="width:280mm">${v.printFull}</div><p style="position:absolute;bottom:0;width:280mm;text-align:center;font:500 12mm '${S}';letter-spacing:.32em;color:${v.ink}">${domain}</p>`,
        '@page{size:280mm 400mm;margin:0}html,body{width:280mm;height:400mm;position:relative}',
        1058,
        1512
      ),
      { width: '280mm', height: '400mm' }
    );
  }

  /* 3. Fiche Google, réseaux : images ------------------------------------ */
  const square = (size) =>
    page(
      `<div style="width:${size}px;height:${size}px;background:radial-gradient(70% 70% at 50% 42%,#2b251e,${C.nuit});display:grid;place-items:center"><div class="logo" style="width:${Math.round(size * 0.56)}px">${LOGO.monoCream}</div></div>`,
      '',
      size,
      size
    );
  await png('google-business/logo-profil-720.png', square(720), 720, 720, false);
  await png('reseaux/profil-1080.png', square(1080), 1080, 1080, false);
  // Une page ouverte par setContent ne charge pas file:// : la photo passe en data URI.
  const photo = 'data:image/webp;base64,' + fs.readFileSync(path.resolve(ROOT, '..', M.photoCouverture)).toString('base64');
  await png(
    'google-business/couverture-1600x900.jpg',
    page(`<img src="${photo}" style="width:1600px;height:900px;object-fit:cover">`, '', 1600, 900),
    1600,
    900,
    false
  );
  await png(
    'reseaux/facebook-couverture-1640x624.png',
    page(
      `<div style="width:1640px;height:624px;background:radial-gradient(60% 90% at 50% 50%,#2b251e,${C.nuit});display:grid;place-items:center;position:relative;overflow:hidden">
        <svg viewBox="0 0 67 165" style="position:absolute;right:90px;bottom:0;height:72%;opacity:.22"><path d="M0 38 L67 0 L67 165 L0 142 Z" fill="${C.bronze}"/></svg>
        <div class="logo" style="width:420px">${LOGO.fullCream}</div>
        <p style="position:absolute;bottom:56px;width:100%;text-align:center;font:500 20px '${S}';letter-spacing:.3em;text-transform:uppercase;color:rgba(234,224,211,.7)">Façades · Toitures · Châssis · Rénovations complètes</p>
      </div>`,
      '',
      1640,
      624
    ),
    1640,
    624,
    false
  );

  /* 4. Signature e-mail : image hébergée sur le site (Gmail bloque le SVG). */
  await png(
    '../public/email/signature-logo.png',
    page(`<div style="display:inline-flex;align-items:center;gap:22px;height:120px;padding:0 4px"><div class="logo" style="width:120px">${LOGO.mono}</div><span style="font:500 34px '${S}';letter-spacing:.26em;color:${C.encre}">CHAUDREL</span></div>`, '', 392, 120),
    392,
    120
  );

  /* 5. Documents : charte graphique et papier à en-tête (A4) -------------- */
  const docCss = `
    @page{size:A4;margin:0}
    html,body{width:auto;height:auto;background:#fff}
    body{font-family:'${S}',sans-serif;color:${C.encre};-webkit-print-color-adjust:exact;print-color-adjust:exact}
    .pg{width:210mm;height:297mm;padding:22mm 20mm;position:relative;overflow:hidden;page-break-after:always;background:#FCF8F3}
    .dark{background:${C.nuit};color:${C.creme}}
    h1,h2,h3{font-family:'${T}',serif;font-weight:400;letter-spacing:-.01em}
    h1{font-size:44pt;line-height:1.05}h2{font-size:26pt;margin-bottom:8mm}h3{font-size:13pt;margin:7mm 0 3mm}
    p,li{font-size:10.5pt;line-height:1.6}
    .lbl{font:500 8pt '${S}';letter-spacing:.24em;text-transform:uppercase;color:#6E532C}
    .dark .lbl{color:${C.bronzeClair}}
    .grid{display:grid;gap:6mm}
    .tile{border-radius:4mm;padding:8mm;display:grid;place-items:center;min-height:52mm}
    .sw{border-radius:4mm;overflow:hidden;border:0.3mm solid rgba(36,34,30,.12)}
    .sw div:first-child{height:26mm}.sw div:last-child{padding:3mm 4mm;font-size:8.5pt;line-height:1.5;background:#fff}
    .foot{position:absolute;left:20mm;right:20mm;bottom:12mm;display:flex;justify-content:space-between;font-size:8pt;color:#6b655d}
    .dark .foot{color:rgba(234,224,211,.6)}
    ul{padding-left:5mm}
    div > svg{width:100%;height:auto;display:block}
  `;
  const cmyk = (hex) => {
    // shortcut: conversion naïve RVB → CMJN, sans profil ICC ; à remplacer par l'épreuve de l'imprimeur.
    const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
    const k = 1 - Math.max(r, g, b);
    if (k >= 1) return '0 / 0 / 0 / 100';
    return [r, g, b].map((x) => Math.round(((1 - x - k) / (1 - k)) * 100)).concat(Math.round(k * 100)).join(' / ');
  };
  const rgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)).join(' ');
  const swatches = [
    ['Bronze de la porte', C.bronze, 'Accent unique : boutons, filets, porte du logo.'],
    ['Or métallisé (textile)', C.or, 'Repère écran. À l’impression : encre or métallisée, teinte choisie sur nuancier physique.'],
    ['Nuit', C.nuit, 'Fonds sombres, t-shirts, pied de page.'],
    ['Brun chaud', C.page, 'Fond des pages du site.'],
    ['Crème', C.creme, 'Texte sur fond sombre, encarts.'],
    ['Crème du logo', C.cremeLogo, 'Fond clair du logo d’origine.'],
    ['Encre', C.encre, 'Texte et logo sur fond clair.'],
  ];
  // shortcut: quelques phrases de la charte (règles du logo, nuancier) restent propres à la marque ; à passer dans marque.json au prochain client.
  const foot = (n) => `<div class="foot"><span>${M.nom} · Charte graphique · ${M.charte.date}</span><span>${n}</span></div>`;
  const charte = `<!doctype html><html lang="fr"><head><meta charset="utf-8">${FONTS}<style>${docCss}</style></head><body>
  <section class="pg dark" style="display:flex;flex-direction:column;justify-content:space-between">
    <p class="lbl">Charte graphique</p>
    <div style="width:120mm;margin:0 auto">${LOGO.fullCream}</div>
    <div><h1>${M.charte.devise}</h1><p style="margin-top:6mm;max-width:120mm;color:rgba(234,224,211,.8)">${M.charte.intro}</p></div>
    ${foot('1')}
  </section>
  <section class="pg">
    <p class="lbl">01 · Le logo</p><h2>Trois versions, une seule porte.</h2>
    <div class="grid" style="grid-template-columns:1fr 1fr">
      <div class="tile" style="background:${C.cremeLogo};grid-column:span 2"><div style="width:95mm">${LOGO.full}</div></div>
      <div class="tile" style="background:${C.nuit}"><div style="width:62mm">${LOGO.fullCream}</div></div>
      <div class="tile" style="background:${C.nuit}"><div style="width:30mm">${LOGO.monoCream}</div></div>
    </div>
    <h3>Zone de protection et taille minimale</h3>
    <ul><li>Autour du logo, laisser vide au moins la hauteur du mot RÉNOVATION × 2.</li><li>Logo complet : 30 mm de large minimum à l’impression, 140 px à l’écran.</li><li>Monogramme seul : 8 mm / 32 px minimum (favicon, avatar, broderie).</li></ul>
    <h3>Versions une couleur</h3>
    <p>Or (textile, dorure), crème + bronze (sérigraphie deux couleurs sur fond sombre), noir (tampon, gravure). Fichiers dans <b>marque/logo</b>.</p>
    ${foot('2')}
  </section>
  <section class="pg">
    <p class="lbl">02 · Couleurs</p><h2>Deux matières, un métal.</h2>
    <div class="grid" style="grid-template-columns:repeat(3,1fr)">
      ${swatches.map(([n, hex, use]) => `<div class="sw"><div style="background:${hex}"></div><div><b>${n}</b><br>HEX ${hex}<br>RVB ${rgb(hex)}<br>CMJN ${cmyk(hex)}*<br><span style="color:#6b655d">${use}</span></div></div>`).join('')}
    </div>
    <p style="margin-top:8mm;font-size:8.5pt;color:#6b655d">* Valeurs CMJN converties sans profil d’impression : faire valider par une épreuve de l’imprimeur. Le bronze est le seul accent ; jamais de deuxième couleur vive.</p>
    ${foot('3')}
  </section>
  <section class="pg">
    <p class="lbl">03 · Typographie</p><h2>Deux voix.</h2>
    <div style="border-top:0.3mm solid rgba(36,34,30,.15);padding-top:6mm">
      <p class="lbl">Titres — ${T}</p>
      <p style="font-family:'${T}';font-size:36pt;line-height:1.1;margin-top:3mm">${M.charte.accroche}</p>
      <p style="margin-top:3mm">Une seule graisse : la présence vient de la taille et du contraste des pleins et déliés, jamais du gras.</p>
    </div>
    <div style="border-top:0.3mm solid rgba(36,34,30,.15);padding-top:6mm;margin-top:10mm">
      <p class="lbl">Texte et interface — Albert Sans</p>
      <p style="font-size:16pt;line-height:1.5;margin-top:3mm">Façades, toitures, châssis et rénovations complètes. Un seul interlocuteur, du devis à la remise des clés.</p>
      <p style="margin-top:3mm">Capitales espacées (0,24 em) pour les petits repères, comme RÉNOVATION sous le logo.</p>
    </div>
    <p style="margin-top:10mm;font-size:9pt;color:#6b655d">Les deux polices sont libres (licence SIL Open Font License) et se téléchargent sur Google Fonts : fonts.google.com/specimen/Prata et fonts.google.com/specimen/Albert+Sans.</p>
    ${foot('4')}
  </section>
  <section class="pg">
    <p class="lbl">04 · À faire, à éviter</p><h2>Le logo ne se retouche pas.</h2>
    <div class="grid" style="grid-template-columns:1fr 1fr">
      <div><h3>À faire</h3><ul><li>Logo complet sur fond uni crème ou nuit.</li><li>Monogramme seul quand la place manque (avatar, cœur du t-shirt).</li><li>Sur photo : poser un voile sombre ou une carte de verre derrière.</li><li>Bronze pour les actions : bouton devis, filets.</li></ul></div>
      <div><h3>À éviter</h3><ul><li>Déformer, incliner ou contourer le logo.</li><li>Changer la couleur de la porte ou des lettres hors des versions prévues.</li><li>Ombres portées, effets 3D, dégradés arc-en-ciel.</li><li>Poser le logo sur une photo chargée sans voile.</li></ul></div>
    </div>
    <h3>Applications</h3>
    <ul><li>Site : ${M.domaine}.</li><li>Carte de visite : marque/carte-de-visite.</li><li>Vêtements : marque/vetements.</li><li>Fiche Google, réseaux : marque/google-business, marque/reseaux.</li><li>Coffret de fin de chantier : marque/coffret.</li></ul>
    ${foot('5')}
  </section>
  </body></html>`;
  fs.writeFileSync(out('documents/charte-graphique.html'), charte);
  await pdf('documents/charte-graphique.pdf', charte, { format: 'A4' });

  const lettre = `<!doctype html><html lang="fr"><head><meta charset="utf-8">${FONTS}<style>${docCss}
    .pg{background:#fff;padding:18mm 20mm}
  </style></head><body><section class="pg" style="page-break-after:auto">
    <div style="display:flex;justify-content:space-between;align-items:flex-start">
      <div style="width:44mm">${LOGO.full}</div>
      <div style="text-align:right;font-size:8.5pt;line-height:1.7;color:#4a453f">${M.adresse.join('<br>')}<br>${M.email}<br>${M.domaine}</div>
    </div>
    <div style="height:0.4mm;background:${C.bronze};margin-top:8mm"></div>
    <div style="position:absolute;left:20mm;right:20mm;bottom:14mm;border-top:0.3mm solid rgba(36,34,30,.15);padding-top:4mm;display:flex;justify-content:space-between;font-size:7.5pt;color:#6b655d">
      <span>${M.nom} · TVA ${M.tva}</span><span>${M.contacts.map((c) => `${c.nom} ${c.tel}`).join(' · ')}</span>
    </div>
  </section></body></html>`;
  fs.writeFileSync(out('documents/papier-en-tete.html'), lettre);
  await pdf('documents/papier-en-tete.pdf', lettre, { format: 'A4' });

  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
