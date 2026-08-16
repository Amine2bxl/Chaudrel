import { useState } from 'react';
import Reveal from '@/lib/reveal';
import { Container, Label, SectionHeading } from '@/components/ui';
import { BELGIUM_VIEWBOX, PROVINCES } from '@/data/belgium';
import { cn } from '@/lib/utils';

/**
 * Preuve visuelle de la couverture nationale.
 * Une silhouette de la Belgique, ses provinces, une mise en évidence au survol
 * ou au focus. Aucune donnée dynamique, aucun service de cartographie, aucune
 * navigation : c'est une illustration, pas un outil.
 */
export default function BelgiumCoverage({ tone = 'carbon' }) {
  const [active, setActive] = useState(null);
  const light = tone === 'carbon';

  const activeName = PROVINCES.find((p) => p.id === active)?.name;

  return (
    <section className={cn('py-20 md:py-28 lg:py-36', light ? 'bg-carbon text-paper' : 'bg-paper text-ink')}>
      <Container>
        <SectionHeading
          tone={light ? 'light' : 'dark'}
          label="Zone d’intervention"
          title={
            <>
              Nous intervenons
              <br />
              partout en Belgique.
            </>
          }
          text="Notre siège est à Bruxelles. Nos chantiers, eux, ne s’arrêtent pas au ring : les dix provinces et la capitale."
        />

        <div className="mt-16 grid gap-12 lg:mt-20 lg:grid-cols-12 lg:gap-16">
          {/* Carte */}
          <Reveal from="fade" className="lg:col-span-7">
            <div className="relative">
              <svg
                viewBox={BELGIUM_VIEWBOX}
                role="img"
                aria-label="Carte de la Belgique : Chaudrel intervient dans les dix provinces et à Bruxelles"
                className="w-full"
              >
                {PROVINCES.map((p, i) => {
                  const isActive = active === p.id;
                  return (
                    <path
                      key={p.id}
                      d={p.d}
                      tabIndex={0}
                      role="button"
                      aria-label={p.name}
                      onMouseEnter={() => setActive(p.id)}
                      onMouseLeave={() => setActive(null)}
                      onFocus={() => setActive(p.id)}
                      onBlur={() => setActive(null)}
                      onClick={() => setActive((cur) => (cur === p.id ? null : p.id))}
                      style={{ transitionDelay: `${i * 35}ms` }}
                      className={cn(
                        'cursor-pointer outline-none transition-[fill,stroke] duration-500',
                        light
                          ? isActive
                            ? 'fill-signal stroke-paper/40'
                            : 'fill-paper/[0.07] stroke-paper/25 hover:fill-paper/15'
                          : isActive
                            ? 'fill-signal stroke-ink/30'
                            : 'fill-ink/[0.05] stroke-ink/25 hover:fill-ink/10',
                        'focus-visible:fill-signal'
                      )}
                      strokeWidth="1.4"
                      vectorEffect="non-scaling-stroke"
                    />
                  );
                })}

                {/* Point de repère : Bruxelles */}
                {(() => {
                  const bxl = PROVINCES.find((p) => p.id === 'BE10');
                  if (!bxl) return null;
                  return (
                    <g aria-hidden="true">
                      <circle cx={bxl.cx} cy={bxl.cy} r="7" className="fill-signal" />
                      <circle
                        cx={bxl.cx}
                        cy={bxl.cy}
                        r="15"
                        className={light ? 'fill-none stroke-signal/50' : 'fill-none stroke-signal/60'}
                        strokeWidth="1.4"
                        vectorEffect="non-scaling-stroke"
                      />
                      <text
                        x={bxl.cx + 26}
                        y={bxl.cy + 5}
                        className={cn('t-label', light ? 'fill-paper/70' : 'fill-ink/60')}
                        style={{ fontSize: 22, letterSpacing: '0.18em' }}
                      >
                        BRUXELLES
                      </text>
                    </g>
                  );
                })()}
              </svg>

              {/* Nom de la province survolée */}
              <p
                aria-live="polite"
                className={cn(
                  'mt-4 h-6 text-center transition-opacity duration-300 lg:text-left',
                  activeName ? 'opacity-100' : 'opacity-0',
                  light ? 'text-paper/70' : 'text-ink/65'
                )}
              >
                <span className="t-label">{activeName || '—'}</span>
              </p>
            </div>
          </Reveal>

          {/* Liste des provinces */}
          <div className="lg:col-span-5 lg:pt-6">
            <Label tone={light ? 'light' : 'dark'}>Provinces couvertes</Label>
            <ul className="mt-6 grid grid-cols-2 gap-x-6">
              {PROVINCES.map((p, i) => (
                <Reveal
                  as="li"
                  key={p.id}
                  delay={i * 45}
                  onMouseEnter={() => setActive(p.id)}
                  onMouseLeave={() => setActive(null)}
                  className={cn(
                    'flex items-center gap-3 border-b py-3 transition-colors duration-300',
                    light ? 'border-paper/10' : 'border-ink/10',
                    active === p.id && (light ? 'text-paper' : 'text-ink'),
                    active !== p.id && (light ? 'text-paper/60' : 'text-ink/65')
                  )}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true" className="flex-shrink-0">
                    <path
                      d="M1 6.5 4.2 9.5 11 2.5"
                      fill="none"
                      stroke="#CC3A14"
                      strokeWidth="1.6"
                      strokeLinecap="square"
                    />
                  </svg>
                  <span className="t-small">{p.name}</span>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
