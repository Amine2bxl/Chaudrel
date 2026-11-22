import { cn } from '@/lib/utils';

/**
 * Maquette 3D de la maison (CSS 3D seul : aucune bibliothèque, aucun
 * JavaScript à l'image). Les parties concernées s'allument en bronze.
 *
 * Deux usages :
 * - Réalisations (`works`) : au défilement, la caméra tourne autour de la
 *   maquette jusqu'à la partie dont parle le bloc (première ligne des
 *   travaux), puis les parties concernées s'allument. View-timeline CSS.
 * - Services (`live`, `lit`, `camera`) : la caméra glisse d'un point de vue
 *   à l'autre quand on change de métier.
 *
 * Repère, en em : x vers la droite, y vers le bas (sol à 0), z vers nous.
 * Chaque face est un plan posé par `translate3d` + rotations ; fenêtres et
 * portes sont des enfants 2D de leur mur, donc sans conflit de profondeur.
 *
 * Illustration (`aria-hidden`) : le sens est porté par le texte voisin.
 */

/* Travaux réels d'un chantier (projects.js → works) → parties de la maison. */
const RULES = [
  ['garage', /garage/i],
  ['porte', /portes? d.entr|^portes$/i],
  ['chassis', /châssis|volet|vitrage|baie/i],
  ['toit', /couverture|zinguerie|rive|toit|charpente/i],
  ['volume', /volume|gros œuvre|extension/i],
  ['facade', /façade|^enduit$|raccord|maçonnerie/i],
  ['abords', /allée|bordure|abords|terrasse|jardin/i],
];
export function partsFor(works = []) {
  const lit = new Set();
  for (const w of works) for (const [part, re] of RULES) if (re.test(w)) lit.add(part);
  return lit;
}

/* Pignon sur rue : rectangle de 5,5 em surmonté d'un triangle de 3,5 em. */
const GABLE = 'polygon(0 100%, 0 38.9%, 50% 0, 100% 38.9%, 100% 100%)';
const win = (x, y, w = 1.6, h = 1.4, p = 'chassis') => ({ p, x, y, w, h, k: 'win' });
/* Les quatre faces d'une boîte verticale (cheminée) : centre, taille, hauteur. */
const box = (p, cx, cz, w, d, y, h, s) => [
  { p, w, h, at: [cx, y, cz + d / 2], s: s + 0.04 },
  { p, w, h, at: [cx, y, cz - d / 2], r: 'rotateY(180deg)', s },
  { p, w: d, h, at: [cx - w / 2, y, cz], r: 'rotateY(-90deg)', s: s + 0.02 },
  { p, w: d, h, at: [cx + w / 2, y, cz], r: 'rotateY(90deg)', s },
  { p, w, h: d, at: [cx, y - h / 2, cz], r: 'rotateX(90deg)', s: s + 0.06 },
];

const FACES = [
  // Le jardin : ombre portée, allée, chemin de la porte, piscine, à plat.
  {
    w: 22, h: 18, at: [0, 0, -0.5], r: 'rotateX(90deg)', s: 0.03, k: 'ground',
    kids: [
      { x: 3.5, y: 0.5, w: 18.5, h: 14.5, k: 'shadow' },
      { p: 'abords', x: 15.4, y: 12.5, w: 4.2, h: 5.5, k: 'pave' },
      { p: 'abords', x: 9.4, y: 13, w: 1.2, h: 5, k: 'pave' },
      { p: 'piscine', x: 0.5, y: 1.5, w: 3.5, h: 7, k: 'pool' },
    ],
  },
  // Intérieur : deux planchers, visibles seulement quand on le désigne.
  { p: 'interieur', w: 10, h: 7, at: [-1, -0.15, 0], r: 'rotateX(90deg)', s: 0.08, k: 'inner' },
  { p: 'interieur', w: 10, h: 7, at: [-1, -2.8, 0], r: 'rotateX(90deg)', s: 0.1, k: 'inner' },
  // La maison : pignon avant, pignon arrière, deux murs gouttereaux.
  {
    p: 'facade', w: 10, h: 9, at: [-1, -4.5, 3.5], s: 0.12, clip: GABLE, k: 'wall', xr: true,
    kids: [
      { p: 'porte', x: 4.3, y: 6.6, w: 1.4, h: 2.4, k: 'door' },
      win(1.2, 6.5, 2, 1.5), win(6.8, 6.5, 2, 1.5),
      win(1.4, 4.2), win(7, 4.2), win(4.4, 1.9, 1.2, 1.2),
    ],
  },
  { p: 'facade', w: 10, h: 9, at: [-1, -4.5, -3.5], r: 'rotateY(180deg)', s: 0.05, clip: GABLE, k: 'wall', xr: true, kids: [win(1.4, 4.2), win(7, 4.2)] },
  { p: 'facade', w: 7, h: 5.5, at: [-6, -2.75, 0], r: 'rotateY(-90deg)', s: 0.08, k: 'wall', xr: true, kids: [win(1.2, 1), win(4.2, 1), win(1.2, 3.4), win(4.2, 3.4)] },
  { p: 'facade', w: 7, h: 5.5, at: [4, -2.75, 0], r: 'rotateY(90deg)', s: 0.06, k: 'wall', xr: true, kids: [win(2.8, 0.5, 1.6, 1.1)] },
  // Le toit à deux pans (pente 35°), débord côté gouttière, et sa cheminée.
  { p: 'toit', w: 6.7, h: 7.8, at: [-3.75, -7.08, 0], r: 'rotateZ(-35deg) rotateX(90deg)', s: 0.2, k: 'roof', xr: true },
  { p: 'toit', w: 6.7, h: 7.8, at: [1.75, -7.08, 0], r: 'rotateZ(35deg) rotateX(90deg)', s: 0.12, k: 'roof', xr: true },
  ...box('toit', 2.05, -1.55, 0.9, 0.9, -7.8, 2.8, 0.1),
  // Le garage accolé à droite, toit plat.
  { p: 'facade', w: 5, h: 3.6, at: [6.5, -1.8, 3], s: 0.12, k: 'wall', kids: [{ p: 'garage', x: 0.6, y: 0.7, w: 3.8, h: 2.9, k: 'slats' }] },
  { p: 'facade', w: 4.5, h: 3.6, at: [9, -1.8, 0.75], r: 'rotateY(90deg)', s: 0.06, k: 'wall' },
  { p: 'facade', w: 5, h: 3.6, at: [6.5, -1.8, -1.5], r: 'rotateY(180deg)', s: 0.05, k: 'wall' },
  { p: 'toit', w: 5, h: 4.5, at: [6.5, -3.6, 0.75], r: 'rotateX(90deg)', s: 0.15, k: 'flat' },
  // L'extension à l'arrière, avec sa baie vitrée.
  { p: 'volume', w: 6, h: 3.8, at: [-2, -1.9, -7.5], r: 'rotateY(180deg)', s: 0.05, k: 'wall', kids: [{ ...win(0.5, 0.6, 5, 3.2), k: 'bay' }] },
  { p: 'volume', w: 4, h: 3.8, at: [-5, -1.9, -5.5], r: 'rotateY(-90deg)', s: 0.08, k: 'wall' },
  { p: 'volume', w: 4, h: 3.8, at: [1, -1.9, -5.5], r: 'rotateY(90deg)', s: 0.06, k: 'wall' },
  { p: 'volume', w: 6, h: 4, at: [-2, -3.8, -5.5], r: 'rotateX(90deg)', s: 0.15, k: 'flat' },
];

/* Point de vue par partie : [rx, ry, x, y, z] - inclinaison (négatif = vu
   d'en haut), rotation autour de la maison (positif = côté gauche), puis
   cadrage (x, y) et distance (z), en em. x, y, z sont mesurés pour que la
   maquette remplisse sa case 4/3 à 88 % sans en sortir. */
export const CAMERAS = {
  facade: [-16, -30, 0.2, -0.3, 6.2],
  porte: [-6, 8, -0.9, 0.7, 13.7],
  chassis: [-10, 58, 1.3, 0, 8.8],
  garage: [-20, -48, -0.7, -0.7, 6.2],
  toit: [-52, 150, 0.5, -2.8, 3.7],
  volume: [-18, 165, 1.2, -0.4, 11.2],
  piscine: [-30, 118, -0.4, -1.8, 11.2],
  abords: [-38, -28, 0.2, -1.5, 7.7],
};

/** La partie dont parle le chantier : celle de sa première ligne de travaux. */
export function focusFor(works = []) {
  return [...partsFor(works.slice(0, 1))][0] ?? 'facade';
}

export default function House3D({ works = [], lit: litProp, camera, live = false, className }) {
  const lit = litProp ?? partsFor(works);
  const [rx, ry, x = 0, y = 0, z = 0] = camera ?? CAMERAS[focusFor(works)];
  const on = (p) => p && lit.has(p) && 'is-lit';

  // La case : la maquette s'y met à l'échelle (unités cqw) et n'en sort jamais.
  return (
    <div aria-hidden="true" className={cn('h3-box', className)}>
      <div className={cn('h3-view', live ? 'is-live' : 'is-scroll', lit.has('interieur') && 'is-xray')}>
        <div
          className="h3-scene"
          style={{
            '--rx': `${rx}deg`,
            '--ry': `${ry}deg`,
            '--cam': `${x}em, ${y}em, ${z}em`,
            '--rx0': `${rx - 16}deg`,
            '--ry0': `${ry + 75}deg`,
          }}
        >
          {FACES.map((f, i) => (
            <div
              key={i}
              className={cn('h3-face', f.k && `h3-${f.k}`, f.xr && 'h3-xr', on(f.p))}
              style={{
                width: `${f.w}em`,
                height: `${f.h}em`,
                margin: `${-f.h / 2}em 0 0 ${-f.w / 2}em`,
                transform: `translate3d(${f.at[0]}em, ${f.at[1]}em, ${f.at[2]}em) ${f.r ?? ''}`,
                clipPath: f.clip,
                '--s': f.s,
              }}
            >
              {f.kids?.map((c, j) => (
                <span
                  key={j}
                  className={cn('h3-part', `h3-${c.k}`, on(c.p))}
                  style={{ left: `${c.x}em`, top: `${c.y}em`, width: `${c.w}em`, height: `${c.h}em` }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
