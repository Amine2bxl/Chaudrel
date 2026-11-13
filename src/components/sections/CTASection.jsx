import { BRAND, EMAIL_DISPLAY, whatsappUrl } from '@/data/site';
import { EVENTS, track } from '@/lib/analytics';
import { useContactDialog } from '@/lib/contactDialog';
import Reveal from '@/lib/reveal';
import { Button, Container, DarkPanel, Eyebrow } from '@/components/ui';

/**
 * Appel final - le dernier panneau graphite avant le pied de page.
 * `data-page-cta` : la barre mobile s'efface quand ce bloc est à l'écran.
 */
export default function CTASection({
  label = 'Votre projet',
  title = (
    <>
      Parlons de <em>votre chantier.</em>
    </>
  ),
  text = 'Décrivez votre projet en quelques minutes. Nous revenons vers vous pour convenir d’une visite sur place, avant tout chiffrage.',
  source = 'cta_band',
}) {
  const { openDialog } = useContactDialog();
  return (
    <div className="px-2 pb-2 pt-section sm:px-3 sm:pb-3" data-cta-band>
      <DarkPanel as="section" aria-label="Demander un devis" className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 h-[28rem] w-[28rem] rounded-full border border-gold/15"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-8 -top-8 h-[20rem] w-[20rem] rounded-full border border-gold/10"
        />
        <Container className="relative grid gap-12 py-section lg:grid-cols-12 lg:items-end">
          <Reveal className="lg:col-span-7">
            <Eyebrow tone="light">{label}</Eyebrow>
            <h2 className="t-hero mt-6 max-w-[16ch] text-balance text-ivory">{title}</h2>
            <p className="t-lead mt-6 max-w-[46ch] text-ivory/65">{text}</p>
            <div className="mt-10 flex flex-wrap gap-3" data-page-cta>
              <Button to="/devis" variant="gold" size="lg" arrow onClick={() => track(EVENTS.QUOTE_CTA, { source })}>
                Demander un devis
              </Button>
              <Button variant="outlineLight" size="lg" onClick={() => openDialog(source)}>
                Nous contacter
              </Button>
            </div>
          </Reveal>

          <Reveal delay={120} className="lg:col-span-4 lg:col-start-9">
            <dl className="divide-y divide-ivory/10 border-y border-ivory/10 text-[14px]">
              {BRAND.phones.map((p) => (
                <div key={p.tel} className="flex items-center justify-between gap-4 py-4">
                  <dt className="text-ivory/55">{p.name}</dt>
                  <dd>
                    <a
                      href={`tel:${p.tel}`}
                      onClick={() => track(EVENTS.PHONE_CLICK, { source, who: p.name })}
                      className="link-line text-ivory"
                    >
                      {p.number}
                    </a>
                  </dd>
                </div>
              ))}
              <div className="flex items-center justify-between gap-4 py-4">
                <dt className="text-ivory/55">WhatsApp</dt>
                <dd>
                  <a
                    href={whatsappUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => track(EVENTS.WHATSAPP_CLICK, { source })}
                    className="link-line text-ivory"
                  >
                    Écrire un message
                  </a>
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4 py-4">
                <dt className="text-ivory/55">E-mail</dt>
                <dd>
                  <a
                    href={`mailto:${BRAND.email}`}
                    onClick={() => track(EVENTS.EMAIL_CLICK, { source })}
                    className="link-line text-ivory"
                  >
                    {EMAIL_DISPLAY}
                  </a>
                </dd>
              </div>
            </dl>
            <p className="mt-5 text-[12.5px] text-ivory/55">
              {BRAND.promises.quote} · {BRAND.promises.responseTime}
            </p>
          </Reveal>
        </Container>
      </DarkPanel>
    </div>
  );
}
