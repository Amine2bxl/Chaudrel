import { useMemo, useState } from 'react';
import PageHero from '@/components/sections/PageHero';
import Zigzag from '@/components/sections/Zigzag';
import HouseDiagram, { partsFor } from '@/components/sections/HouseDiagram';
import { EVENTS, track } from '@/lib/analytics';
import CTASection from '@/components/sections/CTASection';
import { Container, Section } from '@/components/ui';
import { PROJECTS, activeCategories, projectsByCategory } from '@/data/projects';
import { cn } from '@/lib/utils';

/**
 * /realisations - le portfolio, un chantier à la fois, en grand.
 *
 * Le même carrousel que l'accueil, nourri par le filtre : la une est la même
 * expérience immersive, et les filtres recentrent la sélection.
 */
export default function Projects() {
  const [filter, setFilter] = useState('all');
  const categories = useMemo(() => activeCategories(), []);
  const items = useMemo(() => projectsByCategory(filter), [filter]);

  return (
    <>
      <PageHero title="Des chantiers réels, pas des images d’archives." />

      <Section tone="cream" className="pb-0 pt-10 md:pb-0 lg:pb-0 lg:pt-14">
        <Container>
          <div
            className="flex flex-wrap items-center gap-x-7 gap-y-3 border-b border-ink/[0.09] pb-6"
            role="group"
            aria-label="Filtrer les réalisations"
          >
            {[{ id: 'all', label: 'Tout' }, ...categories].map((c) => {
              const on = filter === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setFilter(c.id)}
                  className={cn(
                    'relative tap t-label pb-1 transition-colors duration-fast',
                    on ? 'text-ink' : 'text-ink/65 hover:text-ink'
                  )}
                >
                  {c.label}
                  <span
                    aria-hidden="true"
                    className={cn(
                      'absolute inset-x-0 -bottom-0.5 mx-auto h-1 w-1 rounded-full bg-gold transition-opacity duration-fast',
                      on ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                </button>
              );
            })}
            <span className="t-label ml-auto tabular-nums text-ink/70">
              {String(items.length).padStart(2, '0')} / {String(PROJECTS.length).padStart(2, '0')}
            </span>
          </div>
        </Container>
      </Section>

      {items.length > 0 ? (
        <Zigzag
          items={items.map((p) => ({
            key: p.slug,
            to: `/realisations/${p.slug}`,
            image: { src: p.cover.src, w: p.cover.w, h: p.cover.h },
            title: p.title,
            meta: [p.type, p.location].filter(Boolean).join(' · '),
            text: p.summary,
            extra: (
              <div className="mt-7 flex items-center gap-5">
                <HouseDiagram lit={partsFor(p.works)} className="w-36 flex-none sm:w-44" />
                <ul aria-label="Travaux réalisés" className="flex flex-wrap gap-1.5">
                  {p.works.map((w) => (
                    <li key={w} className="t-small rounded-full border border-ink/[0.09] bg-shell px-3 py-1 text-ink/80">
                      {w}
                    </li>
                  ))}
                </ul>
              </div>
            ),
            cta: 'Voir le chantier',
            onClick: () => track(EVENTS.PROJECT_VIEW, { project: p.slug, source: 'zigzag' }),
          }))}
        />
      ) : (
        <Section tone="cream" className="pt-block">
          <Container>
            <p className="t-lead text-ink/70">Aucun chantier publié dans cette catégorie pour le moment.</p>
            <button
              type="button"
              onClick={() => setFilter('all')}
              className="link-line tap t-label mt-5 inline-flex items-center gap-1.5 pb-1 text-ink"
            >
              Voir tous les chantiers
            </button>
          </Container>
        </Section>
      )}

      <CTASection source="projects" />
    </>
  );
}