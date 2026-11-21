import PageHero from '@/components/sections/PageHero';
import FaqAccordion from '@/components/sections/FaqAccordion';
import CTASection from '@/components/sections/CTASection';
import { Container, Section, SectionHeading } from '@/components/ui';
import { FAQS } from '@/data/faqs';
import { SERVICES } from '@/data/services';
import { SERVICE_ICONS } from '@/components/ui/Icons';

const serviceFaqs = SERVICES.flatMap((s) =>
  s.faqs?.[0] ? [{ ...s.faqs[0], icon: SERVICE_ICONS[s.slug] }] : []
);

export default function Faq() {
  return (
    <>
      <PageHero title="Les questions qu’on nous pose." image="/photos/pf-4.webp" />

      <Section tone="cream" className="pt-block">
        <Container>
          <div className="mx-auto max-w-3xl">
            <FaqAccordion items={FAQS} />

            {serviceFaqs.length > 0 && (
              <div className="mt-block">
                <SectionHeading title="Par métier." />
                <FaqAccordion className="mt-10" items={serviceFaqs} />
              </div>
            )}
          </div>
        </Container>
      </Section>

      <CTASection source="faq" />
    </>
  );
}