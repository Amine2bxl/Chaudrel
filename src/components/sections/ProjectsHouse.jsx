import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Container, Panel, SectionHeading, TextLink } from '@/components/ui';
import House3D, { CAMERAS, focusFor, partsFor } from '@/components/sections/House3D';
import Reveal from '@/lib/reveal';
import { imageAttrs } from '@/lib/image';
import { EVENTS, track } from '@/lib/analytics';
import { PROJECTS } from '@/data/projects';
import { SERVICES } from '@/data/services';
import { cn } from '@/lib/utils';

/** Le métier qui couvre un chantier : celui dont les tags contiennent sa première catégorie. */
const serviceFor = (p) => SERVICES.find((s) => s.projectTags?.includes(p.categories?.[0]));

/**
 * Accueil : la maquette 3D et les chantiers réels côte à côte. Choisir un
 * chantier (survol, clic, clavier) tourne la maison vers ce qui a été fait,
 * montre sa photo et mène à sa fiche ou à son métier.
 */
export default function ProjectsHouse({ projects = PROJECTS }) {
  const [slug, setSlug] = useState(projects[0]?.slug);
  const p = projects.find((x) => x.slug === slug) ?? projects[0];
  if (!p) return null;
  const service = serviceFor(p);

  return (
    <section className="py-section">
      <Container>
        <SectionHeading title="Chaque chantier, sur la maquette.">
          <TextLink to="/realisations" className="flex-none">
            Toutes les réalisations
          </TextLink>
        </SectionHeading>

        <Reveal className="mt-block">
          <Panel pad="p-3 sm:p-4" className="grid gap-4 lg:grid-cols-12">
            <House3D live lit={partsFor(p.works)} camera={CAMERAS[focusFor(p.works)]} className="lg:col-span-7 lg:[--h3-ratio:auto]" />

            <div className="flex flex-col gap-5 p-3 sm:p-4 lg:col-span-5">
              <ul className="grid gap-2" aria-label="Choisir un chantier">
                {projects.map((x) => {
                  const on = x.slug === p.slug;
                  return (
                    <li key={x.slug}>
                      <button
                        type="button"
                        aria-pressed={on}
                        onClick={() => setSlug(x.slug)}
                        onMouseEnter={() => setSlug(x.slug)}
                        onFocus={() => setSlug(x.slug)}
                        className={cn(
                          'flex w-full items-baseline justify-between gap-4 rounded-[14px] border px-4 py-3 text-left transition-[border-color,background-color] duration-fast ease-soft',
                          on ? 'border-gold/60 bg-gold/[0.12]' : 'border-ink/[0.09] bg-shell hover:border-ink/20'
                        )}
                      >
                        <span className={cn('text-[15px] font-medium', on ? 'text-ink' : 'text-ink/80')}>{x.title}</span>
                        <span className="t-small flex-none text-gold-light">{x.type}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>

              <Link
                to={`/realisations/${p.slug}`}
                onClick={() => track(EVENTS.PROJECT_VIEW, { project: p.slug, source: 'home_house' })}
                className="group mt-auto block overflow-hidden rounded-[18px] bg-sand"
              >
                <img
                  key={p.slug}
                  {...imageAttrs(p.cover.src, '(min-width: 1024px) 34vw, 100vw')}
                  alt={p.cover.alt}
                  width={p.cover.w}
                  height={p.cover.h}
                  loading="lazy"
                  decoding="async"
                  className="rise-in aspect-[16/9] w-full object-cover transition-transform duration-700 ease-soft group-hover:scale-[1.03]"
                />
              </Link>
              <div className="flex flex-wrap items-center gap-3">
                <Button to={`/realisations/${p.slug}`} size="lg" arrow>
                  Voir le chantier
                </Button>
                {service && (
                  <Button to={`/services/${service.slug}`} variant="outline" size="lg">
                    {service.title}
                  </Button>
                )}
              </div>
            </div>
          </Panel>
        </Reveal>
      </Container>
    </section>
  );
}
