import { BRAND } from '@/data/site';
import { METHOD } from '@/data/method';
import { STORY } from '@/data/story';

/**
 * Le film d'accueil : on arrive devant la maison d'étude, la porte s'ouvre,
 * on traverse l'entrée et la salle à manger, et le séjour - en chantier - se
 * transforme sous nos yeux. Tout est piloté par le défilement.
 *
 * `FRAMES` : la trajectoire de la caméra (x, z au sol, cap et inclinaison en
 * degrés), `at` = position dans le défilement (0 → 1).
 */
export const FRAMES = [
  { at: 0, x: 7.65, z: -15, yaw: 0, pitch: 9 },
  { at: 0.1, x: 7.65, z: -9.5, yaw: 0, pitch: 5 },
  { at: 0.2, x: 7.65, z: -3.4, yaw: 0, pitch: 1 },
  { at: 0.29, x: 7.65, z: 0.4, yaw: 1, pitch: 0 },
  { at: 0.38, x: 7.7, z: 3.3, yaw: 8, pitch: -1 },
  { at: 0.48, x: 8.1, z: 6.5, yaw: 50, pitch: -2 },
  { at: 0.57, x: 10.0, z: 7.3, yaw: 88, pitch: -3 },
  { at: 0.7, x: 11.0, z: 8.0, yaw: 112, pitch: -3 },
  { at: 0.84, x: 11.4, z: 8.8, yaw: 128, pitch: -6 },
  { at: 0.93, x: 12.2, z: 8.6, yaw: 40, pitch: -2 },
  { at: 1, x: 12.7, z: 8.6, yaw: 16, pitch: 0 },
];
export const DOOR = [0.11, 0.24];
export const REVEAL = { room: 'living', from: 0.6, to: 0.84, origin: [11.4, 0, 8.0] };

const step = (id) => STORY.find((s) => s.id === id);

export const CHAPTERS = [
  {
    ...step('imaginer'),
    title: (
      <>
        Tout commence <em>à la porte.</em>
      </>
    ),
    text: 'Une maison d’étude, dessinée pour être visitée. Faites défiler : vous avancez.',
    at: 0.07,
    until: 0.2,
  },
  {
    ...step('concevoir'),
    title: (
      <>
        Des matières qui <em>guident le pas.</em>
      </>
    ),
    text: 'Travertin à l’entrée, chêne en point de Hongrie dans les pièces de vie : le sol dit où l’on va.',
    at: 0.31,
    until: 0.45,
  },
  {
    ...step('preparer'),
    title: (
      <>
        Ici, le chantier <em>commence.</em>
      </>
    ),
    text: 'Brique nue, chape brute, un projecteur. C’est l’état dans lequel nous trouvons souvent une pièce.',
    at: 0.5,
    until: 0.61,
  },
  {
    ...step('renover'),
    title: (
      <>
        Poste <em>par poste.</em>
      </>
    ),
    text: METHOD[2].text,
    at: 0.63,
    until: 0.74,
  },
  {
    ...step('transformer'),
    title: (
      <>
        Du brut <em>au fini.</em>
      </>
    ),
    text: 'La finition gagne la pièce depuis l’endroit où vous vous tenez : sols, murs, mobilier, lumière.',
    at: 0.76,
    until: 0.88,
  },
  {
    ...step('reveler'),
    title: (
      <>
        Terminé quand <em>vous le dites.</em>
      </>
    ),
    text: 'Ceci est une maquette. La maison entière se visite, pièce par pièce, du chantier au résultat.',
    at: 0.93,
    until: 1.01,
  },
];

/** Index latéral : les six temps du film. */
const STEP_AT = { imaginer: 0, concevoir: 0.36, preparer: 0.55, renover: 0.68, transformer: 0.8, reveler: 1 };
export const INDEX = STORY.map((s) => ({ n: s.n, label: s.verb, at: STEP_AT[s.id] }));

/** Fiche du hero : uniquement des faits de `src/data/site.js`. */
export const SHEET = [
  ['Entreprise', BRAND.legalName],
  ['Siège', `${BRAND.address.city}, Bruxelles`],
  ['Depuis', String(BRAND.founded)],
  ['Zone', BRAND.zone],
  ['Interlocuteurs', BRAND.founders.map((f) => f.name).join(' & ')],
];

/* ---------- interpolation de la trajectoire (Catmull-Rom par segment) ---------- */
const cr = (p0, p1, p2, p3, t) => {
  const t2 = t * t;
  const t3 = t2 * t;
  return 0.5 * (2 * p1 + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 + (-p0 + 3 * p1 - 3 * p2 + p3) * t3);
};
export function poseAt(p) {
  const k = Math.min(1, Math.max(0, p));
  let i = 0;
  while (i < FRAMES.length - 2 && k > FRAMES[i + 1].at) i++;
  const a = FRAMES[i];
  const b = FRAMES[i + 1];
  const t = Math.min(1, Math.max(0, (k - a.at) / (b.at - a.at)));
  const g = (j) => FRAMES[Math.min(FRAMES.length - 1, Math.max(0, j))];
  const out = {};
  for (const key of ['x', 'z', 'yaw', 'pitch']) out[key] = cr(g(i - 1)[key], a[key], b[key], g(i + 2)[key], t);
  return out;
}
