import PageHero from '@/components/sections/PageHero';
import FaqAccordion from '@/components/sections/FaqAccordion';
import CTASection from '@/components/sections/CTASection';
import { Container, Section, SectionHeading } from '@/components/ui';
import { FAQS } from '@/data/faqs';
import { SERVICES } from '@/data/services';

const serviceFaqs = SERVICES.flatMap((s) => (s.faqs?.[0] ? [{ ...s.faqs[0], tag: s.title }] : []));

export default function Faq() {
  return (
    <>
      <PageHero
        title="Les questions qu’on nous pose."
        intro="Budget, délais, zone, déroulement du chantier. La réponse ne suffit pas ? Écrivez-nous."
        breadcrumb={[{ label: 'Accueil', to: '/' }, { label: 'FAQ' }]}
      />

      <Section tone="cream" className="pt-0 md:pt-0 lg:pt-0">
        <Container>
          <div className="mx-auto max-w-3xl">
            <FaqAccordion items={FAQS} />

            {serviceFaqs.length > 0 && (
              <div className="mt-block">
                <SectionHeading title="Par métier." text="Les précisions qui ne valent que pour un type de travaux." />
                <FaqAccordion className="mt-12" items={serviceFaqs} />
              </div>
            )}
          </div>
        </Container>
      </Section>

      <CTASection
        title="Une question sur votre projet ?"
        text="Téléphone, WhatsApp ou e-mail : on répond aussi bien à l’oral."
        source="faq"
      />
    </>
  );
}