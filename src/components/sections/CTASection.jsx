import { Button, Container } from '@/components/ui';
import Reveal from '@/lib/reveal';
import { BRAND } from '@/data/site';
import { useContactDialog } from '@/lib/contactDialog';
import { EVENTS, track } from '@/lib/analytics';

/** Bloc de conversion en fin de page. Une phrase, deux actions, les numéros. */
export default function CTASection({
  title = 'Un projet en tête ?',
  text = 'Répondez à cinq questions. Nous organisons une visite et vous remettons un devis détaillé, gratuitement.',
  source = 'cta',
}) {
  const { openDialog } = useContactDialog();

  return (
    <section className="border-t border-cream/10 bg-bark py-section text-cream">
      <Container>
        <div className="lg:grid lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-7">
            <h2 className="t-h1">{title}</h2>
            <p className="t-body measure mt-6 text-cream/60">{text}</p>
          </Reveal>

          <Reveal delay={120} className="mt-10 lg:col-span-5 lg:mt-0 lg:self-end">
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
              <Button
                to="/devis"
                variant="solidLight"
                size="lg"
                arrow
                onClick={() => track(EVENTS.QUOTE_CTA, { source })}
              >
                Demander un devis
              </Button>
              {/* Un seul appel secondaire : la fenêtre porte tous les canaux
                  plutôt que d'en imposer un. */}
              <Button variant="outlineLight" size="lg" onClick={() => openDialog(source)}>
                Nous joindre
              </Button>
            </div>

            <ul className="mt-8 space-y-2 border-t border-cream/15 pt-6">
              {BRAND.phones.map((p) => (
                <li key={p.tel}>
                  <a
                    href={`tel:${p.tel}`}
                    onClick={() => track(EVENTS.PHONE_CLICK, { source })}
                    className="link-line t-small text-cream/60 transition-colors hover:text-cream"
                  >
                    {p.number} — {p.name}
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
