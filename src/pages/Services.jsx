import PageHero from '@/components/sections/PageHero';
import ServicesBoard from '@/components/sections/ServicesBoard';
import CTASection from '@/components/sections/CTASection';
import { Container, Section } from '@/components/ui';

export default function Services() {
  return (
    <>
      <PageHero
        title="Six métiers, un seul interlocuteur."
        intro="Nous prenons en charge la rénovation complète comme le poste isolé. Dépliez un métier pour voir ce qu'il recouvre, puis demandez le devis."
        breadcrumb={[{ label: 'Accueil', to: '/' }, { label: 'Services' }]}
      />

      <Section tone="cream" className="pt-0 md:pt-0 lg:pt-0">
        <Container>
          <ServicesBoard />
        </Container>
      </Section>

      <CTASection source="services" />
    </>
  );
}