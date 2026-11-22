import { partsFor } from '@/components/sections/HouseDiagram';
import { cn } from '@/lib/utils';

/**
 * Maquette 3D de la maison (CSS 3D seul : aucune bibliothèque, aucun
 * JavaScript à l'image). Les parties touchées par un chantier s'allument en
 * bronze et, au défilement, la caméra tourne autour de la maquette jusqu'à
 * la partie dont parle le bloc (première ligne des travaux).
 *
 * Repère, en em : x vers la droite, y vers le bas (sol à 0), z vers nous.
 * Chaque face est un plan posé par `translate3d` + rotations ; fenêtres et
 * portes sont des enfants 2D de leur mur, donc sans conflit de profondeur.
 *
 * Illustration (`aria-hidden`) : le sens est porté par la liste des travaux.
 */

/* Pignon sur rue : rectangle de 5,5 em surmonté d'un triangle de 3,5 em. */
const GABLE = 'polygon(0 100%, 0 38.9%, 50% 0, 100% 38.9%, 100% 100%)';
const win = (x, y, w = 1.6, h = 1.4, p = 'chassis') => ({ p, x, y, w, h });

const FACES = [
  // Le jardin : allée, chemin de la porte et piscine y sont dessinés à plat.
  {
    w: 24, h: 20, at: [0, 0, -0.5], r: 'rotateX(90deg)', s: 0.03, ground: true,
    kids: [
      { p: 'abords', x: 16.4, y: 13.5, w: 4.2, h: 5.5 },
      { p: 'abords', x: 10.4, y: 14, w: 1.2, h: 5 },
      { p: 'piscine', x: 1.5, y: 2.5, w: 3.5, h: 7, pool: true },
    ],
  },
  // La maison : pignon avant, pignon arrière, deux murs gouttereaux.
  {
    p: 'facade', w: 10, h: 9, at: [-1, -4.5, 3.5], s: 0.11, clip: GABLE,
    kids: [
      { p: 'porte', x: 4.3, y: 6.6, w: 1.4, h: 2.4, door: true },
      win(1.2, 6.5, 2, 1.5), win(6.8, 6.5, 2, 1.5),
      win(1.4, 4.2), win(7, 4.2), win(4.4, 1.9, 1.2, 1.2),
    ],
  },
  { p: 'facade', w: 10, h: 9, at: [-1, -4.5, -3.5], r: 'rotateY(180deg)', s: 0.05, clip: GABLE, kids: [win(1.4, 4.2), win(7, 4.2)] },
  { p: 'facade', w: 7, h: 5.5, at: [-6, -2.75, 0], r: 'rotateY(-90deg)', s: 0.07, kids: [win(1.2, 1), win(4.2, 1), win(1.2, 3.4), win(4.2, 3.4)] },
  { p: 'facade', w: 7, h: 5.5, at: [4, -2.75, 0], r: 'rotateY(90deg)', s: 0.06, kids: [win(2.8, 0.5, 1.6, 1.1)] },
  // Le toit à deux pans (pente 35°), débord côté gouttière seulement.
  { p: 'toit', w: 6.7, h: 7.8, at: [-3.75, -7.08, 0], r: 'rotateZ(-35deg) rotateX(90deg)', s: 0.17 },
  { p: 'toit', w: 6.7, h: 7.8, at: [1.75, -7.08, 0], r: 'rotateZ(35deg) rotateX(90deg)', s: 0.1 },
  // Le garage accolé à droite, toit plat.
  { p: 'facade', w: 5, h: 3.6, at: [6.5, -1.8, 3], s: 0.11, kids: [{ p: 'garage', x: 0.6, y: 0.7, w: 3.8, h: 2.9, slats: true }] },
  { p: 'facade', w: 4.5, h: 3.6, at: [9, -1.8, 0.75], r: 'rotateY(90deg)', s: 0.06 },
  { p: 'facade', w: 5, h: 3.6, at: [6.5, -1.8, -1.5], r: 'rotateY(180deg)', s: 0.05 },
  { p: 'toit', w: 5, h: 4.5, at: [6.5, -3.6, 0.75], r: 'rotateX(90deg)', s: 0.13 },
  // L'extension à l'arrière, avec sa baie vitrée.
  { p: 'volume', w: 6, h: 3.8, at: [-2, -1.9, -7.5], r: 'rotateY(180deg)', s: 0.05, kids: [win(0.5, 0.6, 5, 3.2)] },
  { p: 'volume', w: 4, h: 3.8, at: [-5, -1.9, -5.5], r: 'rotateY(-90deg)', s: 0.07 },
  { p: 'volume', w: 4, h: 3.8, at: [1, -1.9, -5.5], r: 'rotateY(90deg)', s: 0.06 },
  { p: 'volume', w: 6, h: 4, at: [-2, -3.8, -5.5], r: 'rotateX(90deg)', s: 0.13 },
];

/* Point de vue par partie : [rx, ry, x, y, z] - inclinaison (négatif = vu
   d'en haut), rotation autour de la maison (positif = côté gauche), puis
   cadrage à l'écran (x, y) et rapprochement (z), en em. */
const CAMERAS = {
  facade: [-16, -30],
  porte: [-6, 8, 1, 1.4, 11],
  chassis: [-10, 58],
  garage: [-20, -48],
  toit: [-52, 150, 0, 0, -8],
  volume: [-18, 165],
  piscine: [-30, 118],
  abords: [-38, -28],
};

/** La partie dont parle le chantier : celle de sa première ligne de travaux. */
export function focusFor(works = []) {
  return [...partsFor(works.slice(0, 1))][0] ?? 'facade';
}

export default function House3D({ works = [], className }) {
  const lit = partsFor(works);
  const [rx, ry, x = 0, y = 0, z = 0] = CAMERAS[focusFor(works)];
  const on = (p) => p && lit.has(p) && 'is-lit';

  return (
    <div aria-hidden="true" className={cn('h3-view', className)}>
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
            className={cn('h3-face', f.ground && 'h3-ground', on(f.p))}
            style={{
              width: `${f.w}em`,
              height: `${f.h}em`,
              margin: `${-f.h / 2}em 0 0 ${-f.w / 2}em`,
              transform: `translate3d(${f.at[0]}em, ${f.at[1]}em, ${f.at[2]}em) ${f.r ?? ''}`,
              clipPath: f.clip,
              '--s': f.s,
            }}
          >
            {f.kids?.map((k, j) => (
              <span
                key={j}
                className={cn('h3-part', k.door && 'h3-door', k.slats && 'h3-slats', k.pool && 'h3-pool', on(k.p))}
                style={{ left: `${k.x}em`, top: `${k.y}em`, width: `${k.w}em`, height: `${k.h}em` }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
