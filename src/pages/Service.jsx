import { Link, Navigate, useParams } from 'react-router-dom';
import { Check } from 'lucide-react';
import PageHero from '@/components/sections/PageHero';
import ProjectCard from '@/components/sections/ProjectCard';
import MethodSteps from '@/components/sections/MethodSteps';
import FaqAccordion from '@/components/sections/FaqAccordion';
import CtaBand from '@/components/sections/CtaBand';
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
  const others = SERVICES.filter((s) => s.slug !== service.slug).slice(0, 6);

  return (
    <>
      <PageHero
        eyebrow={service.subtitle}
        title={`${service.title} à Bruxelles`}
        intro={service.excerpt}
        image={service.image}
        breadcrumb={[
          { label: 'Accueil', to: '/' },
          { label: 'Services', to: '/services' },
          { label: service.title },
        ]}
      />

      <Section tone="cream">
        <Container className="grid gap-12 lg:grid-cols-3 lg:gap-16">
          <div className="lg:col-span-2">
            <div className="prose-brand">
              <p>{service.intro}</p>
            </div>

            {service.benefits?.length > 0 && (
              <div className="mt-10">
                <h2 className="font-display text-2xl font-light text-brand-ink">Ce que cela vous apporte</h2>
                <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                  {service.benefits.map((b) => (
                    <li key={b} className="flex gap-3 border border-brand-ink/8 bg-white p-4 text-[14px] text-brand-ink/70">
                      <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-gold" aria-hidden="true" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {service.works?.length > 0 && (
              <div className="mt-10">
                <h2 className="font-display text-2xl font-light text-brand-ink">Types de travaux</h2>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {service.works.map((w) => (
                    <li
                      key={w}
                      className="rounded-full border border-brand-ink/12 px-4 py-2 text-[13px] text-brand-ink/65"
                    >
                      {w}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <aside>
            <div className="border border-brand-ink/10 bg-white p-7">
              <h2 className="font-display text-xl font-light text-brand-ink">Devis gratuit</h2>
              <p className="mt-3 text-[14px] font-light leading-[1.8] text-brand-ink/60">
                Décrivez votre projet {service.title.toLowerCase()} : nous organisons une visite et vous remettons une
                proposition détaillée, sans engagement.
              </p>
              <Button to="/devis" variant="primary" className="mt-6 w-full">
                Demander un devis
              </Button>
              <p className="mt-5 text-[13px] text-brand-ink/50">
                Zone d'intervention : {BRAND.zone}.
              </p>
            </div>

            <nav aria-label="Autres services" className="mt-8">
              <h2 className="eyebrow">Autres services</h2>
              <ul className="space-y-2 text-[14px]">
                {others.map((s) => (
                  <li key={s.slug}>
                    <Link
                      to={`/services/${s.slug}`}
                      className="text-brand-ink/65 transition-colors hover:text-brand-gold"
                    >
                      {s.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>
        </Container>
      </Section>

      {related.length > 0 && (
        <Section tone="white">
          <Container>
            <SectionHeading eyebrow="Réalisations" title="Chantiers liés" />
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {related.map((p, i) => (
                <Reveal key={p.slug} delay={i * 70}>
                  <ProjectCard project={p} aspect="aspect-[4/5]" />
                </Reveal>
              ))}
            </div>
          </Container>
        </Section>
      )}

      <Section tone="dark">
        <Container>
          <SectionHeading eyebrow="Notre méthode" tone="dark" title="Le déroulement" accent="d'un chantier" />
        </Container>
        <Container className="mt-12">
          <MethodSteps tone="dark" />
        </Container>
      </Section>

      {service.faqs?.length > 0 && (
        <Section tone="cream">
          <Container className="max-w-3xl">
            <SectionHeading eyebrow="FAQ" title={`Questions sur ${service.title.toLowerCase()}`} align="center" />
            <div className="mt-10">
              <FaqAccordion items={service.faqs} />
            </div>
          </Container>
        </Section>
      )}

      <CtaBand source={`service_${service.slug}`} />
    </>
  );
}
