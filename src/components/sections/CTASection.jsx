import { Button, Container, Panel } from '@/components/ui';
import Reveal from '@/lib/reveal';
import { useContactDialog } from '@/lib/contactDialog';
import { EVENTS, track } from '@/lib/analytics';

/**
 * Fin de page, la même partout : une carte de verre, un titre, deux gestes.
 * Le devis en bronze, et « Nous appeler » qui ouvre la fenêtre de contact
 * (les deux lignes directes, WhatsApp, l'e-mail). Une lueur bronze derrière.
 */
export default function CTASection({ source = 'cta' }) {
  const { openDialog } = useContactDialog();

  return (
    <section data-page-cta className="relative isolate py-section">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(45%_55%_at_50%_50%,rgb(var(--c-gold-rgb)/0.16),transparent)]"
      />
      <Container>
        <Reveal>
          <Panel
            pad="p-7 sm:p-10 lg:px-14 lg:py-12"
            className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between"
          >
            <h2 className="t-h2 max-w-[14ch] text-balance">Parlons de votre projet.</h2>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button to="/devis" size="lg" arrow onClick={() => track(EVENTS.QUOTE_CTA, { source })}>
                Demander un devis gratuit
              </Button>
              <Button variant="outline" size="lg" onClick={() => openDialog(source)}>
                Nous appeler
              </Button>
            </div>
          </Panel>
        </Reveal>
      </Container>
    </section>
  );
}
