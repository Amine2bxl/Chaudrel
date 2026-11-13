import { useEffect } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import PageHero from '@/components/sections/PageHero';
import BeforeAfter from '@/components/sections/BeforeAfter';
import CTASection from '@/components/sections/CTASection';
import { Container, Media, RoundArrow, Section, Tag } from '@/components/ui';
import Reveal from '@/lib/reveal';
import { SIZES } from '@/lib/image';
import { cn } from '@/lib/utils';
import { EVENTS, track } from '@/lib/analytics';
import { LEGACY_SLUGS, getProject, projectSiblings, projectsForTags } from '@/data/projects';
import { SERVICES } from '@/data/services';

function Facts({ project }) {
  const rows = [
    ['Nature', project.type],
    project.location && ['Lieu', project.location],
    project.year && ['Année', project.year],
    ['État sur les photos', project.status === 'en cours' ? 'En cours de chantier' : 'Travaux terminés'],
  ].filter(Boolean);
  return (
    <dl className="divide-y divide-ink/10 border-y border-ink/10 text-[14px]">
      {rows.map(([k, v]) => (
        <div key={k} className="flex justify-between gap-6 py-3.5">
          <dt className="text-ink/65">{k}</dt>
          <dd className="text-right">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

/**
 * Fiche d'un dossier : photo d'ouverture, description factuelle, travaux
 * visibles, galerie, avant/après s'il existe une paire du même point de vue,
 * dossiers liés, puis le précédent et le suivant.
 */
export default function Project() {
  const { slug } = useParams();
  const project = getProject(slug);

  useEffect(() => {
    if (project) track(EVENTS.PROJECT_VIEW, { slug: project.slug });
  }, [project]);

  if (!project) {
    const moved = LEGACY_SLUGS[slug];
    return <Navigate to={moved ? `/realisations/${moved}` : '/realisations'} replace />;
  }

  const { prev, next } = projectSiblings(project.slug);
  const gallery = (project.images ?? []).filter((im) => im.src !== project.cover.src);
  const related = projectsForTags(project.categories, 2, project.slug);
  const services = SERVICES.filter((s) => s.projectTags.some((t) => project.categories.includes(t)));

  return (
    <>
      <PageHero
        breadcrumb={[
          { label: 'Accueil', to: '/' },
          { label: 'Réalisations', to: '/realisations' },
          { label: project.title },
        ]}
        title={project.title}
        intro={project.summary}
        image={project.cover}
        meta={
          <div className="flex flex-wrap gap-2">
            <Tag>{project.type}</Tag>
            {project.status === 'en cours' && <Tag>En cours de chantier</Tag>}
            <Tag>
              {project.images.length} photo{project.images.length > 1 ? 's' : ''}
            </Tag>
          </div>
        }
      />

      <Section className="pt-section">
        <Container className="grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-6">
            <p className="eyebrow">Le dossier</p>
            <p className="t-lead mt-6 max-w-[56ch] text-ink/80">{project.description}</p>
          </Reveal>
          <Reveal delay={100} className="space-y-10 lg:col-span-5 lg:col-start-8">
            <Facts project={project} />
            <div>
              <h2 className="t-label text-ink/65">Travaux visibles sur les photos</h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {project.works.map((w) => (
                  <li key={w}>
                    <Tag>{w}</Tag>
                  </li>
                ))}
              </ul>
            </div>
            {project.materials?.length > 0 && (
              <div>
                <h2 className="t-label text-ink/65">Matériaux</h2>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {project.materials.map((m) => (
                    <li key={m}>
                      <Tag>{m}</Tag>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {services.length > 0 && (
              <p className="text-[14px] text-ink/70">
                Métier{services.length > 1 ? 's' : ''} :{' '}
                {services.map((s, i) => (
                  <span key={s.slug}>
                    {i > 0 && ', '}
                    <Link to={`/services/${s.slug}`} className="link-gold text-ink">
                      {s.title}
                    </Link>
                  </span>
                ))}
              </p>
            )}
          </Reveal>
        </Container>
      </Section>

      {project.beforeAfter && (
        <Section tone="paper">
          <Container>
            <h2 className="t-h2">Avant, après.</h2>
            <div className="mt-block">
              <BeforeAfter before={project.beforeAfter.before} after={project.beforeAfter.after} />
            </div>
          </Container>
        </Section>
      )}

      {gallery.length > 0 && (
        <Section className="pt-0">
          <Container>
            <h2 className="t-label text-ink/65">Galerie · {gallery.length + 1} photos</h2>
            <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:gap-10">
              {gallery.map((im, i) => {
                const wide = gallery.length % 2 === 1 && i === 0;
                return (
                  <li key={im.src} className={cn(wide && 'sm:col-span-2')}>
                    <figure>
                      <Media
                        src={im.src}
                        alt={im.alt}
                        width={im.w}
                        height={im.h}
                        ratio={wide ? 'aspect-[16/9]' : 'aspect-[4/3]'}
                        sizes={wide ? SIZES.full : SIZES.half}
                      />
                      <figcaption className="mt-3 text-[12.5px] text-ink/65">{im.alt}</figcaption>
                    </figure>
                  </li>
                );
              })}
            </ul>
          </Container>
        </Section>
      )}

      {related.length > 0 && (
        <Section tone="paper">
          <Container>
            <h2 className="t-h2">Dossiers voisins</h2>
            <ul className="mt-block grid gap-10 sm:grid-cols-2">
              {related.map((p) => (
                <li key={p.slug}>
                  <Link to={`/realisations/${p.slug}`} className="group grid grid-cols-[7rem_1fr_auto] items-center gap-5 sm:grid-cols-[9rem_1fr_auto]">
                    <Media
                      src={p.cover.src}
                      alt=""
                      width={p.cover.w}
                      height={p.cover.h}
                      ratio="aspect-[4/5]"
                      sizes="10rem"
                      reveal={false}
                      zoom
                    />
                    <div>
                      <p className="t-label text-ink/60">{p.type}</p>
                      <h3 className="t-h3 mt-2">{p.title}</h3>
                    </div>
                    <RoundArrow />
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      )}

      <nav aria-label="Dossier précédent ou suivant" className="border-y border-ink/12">
        <Container className="grid grid-cols-2 divide-x divide-ink/12">
          {[prev, next].map((p, i) =>
            p ? (
              <Link
                key={p.slug}
                to={`/realisations/${p.slug}`}
                className={cn('group py-8 sm:py-10', i === 0 ? 'pr-4 sm:pr-8' : 'pl-4 text-right sm:pl-8')}
              >
                <span className="t-label text-ink/60">{i === 0 ? '← Précédent' : 'Suivant →'}</span>
                <span className="t-h3 mt-3 block transition-colors duration-fast group-hover:text-gold-deep">
                  {p.title}
                </span>
              </Link>
            ) : (
              <span key={i} />
            )
          )}
        </Container>
      </nav>

      <CTASection source="projet" />
    </>
  );
}
