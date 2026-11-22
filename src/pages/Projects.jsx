import { useMemo, useState } from 'react';
import PageHero from '@/components/sections/PageHero';
import House3D from '@/components/sections/House3D';
import { EVENTS, track } from '@/lib/analytics';
import CTASection from '@/components/sections/CTASection';
import { Link } from 'react-router-dom';
import { Container, Panel, Section, TextLink } from '@/components/ui';
import Reveal from '@/lib/reveal';
import { imageAttrs } from '@/lib/image';
import { activeCategories, projectsByCategory } from '@/data/projects';
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
            className="flex flex-wrap items-center justify-center gap-x-7 gap-y-3 border-b border-ink/[0.09] pb-6"
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
          </div>
        </Container>
      </Section>

      {items.length > 0 ? (
        <section className="py-section">
          <Container className="space-y-8 lg:space-y-12">
            {items.map((p) => {
              const to = `/realisations/${p.slug}`;
              const view = () => track(EVENTS.PROJECT_VIEW, { project: p.slug, source: 'list' });
              return (
                <Reveal as="article" key={p.slug}>
                  <Panel pad="p-3 sm:p-4" className="grid gap-x-4 lg:grid-cols-2">
                    {/* Deux cases égales : la vraie photo, la maquette qui montre où l'on a travaillé. */}
                    <Link
                      to={to}
                      onClick={view}
                      tabIndex={-1}
                      aria-hidden="true"
                      className="group block aspect-[4/3] overflow-hidden rounded-[20px] bg-sand"
                    >
                      <img
                        {...imageAttrs(p.cover.src, '(min-width: 1024px) 46vw, 100vw')}
                        alt=""
                        width={p.cover.w}
                        height={p.cover.h}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover transition-transform duration-700 ease-soft group-hover:scale-[1.03]"
                      />
                    </Link>
                    <House3D works={p.works} className="mt-3 sm:mt-4 lg:mt-0" />

                    {/* Sous chaque case, sa légende : le chantier à gauche, les travaux à droite. */}
                    <div className="px-2 pb-2 pt-7 sm:px-4 sm:pb-4">
                      <p className="t-label text-gold-light">{[p.type, p.location].filter(Boolean).join(' · ')}</p>
                      <h2 className="mt-3 font-display text-[1.9rem] leading-tight text-ink sm:text-[2.25rem]">
                        <Link to={to} onClick={view} className="link-line">
                          {p.title}
                        </Link>
                      </h2>
                      <p className="t-body measure mt-4 text-ink/75">{p.summary}</p>
                    </div>
                    <div className="flex flex-col justify-between gap-7 px-2 pb-3 sm:px-4 sm:pb-5 lg:pt-7">
                      <ul aria-label="Travaux réalisés" className="flex flex-wrap gap-1.5">
                        {p.works.map((w) => (
                          <li key={w} className="t-small rounded-full border border-ink/[0.09] bg-shell px-3 py-1 text-ink/80">
                            {w}
                          </li>
                        ))}
                      </ul>
                      <TextLink to={to} onClick={view} className="self-start">
                        Voir le chantier
                      </TextLink>
                    </div>
                  </Panel>
                </Reveal>
              );
            })}
          </Container>
        </section>
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