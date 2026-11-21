/**
 * Génère les variantes de largeur des photos, une fois pour toutes.
 *
 * Sans elles, un téléphone de 375 px télécharge le fichier prévu pour un écran
 * de bureau : 1400 px de large pour en afficher 375. Le navigateur choisit
 * ensuite tout seul, via `srcset`, la variante qui correspond à sa largeur ET
 * à sa densité de pixels.
 *
 * Idempotent : une variante déjà présente et plus récente que sa source est
 * conservée. Relancer après avoir ajouté une photo.
 *
 *   node scripts/responsive-images.mjs
 */
import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { resolve, join, parse } from 'node:path';

const dir = resolve(process.cwd(), 'public/photos');

/* Trois paliers couvrent le parc : téléphone, tablette / demi-écran, écran
   large. Un quatrième n'apporterait que des octets à générer. */
const WIDTHS = [480, 800, 1200];

/** Largeur d'une image, en pixels. */
function widthOf(file) {
  const out = execFileSync('sips', ['-g', 'pixelWidth', file], { encoding: 'utf8' });
  return Number(out.match(/pixelWidth:\s*(\d+)/)?.[1] ?? 0);
}

let made = 0;
let kept = 0;
let failed = null;
const manifest = {};

for (const name of readdirSync(dir)) {
  const { ext, name: base } = parse(name);
  // On ne repart jamais d'une variante : elle a déjà perdu des pixels.
  if (ext !== '.webp' || /-\d+$/.test(base)) continue;

  const source = join(dir, name);
  const sourceTime = statSync(source).mtimeMs;
  const full = widthOf(source);

  for (const w of WIDTHS) {
    // Agrandir une image ne crée pas de détail : on s'arrête à sa largeur.
    if (w >= full) continue;

    const out = join(dir, `${base}-${w}.webp`);
    if (existsSync(out) && statSync(out).mtimeMs >= sourceTime) {
      kept += 1;
      continue;
    }

    // -q 80 : le palier au-delà duquel l'œil ne distingue plus rien sur une
    // photo de chantier, et en deçà duquel les aplats se marbrent.
    try {
      execFileSync('cwebp', ['-q', '80', '-resize', String(w), '0', source, '-o', out], { stdio: 'ignore' });
      made += 1;
    } catch (err) {
      // Un encodeur absent ou cassé ne doit pas faire échouer le build : on
      // note l'échec, le manifeste reste partiel, et `srcset` s'abstient.
      failed = err.message.split('\n')[0];
    }
  }
}

/* Deuxième passe : on n'inscrit au manifeste que des fichiers qui existent
   vraiment. Une largeur annoncée mais absente produirait un 404 sur le
   téléphone de quelqu'un — c'est pire que pas de `srcset` du tout. */
for (const name of readdirSync(dir)) {
  const { ext, name: base } = parse(name);
  if (ext !== '.webp' || /-\d+$/.test(base)) continue;
  const widths = WIDTHS.filter((w) => existsSync(join(dir, `${base}-${w}.webp`)));
  if (widths.length) manifest[`/photos/${base}.webp`] = widths;
}

writeFileSync(
  resolve(process.cwd(), 'src/data/image-variants.json'),
  `${JSON.stringify(manifest, null, 2)}\n`
);

console.log(`[images] ${made} variantes générées, ${kept} déjà à jour, ${Object.keys(manifest).length} photos dans le manifeste`);
if (failed) {
  console.warn(`[images] encodeur indisponible — ${failed}`);
  console.warn('[images] réparer avec : brew reinstall webp libtiff');
}
