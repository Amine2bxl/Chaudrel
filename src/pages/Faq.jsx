import PageHero from '@/components/sections/PageHero';
import FaqAccordion from '@/components/sections/FaqAccordion';
import CTASection from '@/components/sections/CTASection';
import { Button, Container, Section } from '@/components/ui';
import { BRAND } from '@/data/site';
import { FAQS } from '@/data/faqs';
import { SERVICES } from '@/data/services';
import { useContactDialog } from '@/lib/contactDialog';

const serviceFaqs = SERVICES.flatMap((s) => (s.faqs ?? []).map((f) => ({ ...f, tag: s.title })));

/**
 * FAQ - compacte : la question à droite, et à gauche le titre de la rubrique
 * qui reste en place, avec l'invitation à poser la question directement.
 */
export default function Faq() {
  const { openDialog } = useContactDialog();
  return (
    <>
      <PageHero
        title="Les questions qu’on nous pose."
        intro="Budget, délais, zone, déroulement du chantier. La réponse ne suffit pas ? Posez-nous la question."
        breadcrumb={[{ label: 'Accueil', to: '/' }, { label: 'FAQ' }]}
      />

      <Section className="pt-0">
        <Container className="space-y-section">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <div className="lg:sticky lg:top-[calc(var(--header-h)+2rem)]">
                <h2 className="t-h2">En général</h2>
                <p className="t-small mt-4 max-w-[34ch] text-ink/70">
                  Une question qui n’est pas ici ? Nous répondons {BRAND.promises.responseTime.toLowerCase()}.
                </p>
                <div className="mt-6">
                  <Button variant="outline" size="sm" arrow onClick={() => openDialog('faq')}>
                    Nous écrire directement
                  </Button>
                </div>
              </div>
            </div>
            <FaqAccordion items={FAQS} className="lg:col-span-8" />
          </div>

          {serviceFaqs.length > 0 && (
            <div className="grid gap-10 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <h2 className="t-h2">Par métier</h2>
                <p className="t-small mt-4 max-w-[34ch] text-ink/70">
                  Les précisions qui ne valent que pour un type de travaux.
                </p>
              </div>
              <FaqAccordion items={serviceFaqs} className="lg:col-span-8" />
            </div>
          )}
        </Container>
      </Section>

      <CTASection
        title={
          <>
            Une question sur <em>votre projet ?</em>
          </>
        }
        text="Téléphone, WhatsApp ou e-mail : nous répondons aussi bien à l’oral."
        source="faq"
      />
    </>
  );
}
