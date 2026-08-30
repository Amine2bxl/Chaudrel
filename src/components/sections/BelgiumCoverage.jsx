import { useState } from 'react';
import Reveal from '@/lib/reveal';
import { BELGIUM_VIEWBOX, PROVINCES } from '@/data/belgium';
import { BRAND } from '@/data/site';
import { cn } from '@/lib/utils';

/**
 * Zone d'intervention.
 *
 * La carte est une illustration, pas un outil : elle est `aria-hidden` et sans
 * point d'arrêt clavier. Les noms de provinces portent l'interaction - dix
 * boutons lisibles valent mieux que dix silhouettes à viser à la souris.
 *
 * La liste est groupée par région (Flandre, Wallonie, Bruxelles) : lire une
 * grille organisée vaut mieux qu'un mur de noms au hasard.
 */

const ID_TO_PROVINCE = Object.fromEntries(PROVINCES.map((p) => [p.id, p]));

const REGIONS = [
  { name: 'Région flamande', ids: ['BE25', 'BE23', 'BE21', 'BE22', 'BE24'] },
  { name: 'Région wallonne', ids: ['BE31', 'BE32', 'BE33', 'BE34', 'BE35'] },
  { name: 'Bruxelles-Capitale', ids: ['BE10'] },
];

export default function BelgiumCoverage({ tone = 'cream', className }) {
  const [active, setActive] = useState(null);
  const light = tone === 'bark';

  return (
    <div className={cn('lg:grid lg:grid-cols-12 lg:items-center lg:gap-14', className)}>
      <Reveal from="fade" className="mx-auto max-w-[22rem] lg:col-span-5 lg:mx-0 lg:max-w-none">
        <svg viewBox={BELGIUM_VIEWBOX} aria-hidden="true" focusable="false" className="w-full">
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

          {/* Le siège à Bruxelles, seul repère central. */}
          {(() => {
            const bxl = PROVINCES.find((p) => p.id === 'BE10');
            if (!bxl) return null;
            return (
              <g>
                <circle cx={bxl.cx} cy={bxl.cy} r="8" className={light ? 'fill-gold-light' : 'fill-gold'} />
                <circle cx={bxl.cx} cy={bxl.cy} r="17" fill="none" strokeWidth="1.2" vectorEffect="non-scaling-stroke" className={light ? 'stroke-gold-light/50' : 'stroke-gold/50'} />
              </g>
            );
          })()}
        </svg>
      </Reveal>

      <div className="mt-10 lg:col-span-7 lg:mt-0">
        <p className={cn('t-lead measure', light ? 'text-cream/70' : 'text-ink/70')}>
          {BRAND.zoneSentence}
        </p>

        {/* La grille des provinces, groupée par région. Un nom par ligne, un
            marqueur qui s'allume avec la province sur la carte. */}
        <div className="mt-8 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {REGIONS.map((r) => (
            <div key={r.name}>
              <h4 className={cn('t-label', light ? 'text-cream/45' : 'text-ink/45')}>{r.name}</h4>
              <ul className="mt-2">
                {r.ids.map((id) => {
                  const p = ID_TO_PROVINCE[id];
                  const on = active === id;
                  return (
                    <li key={id}>
                      <button
                        type="button"
                        onMouseEnter={() => setActive(id)}
                        onMouseLeave={() => setActive(null)}
                        onFocus={() => setActive(id)}
                        onBlur={() => setActive(null)}
                        aria-pressed={on}
                        className={cn(
                          'group flex w-full items-center justify-between gap-3 border-t py-2.5 text-left transition-colors duration-fast',
                          light ? 'border-cream/12' : 'border-ink/[0.08]'
                        )}
                      >
                        <span className="flex min-w-0 items-center gap-2.5">
                          <span
                            aria-hidden="true"
                            className={cn(
                              'h-1.5 w-1.5 flex-none rounded-full transition-all duration-fast ease-soft',
                              on ? (light ? 'scale-100 bg-gold-light' : 'scale-100 bg-gold') : 'scale-0'
                            )}
                          />
                          <span
                            className={cn(
                              't-small transition-colors duration-fast',
                              on
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
                        </span>

                        <svg
                          width="11"
                          height="11"
                          viewBox="0 0 16 16"
                          aria-hidden="true"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          className={cn(
                            'flex-none transition-all duration-fast ease-soft',
                            on ? (light ? 'text-gold-light' : 'text-gold') : (light ? 'text-cream/0 group-hover:text-cream/70' : 'text-ink/0 group-hover:text-ink/60')
                          )}
                        >
                          <path d="m6 2 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}