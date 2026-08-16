import { useState } from 'react';
import Reveal from '@/lib/reveal';
import { BELGIUM_VIEWBOX, PROVINCES } from '@/data/belgium';
import { cn } from '@/lib/utils';

/**
 * Zone d'intervention.
 *
 * La carte est une illustration, pas un outil : elle est `aria-hidden` et sans
 * point d'arrêt clavier. Ce sont les noms de provinces qui portent l'interaction —
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
                      ? 'fill-umber-light stroke-bark'
                      : 'fill-cream/[0.08] stroke-cream/25'
                    : on
                      ? 'fill-umber stroke-cream'
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
                <circle cx={bxl.cx} cy={bxl.cy} r="8" className={light ? 'fill-umber-light' : 'fill-umber'} />
                <circle
                  cx={bxl.cx}
                  cy={bxl.cy}
                  r="17"
                  fill="none"
                  strokeWidth="1.2"
                  vectorEffect="non-scaling-stroke"
                  className={light ? 'stroke-umber-light/50' : 'stroke-umber/50'}
                />
              </g>
            );
          })()}
        </svg>
      </Reveal>

      <div className="mt-10 lg:col-span-7 lg:mt-0">
        <p className={cn('t-lead measure', light ? 'text-cream/70' : 'text-ink/70')}>
          Notre siège est à Bruxelles. Nos chantiers, eux, ne s’arrêtent pas au ring : les dix provinces et la capitale.
        </p>

        <ul className="mt-8 flex flex-wrap gap-2">
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
                  't-label rounded-full border px-4 py-2.5 transition-all duration-fast ease-soft',
                  light
                    ? active === p.id
                      ? 'border-umber-light bg-umber-light text-bark'
                      : 'border-cream/20 text-cream/70 hover:border-cream/50 hover:text-cream'
                    : active === p.id
                      ? 'border-umber bg-umber text-cream'
                      : 'border-ink/[0.14] text-ink/65 hover:border-ink/30 hover:bg-shell hover:text-ink'
                )}
              >
                {p.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
