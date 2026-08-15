import PageHero from '@/components/sections/PageHero';
import FaqAccordion from '@/components/sections/FaqAccordion';
import CTASection from '@/components/sections/CTASection';
import { Container, Section, SectionHeading } from '@/components/ui';
import { FAQS } from '@/data/faqs';
import { SERVICES } from '@/data/services';

const serviceFaqs = SERVICES.flatMap((s) => (s.faqs || []).map((f) => ({ ...f, service: s.title })));

export default function Faq() {
  return (
    <>
      <PageHero
        label="FAQ"
        title="Les questions qu’on nous pose."
        intro="Budget, délais, zone d’intervention, déroulement du chantier. Si votre question n’y est pas, écrivez-nous."
        breadcrumb={[{ label: 'Accueil', to: '/' }, { label: 'FAQ' }]}
      />

      <Section tone="cream" className="pt-0 md:pt-0 lg:pt-0">
        <Container>
          <FaqAccordion items={FAQS} />

          {serviceFaqs.length > 0 && (
            <div className="mt-20">
              <SectionHeading label="Par service" title="Questions plus précises." />
              <FaqAccordion
                className="mt-12"
                items={serviceFaqs.map((f) => ({ q: `${f.service} — ${f.q}`, a: f.a }))}
              />
            </div>
          )}
        </Container>
      </Section>

      <CTASection
        title="Une question sur votre projet ?"
        text="Téléphone, WhatsApp ou e-mail : on répond à la même question aussi bien à l’oral."
        source="faq"
      />
    </>
  );
}
