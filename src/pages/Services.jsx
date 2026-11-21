import PageHero from '@/components/sections/PageHero';
import ServicesBoard from '@/components/sections/ServicesBoard';
import CTASection from '@/components/sections/CTASection';
import { Container, Section } from '@/components/ui';

export default function Services() {
  return (
    <>
      <PageHero title="Six métiers, un seul interlocuteur." />

      <Section tone="cream" className="pt-block">
        <Container>
          <ServicesBoard />
        </Container>
      </Section>

      <CTASection source="services" />
    </>
  );
}