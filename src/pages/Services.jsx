import PageHero from '@/components/sections/PageHero';
import ServiceList from '@/components/sections/ServiceList';
import ProcessTimeline from '@/components/sections/ProcessTimeline';
import CTASection from '@/components/sections/CTASection';
import { Container, Section, SectionHeading } from '@/components/ui';

export default function Services() {
  return (
    <>
      <PageHero
        title="Un chantier, un interlocuteur."
        intro="Nous prenons en charge la rénovation complète comme le poste isolé. Dans les deux cas, la coordination est de notre côté."
        breadcrumb={[{ label: 'Accueil', to: '/' }, { label: 'Services' }]}
      />

      <Section tone="cream" className="pt-0 md:pt-0 lg:pt-0">
        <Container>
          <ServiceList />
        </Container>
      </Section>

      <Section tone="bark">
        <Container>
          <SectionHeading
            tone="light"
            title="Comment se déroule un chantier."
            text="Le même déroulé pour une salle de bain que pour une maison entière. Seule la durée change."
          />
          <ProcessTimeline tone="light" className="mt-16 lg:mt-24" />
        </Container>
      </Section>

      <CTASection source="services" />
    </>
  );
}
