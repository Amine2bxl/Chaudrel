import { useEffect, useRef } from 'react';
import { BRAND, EMAIL_DISPLAY, whatsappUrl } from '@/data/site';
import { useContactDialog } from '@/lib/contactDialog';
import { EVENTS, track } from '@/lib/analytics';
import { cn } from '@/lib/utils';

/* Une ligne de la fenêtre : intitulé discret, valeur cliquable en grand. */
function Row({ label, children }) {
  return (
    <div className="border-t border-cream/[0.09] py-4 first:border-t-0 first:pt-0">
      <p className="t-label text-cream/50">{label}</p>
      <div className="mt-2">{children}</div>
    </div>
  );
}

const linkClass = 'link-line font-display text-[1.375rem] leading-none tracking-[-0.01em] text-cream';

/**
 * Fenêtre de contact — toutes les coordonnées de Chaudrel, au même endroit.
 *
 * Elle s'ouvre depuis n'importe quel appel à contact : barre de navigation,
 * menu mobile, barre d'action, pied de page. Le devis, lui, a sa propre page :
 * cette fenêtre sert à joindre quelqu'un, pas à décrire un chantier.
 *
 * Accessibilité : `role="dialog"` + `aria-modal`, fermeture par Échap et par
 * le fond, focus déplacé sur le panneau à l'ouverture puis rendu au bouton
 * d'origine, tabulation piégée dans le panneau.
 */
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
        className="panel-in relative w-full max-w-md rounded-xl bg-ground p-6 shadow-lift outline-none sm:p-8"
      >
        <div className="flex items-start justify-between gap-6">
          <div>
            <h2 id="contact-dialog-title" className="t-h2 text-[1.625rem] sm:text-[1.875rem]">
              Nous joindre
            </h2>
            <p className="t-small mt-2 text-cream/60">
              {BRAND.promises.responseTime}. Pour un chiffrage, passez plutôt par{' '}
              <a href="/devis" className="link-line text-cream">
                la demande de devis
              </a>
              .
            </p>
          </div>
          <button
            type="button"
            onClick={closeDialog}
            aria-label="Fermer"
            className="-mr-1 -mt-1 grid h-10 w-10 flex-none place-items-center rounded-full text-cream/60 transition-colors duration-fast hover:bg-cream/5 hover:text-cream"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M1 1l12 12M13 1L1 13" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Deux actions d'abord, le détail ensuite : la plupart des visiteurs
            veulent appeler ou écrire, pas lire une fiche. */}
        <div className="mt-6 grid gap-2.5 sm:grid-cols-2">
          <a
            href={`tel:${BRAND.phones[0].tel}`}
            onClick={() => track(EVENTS.PHONE_CLICK, { source: `dialog:${source}` })}
            className="t-label inline-flex items-center justify-center gap-2.5 rounded-full bg-cream px-5 py-4 text-ground shadow-soft transition-all duration-fast ease-soft hover:bg-shell hover:shadow-lift active:translate-y-px"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path
                d="M5.2 2.5 6.6 5.4 5.1 6.9a8 8 0 0 0 4 4l1.5-1.5 2.9 1.4v2.3c0 .6-.5 1-1.1.9A12.6 12.6 0 0 1 2 3.6c-.1-.6.3-1.1.9-1.1h2.3Z"
                strokeLinejoin="round"
              />
            </svg>
            Appeler
          </a>
          <a
            href={whatsappUrl()}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track(EVENTS.WHATSAPP_CLICK, { source: `dialog:${source}` })}
            className="t-label inline-flex items-center justify-center gap-2.5 rounded-full border border-cream/15 bg-surface px-5 py-4 text-cream transition-all duration-fast ease-soft hover:border-cream/30 hover:shadow-soft active:translate-y-px"
          >
            <svg width="15" height="15" viewBox="0 0 16 16" aria-hidden="true" fill="currentColor">
              <path d="M8 0a8 8 0 0 0-6.9 12L0 16l4.1-1.1A8 8 0 1 0 8 0Zm0 14.6a6.6 6.6 0 0 1-3.4-.9l-.2-.2-2.5.7.7-2.4-.2-.3A6.6 6.6 0 1 1 8 14.6Zm3.6-4.9c-.2-.1-1.2-.6-1.3-.6-.2-.1-.3-.1-.4.1l-.6.7c-.1.1-.2.1-.4 0a5.4 5.4 0 0 1-2.6-2.3c-.2-.3.2-.3.5-1 0-.1 0-.2 0-.3l-.6-1.3c-.1-.4-.3-.3-.4-.3h-.4a.7.7 0 0 0-.5.3c-.2.2-.7.7-.7 1.7s.7 2 .8 2.1a7.6 7.6 0 0 0 3 2.6c1.1.4 1.5.5 2 .4.4 0 1.2-.5 1.3-.9.2-.5.2-.9.1-1 0-.1-.1-.1-.3-.2Z" />
            </svg>
            WhatsApp
          </a>
        </div>

        <div className="mt-7">
          <Row label="Téléphones">
            <ul className="space-y-2.5">
              {BRAND.phones.map((p) => (
                <li key={p.tel} className="flex items-baseline justify-between gap-4">
                  <a
                    href={`tel:${p.tel}`}
                    onClick={() => track(EVENTS.PHONE_CLICK, { source: `dialog:${source}` })}
                    className={cn(linkClass, 'tabular-nums')}
                  >
                    {p.number}
                  </a>
                  <span className="t-small text-cream/50">{p.name}</span>
                </li>
              ))}
            </ul>
          </Row>

          <Row label="Par e-mail">
            <a
              href={`mailto:${BRAND.email}`}
              onClick={() => track(EVENTS.EMAIL_CLICK, { source: `dialog:${source}` })}
              className={cn(linkClass, 'break-all')}
            >
              {EMAIL_DISPLAY}
            </a>
          </Row>

          <Row label="Horaires">
            {/* TODO_VALIDATION : horaires provisoires, à confirmer par Chaudrel. */}
            <ul className="space-y-1.5">
              {BRAND.hours.map((h) => (
                <li key={h.days} className="t-small flex items-baseline justify-between gap-6">
                  <span className="text-cream/70">{h.days}</span>
                  <span className="tabular-nums text-cream">{h.time}</span>
                </li>
              ))}
            </ul>
          </Row>

          <Row label="Adresse">
            <address className="t-small not-italic text-cream/70">
              {BRAND.address.street}
              <br />
              {BRAND.address.postalCode} {BRAND.address.city}
            </address>
            <p className="t-small mt-2 text-cream/50">{BRAND.zoneLong}.</p>
          </Row>
        </div>
      </div>
    </div>
  );
}
