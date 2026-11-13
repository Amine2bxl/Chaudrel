import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import PageHero from '@/components/sections/PageHero';
import CTASection from '@/components/sections/CTASection';
import { Container, Media, RoundArrow, Section, Tag } from '@/components/ui';
import Reveal from '@/lib/reveal';
import { SIZES } from '@/lib/image';
import { cn } from '@/lib/utils';
import { PROJECTS, activeCategories, projectsByCategory } from '@/data/projects';

/**
 * Portfolio - filtres en pilules, puis une grille en deux colonnes décalées :
 * des photographies hautes, beaucoup d'air, le titre sous l'image.
 */
export default function Projects() {
  const [filter, setFilter] = useState('all');
  const categories = activeCategories();
  const items = useMemo(() => projectsByCategory(filter), [filter]);

  return (
    <>
      <PageHero
        title={
          <>
            Réalisations, <em>en photographies réelles.</em>
          </>
        }
        intro="Façades, châssis et portes, extensions, toitures, abords. Les photos sont regroupées par nature de travaux, et chaque fiche décrit ce qu’elles montrent - rien de plus."
        breadcrumb={[{ label: 'Accueil', to: '/' }, { label: 'Réalisations' }]}
      />

      <Section className="pt-0">
        <Container>
          <div className="flex flex-col gap-5 border-y border-ink/12 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div role="group" aria-label="Filtrer par nature de travaux" className="snap-row -mx-gutter flex gap-2 overflow-x-auto px-gutter sm:mx-0 sm:flex-wrap sm:px-0">
              {[{ id: 'all', label: 'Tout' }, ...categories].map((c) => {
                const on = filter === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    aria-pressed={on}
                    onClick={() => setFilter(c.id)}
                    className={cn(
                      'h-10 flex-none snap-start rounded-full border px-4 text-[13px] font-medium transition-colors duration-fast',
                      on ? 'border-graphite bg-graphite text-ivory' : 'border-ink/15 text-ink/75 hover:border-ink/40 hover:text-ink'
                    )}
                  >
                    {c.label}
                  </button>
                );
              })}
            </div>
            <p className="text-[13px] text-ink/65" aria-live="polite">
              {items.length} {items.length > 1 ? 'dossiers' : 'dossier'}
            </p>
          </div>

          <ul key={filter} className="mt-block grid gap-x-10 gap-y-16 sm:grid-cols-2 lg:gap-x-16">
            {items.map((p, i) => (
              <Reveal as="li" key={p.slug} delay={(i % 2) * 90} className={cn(i % 2 === 1 && 'sm:mt-24')}>
                <Link to={`/realisations/${p.slug}`} className="group block">
                  <Media
                    src={p.cover.src}
                    alt={p.cover.alt}
                    width={p.cover.w}
                    height={p.cover.h}
                    ratio="aspect-[4/5]"
                    sizes={SIZES.card}
                    reveal={false}
                    zoom
                  />
                  <div className="mt-5 flex items-start justify-between gap-6">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="t-num mr-1 text-[14px] text-gold-ink">
                          {String(PROJECTS.indexOf(p) + 1).padStart(2, '0')}
                        </span>
                        <Tag>{p.type}</Tag>
                        {p.status === 'en cours' && <Tag>En cours de chantier</Tag>}
                        <Tag>
                          {p.images.length} photo{p.images.length > 1 ? 's' : ''}
                        </Tag>
                      </div>
                      <h2 className="t-h3 mt-4">{p.title}</h2>
                      <p className="t-small mt-2 max-w-[44ch] text-ink/70">{p.summary}</p>
                    </div>
                    <RoundArrow />
                  </div>
                </Link>
              </Reveal>
            ))}
          </ul>
        </Container>
      </Section>

      <CTASection
        title={
          <>
            Votre chantier, <em>le prochain dossier ?</em>
          </>
        }
        source="realisations"
      />
    </>
  );
}
