import { useEffect, useRef } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import PageHero from '@/components/sections/PageHero';
import ProjectCarousel from '@/components/sections/ProjectCarousel';
import FaqAccordion from '@/components/sections/FaqAccordion';
import CTASection from '@/components/sections/CTASection';
import { Button, Container, Panel, Section, SectionHeading } from '@/components/ui';
import { GroupLabel } from '@/components/layout/ContactList';
import { HouseIcon, SERVICE_ICONS } from '@/components/ui/Icons';
import { EVENTS, track } from '@/lib/analytics';
import Reveal from '@/lib/reveal';
import { SERVICES, getService } from '@/data/services';
import { projectsForTags } from '@/data/projects';
import { cn } from '@/lib/utils';

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
  const tabs = useRef(null);

  // Sur mobile, la barre des métiers défile : on y amène le métier en cours.
  useEffect(() => {
    const ul = tabs.current;
    const on = ul?.querySelector('[aria-current="page"]')?.parentElement;
    if (on) ul.scrollLeft = on.offsetLeft - (ul.clientWidth - on.offsetWidth) / 2;
  }, [slug]);

  if (!service) {
    const moved = LEGACY_SLUGS[slug];
    return <Navigate to={moved ? `/services/${moved}` : '/services'} replace />;
  }

  const related = projectsForTags(service.projectTags || [], 3);

  return (
    <>
      <PageHero title={service.title} image={service.image} />

      {/* Les six métiers, toujours visibles : on passe de l'un à l'autre en un geste. */}
      <nav aria-label="Nos métiers" className="border-b border-ink/10">
        <Container>
          <ul ref={tabs} className="-mx-5 flex gap-2 overflow-x-auto px-5 py-4 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:justify-center sm:overflow-visible sm:px-0">
            {SERVICES.map((s) => {
              const on = s.slug === service.slug;
              const Icon = SERVICE_ICONS[s.slug] || HouseIcon;
              return (
                <li key={s.slug} className="flex-none">
                  <Link
                    to={`/services/${s.slug}`}
                    aria-current={on ? 'page' : undefined}
                    className={cn(
                      't-small flex items-center gap-2 rounded-full border px-4 py-2 transition-colors duration-fast',
                      on ? 'border-gold/60 bg-gold/[0.12] text-ink' : 'border-ink/10 text-ink/70 hover:border-ink/25 hover:text-ink'
                    )}
                  >
                    <Icon size={16} className={on ? 'text-gold-light' : 'text-ink/50'} />
                    {s.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </Container>
      </nav>

      {/* Le métier en une carte : ce qu'on y gagne et le devis à gauche, les postes à droite. */}
      <Section>
        <Container>
          <Reveal>
            <Panel pad="p-6 sm:p-10" className="grid gap-10 lg:grid-cols-12 lg:gap-14">
              <div className="lg:col-span-6">
                <p className="t-h3 measure text-ink">{service.intro}</p>
                <Button
                  to="/devis"
                  size="lg"
                  arrow
                  className="mt-8"
                  onClick={() => track(EVENTS.QUOTE_CTA, { source: `service_${service.slug}` })}
                >
                  Demander un devis gratuit
                </Button>
              </div>
              {service.groups?.length > 0 && (
                <div className="lg:col-span-6">
                  {service.groups.map((g) => (
                    <div key={g.title} className="mt-7 first:mt-0">
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
