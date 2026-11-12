import { Button, Container } from '@/components/ui';
import Reveal from '@/lib/reveal';
import { useContactDialog } from '@/lib/contactDialog';
import { EVENTS, track } from '@/lib/analytics';
import { BRAND, EMAIL_DISPLAY } from '@/data/site';

/**
 * Bande de conversion en fin de page.
 *
 * Une composition de page de garde : un cartouche (les deux engagements
 * confirmés), un très grand titre, l'action, puis les coordonnées directes
 * alignées sous un filet. Tout ce qu'il faut pour agir tient dans l'écran :
 * chiffrer, appeler l'un ou l'autre, écrire.
 */
export default function CTASection({
  title = 'Un projet en tête ?',
  text = 'Cinq questions, deux minutes. Nous organisons une visite et vous remettons un devis détaillé, gratuitement.',
  source = 'cta',
}) {
  const { openDialog } = useContactDialog();

  return (
    <section data-page-cta className="on-dark border-t border-cream/10 bg-bark pt-section text-cream">
      <Container>
        <div className="flex items-center justify-between gap-6 border-b border-cream/15 pb-4">
          <p className="t-label text-cream/60">{BRAND.promises.quote}</p>
          <p className="t-label text-right text-cream/60">{BRAND.promises.responseTime}</p>
        </div>

        <div className="grid gap-10 py-block lg:grid-cols-12 lg:items-end lg:gap-16">
          <Reveal className="lg:col-span-7">
            <h2 className="t-display max-w-[11ch] text-balance">{title}</h2>
          </Reveal>

          <Reveal delay={120} className="lg:col-span-5">
            <p className="t-lead max-w-[44ch] text-cream/70">{text}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                to="/devis"
                variant="solidLight"
                size="lg"
                arrow
                className="w-full justify-center sm:w-auto"
                onClick={() => track(EVENTS.QUOTE_CTA, { source })}
              >
                Devis gratuit
              </Button>
              {/* Un seul appel secondaire : la fenêtre porte tous les canaux
                  plutôt que d'en imposer un. */}
              <Button variant="outlineLight" size="lg" className="w-full justify-center sm:w-auto" onClick={() => openDialog(source)}>
                Nous joindre
              </Button>
            </div>
          </Reveal>
        </div>

        {/* ---------- Coordonnées directes ---------- */}
        <dl className="grid border-t border-cream/15 sm:grid-cols-3">
          {BRAND.phones.map((p) => (
            <div key={p.tel} className="border-b border-cream/10 py-5 sm:border-b-0 sm:border-r sm:pr-6 sm:[&:not(:first-child)]:pl-6">
              <dt className="t-label text-cream/50">{p.name}</dt>
              <dd className="mt-2.5">
                <a
                  href={`tel:${p.tel}`}
                  onClick={() => track(EVENTS.PHONE_CLICK, { source })}
                  className="link-line font-display text-[1.375rem] tabular-nums leading-none text-cream"
                >
                  {p.number}
                </a>
              </dd>
            </div>
          ))}
          <div className="py-5 sm:pl-6">
            <dt className="t-label text-cream/50">E-mail</dt>
            <dd className="mt-2.5">
              <a
                href={`mailto:${BRAND.email}`}
                onClick={() => track(EVENTS.EMAIL_CLICK, { source })}
                className="link-line break-all font-display text-[1.375rem] leading-none text-cream"
              >
                {EMAIL_DISPLAY}
              </a>
            </dd>
          </div>
        </dl>
      </Container>
    </section>
  );
}
