import { MessageCircle, Phone } from 'lucide-react';
import { Button, Container } from '@/components/ui';
import Reveal from '@/lib/reveal';
import { BRAND, whatsappUrl } from '@/data/site';
import { EVENTS, track } from '@/lib/analytics';

/** Bandeau de conversion — présent en fin de chaque page. */
export default function CtaBand({
  title = 'Parlons de votre projet',
  text = "Décrivez-nous votre projet en quelques minutes. Nous revenons vers vous pour organiser une visite et établir un devis clair et détaillé.",
  source = 'cta_band',
}) {
  return (
    <section className="bg-brand-dark py-16 text-white md:py-24">
      <Container>
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="eyebrow text-brand-goldLight">Demander un devis</p>
          <h2 className="h-display text-[2rem] sm:text-4xl lg:text-5xl">{title}</h2>
          <p className="mx-auto mt-5 max-w-xl text-[15px] font-light leading-[1.85] text-white/55">{text}</p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button to="/devis" variant="gold" size="lg" onClick={() => track(EVENTS.QUOTE_CTA, { source })}>
              Demander un devis
            </Button>
            <Button
              href={whatsappUrl()}
              variant="ghostLight"
              size="lg"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track(EVENTS.WHATSAPP_CLICK, { source })}
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              WhatsApp
            </Button>
          </div>

          <p className="mt-7 text-[13px] text-white/40">
            ou appelez-nous —{' '}
            {BRAND.phones.map((p, i) => (
              <span key={p.tel}>
                {i > 0 && ' · '}
                <a
                  href={`tel:${p.tel}`}
                  onClick={() => track(EVENTS.PHONE_CLICK, { source })}
                  className="text-white/70 transition-colors hover:text-brand-goldLight"
                >
                  <Phone className="mr-1 inline h-3.5 w-3.5" aria-hidden="true" />
                  {p.number}
                </a>
              </span>
            ))}
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
