import { Button, Container } from '@/components/ui';
import Reveal from '@/lib/reveal';
import { useContactDialog } from '@/lib/contactDialog';
import { EVENTS, track } from '@/lib/analytics';

/**
 * Bande de conversion en fin de page.
 *
 * Centrée, contrairement au reste du site qui est aligné à gauche : c'est le
 * point d'arrêt de la lecture, pas un paragraphe de plus. La composition
 * symétrique fait ralentir l'œil là où il faut décider.
 */
export default function CTASection({
  title = 'Un projet en tête ?',
  text = 'Cinq questions, deux minutes. Nous organisons une visite et vous remettons un devis détaillé, gratuitement.',
  source = 'cta',
}) {
  const { openDialog } = useContactDialog();

  return (
    <section data-page-cta className="on-dark border-t border-cream/10 bg-bark py-section text-cream">
      <Container>
        <Reveal className="mx-auto max-w-3xl text-center">
          <h2 className="t-h1 mx-auto max-w-[18ch] text-balance">{title}</h2>
          <p className="t-lead mx-auto mt-6 max-w-[52ch] text-cream/60">{text}</p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              to="/devis"
              variant="solidLight"
              size="lg"
              arrow
              onClick={() => track(EVENTS.QUOTE_CTA, { source })}
            >
              Devis gratuit
            </Button>
            {/* Un seul appel secondaire : la fenêtre porte tous les canaux
                plutôt que d'en imposer un. */}
            <Button variant="outlineLight" size="lg" onClick={() => openDialog(source)}>
              Nous joindre
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
