/**
 * Storyboard - la seule description du film.
 *
 * Un seul espace : la maquette, posée sur le plan de travail de l'atelier,
 * avec les plans à sa gauche et les échantillons de matières à sa droite. La
 * caméra le parcourt sans coupe, en six temps :
 *
 *   IMAGINER     la maquette, entière
 *   CONCEVOIR    les plans se tracent
 *   PRÉPARER     les matières, à leur grain réel
 *   RÉNOVER      la maison s'ouvre, couche par couche
 *   TRANSFORMER  le brut devient fini, des fondations à la toiture
 *   RÉVÉLER      le soir tombe, la maison s'allume
 *
 * Chaque image-clé fixe la caméra (azimut / élévation en degrés, distance en
 * mètres, point visé) et l'état de la scène :
 *   draw     0 → 1   tracé des plans
 *   explode  0 → 1   vue éclatée
 *   wipe     0 → 1   brut → fini (le plan de finition monte)
 *   dusk     0 → 1   jour → crépuscule, lumières intérieures
 * `at` est la position dans le défilement (0 → 1). La timeline GSAP interpole
 * entre ces images ; rien d'autre ne décide du mouvement.
 */

/* Les six temps, et leur place dans le défilement. */
export const STEPS = [
  { id: 'imaginer', at: 0 },
  { id: 'concevoir', at: 0.19 },
  { id: 'preparer', at: 0.36 },
  { id: 'renover', at: 0.56 },
  { id: 'transformer', at: 0.78 },
  { id: 'reveler', at: 1 },
];

const LANDSCAPE = [
  { at: 0, az: 31, el: 3.2, dist: 47, tx: 0.2, ty: 2.7, tz: 0.5, sx: 0.035, draw: 0, explode: 0, wipe: 0, dusk: 0 },
  { at: 0.07, az: 28, el: 3.6, dist: 46, tx: 0.2, ty: 2.7, tz: 0.5, sx: 0.035, draw: 0, explode: 0, wipe: 0, dusk: 0 },
  // Concevoir : la caméra s'élève au-dessus des plans, la maquette reste dans le champ
  { at: 0.2, az: -16, el: 48, dist: 43, tx: -24.5, ty: -0.7, tz: 17.5, sx: 0.2, sy: -0.03, draw: 1, explode: 0, wipe: 0, dusk: 0 },
  { at: 0.27, az: -11, el: 45, dist: 42, tx: -24, ty: -0.7, tz: 17.5, sx: 0.2, sy: -0.03, draw: 1, explode: 0, wipe: 0, dusk: 0 },
  // Préparer : elle redescend et rase les échantillons
  { at: 0.38, az: 34, el: 21, dist: 29, tx: 23.5, ty: -0.2, tz: 20, sx: 0.09, draw: 1, explode: 0, wipe: 0, dusk: 0 },
  { at: 0.45, az: 27, el: 19, dist: 28, tx: 23.5, ty: -0.2, tz: 20, sx: 0.09, draw: 1, explode: 0, wipe: 0, dusk: 0 },
  // Rénover : retour à la maquette, qui s'ouvre
  { at: 0.56, az: -36, el: 24, dist: 66, tx: 0, ty: 7.2, tz: 0, sx: 0.1, draw: 1, explode: 1, wipe: 0, dusk: 0 },
  { at: 0.64, az: -30, el: 22, dist: 66, tx: 0, ty: 7.2, tz: 0, sx: 0.1, draw: 1, explode: 1, wipe: 0.12, dusk: 0 },
  // Transformer : elle se referme, la finition monte
  { at: 0.8, az: 18, el: 10, dist: 42, tx: 0, ty: 3.4, tz: 0.5, sx: 0.12, draw: 1, explode: 0, wipe: 1, dusk: 0 },
  { at: 0.87, az: 21, el: 6, dist: 38, tx: -0.2, ty: 3.35, tz: 0.8, sx: 0.11, draw: 1, explode: 0, wipe: 1, dusk: 0 },
  // Révéler
  { at: 1, az: 24, el: 2.5, dist: 34, tx: -0.4, ty: 3.3, tz: 1, sx: 0.1, draw: 1, explode: 0, wipe: 1, dusk: 1 },
];

/* Écran en hauteur : la maison est vue plus de trois quarts pour tenir dans la
   largeur, et la caméra recule. Mêmes temps, même récit. */
const PORTRAIT = [
  { at: 0, az: 40, el: 7, dist: 100, tx: 0, ty: 3.6, tz: 0.5, sy: -0.14, draw: 0, explode: 0, wipe: 0, dusk: 0 },
  { at: 0.07, az: 38, el: 7, dist: 98, tx: 0, ty: 3.6, tz: 0.5, sy: -0.14, draw: 0, explode: 0, wipe: 0, dusk: 0 },
  { at: 0.2, az: -8, el: 58, dist: 84, tx: -26, ty: -0.7, tz: 18.5, sy: -0.15, draw: 1, explode: 0, wipe: 0, dusk: 0 },
  { at: 0.27, az: -4, el: 55, dist: 82, tx: -26, ty: -0.7, tz: 18.5, sy: -0.15, draw: 1, explode: 0, wipe: 0, dusk: 0 },
  { at: 0.38, az: 30, el: 32, dist: 66, tx: 23.8, ty: -0.2, tz: 20.4, sy: -0.15, draw: 1, explode: 0, wipe: 0, dusk: 0 },
  { at: 0.45, az: 24, el: 30, dist: 64, tx: 23.8, ty: -0.2, tz: 20.4, sy: -0.15, draw: 1, explode: 0, wipe: 0, dusk: 0 },
  { at: 0.56, az: -42, el: 22, dist: 104, tx: 0, ty: 7.2, tz: 0, sy: -0.16, draw: 1, explode: 1, wipe: 0, dusk: 0 },
  { at: 0.64, az: -36, el: 20, dist: 104, tx: 0, ty: 7.2, tz: 0, sy: -0.16, draw: 1, explode: 1, wipe: 0.12, dusk: 0 },
  { at: 0.8, az: 30, el: 10, dist: 92, tx: 0, ty: 3.8, tz: 0.5, sy: -0.15, draw: 1, explode: 0, wipe: 1, dusk: 0 },
  { at: 0.87, az: 33, el: 8, dist: 90, tx: 0, ty: 3.7, tz: 0.5, sy: -0.15, draw: 1, explode: 0, wipe: 1, dusk: 0 },
  { at: 1, az: 36, el: 6, dist: 86, tx: 0, ty: 3.6, tz: 0.5, sy: -0.15, draw: 1, explode: 0, wipe: 1, dusk: 1 },
];

export const isPortrait = (aspect) => aspect < 0.8;
/* `sx` / `sy` décalent le cadre (fraction de l'écran) : la maison se place
   dans la composition sans que la perspective change. */
const withFrame = (frames) => frames.map((f) => ({ sx: 0, sy: 0, ...f }));
const SETS = { landscape: withFrame(LANDSCAPE), portrait: withFrame(PORTRAIT) };

/* Le jeu « portrait » est réglé pour un téléphone (≈ 9:19). Une tablette tenue
   debout est plus large : la caméra s'approche d'autant, sinon la maquette
   flotterait, petite, au milieu de l'écran. */
export function keyframes(aspect) {
  if (!isPortrait(aspect)) return SETS.landscape;
  const k = Math.min(1, Math.max(0.62, 0.47 / aspect));
  /* La vue éclatée est haute : elle profite moins du rapprochement. */
  return k === 1 ? SETS.portrait : SETS.portrait.map((f) => ({ ...f, dist: f.dist * (k + (1 - k) * 0.75 * f.explode) }));
}
export const STATE_KEYS = ['az', 'el', 'dist', 'tx', 'ty', 'tz', 'sx', 'sy', 'draw', 'explode', 'wipe', 'dusk'];

/** État à une position donnée - même interpolation que la timeline (lissée). */
export function stateAt(frames, p) {
  const t = Math.min(1, Math.max(0, p));
  let i = 0;
  while (i < frames.length - 2 && t > frames[i + 1].at) i++;
  const a = frames[i];
  const b = frames[i + 1];
  let k = (t - a.at) / (b.at - a.at || 1);
  k = Math.min(1, Math.max(0, k));
  k = k * k * (3 - 2 * k);
  const out = {};
  for (const key of STATE_KEYS) out[key] = a[key] + (b[key] - a[key]) * k;
  return out;
}
