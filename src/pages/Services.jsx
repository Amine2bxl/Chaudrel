import PageHero from '@/components/sections/PageHero';
import ServiceCard from '@/components/sections/ServiceCard';
import MethodSteps from '@/components/sections/MethodSteps';
import CtaBand from '@/components/sections/CtaBand';
import { Container, Section, SectionHeading } from '@/components/ui';
import Reveal from '@/lib/reveal';
import { SERVICES } from '@/data/services';

export default function Services() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Nos domaines d'intervention"
        intro="Rénovation complète ou chantier ciblé : nous coordonnons l'ensemble des travaux, avec un seul interlocuteur du devis à la livraison."
        breadcrumb={[{ label: 'Accueil', to: '/' }, { label: 'Services' }]}
      />

      <Section tone="cream">
        <Container>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((s, i) => (
              <Reveal key={s.slug} delay={i * 50}>
                <ServiceCard service={s} className="h-full" />
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <Section tone="dark">
        <Container>
          <SectionHeading
            eyebrow="Notre méthode"
            tone="dark"
            title="Comment se déroule"
            accent="un chantier"
          />
        </Container>
        <Container className="mt-12">
          <MethodSteps tone="dark" />
        </Container>
      </Section>

      <CtaBand source="services" />
    </>
  );
}
