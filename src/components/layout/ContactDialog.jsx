import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { BRAND, EMAIL_DISPLAY, whatsappUrl } from '@/data/site';
import { useContactDialog } from '@/lib/contactDialog';
import { EVENTS, track } from '@/lib/analytics';
import { GroupLabel, Row } from '@/components/layout/ContactList';
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
 * Fenêtre de contact - les coordonnées, rangées dans la langue de la page
 * « Tous nos liens ».
 *
 * La structure de la fiche est conservée (parler, coordonnées, réseaux) mais
 * chaque ligne reprend les rangées de la carte de liens : pastille, intitulé,
 * description, chevron. Le fond se fige et se voile à l'ouverture ; la
 * fenêtre se ferme par Échap, par le fond, ou par une action interne.
 */
const SOCIALS = [
  { key: 'instagram', label: 'Instagram', icon: InstagramIcon },
  { key: 'tiktok', label: 'TikTok', icon: TiktokIcon },
  { key: 'facebook', label: 'Facebook', icon: FacebookIcon },
  { key: 'youtube', label: 'YouTube', icon: YoutubeIcon },
];

function Detail({ label, children }) {
  return (
    <div className="grid grid-cols-[6.5rem_1fr] items-baseline gap-4 border-t border-ink/10 py-3 first:border-t-0 first:pt-0">
      <dt className="t-label text-ink/55">{label}</dt>
      <dd className="t-small text-ink/80">{children}</dd>
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
    <div className="fixed inset-0 z-[60] flex items-end justify-center p-3 sm:items-center sm:p-6">
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
        className="panel-in relative flex max-h-[92svh] w-full max-w-md flex-col overflow-hidden rounded-2xl bg-cream shadow-lift outline-none"
      >
        <div className="flex items-start justify-between gap-6 px-6 pb-2 pt-7 sm:px-8 sm:pt-8">
          <div>
            <h2 id="contact-dialog-title" className="t-h2 text-[1.625rem] sm:text-[1.75rem]">
              Nous joindre
            </h2>
            <p className="t-small mt-2 text-ink/60">
              {BRAND.promises.responseTime}. Pour un chiffrage, passez par la{' '}
              <Link to="/devis" onClick={() => closeDialog()} className="link-line text-ink">
                demande de devis
              </Link>
              .
            </p>
          </div>
          <button
            type="button"
            onClick={closeDialog}
            aria-label="Fermer"
            className="-mr-2 grid h-10 w-10 flex-none place-items-center rounded-full text-ink/60 transition-colors duration-fast hover:bg-ink/5 hover:text-ink"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M1 1l12 12M13 1L1 13" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto px-6 pb-6 pt-2 sm:px-8 sm:pb-8">
          {/* Les trois gestes immédiats, dans l'ordre : décider, parler, écrire. */}
          <div className="space-y-2.5">
            <Row
              to="/devis"
              icon={QuoteIcon}
              label="Devis gratuit"
              hint={`Sans engagement - ${BRAND.promises.responseTime}`}
              onClick={t(EVENTS.QUOTE_CTA)}
              primary
            />
            <Row
              href={`tel:${BRAND.phones[0].tel}`}
              icon={PhoneIcon}
              label="Appeler"
              hint={BRAND.phones[0].number}
              onClick={t(EVENTS.PHONE_CLICK)}
            />
            <Row
              href={whatsappUrl()}
              icon={WhatsappIcon}
              label="WhatsApp"
              hint="Écrivez-nous, photos bienvenues"
              onClick={t(EVENTS.WHATSAPP_CLICK)}
            />
          </div>

          <GroupLabel>Coordonnées</GroupLabel>
          <dl>
            <Detail label="Téléphones">
              <ul className="space-y-1">
                {BRAND.phones.map((p) => (
                  <li key={p.tel} className="flex items-baseline justify-between gap-4">
                    <a href={`tel:${p.tel}`} onClick={t(EVENTS.PHONE_CLICK)} className="link-line tabular-nums text-ink">
                      {p.number}
                    </a>
                    <span className="t-label text-ink/45">{p.name}</span>
                  </li>
                ))}
              </ul>
            </Detail>
            <Detail label="E-mail">
              <a href={`mailto:${BRAND.email}`} onClick={t(EVENTS.EMAIL_CLICK)} className="link-line break-all text-ink">
                {EMAIL_DISPLAY}
              </a>
            </Detail>
            <Detail label="Horaires">
              <ul className="space-y-1">
                {BRAND.hours.map((h) => (
                  <li key={h.days} className="flex items-baseline justify-between gap-4">
                    <span className="text-ink/70">{h.days}</span>
                    <span className="tabular-nums text-ink">{h.time}</span>
                  </li>
                ))}
              </ul>
            </Detail>
            <Detail label="Adresse">
              <address className="not-italic text-ink/70">
                {BRAND.address.street}, {BRAND.address.postalCode} {BRAND.address.city}
                <br />
                {BRAND.zoneLong}.
              </address>
            </Detail>
          </dl>

          <GroupLabel>Nous suivre</GroupLabel>
          <ul className="flex flex-wrap justify-center gap-2.5">
            {SOCIALS.map(({ key, label, icon: Icon }) =>
              BRAND.socials[key] ? (
                <li key={key}>
                  <a
                    href={BRAND.socials[key]}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    onClick={t(EVENTS.SOCIAL_CLICK, { network: key })}
                    className="grid h-11 w-11 place-items-center rounded-full border border-ink/10 text-ink/70 transition-all duration-fast ease-soft hover:border-gold/40 hover:text-gold"
                  >
                    <Icon width="18" height="18" />
                  </a>
                </li>
              ) : null
            )}
          </ul>

          <div className="mt-9 border-t border-ink/10 pt-5 text-center">
            <Link to="/" onClick={() => closeDialog()} className="link-line t-label inline-flex min-h-[44px] items-center px-2 text-ink">
              Voir le site
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}