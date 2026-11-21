import { Navigate, useParams } from 'react-router-dom';
import PageHero from '@/components/sections/PageHero';
import ProjectCarousel from '@/components/sections/ProjectCarousel';
import FaqAccordion from '@/components/sections/FaqAccordion';
import CTASection from '@/components/sections/CTASection';
import { Container, Panel, Section, SectionHeading } from '@/components/ui';
import { GroupLabel, Row } from '@/components/layout/ContactList';
import { HouseIcon, SERVICE_ICONS } from '@/components/ui/Icons';
import { QuoteIcon } from '@/components/ui/BrandIcons';
import { EVENTS, track } from '@/lib/analytics';
import Reveal from '@/lib/reveal';
import { SERVICES, getService } from '@/data/services';
import { projectsForTags } from '@/data/projects';

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
        image={service.image}
      />

      <Section>
        <Container>
          <div className="grid gap-6 lg:grid-cols-12 lg:items-start">
            {/* Le métier, sur la carte de verre : la phrase d'entrée, puis les
                postes groupés par nature. */}
            <Reveal className="lg:col-span-8">
              <Panel pad="p-6 sm:p-10">
                <p className="t-h3 measure text-ink">{service.intro}</p>
                {service.groups?.length > 0 && (
                  <div className="mt-9 space-y-7">
                    {service.groups.map((g) => (
                      <div key={g.title}>
                        <GroupLabel>{g.title}</GroupLabel>
                        <ul className="flex flex-wrap gap-2">
                          {g.items.map((item) => (
                            <li
                              key={item}
                              className="t-small rounded-full border border-ink/[0.09] bg-shell px-3.5 py-1.5 text-ink/80"
                            >
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </Panel>
            </Reveal>

            {/* La suite : le devis, puis les autres métiers. */}
            <Reveal delay={100} as="aside" className="lg:sticky lg:top-28 lg:col-span-4">
              <Panel>
                <div data-page-cta>
                  <Row
                    to="/devis"
                    icon={QuoteIcon}
                    label="Devis gratuit"
                    onClick={() => track(EVENTS.QUOTE_CTA, { source: `service_${service.slug}_aside` })}
                    primary
                  />
                </div>
                <nav aria-label="Autres services" className="mt-8">
                  <GroupLabel>Autres métiers</GroupLabel>
                  <ul className="space-y-2">
                    {others.map((s) => (
                      <li key={s.slug}>
                        <Row to={`/services/${s.slug}`} icon={SERVICE_ICONS[s.slug] || HouseIcon} label={s.title} compact />
                      </li>
                    ))}
                  </ul>
                </nav>
              </Panel>
            </Reveal>
          </div>
        </Container>
      </Section>

      {related.length > 0 && (
        <ProjectCarousel
          projects={related}
          sectionLabel="Sur le chantier"
          title="Des chantiers de ce type."
        />
      )}

      {service.faqs?.length > 0 && (
        <Section>
          <Container>
            <SectionHeading title={`Questions sur ${service.title.toLowerCase()}.`} />
            <FaqAccordion items={service.faqs} className="mt-10 max-w-3xl" />
          </Container>
        </Section>
      )}

      <CTASection source={`service_${service.slug}`} />
    </>
  );
}
