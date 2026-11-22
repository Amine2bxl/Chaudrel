import { Link } from 'react-router-dom';
import PageHero from '@/components/sections/PageHero';
import CTASection from '@/components/sections/CTASection';
import { Container } from '@/components/ui';
import { Chip } from '@/components/layout/ContactList';
import { ArrowIcon, HouseIcon, SERVICE_ICONS } from '@/components/ui/Icons';
import Reveal from '@/lib/reveal';
import { imageAttrs } from '@/lib/image';
import { SERVICES } from '@/data/services';
import { EVENTS, track } from '@/lib/analytics';

/**
 * /services - les six métiers d'un coup d'œil : six cartes identiques, la
 * photo, le nom, la phrase qui dit ce qu'on y gagne. Une carte = une page
 * métier ; le détail vit là-bas.
 */
export default function Services() {
  return (
    <>
      <PageHero title="Six métiers, un seul interlocuteur." />

      <section className="py-section">
        <Container>
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((s, i) => (
              <Reveal as="li" key={s.slug} delay={(i % 3) * 70}>
                <Link
                  to={`/services/${s.slug}`}
                  onClick={() => track(EVENTS.SERVICE_VIEW, { service: s.slug, source: 'grid' })}
                  className="glass-light group flex h-full flex-col rounded-[24px] p-3 [backdrop-filter:none] [-webkit-backdrop-filter:none]"
                >
                  <div className="aspect-[4/3] overflow-hidden rounded-[18px] bg-sand">
                    <img
                      {...imageAttrs(s.image, '(min-width: 1024px) 30vw, (min-width: 640px) 46vw, 100vw')}
                      alt=""
                      width="1200"
                      height="900"
                      loading={i < 3 ? 'eager' : 'lazy'}
                      decoding="async"
                      className="h-full w-full object-cover transition-transform duration-700 ease-soft group-hover:scale-[1.04]"
                    />
                  </div>
                  <div className="flex flex-1 items-start gap-4 px-3 pb-3 pt-5">
                    <Chip icon={SERVICE_ICONS[s.slug] || HouseIcon} accent compact />
                    <div className="min-w-0 flex-1">
                      <h2 className="font-display text-[1.5rem] leading-tight text-ink">{s.title}</h2>
                      <p className="t-body mt-1.5 text-ink/70">{s.excerpt}</p>
                    </div>
                    <ArrowIcon
                      size={18}
                      aria-hidden="true"
                      className="mt-1.5 flex-none text-ink/50 transition-[color,transform] duration-200 ease-soft group-hover:translate-x-0.5 group-hover:text-gold-light"
                    />
                  </div>
                </Link>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      <CTASection source="services" />
    </>
  );
}
