import PageHero from '@/components/sections/PageHero';
import ServicesBoard from '@/components/sections/ServicesBoard';
import CTASection from '@/components/sections/CTASection';

export default function Services() {
  return (
    <>
      <PageHero title="Six métiers, un seul interlocuteur." image="/photos/svc-toiture.webp" />

      <ServicesBoard />

      <CTASection source="services" />
    </>
  );
}