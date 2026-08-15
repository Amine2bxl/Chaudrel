import PageHero from '@/components/sections/PageHero';
import FaqAccordion from '@/components/sections/FaqAccordion';
import CtaBand from '@/components/sections/CtaBand';
import { Container, Section } from '@/components/ui';
import { FAQS } from '@/data/faqs';
import { SERVICES } from '@/data/services';

const serviceFaqs = SERVICES.flatMap((s) => (s.faqs || []).map((f) => ({ ...f, service: s.title })));

export default function Faq() {
  return (
    <>
      <PageHero
        eyebrow="FAQ"
        title="Questions fréquentes"
        intro="Budget, délais, zone d'intervention, déroulement du chantier : les réponses aux questions que l'on nous pose le plus souvent."
        breadcrumb={[{ label: 'Accueil', to: '/' }, { label: 'FAQ' }]}
      />

      <Section tone="cream">
        <Container className="max-w-3xl">
          <FaqAccordion items={FAQS} />

          {serviceFaqs.length > 0 && (
            <>
              <h2 className="h-display mt-16 text-[1.75rem] text-brand-ink sm:text-3xl">Questions par service</h2>
              <div className="mt-8">
                <FaqAccordion items={serviceFaqs.map((f) => ({ q: `${f.service} — ${f.q}`, a: f.a }))} />
              </div>
            </>
          )}
        </Container>
      </Section>

      <CtaBand
        title="Une question sur votre projet ?"
        text="Posez-la nous directement : nous répondons par téléphone, WhatsApp ou e-mail."
        source="faq"
      />
    </>
  );
}
