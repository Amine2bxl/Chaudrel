import { Link, Navigate, useParams } from 'react-router-dom';
import PageHero from '@/components/sections/PageHero';
import BeforeAfter from '@/components/sections/BeforeAfter';
import ProjectCard from '@/components/sections/ProjectCard';
import CtaBand from '@/components/sections/CtaBand';
import { Button, Container, Section } from '@/components/ui';
import Reveal from '@/lib/reveal';
import { PROJECTS, getProject } from '@/data/projects';

export default function Project() {
  const { slug } = useParams();
  const project = getProject(slug);

  if (!project) return <Navigate to="/realisations" replace />;

  const others = PROJECTS.filter((p) => p.slug !== project.slug).slice(0, 3);

  return (
    <>
      <PageHero
        eyebrow={project.type}
        title={project.title}
        intro={project.summary}
        image={project.cover}
        breadcrumb={[
          { label: 'Accueil', to: '/' },
          { label: 'Réalisations', to: '/realisations' },
          { label: project.title },
        ]}
      />

      <Section tone="cream">
        <Container className="grid gap-12 lg:grid-cols-3 lg:gap-16">
          <div className="lg:col-span-2">
            <div className="prose-brand">
              <p>{project.description}</p>
            </div>

            {project.images.length > 0 && (
              <div className="mt-10 grid gap-4 sm:grid-cols-2">
                {project.images.map((src, i) => (
                  <Reveal key={src} delay={i * 70} className={i === 0 ? 'sm:col-span-2' : ''}>
                    <div className={i === 0 ? 'aspect-[3/2] overflow-hidden bg-brand-sand' : 'aspect-[4/5] overflow-hidden bg-brand-sand'}>
                      <img
                        src={src}
                        alt={`${project.title} — ${project.type}, ${project.location}`}
                        loading={i === 0 ? 'eager' : 'lazy'}
                        decoding="async"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </Reveal>
                ))}
              </div>
            )}

            {project.beforeAfter && (
              <div className="mt-12">
                <h2 className="font-display text-2xl font-light text-brand-ink">Avant / après</h2>
                <div className="mt-5">
                  <BeforeAfter
                    before={project.beforeAfter.before}
                    after={project.beforeAfter.after}
                    label={project.title}
                    aspect="aspect-[3/2]"
                  />
                </div>
              </div>
            )}
          </div>

          <aside className="lg:col-span-1">
            <div className="border border-brand-ink/10 bg-white p-7">
              <h2 className="font-display text-xl font-light text-brand-ink">Fiche projet</h2>

              <dl className="mt-6 space-y-5 text-[14px]">
                <div>
                  <dt className="text-[11px] uppercase tracking-[0.16em] text-brand-ink/40">Localisation</dt>
                  <dd className="mt-1 text-brand-ink/75">{project.location}</dd>
                </div>
                <div>
                  <dt className="text-[11px] uppercase tracking-[0.16em] text-brand-ink/40">Type de chantier</dt>
                  <dd className="mt-1 text-brand-ink/75">{project.type}</dd>
                </div>
                {project.works?.length > 0 && (
                  <div>
                    <dt className="text-[11px] uppercase tracking-[0.16em] text-brand-ink/40">Travaux réalisés</dt>
                    <dd className="mt-2">
                      <ul className="space-y-1.5 text-brand-ink/70">
                        {project.works.map((w) => (
                          <li key={w} className="flex gap-2">
                            <span className="text-brand-gold" aria-hidden="true">
                              —
                            </span>
                            {w}
                          </li>
                        ))}
                      </ul>
                    </dd>
                  </div>
                )}
                {project.materials?.length > 0 && (
                  <div>
                    <dt className="text-[11px] uppercase tracking-[0.16em] text-brand-ink/40">Matériaux</dt>
                    <dd className="mt-1 text-brand-ink/75">{project.materials.join(' · ')}</dd>
                  </div>
                )}
              </dl>

              <Button to="/devis" variant="primary" className="mt-8 w-full">
                Demander un devis
              </Button>
            </div>
          </aside>
        </Container>
      </Section>

      {others.length > 0 && (
        <Section tone="white">
          <Container>
            <div className="flex items-end justify-between gap-6">
              <h2 className="h-display text-[1.75rem] text-brand-ink sm:text-3xl">Autres réalisations</h2>
              <Link
                to="/realisations"
                className="text-[12px] font-semibold uppercase tracking-[0.14em] text-brand-ink transition-colors hover:text-brand-gold"
              >
                Tout voir
              </Link>
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {others.map((p, i) => (
                <Reveal key={p.slug} delay={i * 70}>
                  <ProjectCard project={p} aspect="aspect-[4/5]" />
                </Reveal>
              ))}
            </div>
          </Container>
        </Section>
      )}

      <CtaBand source="project_detail" />
    </>
  );
}
