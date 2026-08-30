import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { BRAND, EMAIL_DISPLAY, LOGO, whatsappUrl } from '@/data/site';
import { useContactDialog } from '@/lib/contactDialog';
import { EVENTS, track } from '@/lib/analytics';
import { GroupLabel, Row } from '@/components/layout/ContactList';
import {
  FacebookIcon,
  GalleryIcon,
  InstagramIcon,
  MailIcon,
  PhoneIcon,
  PinIcon,
  QuoteIcon,
  TiktokIcon,
  WhatsappIcon,
  YoutubeIcon,
} from '@/components/ui/BrandIcons';

/**
 * Fenêtre de contact - toutes les coordonnées de Chaudrel, la même carte que
 * la page « Tous nos liens ».
 *
 * Elle reprend exactement les rangées de la page `/liens` (logo, projet,
 * réalisations, réseaux) pour qu'une fiche de contact dise la même chose
 * partout. Le fond se fige et se voile : `overflow: hidden` sur le corps au
 * moment où elle s'ouvre, flou derrière le panneau. Fermeture par Échap et par
 * le fond, tabulation piégée dans le panneau.
 */
const SOCIALS = [
  { key: 'instagram', label: 'Instagram', icon: InstagramIcon },
  { key: 'tiktok', label: 'TikTok', icon: TiktokIcon },
  { key: 'facebook', label: 'Facebook', icon: FacebookIcon },
  { key: 'youtube', label: 'YouTube', icon: YoutubeIcon },
];

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
      // Piège à tabulation : la fenêtre est modale, le focus n'en sort pas.
      const focusables = panel.querySelectorAll(
        'a[href], button:not([disabled])'
      );
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

  /* Une rangée interne : ferme la fenêtre et trace le geste. */
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
        {/* En-tête : le même logotype que la carte de liens, puis un bouton pour
            fermer. */}
        <div className="flex items-center justify-between gap-6 px-6 pb-2 pt-6 sm:px-8 sm:pt-8">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 flex-none place-items-center overflow-hidden rounded-logo bg-shell shadow-soft ring-1 ring-ink/[0.06]">
              <img src={LOGO} alt="" aria-hidden="true" width="44" height="44" className="h-full w-full object-cover" />
            </span>
            <div>
              <h2 id="contact-dialog-title" className="font-wordmark text-[17px] uppercase leading-none tracking-[0.2em] text-ink">
                {BRAND.name}
              </h2>
              <p className="t-small mt-1 text-ink/55">{BRAND.zoneLong}</p>
            </div>
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

        {/* Corps : les mêmes rangées que la page /liens, dans le même ordre. */}
        <div className="overflow-y-auto px-6 pb-6 pt-2 sm:px-8 sm:pb-8">
          <GroupLabel>Votre projet</GroupLabel>
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
              href={whatsappUrl()}
              icon={WhatsappIcon}
              label="WhatsApp"
              hint="Écrivez-nous, photos bienvenues"
              onClick={t(EVENTS.WHATSAPP_CLICK)}
            />
            <Row
              href={`tel:${BRAND.phones[0].tel}`}
              icon={PhoneIcon}
              label={`Appeler ${BRAND.phones[0].name}`}
              hint={BRAND.phones[0].number}
              onClick={t(EVENTS.PHONE_CLICK)}
            />
            <Row
              href={`mailto:${BRAND.email}`}
              icon={MailIcon}
              label="Nous écrire"
              hint={EMAIL_DISPLAY}
              onClick={t(EVENTS.EMAIL_CLICK)}
            />
          </div>

          <GroupLabel>Le travail</GroupLabel>
          <div className="space-y-2.5">
            <Row
              to="/realisations"
              icon={GalleryIcon}
              label="Nos réalisations"
              hint="Chantiers livrés, photos réelles"
              onClick={closeDialog}
            />
            <Row
              to="/services"
              icon={PinIcon}
              label="Nos métiers"
              hint="Intérieur, extérieur, toiture, façade, piscine"
              onClick={closeDialog}
            />
          </div>

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
                    className="grid h-[3.25rem] w-[3.25rem] place-items-center rounded-md border border-ink/[0.09] bg-shell text-ink/70 transition-all duration-fast ease-soft hover:border-ink/20 hover:text-ink hover:shadow-soft active:translate-y-px"
                  >
                    <Icon width="19" height="19" />
                  </a>
                </li>
              ) : null
            )}
          </ul>

          <div className="mt-9 border-t border-ink/10 pt-5 text-center">
            <address className="t-small not-italic text-ink/65">
              {BRAND.address.street}, {BRAND.address.postalCode} {BRAND.address.city}
            </address>
            <Link
              to="/"
              onClick={() => closeDialog()}
              className="link-line t-label mt-2 inline-flex min-h-[44px] items-center px-2 text-ink"
            >
              Voir le site
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}