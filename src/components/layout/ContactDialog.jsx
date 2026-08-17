import { useEffect, useRef } from 'react';
import { BRAND, whatsappUrl } from '@/data/site';
import { useContactDialog } from '@/lib/contactDialog';
import { EVENTS, track } from '@/lib/analytics';
import { cn } from '@/lib/utils';

/* Une ligne de la fenêtre : intitulé discret, valeur cliquable en grand. */
function Row({ label, children }) {
  return (
    <div className="border-t border-ink/[0.09] py-4 first:border-t-0 first:pt-0">
      <p className="t-label text-ink/50">{label}</p>
      <div className="mt-2">{children}</div>
    </div>
  );
}

const linkClass = 'link-line font-display text-[1.375rem] leading-none tracking-[-0.01em] text-ink';

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
        className="panel-in relative w-full max-w-md rounded-xl bg-cream p-6 shadow-lift outline-none sm:p-8"
      >
        <div className="flex items-start justify-between gap-6">
          <div>
            <h2 id="contact-dialog-title" className="t-h2 text-[1.625rem] sm:text-[1.875rem]">
              Nous joindre
            </h2>
            <p className="t-small mt-2 text-ink/60">
              {BRAND.promises.responseTime}. Pour un chiffrage, passez plutôt par{' '}
              <a href="/devis" className="link-line text-ink">
                la demande de devis
              </a>
              .
            </p>
          </div>
          <button
            type="button"
            onClick={closeDialog}
            aria-label="Fermer"
            className="-mr-1 -mt-1 grid h-10 w-10 flex-none place-items-center rounded-full text-ink/60 transition-colors duration-fast hover:bg-ink/5 hover:text-ink"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M1 1l12 12M13 1L1 13" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="mt-7">
          <Row label="Par téléphone">
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
                  <span className="t-small text-ink/50">{p.name}</span>
                </li>
              ))}
            </ul>
          </Row>

          <Row label="WhatsApp">
            <a
              href={whatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track(EVENTS.WHATSAPP_CLICK, { source: `dialog:${source}` })}
              className={linkClass}
            >
              Écrire sur WhatsApp
            </a>
          </Row>

          <Row label="Par e-mail">
            <a
              href={`mailto:${BRAND.email}`}
              onClick={() => track(EVENTS.EMAIL_CLICK, { source: `dialog:${source}` })}
              className={cn(linkClass, 'break-all')}
            >
              {BRAND.email}
            </a>
          </Row>

          <Row label="Horaires">
            {/* TODO_VALIDATION : horaires provisoires, à confirmer par Chaudrel. */}
            <ul className="space-y-1.5">
              {BRAND.hours.map((h) => (
                <li key={h.days} className="t-small flex items-baseline justify-between gap-6">
                  <span className="text-ink/70">{h.days}</span>
                  <span className="tabular-nums text-ink">{h.time}</span>
                </li>
              ))}
            </ul>
          </Row>

          <Row label="Adresse">
            <address className="t-small not-italic text-ink/70">
              {BRAND.address.street}
              <br />
              {BRAND.address.postalCode} {BRAND.address.city}
            </address>
            <p className="t-small mt-2 text-ink/50">{BRAND.zoneLong}.</p>
          </Row>
        </div>
      </div>
    </div>
  );
}
