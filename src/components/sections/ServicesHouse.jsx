import { useState } from 'react';
import { Container, Panel, SectionHeading, TextLink } from '@/components/ui';
import Reveal from '@/lib/reveal';
import House3D from '@/components/sections/House3D';
import { SERVICES } from '@/data/services';
import { HouseIcon, SERVICE_ICONS } from '@/components/ui/Icons';
import { cn } from '@/lib/utils';

/* Métier → parties de la maison qu'il touche. */
const ZONES = {
  'renovation-complete': ['toit', 'facade', 'chassis', 'porte', 'volume', 'garage', 'abords'],
  'finitions-interieures': ['interieur'],
  'amenagement-exterieur': ['abords', 'garage'],
  toiture: ['toit'],
  facade: ['facade'],
  piscine: ['piscine'],
};
/* Métier → point de vue, un peu penché, vu d'en haut : [rx, ry, x, y, z] (cadrage
   mesuré pour remplir la case sans en sortir, comme CAMERAS dans House3D). */
const VIEWS = {
  'renovation-complete': [-32, -34, -0.1, -1.3, 6.3],
  'finitions-interieures': [-50, -24, 0.2, -1.9, 7.3],
  'amenagement-exterieur': [-40, -42, -0.4, -1.8, 5.2],
  toiture: [-46, 32, 0, -2.2, 7.1],
  facade: [-26, -18, 0.7, -0.7, 10.9],
  piscine: [-38, 122, -0.2, -2.3, 7.2],
};
/**
 * La maison interactive : choisir un métier dans la liste (survol, clic ou
 * clavier) allume les parties qu'il touche et tourne la maquette vers elles.
 * La maquette ne réagit pas au pointeur : elle bougerait sous la souris.
 */
export default function ServicesHouse({ services = SERVICES }) {
  const [slug, setSlug] = useState(services[0]?.slug);
  const current = services.find((s) => s.slug === slug) ?? services[0];

  return (
    <section className="pt-section">
      <Container>
        <SectionHeading title="Votre maison, métier par métier." />
        <Reveal className="mt-block">
          <Panel pad="p-6 sm:p-10" className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-12">
            <House3D
              live
              lit={new Set(ZONES[current.slug] ?? [])}
              camera={VIEWS[current.slug] ?? VIEWS['renovation-complete']}
              className="lg:col-span-7"
            />

            <div className="lg:col-span-5">
              <ul className="grid grid-cols-2 gap-2">
                {services.map((s) => {
                  const Icon = SERVICE_ICONS[s.slug] || HouseIcon;
                  const on = s.slug === current.slug;
                  return (
                    <li key={s.slug}>
                      <button
                        type="button"
                        aria-pressed={on}
                        onClick={() => setSlug(s.slug)}
                        onMouseEnter={() => setSlug(s.slug)}
                        onFocus={() => setSlug(s.slug)}
                        className={cn(
                          'flex w-full items-center gap-2.5 rounded-[14px] border px-3 py-2.5 text-left transition-[border-color,background-color] duration-fast ease-soft',
                          on ? 'border-gold/60 bg-gold/[0.12]' : 'border-ink/[0.09] bg-shell hover:border-ink/20'
                        )}
                      >
                        <Icon size={18} className={cn('flex-none', on ? 'text-gold-light' : 'text-ink/60')} />
                        <span className={cn('t-small leading-tight', on ? 'text-ink' : 'text-ink/75')}>{s.title}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-7 border-t border-ink/10 pt-6" aria-live="polite">
                <h3 className="font-display text-[1.75rem] leading-tight text-ink">{current.title}</h3>
                <p className="t-body mt-3 text-ink/75">{current.excerpt}</p>
                <TextLink to={`/services/${current.slug}`} className="mt-5">
                  Découvrir le métier
                </TextLink>
              </div>
            </div>
          </Panel>
        </Reveal>
      </Container>
    </section>
  );
}
