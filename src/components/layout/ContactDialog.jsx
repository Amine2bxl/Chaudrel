import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { BRAND, EMAIL_DISPLAY, whatsappUrl } from '@/data/site';
import { useContactDialog } from '@/lib/contactDialog';
import { EVENTS, track } from '@/lib/analytics';
import { Row } from '@/components/layout/ContactList';
import {
  FacebookIcon,
  InstagramIcon,
  MailIcon,
  PhoneIcon,
  QuoteIcon,
  TiktokIcon,
  WhatsappIcon,
  YoutubeIcon,
} from '@/components/ui/BrandIcons';

/**
 * Fenêtre de contact - tout tient à l'écran, rien ne se plie.
 *
 * Une carte de visite : un titre, les trois gestes (devis, WhatsApp, appel),
 * les coordonnées en bloc compact, les réseaux. Aucun défilement à
 * l'intérieur - tout est visible d'un coup d'œil. Le fond se fige et se voile
 * à l'ouverture ; fermeture par Échap, par le fond, ou par une action.
 */
const SOCIALS = [
  { key: 'instagram', label: 'Instagram', icon: InstagramIcon },
  { key: 'tiktok', label: 'TikTok', icon: TiktokIcon },
  { key: 'facebook', label: 'Facebook', icon: FacebookIcon },
  { key: 'youtube', label: 'YouTube', icon: YoutubeIcon },
];

/** Une ligne de coordonnées : intitulé discret, valeur cliquable. */
function Coord({ label, children }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="t-label flex-none text-ink/45">{label}</dt>
      <dd className="t-small text-right text-ink/80">{children}</dd>
    </div>
  );
}

export default function ContactDialog() {
  const { open, source, closeDialog } = useContactDialog();
  const panelRef = useRef(null);
  const restoreRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    restoreRef.current = document.activeElement;
    const { body } = document;
    const prevOverflow = body.style.overflow;
    body.style.overflow = 'hidden';

    const panel = panelRef.current;
    panel?.focus();

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeDialog();
        return;
      }
      if (e.key !== 'Tab' || !panel) return;
      const focusables = panel.querySelectorAll('a[href], button:not([disabled])');
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      body.style.overflow = prevOverflow;
      restoreRef.current?.focus?.();
    };
  }, [open, closeDialog]);

  if (!open) return null;

  const t = (event) => () => {
    closeDialog();
    track(event, { source: `dialog:${source}` });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Fermer"
        onClick={closeDialog}
        className="absolute inset-0 cursor-default bg-bark/60 backdrop-blur-sm"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-dialog-title"
        tabIndex={-1}
        className="panel-in relative w-full max-w-sm overflow-hidden rounded-2xl bg-cream shadow-lift outline-none"
      >
        {/* En-tête : un titre, une croix. Rien d'autre. */}
        <div className="flex items-center justify-between gap-4 px-5 pb-2 pt-5">
          <h2 id="contact-dialog-title" className="t-h2 text-[1.4rem]">
            Nous joindre
          </h2>
          <button
            type="button"
            onClick={closeDialog}
            aria-label="Fermer"
            className="-mr-1 grid h-10 w-10 flex-none place-items-center rounded-full text-ink/60 transition-colors duration-fast hover:bg-ink/5 hover:text-ink"
          >
            <svg width="13" height="13" viewBox="0 0 14 14" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M1 1l12 12M13 1L1 13" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Les trois gestes : décider, écrire, parler. */}
        <div className="space-y-2 px-5">
          <Row
            to="/devis"
            icon={QuoteIcon}
            label="Devis gratuit"
            hint={`Sans engagement - ${BRAND.promises.responseTime}`}
            onClick={t(EVENTS.QUOTE_CTA)}
            primary
            compact
          />
          <Row
            href={whatsappUrl()}
            icon={WhatsappIcon}
            label="WhatsApp"
            hint="Réponse rapide, photos bienvenues"
            onClick={t(EVENTS.WHATSAPP_CLICK)}
            compact
          />
          <Row
            href={`tel:${BRAND.phones[0].tel}`}
            icon={PhoneIcon}
            label={`Appeler ${BRAND.phones[0].name}`}
            hint={BRAND.phones[0].number}
            onClick={t(EVENTS.PHONE_CLICK)}
            compact
          />
        </div>

        {/* Coordonnées, en bloc compact. */}
        <dl className="mt-4 space-y-2.5 border-t border-ink/10 px-5 py-4">
          <Coord label="Téléphones">
            <span className="space-x-2">
              {BRAND.phones.map((p) => (
                <a key={p.tel} href={`tel:${p.tel}`} onClick={t(EVENTS.PHONE_CLICK)} className="link-line tabular-nums text-ink">
                  {p.number}
                </a>
              ))}
            </span>
          </Coord>
          <Coord label="E-mail">
            <a href={`mailto:${BRAND.email}`} onClick={t(EVENTS.EMAIL_CLICK)} className="link-line break-all text-ink">
              {EMAIL_DISPLAY}
            </a>
          </Coord>
          <Coord label="Horaires">
            <span className="inline-block text-left">
              {BRAND.hours.map((h) => (
                <span key={h.days} className="block tabular-nums">
                  {h.days} · {h.time}
                </span>
              ))}
            </span>
          </Coord>
          <Coord label="Adresse">
            <address className="not-italic text-ink/80">
              {BRAND.address.postalCode} {BRAND.address.city}
              <br />
              <span className="text-ink/55">{BRAND.zoneLong}</span>
            </address>
          </Coord>
        </dl>

        {/* Réseaux + site. */}
        <div className="border-t border-ink/10 px-5 py-3">
          <div className="flex items-center justify-between">
            <span className="t-label text-ink/45">Nous suivre</span>
            <ul className="flex items-center gap-1.5">
              {SOCIALS.map(({ key, label, icon: Icon }) =>
                BRAND.socials[key] ? (
                  <li key={key}>
                    <a
                      href={BRAND.socials[key]}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      onClick={t(EVENTS.SOCIAL_CLICK, { network: key })}
                      className="grid h-9 w-9 place-items-center rounded-full text-ink/60 transition-all duration-fast ease-soft hover:bg-ink/5 hover:text-gold"
                    >
                      <Icon width="17" height="17" />
                    </a>
                  </li>
                ) : null
              )}
            </ul>
            <Link to="/" onClick={() => closeDialog()} className="link-line t-label inline-flex items-center gap-1 pb-0.5 text-ink">
              Voir le site
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}