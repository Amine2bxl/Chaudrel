import { Navigate, useParams } from 'react-router-dom';
import PageHero from '@/components/sections/PageHero';
import BeforeAfter from '@/components/sections/BeforeAfter';
import SiblingBar from '@/components/sections/SiblingBar';
import CTASection from '@/components/sections/CTASection';
import { Container, Panel, Section, SectionHeading, TextLink } from '@/components/ui';
import House3D from '@/components/sections/House3D';
import { CheckIcon } from '@/components/ui/Icons';
import { imageAttrs } from '@/lib/image';
import { SERVICES } from '@/data/services';
import Reveal from '@/lib/reveal';
import { LEGACY_SLUGS, PROJECTS, getProject, projectSiblings } from '@/data/projects';
import { EVENTS, track } from '@/lib/analytics';
import { cn } from '@/lib/utils';

export default function Project() {
  const { slug } = useParams();
  const project = getProject(slug);

  if (!project) {
    // Ancienne adresse de fiche : on mène au dossier qui contient sa photo.
    const moved = LEGACY_SLUGS[slug];
    return <Navigate to={moved ? `/realisations/${moved}` : '/realisations'} replace />;
  }

  const { prev, next } = projectSiblings(project.slug);
  // La galerie ne répète pas la photo déjà montrée en en-tête : on ne montre
  // pas deux fois la même image sur une même page.
  const gallery = (project.images ?? []).filter((im) => im.src !== project.cover.src);
  // Le métier qui couvre ce chantier : celui dont les tags contiennent sa première catégorie.
  const service = SERVICES.find((s) => s.projectTags?.includes(project.categories?.[0]));

  return (
    <>
      <PageHero title={project.title} />

      {/* Dès l'arrivée, côte à côte et entiers à l'écran : la vraie photo du
          chantier et la maquette qui montre où l'on a travaillé. */}
      <section className="pt-3 sm:pt-6 lg:pt-8">
        <Container>
          <Reveal>
            <Panel pad="p-3 sm:p-4" className="grid gap-3 sm:gap-4 lg:grid-cols-2">
              <div className="aspect-[16/10] overflow-hidden rounded-[20px] bg-sand lg:aspect-[16/11]">
                <img
                  {...imageAttrs(project.cover.src, '(min-width: 1024px) 46vw, 100vw')}
                  alt={project.cover.alt}
                  width={project.cover.w}
                  height={project.cover.h}
                  fetchpriority="high"
                  decoding="async"
                  className="h-full w-full object-cover"
                />
              </div>
              <House3D works={project.works} className="[--h3-fit:40] [--h3-ratio:16/10] lg:[--h3-fit:37] lg:[--h3-ratio:16/11]" />
            </Panel>
          </Reveal>
        </Container>
      </section>

      {/* Le récit et la fiche : ce qui a été fait, où, et les travaux, cochés. */}
      <Section tone="cream" className="pt-6 md:pt-6 lg:pt-8">
        <Container>
          <div className="grid gap-5 lg:grid-cols-12">
            <Reveal className="lg:col-span-7">
              <Panel pad="p-7 sm:p-10" className="h-full">
                <p className="t-label text-gold-light">{[project.type, project.location].filter(Boolean).join(' · ')}</p>
                <p className="t-lead measure mt-5 text-ink/85">{project.description}</p>
                {project.materials?.length > 0 && (
                  <p className="t-small mt-6 text-ink/60">Matériaux : {project.materials.join(' · ')}</p>
                )}
              </Panel>
            </Reveal>

            {project.works?.length > 0 && (
              <Reveal delay={100} className="lg:col-span-5">
                <Panel pad="p-7 sm:p-10" className="h-full">
                  <div className="flex items-baseline justify-between gap-4">
                    <h2 className="font-display text-[1.5rem] leading-tight text-ink">Travaux réalisés</h2>
                    <span className="t-label flex-none tabular-nums text-gold-light">
                      {project.works.length} {project.works.length > 1 ? 'postes' : 'poste'}
                    </span>
                  </div>
                  <ul className="mt-5 space-y-3">
                    {project.works.map((w) => (
                      <li key={w} className="t-body flex items-start gap-3 text-ink/80">
                        <CheckIcon size={18} className="mt-[3px] flex-none text-gold-light" aria-hidden="true" />
                        {w}
                      </li>
                    ))}
                  </ul>
                  {service && (
                    <TextLink to={`/services/${service.slug}`} className="mt-7">
                      Le métier : {service.title}
                    </TextLink>
                  )}
                </Panel>
              </Reveal>
            )}
          </div>

          {/* Avant / après, quand la comparaison existe : la preuve la plus forte. */}
          {project.beforeAfter && (
            <div className="mt-block">
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

          {/* Les autres vues du chantier, en cases égales. */}
          {gallery.length > 0 && (
            <div className="mt-block">
              <SectionHeading title="Sur le chantier." />
              <div className={cn('mt-10 grid gap-5', gallery.length > 1 && 'sm:grid-cols-2')}>
                {gallery.map((im) => (
                  <Reveal key={im.src} from="veil" className="overflow-hidden rounded-[24px] bg-sand">
                    <img
                      {...imageAttrs(im.src, gallery.length > 1 ? '(min-width: 640px) 46vw, 100vw' : '100vw')}
                      alt={im.alt}
                      width={im.w}
                      height={im.h}
                      loading="lazy"
                      decoding="async"
                      className={cn('w-full object-cover', gallery.length > 1 ? 'aspect-[4/3]' : 'aspect-[16/9]')}
                    />
                  </Reveal>
                ))}
              </div>
            </div>
          )}
        </Container>
      </Section>

      {/* La navigation entre chantiers quitte le corps de page pour se coller
          en bas : c'est une commande permanente, pas un paragraphe qu'on
          dépasse en défilant. */}
      <SiblingBar
        label="Chantier"
        current={project.slug}
        items={PROJECTS}
        prev={prev && { to: `/realisations/${prev.slug}`, title: prev.title }}
        next={next && { to: `/realisations/${next.slug}`, title: next.title }}
      />

      <CTASection source="project_detail" />
    </>
  );
}
