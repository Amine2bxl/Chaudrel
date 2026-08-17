import { Link, Navigate, useParams } from 'react-router-dom';
import PageHero from '@/components/sections/PageHero';
import ProjectGrid from '@/components/sections/ProjectGrid';
import ProcessCurve from '@/components/sections/ProcessCurve';
import FaqAccordion from '@/components/sections/FaqAccordion';
import CTASection from '@/components/sections/CTASection';
import { Button, Container, Section, SectionHeading } from '@/components/ui';
import Reveal from '@/lib/reveal';
import { SERVICES, getService } from '@/data/services';
import { projectsForTags } from '@/data/projects';
import { BRAND } from '@/data/site';

/**
 * Anciens métiers de la V1 vers les métiers réels.
 *
 * La V1 découpait l'offre par pièce et par corps de métier (cuisine, salle de
 * bain, électricité…) ; le site historique la découpe par métier de chantier.
 * Ces URL ont pu être indexées ou partagées : elles pointent vers le métier qui
 * couvre réellement ces travaux, plutôt que de renvoyer tout le monde sur
 * l'index.
 */
const LEGACY_SLUGS = {
  cuisine: 'finitions-interieures',
  'salle-de-bain': 'finitions-interieures',
  peinture: 'finitions-interieures',
  'sols-et-revetements': 'finitions-interieures',
  menuiserie: 'finitions-interieures',
  'amenagement-interieur': 'finitions-interieures',
  electricite: 'renovation-complete',
  plomberie: 'renovation-complete',
  jardin: 'amenagement-exterieur',
  nettoyage: 'renovation-complete',
};

export default function Service() {
  const { slug } = useParams();
  const service = getService(slug);

  if (!service) {
    const moved = LEGACY_SLUGS[slug];
    return <Navigate to={moved ? `/services/${moved}` : '/services'} replace />;
  }

  const related = projectsForTags(service.projectTags || [], 3);
  const others = SERVICES.filter((s) => s.slug !== service.slug);

  return (
    <>
      <PageHero
        title={service.title}
        intro={service.excerpt}
        image={service.image}
        breadcrumb={[
          { label: 'Accueil', to: '/' },
          { label: 'Services', to: '/services' },
          { label: service.title },
        ]}
      />

      <Section tone="cream">
        <Container>
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <p className="t-h3 measure text-ink">{service.intro}</p>

              {/* Les postes sont groupés par nature plutôt qu'alignés en une
                  liste numérotée : trente lignes d'affilée ne se lisent pas, et
                  la numérotation laissait croire à un ordre d'exécution. */}
              {service.groups?.length > 0 && (
                <div className="mt-block space-y-10">
                  {service.groups.map((g, gi) => (
                    <Reveal key={g.title} delay={gi * 90}>
                      <h2 className="t-label text-ink/55">{g.title}</h2>
                      <ul className="mt-4 flex flex-wrap gap-x-8 gap-y-2.5">
                        {g.items.map((item) => (
                          <li key={item} className="t-body flex items-baseline gap-2.5 text-ink/75">
                            <span aria-hidden="true" className="h-1 w-1 flex-none rounded-full bg-umber" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </Reveal>
                  ))}
                </div>
              )}
            </div>

            <aside className="lg:col-span-4 lg:col-start-9">
              <div className="border-t border-ink/12 pt-6">
                <span className="t-label text-ink/65">Devis gratuit</span>
                <p className="t-body mt-4 text-ink/65">
                  Décrivez votre projet {service.title.toLowerCase()}. Nous organisons une visite et vous remettons une
                  proposition détaillée, sans engagement.
                </p>
                <Button to="/devis" variant="solid" className="mt-7 w-full">
                  Demander un devis
                </Button>
                <p className="t-small mt-5 text-ink/65">{BRAND.zoneLong}.</p>
              </div>

              <nav aria-label="Autres services" className="mt-12">
                <span className="t-label text-ink/65">Autres services</span>
                <ul className="mt-5 space-y-2.5">
                  {others.map((s) => (
                    <li key={s.slug}>
                      <Link to={`/services/${s.slug}`} className="link-line t-small text-ink/65 hover:text-ink">
                        {s.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </aside>
          </div>
        </Container>
      </Section>

      {related.length > 0 && (
        <Section tone="white">
          <Container>
            <SectionHeading title="Des chantiers de ce type." />
            <ProjectGrid projects={related} className="mt-block" />
          </Container>
        </Section>
      )}

      <Section tone="bark">
        <Container>
          <SectionHeading tone="light" title="Le déroulé, étape par étape." />
          <ProcessCurve tone="light" className="mt-block" />
        </Container>
      </Section>

      {service.faqs?.length > 0 && (
        <Section tone="cream">
          <Container>
            <SectionHeading title={`Questions sur ${service.title.toLowerCase()}.`} />
            <FaqAccordion items={service.faqs} className="mt-12" />
          </Container>
        </Section>
      )}

      <CTASection source={`service_${service.slug}`} />
    </>
  );
}
