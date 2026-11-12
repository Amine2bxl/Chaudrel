import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, SectionHeading, TextLink } from '@/components/ui';
import Reveal from '@/lib/reveal';
import { SERVICES } from '@/data/services';
import { imageAttrs } from '@/lib/image';
import { cn } from '@/lib/utils';

const SIZES_STAGE = '(min-width: 1024px) 52vw, 80vw';

function Arrow({ className }) {
  return (
    <svg width="14" height="14" viewBox="0 0 11 11" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.3" className={className}>
      <path d="M1.5 9.5 9.5 1.5M3.5 1.5h6v6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * Les métiers, en grand.
 *
 * Écran large : un index à gauche, une seule grande photo à droite, qui suit
 * la ligne survolée ou atteinte au clavier. Chaque ligne est un lien vers la
 * page du métier - le survol ne fait que changer l'image, il ne cache rien.
 *
 * Écran étroit : les mêmes six liens en cartes photographiques, à faire
 * glisser du pouce (défilement natif, aimanté).
 */
export default function ServicesShowcase() {
  const [active, setActive] = useState(0);

  return (
    <section className="bg-shell py-section text-ink">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            title="Une rénovation complète, ou un seul poste."
            text="Dans les deux cas, c’est nous qui coordonnons les corps de métier."
          />
          <TextLink to="/services" className="mb-1">
            Tous les services
          </TextLink>
        </div>

        {/* ---------- Écran large ---------- */}
        <div className="mt-block hidden gap-16 lg:grid lg:grid-cols-12">
          <ol className="col-span-5 self-center border-t border-ink/15">
            {SERVICES.map((s, i) => (
              <li key={s.slug} className="border-b border-ink/15">
                <Link
                  to={`/services/${s.slug}`}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  className="group flex items-baseline gap-5 py-5 outline-offset-4"
                >
                  <span className={cn('t-num w-7 flex-none text-[0.8125rem] transition-colors duration-300', i === active ? 'text-gold' : 'text-ink/35')}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span
                      className={cn(
                        'block font-display text-[clamp(1.5rem,2.3vw,2.125rem)] leading-[1.1] tracking-[-0.012em] transition-colors duration-300',
                        i === active ? 'text-ink' : 'text-ink/45'
                      )}
                    >
                      {s.title}
                    </span>
                    <span
                      className={cn(
                        'grid transition-[grid-template-rows,opacity] duration-500 ease-soft',
                        i === active ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                      )}
                    >
                      <span className="overflow-hidden">
                        <span className="t-small block pt-2 text-ink/65">{s.excerpt}</span>
                      </span>
                    </span>
                  </span>
                  <Arrow className={cn('flex-none self-center transition-all duration-300 ease-soft', i === active ? 'translate-x-0 text-ink opacity-100' : '-translate-x-1 opacity-0')} />
                </Link>
              </li>
            ))}
          </ol>

          <Reveal from="fade" className="col-span-7">
            <div className="relative aspect-[5/4] overflow-hidden rounded-lg bg-sand">
              {SERVICES.map((s, i) => (
                <img
                  key={s.slug}
                  {...imageAttrs(s.image, SIZES_STAGE)}
                  alt=""
                  aria-hidden="true"
                  width="1200"
                  height="900"
                  loading="lazy"
                  decoding="async"
                  className={cn(
                    'absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-700 ease-soft',
                    i === active ? 'scale-100 opacity-100' : 'scale-[1.03] opacity-0'
                  )}
                />
              ))}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 bg-gradient-to-t from-bark/70 to-transparent p-6 pt-20 text-cream">
                <p className="t-label">{SERVICES[active].title}</p>
                <p className="t-label tabular-nums text-cream/70">
                  {String(active + 1).padStart(2, '0')} / {String(SERVICES.length).padStart(2, '0')}
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>

      {/* ---------- Écran étroit ---------- */}
      <ul className="snap-row mt-block flex gap-3 overflow-x-auto px-5 pb-2 sm:px-8 lg:hidden">
        {SERVICES.map((s, i) => (
          <li key={s.slug} className="w-[78vw] max-w-[22rem] flex-none snap-start">
            <Link to={`/services/${s.slug}`} className="group relative block aspect-[4/5] overflow-hidden rounded-lg bg-sand">
              <img
                {...imageAttrs(s.image, SIZES_STAGE)}
                alt=""
                aria-hidden="true"
                width="1200"
                height="900"
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-bark/85 via-bark/20 to-transparent" aria-hidden="true" />
              <span className="absolute inset-x-0 bottom-0 block p-5 text-cream">
                <span className="t-num block text-[0.75rem] text-gold-light">{String(i + 1).padStart(2, '0')}</span>
                <span className="mt-2 block font-display text-[1.625rem] leading-[1.1]">{s.title}</span>
                <span className="t-small mt-1.5 block text-cream/75">{s.excerpt}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
