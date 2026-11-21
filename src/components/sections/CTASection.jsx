import { Button, Container, Panel, Scene } from '@/components/ui';
import Reveal from '@/lib/reveal';
import { useContactDialog } from '@/lib/contactDialog';
import { EVENTS, track } from '@/lib/analytics';

/**
 * Fin de page, la même partout : une plaque de verre posée sur une photo de
 * chantier, un titre, deux boutons de verre (le devis en bronze, « Nous
 * appeler » qui ouvre la fenêtre de contact).
 */
export default function CTASection({ source = 'cta' }) {
  const { openDialog } = useContactDialog();

  return (
    <Scene data-page-cta image="/photos/maison-brique.webp" veil="bg-[#110F0D]/70">
      <Container>
        <Reveal>
          <Panel
            glass
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
    </Scene>
  );
}
