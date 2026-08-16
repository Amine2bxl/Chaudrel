import { Link, Navigate, useParams } from 'react-router-dom';
import PageHero from '@/components/sections/PageHero';
import BeforeAfter from '@/components/sections/BeforeAfter';
import QuickQuote from '@/components/sections/QuickQuote';
import { Container, Media, Section, SectionHeading } from '@/components/ui';
import Reveal from '@/lib/reveal';
import { getProject, projectSiblings } from '@/data/projects';
import { EVENTS, track } from '@/lib/analytics';
import { cn } from '@/lib/utils';

/** Une ligne de la fiche technique : intitulé sur filet, valeur dessous. */
function Spec({ label, children }) {
  return (
    <div className="border-t border-ink/12 py-4">
      <dt className="t-label text-ink/55">{label}</dt>
      <dd className="mt-1.5 t-body">{children}</dd>
    </div>
  );
}

/** Navigation éditoriale : le chantier précédent et le suivant, par leur nom. */
function ProjectNav({ prev, next }) {
  if (!prev && !next) return null;
  const Item = ({ project, dir }) => {
    if (!project) return <span />;
    const forward = dir === 'next';
    return (
      <Link
        to={`/realisations/${project.slug}`}
        onClick={() => track(EVENTS.PROJECT_VIEW, { project: project.slug, source: 'sibling' })}
        className={cn('group flex flex-col gap-2', forward && 'items-end text-right')}
      >
        <span className="t-label text-ink/50">{forward ? 'Chantier suivant' : 'Chantier précédent'}</span>
        <span className="font-display text-[1.5rem] leading-tight tracking-[-0.01em] text-ink transition-colors duration-fast group-hover:text-umber sm:text-[1.75rem]">
          {project.title}
        </span>
        <span className="t-small text-ink/55">
          {project.type} · {project.location}
        </span>
      </Link>
    );
  };
  return (
    <div className="grid grid-cols-2 gap-8 border-t border-ink/12 pt-10">
      <Item project={prev} dir="prev" />
      <Item project={next} dir="next" />
    </div>
  );
}

export default function Project() {
  const { slug } = useParams();
  const project = getProject(slug);

  if (!project) return <Navigate to="/realisations" replace />;

  const { prev, next } = projectSiblings(project.slug);
  const gallery = project.images ?? [];

  return (
    <>
      <PageHero
        title={project.title}
        intro={project.summary}
        image={project.cover.src}
        breadcrumb={[
          { label: 'Accueil', to: '/' },
          { label: 'Réalisations', to: '/realisations' },
          { label: project.title },
        ]}
      />

      {/* Contexte : le récit à gauche, la fiche technique en regard à droite. */}
      <Section tone="cream">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <Reveal className="lg:col-span-7">
              <p className="t-lead measure text-ink/75">{project.description}</p>
            </Reveal>

            <Reveal delay={120} as="dl" className="lg:col-span-4 lg:col-start-9">
              <Spec label="Lieu">{project.location}</Spec>
              <Spec label="Nature">{project.type}</Spec>
              {project.year && <Spec label="Livraison">{project.year}</Spec>}
              {project.materials?.length > 0 && <Spec label="Matériaux">{project.materials.join(' · ')}</Spec>}
              {project.works?.length > 0 && (
                <div className="border-y border-ink/12 py-4">
                  <dt className="t-label text-ink/55">Travaux réalisés</dt>
                  <dd className="mt-2">
                    <ul className="space-y-1.5">
                      {project.works.map((w) => (
                        <li key={w} className="t-small flex gap-2.5 text-ink/70">
                          <span aria-hidden="true" className="mt-[7px] h-1 w-1 flex-none rounded-full bg-umber" />
                          {w}
                        </li>
                      ))}
                    </ul>
                  </dd>
                </div>
              )}
            </Reveal>
          </div>

          {/* Avant / après, quand la comparaison existe : elle prime sur la
              galerie car c'est la preuve la plus forte. */}
          {project.beforeAfter && (
            <div className="mt-20 lg:mt-28">
              <SectionHeading title="Le même espace, avant et après." />
              <div className="mt-10 max-w-4xl">
                <BeforeAfter
                  before={project.beforeAfter.before}
                  after={project.beforeAfter.after}
                  label={project.title}
                  ratio="aspect-[16/10]"
                />
              </div>
            </div>
          )}

          {/* Galerie : première image en grand, les suivantes en appui. */}
          {gallery.length > 0 && (
            <div className="mt-20 grid gap-8 lg:mt-28 lg:grid-cols-12">
              {gallery.map((im, i) => (
                <Media
                  key={im.src}
                  src={im.src}
                  alt={im.alt}
                  ratio={i === 0 ? 'aspect-[16/10]' : 'aspect-[4/5]'}
                  className={i === 0 ? 'lg:col-span-12' : 'lg:col-span-6'}
                  priority={i === 0}
                />
              ))}
            </div>
          )}

          <div className="mt-20 lg:mt-28">
            <ProjectNav prev={prev} next={next} />
          </div>
        </Container>
      </Section>

      <QuickQuote
        source="project_detail"
        title="Vous avez un projet similaire ?"
        lead="Décrivez-le en quelques lignes. Nous revenons vers vous, puis nous convenons d’une visite sur place."
      />
    </>
  );
}
