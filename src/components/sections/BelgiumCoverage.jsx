import { useState } from 'react';
import Reveal from '@/lib/reveal';
import { BELGIUM_VIEWBOX, PROVINCES } from '@/data/belgium';
import { BRAND } from '@/data/site';
import { PROJECTS } from '@/data/projects';
import { cn } from '@/lib/utils';

/* Position approximative de chaque chantier sur la carte (coordonnées du
   viewBox équirectangulaire). La liste s'étend avec PROJECTS. */
const PINS = {
  'renovation-overijse': { x: 596, y: 322 },
  'residence-uccle': { x: 448, y: 318 },
  'allee-uccle': { x: 436, y: 310 },
  'cuisine-ixelles': { x: 498, y: 302 },
  'terrasse-woluwe': { x: 556, y: 274 },
  'villa-tervuren': { x: 615, y: 258 },
};

/** Une épingle façon Google Maps : le point posé sur le bulbe, la queue au
   -dessus. `title` donne le nom du chantier en infobulle native. */
function Pin({ x, y, title, toneClass }) {
  return (
    <g transform={`translate(${x} ${y})`} className={toneClass}>
      <title>{title}</title>
      <path
        d="M0 -9.5 C -2.2 -6.5 -4.4 -3.2 -4.2 -0.4 a 4.6 4.6 0 0 0 9.2 0 C 5 -3.2 2.8 -6.5 0 -9.5 Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
        transform="translate(-0.4 2.6) scale(1.15)"
      />
      <circle cx="0" cy="-0.15" r="1.9" fill="#fff" />
    </g>
  );
}

/**
 * Zone d'intervention.
 *
 * La carte est une illustration, pas un outil : elle est `aria-hidden` et sans
 * point d'arrêt clavier. Ce sont les noms de provinces qui portent l'interaction -
 * dix boutons lisibles valent mieux que dix silhouettes à viser à la souris,
 * et cela retire dix arrêts de tabulation du parcours.
 *
 * Aucun service de cartographie, aucune tuile, aucun script tiers : un SVG de
 * 4 ko servi avec la page.
 */
export default function BelgiumCoverage({ tone = 'cream', className }) {
  const [active, setActive] = useState(null);
  const light = tone === 'bark';

  return (
    <div className={cn('lg:grid lg:grid-cols-12 lg:items-center lg:gap-14', className)}>
      <Reveal from="fade" className="mx-auto max-w-[22rem] lg:col-span-5 lg:mx-0 lg:max-w-none">
        <svg
          viewBox={BELGIUM_VIEWBOX}
          aria-hidden="true"
          focusable="false"
          className="w-full"
        >
          {PROVINCES.map((p) => {
            const on = active === p.id;
            return (
              <path
                key={p.id}
                d={p.d}
                strokeWidth="1.2"
                vectorEffect="non-scaling-stroke"
                className={cn(
                  'transition-[fill] duration-slow ease-soft',
                  light
                    ? on
                      ? 'fill-gold-light stroke-bark'
                      : 'fill-cream/[0.08] stroke-cream/25'
                    : on
                      ? 'fill-gold stroke-cream'
                      : 'fill-ink/[0.06] stroke-ink/20'
                )}
              />
            );
          })}

          {/* Bruxelles : le siège, seul repère nommé. */}
          {(() => {
            const bxl = PROVINCES.find((p) => p.id === 'BE10');
            if (!bxl) return null;
            return (
              <g>
                <circle cx={bxl.cx} cy={bxl.cy} r="8" className={light ? 'fill-gold-light' : 'fill-gold'} />
                <circle
                  cx={bxl.cx}
                  cy={bxl.cy}
                  r="17"
                  fill="none"
                  strokeWidth="1.2"
                  vectorEffect="non-scaling-stroke"
                  className={light ? 'stroke-gold-light/50' : 'stroke-gold/50'}
                />
              </g>
            );
          })()}

          {/* Les chantiers livrés, en épingles : un chantier réel par point. */}
          <g className={light ? 'text-gold-light' : 'text-gold'}>
            {PROJECTS.filter((p) => PINS[p.slug]).map((p) => (
              <Pin key={p.slug} {...PINS[p.slug]} toneClass={light ? 'text-gold-light' : 'text-gold'} title={`${p.title} - ${p.location}`} />
            ))}
          </g>
        </svg>
      </Reveal>

      <div className="mt-10 lg:col-span-7 lg:mt-0">
        <p className={cn('t-lead measure', light ? 'text-cream/70' : 'text-ink/70')}>
{BRAND.zoneSentence}
        </p>

        {/* Une liste, pas un mur de pastilles : deux colonnes réglées, chaque
            nom sur un filet, un marqueur brun qui glisse sur la ligne survolée
            et allume sa province sur la carte. */}
        <ul className="mt-8 grid grid-cols-1 gap-x-10 sm:grid-cols-2">
          {PROVINCES.map((p) => (
            <li key={p.id}>
              <button
                type="button"
                onMouseEnter={() => setActive(p.id)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(p.id)}
                onBlur={() => setActive(null)}
                aria-pressed={active === p.id}
                className={cn(
                  'group flex w-full items-center gap-3 border-b py-3 text-left transition-colors duration-fast',
                  light ? 'border-cream/12' : 'border-ink/[0.09]'
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    'h-1.5 w-1.5 flex-none rounded-full transition-all duration-fast ease-soft',
                    active === p.id
                      ? light
                        ? 'scale-100 bg-gold-light'
                        : 'scale-100 bg-gold'
                      : 'scale-0'
                  )}
                />
                <span
                  className={cn(
                    't-small transition-colors duration-fast',
                    active === p.id
                      ? light
                        ? 'text-cream'
                        : 'text-ink'
                      : light
                        ? 'text-cream/60 group-hover:text-cream'
                        : 'text-ink/60 group-hover:text-ink'
                  )}
                >
                  {p.name}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
