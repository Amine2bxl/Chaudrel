/**
 * Coffret de fin de chantier : le certificat de réalisation (PDF A4 paysage,
 * à imprimer et encadrer) et la page de remerciement privée qu'ouvre son QR.
 *
 *   node studio/coffret.cjs marque marque/coffret/chantiers/dupont
 *
 * Le dossier du chantier reste sur l'ordinateur (ignoré par Git) : il contient
 * `chantier.json` (modèle : studio/modele/chantier.json) et les photos.
 * Sorties :
 *   <chantier>/certificat.pdf   à imprimer
 *   <chantier>/lien.txt         l'adresse du QR, clé comprise (à garder)
 *   public/c/<id>.bin           la page du client, chiffrée : à commiter
 *   public/c/index.html, merci.js, polices : la page commune qui déchiffre
 *
 * Confidentialité : nom, travaux et photos sont chiffrés (AES-256-GCM). La clé
 * n'existe que dans le QR, après le « # » : le navigateur ne l'envoie jamais au
 * serveur et elle n'entre jamais dans le dépôt. Sans le QR, le fichier publié
 * est illisible. Relancer le script garde la même adresse (lue dans lien.txt) ;
 * supprimer public/c/<id>.bin coupe l'accès.
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const QRCode = require('qrcode');
const { chromium } = require('playwright');

const [brandArg = 'marque', siteArg] = process.argv.slice(2);
if (!siteArg) {
  console.error('Usage : node studio/coffret.cjs <dossier-marque> <dossier-chantier>');
  process.exit(1);
}
const BRAND = path.resolve(brandArg);
const SITE = path.resolve(siteArg);
const PUBLIC_C = path.resolve(BRAND, '..', 'public', 'c');
const M = JSON.parse(fs.readFileSync(path.join(BRAND, 'marque.json'), 'utf8'));
const J = JSON.parse(fs.readFileSync(path.join(SITE, 'chantier.json'), 'utf8'));
const C = M.couleurs;
const T = M.polices.titre;
const S = M.polices.texte;
const gf = (f) => f.replace(/ /g, '+');
const FONTS = `<link href="https://fonts.googleapis.com/css2?family=${gf(S)}:wght@400;500;600&family=${gf(T)}&display=block" rel="stylesheet">`;
const MONO = fs.readFileSync(path.join(BRAND, 'logo', `${M.slug}-monogram-creme-bronze.svg`), 'utf8');
const esc = (v) => String(v).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const date = (iso) => new Date(`${iso}T12:00:00`).toLocaleDateString('fr-BE', { day: 'numeric', month: 'long', year: 'numeric' });

for (const k of ['client', 'commune', 'travaux', 'debut', 'fin']) {
  if (!J[k]) throw new Error(`chantier.json : « ${k} » manque`);
}
if (!J.paires?.length) throw new Error('chantier.json : au moins une paire de photos avant / après');

/* Adresse du QR : réutilisée si le chantier a déjà été généré (réimpression). */
const lienFile = path.join(SITE, 'lien.txt');
let id;
let key;
const previous = fs.existsSync(lienFile) && fs.readFileSync(lienFile, 'utf8').match(/\/c\/#([0-9a-f]{12})\.([\w-]{43})/);
if (previous) {
  [, id] = previous;
  key = Buffer.from(previous[2], 'base64url');
} else {
  id = crypto.randomBytes(6).toString('hex');
  key = crypto.randomBytes(32);
}
const url = `https://${M.domaine}/c/#${id}.${key.toString('base64url')}`;
const numero = `${J.fin.slice(0, 4)}-${id.slice(0, 4).toUpperCase()}`;

function encrypt(payload) {
  const iv = crypto.randomBytes(12);
  const c = crypto.createCipheriv('aes-256-gcm', key, iv);
  // Même disposition que WebCrypto : iv, puis le texte chiffré suivi du tag.
  return Buffer.concat([iv, c.update(JSON.stringify(payload), 'utf8'), c.final(), c.getAuthTag()]);
}

/* Contrôle : ce qui est chiffré se relit avec la clé, et pas sans. */
function selfCheck(blob, payload) {
  const d = crypto.createDecipheriv('aes-256-gcm', key, blob.subarray(0, 12));
  d.setAuthTag(blob.subarray(blob.length - 16));
  const back = Buffer.concat([d.update(blob.subarray(12, blob.length - 16)), d.final()]).toString('utf8');
  if (back !== JSON.stringify(payload)) throw new Error('chiffrement : relecture différente');
  const wrong = crypto.createDecipheriv('aes-256-gcm', crypto.randomBytes(32), blob.subarray(0, 12));
  wrong.setAuthTag(blob.subarray(blob.length - 16));
  wrong.update(blob.subarray(12, blob.length - 16));
  let opened = true;
  try {
    wrong.final();
  } catch {
    opened = false;
  }
  if (opened) throw new Error('chiffrement : une mauvaise clé a ouvert le fichier');
}

/* Dorure simulée : le même dégradé « métal » que les maquettes de vêtements. */
const FOIL = `<linearGradient id="foil" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7A5A2E"/><stop offset=".3" stop-color="#E4C68E"/><stop offset=".5" stop-color="#A27D47"/><stop offset=".72" stop-color="#F1DCAA"/><stop offset="1" stop-color="#8A6A3A"/></linearGradient>`;
const MONO_OR = fs
  .readFileSync(path.join(BRAND, 'logo', `${M.slug}-monogram-or.svg`), 'utf8')
  .replace(/<defs>[\s\S]*?<\/defs>/, '')
  .replace(/fill="#[0-9A-Fa-f]{6}"/g, 'fill="url(#foil)"');

/* Guilloché : ellipses tournées, comme le fond d'un papier-valeur. */
const guilloche = (cx, cy, rx, ry, n) =>
  Array.from({ length: n }, (_, i) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" transform="rotate(${(180 / n) * i} ${cx} ${cy})"/>`).join('');

/* Couronne de laurier : des feuilles posées le long de deux arcs. */
function laurel(cx, cy, r) {
  const leaf = (a, side) => {
    const x = cx + r * Math.cos(a);
    const y = cy + r * Math.sin(a);
    const deg = (a * 180) / Math.PI + (side > 0 ? 60 : 120);
    return `<ellipse cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" rx="1.1" ry="2.9" transform="rotate(${deg.toFixed(1)} ${x.toFixed(2)} ${y.toFixed(2)})"/>`;
  };
  let out = '';
  for (let i = 0; i < 11; i++) {
    const t = (i / 10) * (Math.PI * 0.62);
    out += leaf(Math.PI / 2 + 0.18 + t, -1) + leaf(Math.PI / 2 - 0.18 - t, 1);
  }
  return out;
}

const certificat = (qrSvg) => {
  const W = 297;
  const H = 210;
  const sealR = 17;
  return `<!doctype html><html lang="fr"><head><meta charset="utf-8">${FONTS.replace('&display', '&family=Pinyon+Script&display')}<style>
@page{size:${W}mm ${H}mm;margin:0}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:${W}mm;height:${H}mm}
body{background:${C.nuit};color:${C.creme};font-family:'${S}',sans-serif;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.cert{position:relative;width:${W}mm;height:${H}mm;overflow:hidden;background:
  radial-gradient(150mm 95mm at 50% 38%,rgba(174,138,86,.13),transparent 70%),
  linear-gradient(160deg,#211c18 0%,${C.nuit} 55%,#141110 100%)}
.art{position:absolute;inset:0;width:${W}mm;height:${H}mm}
.inner{position:absolute;inset:20mm 30mm 17mm;display:flex;flex-direction:column;align-items:center;text-align:center}
.lbl{font:500 6.4pt '${S}';letter-spacing:.46em;text-transform:uppercase;color:${C.bronzeClair}}
.sub{font:500 9pt '${S}';letter-spacing:.62em;text-transform:uppercase;color:${C.creme};margin-top:1mm}
.client{font:400 31pt/1.1 '${T}';color:${C.creme};margin-top:2.5mm}
.txt{font-size:10pt;line-height:1.6;color:rgba(234,224,211,.8);max-width:215mm;margin-top:4mm;text-wrap:balance}
.band{display:grid;grid-template-columns:repeat(3,1fr);width:180mm;margin-top:7mm;border-top:.25mm solid rgba(205,174,126,.35);border-bottom:.25mm solid rgba(205,174,126,.35)}
.band div{padding:3.2mm 0}.band div+div{border-left:.25mm solid rgba(205,174,126,.25)}
.band b{display:block;font:400 12.5pt '${T}';color:${C.creme};margin-top:1.2mm}
.foot{margin-top:auto;width:100%;display:grid;grid-template-columns:1fr auto 1fr;align-items:end;gap:8mm}
.sigs{display:flex;gap:7mm;text-align:left}
.sig{width:40mm}
.sig i{display:block;font:400 22pt/1 'Pinyon Script',cursive;color:${C.bronzeClair};padding-left:2mm;height:11mm}
.sig div{border-top:.3mm solid rgba(234,224,211,.45);padding-top:2mm;font:400 11pt '${T}'}
.sig span{display:block;font:500 6pt '${S}';letter-spacing:.2em;text-transform:uppercase;color:rgba(234,224,211,.6);margin-top:.8mm}
.qr{justify-self:end;display:flex;align-items:end;gap:4mm;text-align:right}
.qr .tile{width:27mm;height:27mm;padding:2mm;border-radius:2mm;background:${C.cremeLogo};box-shadow:0 0 0 .5mm ${C.nuit},0 0 0 .8mm #B8945F}
.qr .tile svg{width:100%;height:100%;display:block}
.qr p{font-size:7.2pt;line-height:1.5;color:rgba(234,224,211,.72);max-width:31mm}
.qr p b{display:block;font:400 10.5pt '${T}';color:${C.creme};margin-bottom:.6mm}
</style></head><body><div class="cert">
<svg class="art" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>${FOIL}</defs>
  <g fill="none" stroke="url(#foil)" stroke-width=".12" opacity=".2">${guilloche(W / 2, 78, 92, 30, 48)}${guilloche(W / 2, 78, 60, 18, 36)}</g>
  <rect x="7" y="7" width="${W - 14}" height="${H - 14}" fill="none" stroke="url(#foil)" stroke-width=".7"/>
  <rect x="9.6" y="9.6" width="${W - 19.2}" height="${H - 19.2}" fill="none" stroke="url(#foil)" stroke-width=".25"/>
  ${[[7, 7, 1, 1], [W - 7, 7, -1, 1], [7, H - 7, 1, -1], [W - 7, H - 7, -1, -1]]
    .map(([x, y, sx, sy]) => `<path d="M${x + sx * 1} ${y + sy * 14} V${y + sy * 1} H${x + sx * 14}" fill="none" stroke="url(#foil)" stroke-width="1.4"/><rect x="${x + sx * 4.6 - 1.3}" y="${y + sy * 4.6 - 1.3}" width="2.6" height="2.6" transform="rotate(45 ${x + sx * 4.6} ${y + sy * 4.6})" fill="url(#foil)"/>`)
    .join('')}
  <text x="${W / 2}" y="56" text-anchor="middle" font-family="${T}" font-size="17" letter-spacing="3.2" fill="url(#foil)">CERTIFICAT</text>
  <g transform="translate(${W / 2} ${H - 37.5})">
    <g fill="url(#foil)">${laurel(0, 0, sealR + 4.2)}</g>
    <circle r="${sealR}" fill="${C.nuit}" stroke="url(#foil)" stroke-width=".7"/>
    <circle r="${sealR - 1.6}" fill="none" stroke="url(#foil)" stroke-width=".2"/>
    <path id="ring" d="M -${sealR - 4.2} 0 a ${sealR - 4.2} ${sealR - 4.2} 0 1 1 ${2 * (sealR - 4.2)} 0 a ${sealR - 4.2} ${sealR - 4.2} 0 1 1 -${2 * (sealR - 4.2)} 0" fill="none"/>
    <text font-family="${S}" font-size="2.1" letter-spacing=".9" fill="${C.bronzeClair}"><textPath href="#ring" startOffset="2%">${esc(M.nom.toUpperCase())} · CHANTIER LIVRÉ · ${J.fin.slice(0, 4)} ·</textPath></text>
    ${MONO_OR.replace('<svg ', '<svg x="-8.5" y="-6.6" width="17" height="13.3" ')}
  </g>
</svg>
<div class="inner">
  <div style="width:17mm">${MONO_OR.replace('<svg ', '<svg style="width:100%;height:auto;display:block" ')}</div>
  <p class="lbl" style="margin-top:3.5mm">${esc(M.nom)}</p>
  <div style="height:22mm"></div>
  <p class="sub">de réalisation</p>
  <p class="lbl" style="margin-top:7mm">ce certificat est remis à</p>
  <p class="client">${esc(J.client)}</p>
  <p class="txt">En reconnaissance d’un chantier mené à bien à ${esc(J.commune)} : ${esc(J.travaux)}.</p>
  <div class="band">
    <div><span class="lbl">Ouvert le</span><b>${date(J.debut)}</b></div>
    <div><span class="lbl">Livré le</span><b>${date(J.fin)}</b></div>
    <div><span class="lbl">Certificat</span><b>N° ${numero}</b></div>
  </div>
  <div class="foot">
    <div class="sigs">${M.contacts.map((c) => `<div class="sig"><i>${esc(c.nom)}</i><div>${esc(c.nom)}<span>${esc(c.role)}</span></div></div>`).join('')}</div>
    <div style="width:60mm;height:44mm"></div>
    <div class="qr"><p><b>Avant, après.</b>Scannez pour revoir votre chantier.</p><div class="tile">${qrSvg}</div></div>
  </div>
</div></div></body></html>`;
};

/* Page commune du QR : HTML statique, script externe (la CSP du site interdit
   le script en ligne), polices du site, aucune mesure d'audience. */
const pageQr = () => `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<meta name="referrer" content="no-referrer">
<title>Merci · ${esc(M.nom)}</title>
<style>
@font-face{font-family:'${T}';src:url(/c/titre.woff2) format('woff2');font-display:swap}
@font-face{font-family:'${S}';src:url(/c/texte.woff2) format('woff2');font-weight:100 900;font-display:swap}
*{margin:0;padding:0;box-sizing:border-box}
:root{color-scheme:dark}
body{min-height:100svh;background:radial-gradient(60% 40% at 50% 0%,rgba(174,138,86,.16),transparent 70%),${C.nuit};color:${C.creme};font:400 17px/1.65 '${S}',system-ui,sans-serif;-webkit-font-smoothing:antialiased}
main{max-width:46rem;margin:0 auto;padding:3.5rem 1.25rem 4rem}
.mono{width:64px;margin:0 auto}.mono svg{width:100%;height:auto;display:block}
h1{font:400 clamp(2.2rem,7vw,3.4rem)/1.05 '${T}',Georgia,serif;letter-spacing:-.02em;text-align:center;margin-top:2rem;text-wrap:balance}
.lead{text-align:center;color:rgba(234,224,211,.8);margin:1rem auto 0;max-width:34rem;text-wrap:pretty}
.dates{text-align:center;font-size:.8rem;letter-spacing:.2em;text-transform:uppercase;color:${C.bronzeClair};margin-top:1rem}
.msg{margin:2rem auto 0;max-width:34rem;text-align:center;font-style:italic;color:rgba(234,224,211,.85)}
figure{margin-top:2.5rem}
.ba{position:relative;overflow:hidden;border-radius:24px;background:#1d1916;touch-action:pan-y}
.ba img{display:block;width:100%;height:auto;user-select:none;-webkit-user-drag:none}
.ba .after{position:absolute;inset:0;height:100%;object-fit:cover;clip-path:inset(0 0 0 var(--pos,50%))}
.ba .line{position:absolute;top:0;bottom:0;left:var(--pos,50%);width:2px;margin-left:-1px;background:${C.creme};pointer-events:none}
.ba .knob{position:absolute;top:50%;left:var(--pos,50%);width:44px;height:44px;margin:-22px 0 0 -22px;border-radius:50%;background:${C.bronze};box-shadow:0 6px 20px rgba(0,0,0,.4);pointer-events:none}
.ba input{position:absolute;inset:0;width:100%;height:100%;opacity:0;cursor:ew-resize;margin:0}
.ba input:focus-visible ~ .knob{outline:2px solid ${C.creme};outline-offset:3px}
.tag{position:absolute;top:14px;padding:4px 12px;border-radius:999px;background:rgba(26,22,19,.7);font-size:.7rem;letter-spacing:.2em;text-transform:uppercase;pointer-events:none}
.tag.l{left:14px}.tag.r{right:14px}
figcaption{margin-top:.75rem;text-align:center;font-size:.9rem;color:rgba(234,224,211,.7)}
.card{margin-top:3rem;padding:1.25rem;border-radius:28px;border:1px solid rgba(234,224,211,.1);background:linear-gradient(140deg,rgba(44,38,33,.86),rgba(35,30,26,.66));box-shadow:inset 0 1px 0 rgba(255,255,255,.06),0 26px 54px -30px rgba(0,0,0,.6);display:grid;gap:.6rem}
.row{display:flex;align-items:center;gap:.9rem;width:100%;padding:1rem 1.25rem;border-radius:18px;border:1px solid rgba(234,224,211,.09);background:#2C2621;color:${C.creme};font:500 15px '${S}',system-ui,sans-serif;text-decoration:none;text-align:left;cursor:pointer;transition:transform .2s cubic-bezier(.22,1,.36,1),border-color .2s}
.row:hover{border-color:rgba(234,224,211,.2)}.row:active{transform:scale(.98)}
.row.primary{background:${C.bronze};border-color:transparent;color:${C.nuit}}
.row span{flex:1}.row small{display:block;font-weight:400;font-size:.85rem;opacity:.75}
.row:focus-visible{outline:2px solid ${C.bronzeClair};outline-offset:3px}
footer{margin-top:3rem;text-align:center;font-size:.85rem;color:rgba(234,224,211,.6)}
footer a{color:inherit}
.state{text-align:center;margin-top:3rem;color:rgba(234,224,211,.75)}
[hidden]{display:none!important}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
</style>
</head>
<body data-site="https://${esc(M.domaine)}" data-avis="${esc(M.avisGoogle || '')}" data-nom="${esc(M.nom)}">
<main>
  <div class="mono" aria-hidden="true">${MONO}</div>
  <p class="state" id="state">Ouverture de votre page…</p>
  <div id="page" hidden>
    <h1 id="titre"></h1>
    <p class="lead" id="lead"></p>
    <p class="dates" id="dates"></p>
    <p class="msg" id="msg" hidden></p>
    <div id="paires"></div>
    <div class="card">
      <a class="row primary" id="avis" hidden target="_blank" rel="noopener noreferrer"><span>Laisser un avis Google<small>Deux lignes nous aident beaucoup.</small></span>›</a>
      <button class="row" id="parrainer" type="button"><span>Recommander ${esc(M.nom.split(' ')[0])} à un proche<small>Il reçoit le lien du devis gratuit.</small></span>›</button>
    </div>
    <footer>${M.contacts.map((c) => esc(c.nom)).join(' et ')}, ${esc(M.nom)}<br><a href="https://${esc(M.domaine)}">${esc(M.domaine)}</a></footer>
  </div>
</main>
<script src="/c/merci.js" defer></script>
</body>
</html>
`;

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  /* Photos : redimensionnées (1600 px de large au plus) et converties en WebP
     par le navigateur, puis embarquées dans la page chiffrée. */
  const shrink = async (file) => {
    const ext = path.extname(file).slice(1).toLowerCase().replace('jpg', 'jpeg');
    const src = `data:image/${ext};base64,${fs.readFileSync(path.join(SITE, file)).toString('base64')}`;
    return page.evaluate(async (s) => {
      const img = new Image();
      img.src = s;
      await img.decode();
      const w = Math.min(1600, img.naturalWidth);
      const c = document.createElement('canvas');
      c.width = w;
      c.height = Math.round((img.naturalHeight * w) / img.naturalWidth);
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      return c.toDataURL('image/webp', 0.82);
    }, src);
  };
  const paires = [];
  for (const p of J.paires) {
    paires.push({ legende: p.legende || '', avant: await shrink(p.avant), apres: await shrink(p.apres) });
  }
  const payload = {
    client: J.client,
    commune: J.commune,
    travaux: J.travaux,
    debut: date(J.debut),
    fin: date(J.fin),
    message: J.message || '',
    paires,
  };

  fs.mkdirSync(PUBLIC_C, { recursive: true });
  const blob = encrypt(payload);
  selfCheck(blob, payload);
  fs.writeFileSync(path.join(PUBLIC_C, `${id}.bin`), blob);
  fs.writeFileSync(path.join(PUBLIC_C, 'index.html'), pageQr());
  fs.copyFileSync(path.join(__dirname, 'coffret-merci.js'), path.join(PUBLIC_C, 'merci.js'));
  // shortcut: polices du site Chaudrel (Prata / Albert Sans) ; pour une autre marque, pointer ses fichiers woff2.
  const nm = path.resolve(BRAND, '..', 'node_modules');
  fs.copyFileSync(path.join(nm, '@fontsource/prata/files/prata-latin-400-normal.woff2'), path.join(PUBLIC_C, 'titre.woff2'));
  fs.copyFileSync(path.join(nm, '@fontsource-variable/albert-sans/files/albert-sans-latin-wght-normal.woff2'), path.join(PUBLIC_C, 'texte.woff2'));

  const qrSvg = await QRCode.toString(url, { type: 'svg', margin: 0, errorCorrectionLevel: 'M', color: { dark: C.nuit, light: '#0000' } });
  await page.setContent(certificat(qrSvg), { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.pdf({ path: path.join(SITE, 'certificat.pdf'), width: '297mm', height: '210mm', printBackground: true });
  await page.setViewportSize({ width: 1123, height: 794 });
  await page.screenshot({ path: path.join(SITE, 'certificat-apercu.png') });
  fs.writeFileSync(lienFile, `${url}\n`);
  await browser.close();

  console.log(`certificat  ${path.relative(process.cwd(), path.join(SITE, 'certificat.pdf'))}  (N° ${numero})`);
  console.log(`page        public/c/${id}.bin  (chiffrée, à commiter)`);
  console.log(`lien        ${path.relative(process.cwd(), lienFile)}  (contient la clé : ne pas publier)`);
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
