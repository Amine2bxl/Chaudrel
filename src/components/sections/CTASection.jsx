import { Button, Container } from '@/components/ui';
import Reveal from '@/lib/reveal';
import usePointerGlow from '@/lib/usePointerGlow';
import { useContactDialog } from '@/lib/contactDialog';
import { EVENTS, track } from '@/lib/analytics';
import { imageAttrs, SIZES } from '@/lib/image';
import { BRAND, EMAIL_DISPLAY, whatsappUrl } from '@/data/site';
import { WhatsappIcon } from '@/components/ui/BrandIcons';
import { Mail, Phone } from 'lucide-react';

/**
 * Bloc de conversion en fin de page. À gauche, la décision : un titre, ce qui
 * se passe ensuite, le devis. À droite, la valeur immédiate : les lignes
 * directes des deux fondateurs, WhatsApp et l'e-mail, sur une carte de verre.
 * Derrière, un chantier livré qui glisse plus lentement que la page
 * (parallaxe CSS, sans JavaScript).
 */
export default function CTASection({
  title = 'Parlons de votre projet.',
  text = 'Une visite sur place, puis un devis détaillé poste par poste. Gratuit, sans engagement.',
  source = 'cta',
}) {
  const { openDialog } = useContactDialog();
  const glow = usePointerGlow();
  const row =
    'group flex items-center gap-4 rounded-2xl px-4 py-3.5 transition-[background-color,transform] duration-200 hover:bg-cream/[0.07] active:scale-[0.98]';

  return (
    <section data-page-cta className="on-dark relative isolate overflow-hidden bg-bark py-section text-cream">
      <img
        {...imageAttrs('/photos/facade-garages.webp', SIZES.full)}
        alt=""
        aria-hidden="true"
        width="1920"
        height="1080"
        loading="lazy"
        decoding="async"
        className="parallax absolute inset-0 -z-20 h-full w-full object-cover"
      />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-bark via-bark/85 to-bark/55" />

      <Container className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-7">
          <h2 className="t-h1 max-w-[14ch] text-balance">{title}</h2>
          <p className="t-lead mt-6 max-w-[46ch] text-cream/80">{text}</p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Button to="/devis" size="lg" arrow onClick={() => track(EVENTS.QUOTE_CTA, { source })}>
              Demander un devis gratuit
            </Button>
            <Button variant="outlineLight" size="lg" onClick={() => openDialog(source)}>
              Toutes nos coordonnées
            </Button>
          </div>
        </Reveal>

        <Reveal delay={120} from="left" {...glow} className="glass-dark rounded-[28px] p-3 lg:col-span-5">
          <p className="t-label px-4 pb-2 pt-4 text-gold-light">En direct, sans standard</p>
          <ul>
            {BRAND.phones.map((p) => (
              <li key={p.tel}>
                <a
                  href={`tel:${p.tel}`}
                  onClick={() => track(EVENTS.PHONE_CLICK, { source })}
                  className={row}
                >
                  <span className="grid h-11 w-11 flex-none place-items-center rounded-full bg-gold text-bark">
                    <Phone size={17} strokeWidth={1.8} aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block font-display text-[1.25rem] leading-tight">{p.name}</span>
                    <span className="t-small tabular-nums text-cream/75">{p.number}</span>
                  </span>
                </a>
              </li>
            ))}
            <li>
              <a
                href={whatsappUrl()}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track(EVENTS.WHATSAPP_CLICK, { source })}
                className={row}
              >
                <span className="grid h-11 w-11 flex-none place-items-center rounded-full bg-cream/10 text-cream">
                  <WhatsappIcon width={18} height={18} />
                </span>
                <span>
                  <span className="block font-medium">WhatsApp</span>
                  <span className="t-small text-cream/75">Photos du chantier bienvenues</span>
                </span>
              </a>
            </li>
            <li>
              <a href={`mailto:${BRAND.email}`} onClick={() => track(EVENTS.EMAIL_CLICK, { source })} className={row}>
                <span className="grid h-11 w-11 flex-none place-items-center rounded-full bg-cream/10 text-cream">
                  <Mail size={17} strokeWidth={1.8} aria-hidden="true" />
                </span>
                <span>
                  <span className="block font-medium">{EMAIL_DISPLAY}</span>
                  <span className="t-small text-cream/75">{BRAND.promises.responseTime}</span>
                </span>
              </a>
            </li>
          </ul>
        </Reveal>
      </Container>
    </section>
  );
}
