import { Navigate, useParams } from 'react-router-dom';
import PageHero from '@/components/sections/PageHero';
import BeforeAfter from '@/components/sections/BeforeAfter';
import ProjectGrid from '@/components/sections/ProjectGrid';
import CTASection from '@/components/sections/CTASection';
import { Button, Container, Media, Section, SectionHeading, TextLink } from '@/components/ui';
import { PROJECTS, getProject } from '@/data/projects';

export default function Project() {
  const { slug } = useParams();
  const project = getProject(slug);

  if (!project) return <Navigate to="/realisations" replace />;

  const others = PROJECTS.filter((p) => p.slug !== project.slug).slice(0, 3);

  return (
    <>
      <PageHero
        label={project.type}
        title={project.title}
        intro={project.summary}
        image={project.cover}
        breadcrumb={[
          { label: 'Accueil', to: '/' },
          { label: 'Réalisations', to: '/realisations' },
          { label: project.title },
        ]}
      />

      <Section tone="paper">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <p className="t-body measure text-ink/70">{project.description}</p>
            </div>

            <dl className="lg:col-span-4 lg:col-start-9">
              <div className="border-t border-ink/12 py-4">
                <dt className="t-label text-ink/65">Lieu</dt>
                <dd className="t-body mt-1.5">{project.location}</dd>
              </div>
              <div className="border-t border-ink/12 py-4">
                <dt className="t-label text-ink/65">Type de chantier</dt>
                <dd className="t-body mt-1.5">{project.type}</dd>
              </div>
              {project.materials?.length > 0 && (
                <div className="border-t border-ink/12 py-4">
                  <dt className="t-label text-ink/65">Matériaux</dt>
                  <dd className="t-body mt-1.5">{project.materials.join(' · ')}</dd>
                </div>
              )}
              {project.works?.length > 0 && (
                <div className="border-y border-ink/12 py-4">
                  <dt className="t-label text-ink/65">Travaux réalisés</dt>
                  <dd className="mt-2">
                    <ul className="t-small space-y-1.5 text-ink/65">
                      {project.works.map((w) => (
                        <li key={w}>{w}</li>
                      ))}
                    </ul>
                  </dd>
                </div>
              )}
              <Button to="/devis" variant="solid" className="mt-8 w-full">
                Un projet similaire ?
              </Button>
            </dl>
          </div>

          {project.images.length > 0 && (
            <div className="mt-16 grid gap-8 lg:mt-24 lg:grid-cols-12">
              {project.images.map((src, i) => (
                <Media
                  key={src}
                  src={src}
                  alt={`${project.title} — ${project.type}, ${project.location}`}
                  ratio={i === 0 ? 'aspect-[16/10]' : 'aspect-[4/5]'}
                  className={i === 0 ? 'lg:col-span-12' : 'lg:col-span-6'}
                />
              ))}
            </div>
          )}

          {project.beforeAfter && (
            <div className="mt-16 lg:mt-24">
              <SectionHeading title="Le même espace, avant et après." />
              <div className="mt-10 max-w-3xl">
                <BeforeAfter
                  before={project.beforeAfter.before}
                  after={project.beforeAfter.after}
                  label={project.title}
                  ratio="aspect-[16/10]"
                />
              </div>
            </div>
          )}
        </Container>
      </Section>

      {others.length > 0 && (
        <Section tone="white">
          <Container>
            <SectionHeading title="D’autres chantiers." />
            <ProjectGrid projects={others} className="mt-14" />
            <div className="mt-12">
              <TextLink to="/realisations">Toutes les réalisations</TextLink>
            </div>
          </Container>
        </Section>
      )}

      <CTASection source="project_detail" />
    </>
  );
}
