/**
 * Storyboard - la seule description du film.
 *
 * Chaque image-clé fixe la caméra (azimut / élévation en degrés, distance en
 * mètres, point visé) et l'état de la maquette :
 *   explode  0 → 1   vue éclatée
 *   wipe     0 → 1   brut → fini (le plan de finition monte)
 *   dusk     0 → 1   jour → crépuscule, lumières intérieures
 * `at` est la position dans le défilement (0 → 1). La timeline GSAP interpole
 * entre ces images ; rien d'autre ne décide du mouvement.
 */

export const CHAPTERS = [
  { id: 'architecture', at: 0 },
  { id: 'exploration', at: 0.24 },
  { id: 'couches', at: 0.5 },
  { id: 'renovation', at: 0.74 },
  { id: 'resultat', at: 0.96 },
];

const LANDSCAPE = [
  { at: 0, az: 31, el: 3.2, dist: 47, tx: 0.2, ty: 2.7, tz: 0.5, sx: 0.035, explode: 0, wipe: 0, dusk: 0 },
  { at: 0.1, az: 29, el: 3.2, dist: 46, tx: 0.2, ty: 2.7, tz: 0.5, sx: 0.035, explode: 0, wipe: 0, dusk: 0 },
  { at: 0.3, az: -24, el: 9, dist: 41, tx: -0.5, ty: 3.1, tz: 1, sx: 0.12, explode: 0, wipe: 0, dusk: 0 },
  { at: 0.5, az: -36, el: 24, dist: 66, tx: 0, ty: 7.2, tz: 0, sx: 0.1, explode: 1, wipe: 0, dusk: 0 },
  { at: 0.6, az: -30, el: 22, dist: 66, tx: 0, ty: 7.2, tz: 0, sx: 0.1, explode: 1, wipe: 0.12, dusk: 0 },
  { at: 0.8, az: 18, el: 10, dist: 42, tx: 0, ty: 3.4, tz: 0.5, sx: 0.12, explode: 0, wipe: 1, dusk: 0 },
  { at: 0.87, az: 21, el: 6, dist: 38, tx: -0.2, ty: 3.35, tz: 0.8, sx: 0.11, explode: 0, wipe: 1, dusk: 0 },
  { at: 1, az: 24, el: 2.5, dist: 34, tx: -0.4, ty: 3.3, tz: 1, sx: 0.1, explode: 0, wipe: 1, dusk: 1 },
];

/* Écran en hauteur : la maison est vue plus de trois quarts pour tenir dans la
   largeur, et la caméra recule. Mêmes temps, même récit. */
const PORTRAIT = [
  { at: 0, az: 40, el: 7, dist: 100, tx: 0, ty: 3.6, tz: 0.5, sy: -0.11, explode: 0, wipe: 0, dusk: 0 },
  { at: 0.1, az: 38, el: 7, dist: 98, tx: 0, ty: 3.6, tz: 0.5, sy: -0.11, explode: 0, wipe: 0, dusk: 0 },
  { at: 0.3, az: -34, el: 10, dist: 88, tx: 0, ty: 3.6, tz: 1, sy: -0.15, explode: 0, wipe: 0, dusk: 0 },
  { at: 0.5, az: -42, el: 22, dist: 104, tx: 0, ty: 7.2, tz: 0, sy: -0.16, explode: 1, wipe: 0, dusk: 0 },
  { at: 0.6, az: -36, el: 20, dist: 104, tx: 0, ty: 7.2, tz: 0, sy: -0.16, explode: 1, wipe: 0.12, dusk: 0 },
  { at: 0.8, az: 30, el: 10, dist: 92, tx: 0, ty: 3.8, tz: 0.5, sy: -0.15, explode: 0, wipe: 1, dusk: 0 },
  { at: 0.87, az: 33, el: 8, dist: 90, tx: 0, ty: 3.7, tz: 0.5, sy: -0.15, explode: 0, wipe: 1, dusk: 0 },
  { at: 1, az: 36, el: 6, dist: 86, tx: 0, ty: 3.6, tz: 0.5, sy: -0.15, explode: 0, wipe: 1, dusk: 1 },
];

export const isPortrait = (aspect) => aspect < 0.8;
/* `sx` / `sy` décalent le cadre (fraction de l'écran) : la maison se place
   dans la composition sans que la perspective change. */
const withFrame = (frames) => frames.map((f) => ({ sx: 0, sy: 0, ...f }));
const SETS = { landscape: withFrame(LANDSCAPE), portrait: withFrame(PORTRAIT) };
export const keyframes = (aspect) => (isPortrait(aspect) ? SETS.portrait : SETS.landscape);
export const STATE_KEYS = ['az', 'el', 'dist', 'tx', 'ty', 'tz', 'sx', 'sy', 'explode', 'wipe', 'dusk'];

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
