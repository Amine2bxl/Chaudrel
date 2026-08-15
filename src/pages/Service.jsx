import { Link, Navigate, useParams } from 'react-router-dom';
import PageHero from '@/components/sections/PageHero';
import ProjectGrid from '@/components/sections/ProjectGrid';
import ProcessTimeline from '@/components/sections/ProcessTimeline';
import FaqAccordion from '@/components/sections/FaqAccordion';
import CTASection from '@/components/sections/CTASection';
import { Button, Container, Section, SectionHeading } from '@/components/ui';
import Reveal from '@/lib/reveal';
import { SERVICES, getService } from '@/data/services';
import { projectsForTags } from '@/data/projects';
import { BRAND } from '@/data/site';

export default function Service() {
  const { slug } = useParams();
  const service = getService(slug);

  if (!service) return <Navigate to="/services" replace />;

  const related = projectsForTags(service.projectTags || [], 3);
  const others = SERVICES.filter((s) => s.slug !== service.slug);

  return (
    <>
      <PageHero
        label="Service"
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

              {service.works?.length > 0 && (
                <div className="mt-14">
                  <span className="t-label text-ink/35">Ce que comprend le poste</span>
                  <ul className="mt-6 border-t border-ink/12">
                    {service.works.map((w, i) => (
                      <Reveal as="li" key={w} delay={i * 60} className="flex gap-6 border-b border-ink/12 py-4">
                        <span className="t-num text-ink/25">{String(i + 1).padStart(2, '0')}</span>
                        <span className="t-body text-ink/70">{w}</span>
                      </Reveal>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <aside className="lg:col-span-4 lg:col-start-9">
              <div className="border-t border-ink/12 pt-6">
                <span className="t-label text-ink/35">Devis gratuit</span>
                <p className="t-body mt-4 text-ink/65">
                  Décrivez votre projet {service.title.toLowerCase()}. Nous organisons une visite et vous remettons une
                  proposition détaillée, sans engagement.
                </p>
                <Button to="/devis" variant="solid" className="mt-7 w-full">
                  Demander un devis
                </Button>
                <p className="t-small mt-5 text-ink/45">Zone d’intervention : {BRAND.zone}.</p>
              </div>

              <nav aria-label="Autres services" className="mt-12">
                <span className="t-label text-ink/35">Autres services</span>
                <ul className="mt-5 space-y-2.5">
                  {others.map((s) => (
                    <li key={s.slug}>
                      <Link to={`/services/${s.slug}`} className="link-line t-small text-ink/60 hover:text-ink">
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
            <SectionHeading label="Réalisations" title="Des chantiers de ce type." />
            <ProjectGrid projects={related} className="mt-14" />
          </Container>
        </Section>
      )}

      <Section tone="night">
        <Container>
          <SectionHeading tone="light" label="Notre méthode" title="Le déroulé, étape par étape." />
          <ProcessTimeline tone="light" className="mt-16 lg:mt-24" />
        </Container>
      </Section>

      {service.faqs?.length > 0 && (
        <Section tone="cream">
          <Container>
            <SectionHeading label="FAQ" title={`Questions sur ${service.title.toLowerCase()}.`} />
            <FaqAccordion items={service.faqs} className="mt-12" />
          </Container>
        </Section>
      )}

      <CTASection source={`service_${service.slug}`} />
    </>
  );
}
