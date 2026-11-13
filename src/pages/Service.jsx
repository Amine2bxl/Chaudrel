import { useEffect } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import PageHero from '@/components/sections/PageHero';
import FaqAccordion from '@/components/sections/FaqAccordion';
import CTASection from '@/components/sections/CTASection';
import { Container, Media, RoundArrow, Section, Tag } from '@/components/ui';
import Reveal from '@/lib/reveal';
import { SIZES } from '@/lib/image';
import { EVENTS, track } from '@/lib/analytics';
import { SERVICES, getService } from '@/data/services';
import { projectsForTags } from '@/data/projects';
import { cn } from '@/lib/utils';

/**
 * Fiche métier : ce que comprend le métier (postes groupés), les dossiers
 * photo qui s'y rattachent, les questions propres au métier, les autres
 * métiers. Pas de photo d'ouverture quand aucune vraie photo ne montre ce
 * métier (finitions intérieures, piscine) - plutôt un en-tête typographique.
 */
export default function Service() {
  const { slug } = useParams();
  const service = getService(slug);

  useEffect(() => {
    if (service) track(EVENTS.SERVICE_VIEW, { slug: service.slug });
  }, [service]);

  if (!service) return <Navigate to="/services" replace />;

  const index = SERVICES.indexOf(service);
  const related = projectsForTags(service.projectTags, 3);
  const others = SERVICES.filter((s) => s.slug !== service.slug);

  return (
    <>
      <PageHero
        breadcrumb={[
          { label: 'Accueil', to: '/' },
          { label: 'Services', to: '/services' },
          { label: service.title },
        ]}
        label={`Métier ${String(index + 1).padStart(2, '0')} / ${String(SERVICES.length).padStart(2, '0')}`}
        title={service.title}
        intro={service.intro}
        image={service.image ?? undefined}
        aside={
          !service.image && (
            <p className="font-display text-[clamp(1.5rem,1.2rem+1vw,2rem)] italic leading-snug text-gold-deep">
              {service.excerpt}
            </p>
          )
        }
      />

      <Section className="pt-section">
        <Container>
          <h2 className="t-h2">Ce que comprend le métier</h2>
          <div
            className={cn(
              'mt-block grid gap-px overflow-hidden rounded-lg border border-ink/[0.08] bg-ink/[0.08] md:grid-cols-2',
              service.groups.length >= 3 && 'lg:grid-cols-3'
            )}
          >
            {service.groups.map((g, i) => (
              <Reveal key={g.title} delay={i * 70} className="bg-paper p-6 sm:p-8">
                <span className="t-num text-[15px] text-gold-ink">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="t-h3 mt-6">{g.title}</h3>
                <ul className="mt-5 space-y-2.5 text-[14.5px] text-ink/75">
                  {g.items.map((it) => (
                    <li key={it} className="flex gap-3">
                      <span aria-hidden="true" className="mt-[0.7em] h-px w-3 flex-none bg-gold" />
                      {it}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {related.length > 0 && (
        <Section tone="paper">
          <Container>
            <h2 className="t-h2">Sur nos chantiers</h2>
            <ul className="mt-block grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <li key={p.slug}>
                  <Link to={`/realisations/${p.slug}`} className="group block">
                    <Media
                      src={p.cover.src}
                      alt={p.cover.alt}
                      width={p.cover.w}
                      height={p.cover.h}
                      ratio="aspect-[4/5]"
                      sizes={SIZES.card}
                      zoom
                    />
                    <div className="mt-5 flex items-start justify-between gap-5">
                      <div>
                        <Tag>{p.type}</Tag>
                        <h3 className="t-h3 mt-3">{p.title}</h3>
                      </div>
                      <RoundArrow />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      )}

      {service.faqs?.length > 0 && (
        <Section>
          <Container className="grid gap-10 lg:grid-cols-12">
            <h2 className="t-h2 lg:col-span-4">Questions fréquentes</h2>
            <FaqAccordion items={service.faqs} className="lg:col-span-8" />
          </Container>
        </Section>
      )}

      <Section tone="paper" className="py-block">
        <Container>
          <h2 className="t-label text-ink/65">Autres métiers</h2>
          <ul className="mt-6 flex flex-wrap gap-2">
            {others.map((s) => (
              <li key={s.slug}>
                <Link
                  to={`/services/${s.slug}`}
                  className="inline-flex h-10 items-center rounded-full border border-ink/15 px-4 text-[13px] font-medium text-ink/80 transition-colors duration-fast hover:border-graphite hover:bg-graphite hover:text-ivory"
                >
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <CTASection
        title={
          <>
            {service.title} : <em>parlons de votre projet.</em>
          </>
        }
        source={`service_${service.slug}`}
      />
    </>
  );
}
