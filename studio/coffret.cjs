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

const short = (iso) => new Date(`${iso}T12:00:00`).toLocaleDateString('fr-BE', { day: '2-digit', month: '2-digit', year: 'numeric' });

/* Certificat : sobre et moderne, une seule lueur (la porte du logo), un
   filet bronze, le nom au centre. Toutes les valeurs viennent de
   marque.json et de chantier.json. */
const certificat = (qrSvg) => {
  const W = 297;
  const H = 210;
  const lead = M.contacts[0];
  return `<!doctype html><html lang="fr"><head><meta charset="utf-8">${FONTS.replace('wght@400;500;600', 'wght@400;500;600;700').replace('&display', '&family=Pinyon+Script&display')}<style>
@page{size:${W}mm ${H}mm;margin:0}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:${W}mm;height:${H}mm}
body{background:#110F0D;color:${C.creme};font-family:'${S}',sans-serif;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.cert{position:relative;width:${W}mm;height:${H}mm;overflow:hidden;background:radial-gradient(160mm 120mm at 50% 30%,#1c1815,#110F0D 70%)}
.art{position:absolute;inset:0;width:${W}mm;height:${H}mm}
.top{position:absolute;left:16mm;right:16mm;top:15mm;display:flex;justify-content:space-between;align-items:center}
.brand{display:flex;align-items:center;gap:3.5mm}
.brand .m{width:11mm}.brand .m svg{width:100%;height:auto;display:block}
.brand b{display:block;font:600 11pt '${S}';letter-spacing:.2em}
.brand span{display:block;font:500 5.6pt '${S}';letter-spacing:.42em;color:${C.bronzeClair};margin-top:.6mm}
.date{font:600 7.5pt '${S}';letter-spacing:.12em;color:rgba(234,224,211,.7);text-align:right}
.date i{display:block;font-style:normal;font-weight:500;font-size:6.2pt;color:rgba(234,224,211,.45);margin-top:1mm}
.mid{position:absolute;left:0;right:0;top:52mm;text-align:center}
h1{font:700 27pt/1 '${S}';letter-spacing:.04em;text-transform:uppercase;color:#D8D0C4}
.by{display:flex;align-items:center;justify-content:center;gap:5mm;margin-top:4mm;font:500 8.5pt '${S}';letter-spacing:.16em;text-transform:uppercase;color:rgba(234,224,211,.72)}
.by::before,.by::after{content:'';width:26mm;height:.3mm;background:linear-gradient(90deg,transparent,${C.bronze})}
.by::after{background:linear-gradient(90deg,${C.bronze},transparent)}
.client{font:700 26pt/1.1 '${S}';letter-spacing:.03em;text-transform:uppercase;color:${C.creme};margin-top:10mm}
.rule{width:95mm;height:.35mm;margin:8mm auto 0;background:linear-gradient(90deg,transparent,${C.bronze},transparent);box-shadow:0 0 6mm rgba(174,138,86,.35)}
.lbl{font:500 7.5pt '${S}';letter-spacing:.16em;text-transform:uppercase;color:rgba(234,224,211,.65);margin-top:12mm}
.what{font:700 17pt/1.2 '${S}';color:${C.bronzeClair};margin-top:2.5mm;padding:0 40mm}
.where{font:500 8pt '${S}';letter-spacing:.06em;color:rgba(234,224,211,.55);margin-top:2.5mm}
.bottom{position:absolute;left:16mm;right:16mm;bottom:14mm;display:flex;justify-content:space-between;align-items:flex-end}
.site{font:600 7pt '${S}';letter-spacing:.14em;color:rgba(234,224,211,.75)}
.right{display:flex;align-items:flex-end;gap:7mm}
.sig{text-align:right}
.sig i{display:block;font:400 25pt/1 'Pinyon Script',cursive;color:${C.creme};opacity:.92}
.sig span{display:block;font:600 6.5pt '${S}';letter-spacing:.14em;text-transform:uppercase;color:rgba(234,224,211,.75);margin-top:1.5mm}
.qr{width:21mm;height:21mm;padding:1.6mm;border-radius:1.8mm;background:${C.cremeLogo}}
.qr svg{width:100%;height:100%;display:block}
</style></head><body><div class="cert">
<svg class="art" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="n"><feTurbulence type="fractalNoise" baseFrequency="1.4" numOctaves="2" seed="3"/><feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 .5 0"/></filter>
    <filter id="g" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="7"/></filter>
    <linearGradient id="door" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#E4C68E"/><stop offset=".55" stop-color="#AE8A56"/><stop offset="1" stop-color="#3a2c1a"/></linearGradient>
    <linearGradient id="edge" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#AE8A56" stop-opacity=".2"/><stop offset=".5" stop-color="#CDAE7E"/><stop offset="1" stop-color="#AE8A56" stop-opacity=".2"/></linearGradient>
  </defs>
  <rect width="${W}" height="${H}" filter="url(#n)" opacity=".05"/>
  <g transform="translate(244 104) scale(.44)" opacity=".85">
    <path d="M0 38 L67 0 L67 165 L0 142 Z" fill="#AE8A56" filter="url(#g)" opacity=".42"/>
    <path d="M0 38 L67 0 L67 165 L0 142 Z" fill="url(#door)" opacity=".08"/>
    <path d="M0 38 L67 0 L67 165 L0 142 Z" fill="none" stroke="#E4C68E" stroke-width=".7" opacity=".7"/>
  </g>
  <rect x="6" y="6" width="${W - 12}" height="${H - 12}" rx="1.5" fill="none" stroke="url(#edge)" stroke-width=".4"/>
</svg>
<div class="top">
  <div class="brand"><div class="m">${MONO}</div><div><b>${esc(M.nom.split(' ')[0].toUpperCase())}</b><span>${esc(M.nom.split(' ').slice(1).join(' ').toUpperCase())}</span></div></div>
  <div class="date">${short(J.fin)}<i>N° ${numero}</i></div>
</div>
<div class="mid">
  <h1>Certificat de réalisation</h1>
  <div class="by">Chantier mené à bien pour</div>
  <p class="client">${esc(J.client)}</p>
  <div class="rule"></div>
  <p class="lbl">Nature des travaux</p>
  <p class="what">${esc(J.travaux.charAt(0).toUpperCase() + J.travaux.slice(1))}</p>
  <p class="where">${esc(J.commune)} · du ${date(J.debut)} au ${date(J.fin)}</p>
</div>
<div class="bottom">
  <p class="site">${esc(M.domaine.toUpperCase())}</p>
  <div class="right">
    <div class="sig"><i>${esc(lead.nom)}</i><span>${esc(lead.nom)} · ${esc(lead.role)}</span></div>
    <div class="qr">${qrSvg}</div>
  </div>
</div>
</div></body></html>`;
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
