import { cn } from '@/lib/utils';

/**
 * Maison schématique au trait Chaudrel (la porte du logo est la porte
 * d'entrée). Chaque partie peut s'allumer : `lit` (parties concernées, en
 * bronze doux) et `active` (partie survolée, en bronze plein).
 *
 * Le dessin est une illustration (`aria-hidden`) : le sens est porté par le
 * texte voisin (liste des travaux, liste des métiers).
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

const SHAPES = {
  abords: <path d="M196 190 H254 L276 216 H174 Z" />,
  piscine: <rect x="270" y="196" width="40" height="14" rx="3" />,
  volume: <rect x="190" y="124" width="72" height="66" />,
  garage: <rect x="200" y="148" width="52" height="42" />,
  facade: <rect x="58" y="96" width="132" height="94" />,
  interieur: <rect x="66" y="104" width="116" height="80" />,
  toit: <path d="M48 98 L124 38 L200 98 Z" />,
  chassis: (
    <>
      <rect x="74" y="110" width="28" height="26" />
      <rect x="146" y="110" width="28" height="26" />
    </>
  ),
  porte: <path d="M111 153 L137 146 L137 190 L111 187 Z" />,
};
/* Ordre de dessin : du fond vers l'avant. */
const ORDER = ['abords', 'piscine', 'volume', 'facade', 'interieur', 'toit', 'garage', 'chassis', 'porte'];

export default function HouseDiagram({ lit = new Set(), active = null, onHover, className }) {
  return (
    <svg viewBox="30 30 290 190" aria-hidden="true" focusable="false" className={cn('w-full', className)}>
      <line x1="34" y1="190" x2="316" y2="190" className="stroke-ink/25" strokeWidth="1.2" vectorEffect="non-scaling-stroke" />
      {ORDER.map((part) => {
        const on = active === part;
        const isLit = lit.has(part);
        // L'intérieur n'existe à l'écran que lorsqu'on le désigne.
        if (part === 'interieur' && !on && !isLit) return null;
        return (
          <g
            key={part}
            onMouseEnter={onHover && (() => onHover(part))}
            onMouseLeave={onHover && (() => onHover(null))}
            strokeWidth="1.4"
            vectorEffect="non-scaling-stroke"
            strokeLinejoin="round"
            className={cn(
              'transition-[fill,stroke] duration-300 ease-soft',
              onHover && 'cursor-pointer',
              on
                ? 'fill-gold/55 stroke-gold-light'
                : isLit
                  ? 'fill-gold/[0.22] stroke-gold-light'
                  : part === 'interieur'
                    ? 'fill-transparent stroke-transparent'
                    : 'fill-ink/[0.04] stroke-ink/30'
            )}
          >
            {SHAPES[part]}
          </g>
        );
      })}
      {/* Lames de la porte de garage et ligne d'eau de la piscine : du trait seul. */}
      <g className="stroke-ink/25" strokeWidth="1" vectorEffect="non-scaling-stroke" pointerEvents="none">
        <path d="M200 162 H252 M200 176 H252" />
        <path d="M276 203 Q281 200 286 203 T296 203 T306 203" fill="none" />
      </g>
    </svg>
  );
}
