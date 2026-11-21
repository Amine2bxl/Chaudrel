import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { EASE } from '@/lib/motion';
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
 * La carte de la page de liens, en fenêtre : un titre, les gestes (devis,
 * WhatsApp, les deux lignes, l'e-mail), les réseaux. Sans description sous
 * les libellés : tout tient à l'écran d'un coup d'œil. Le fond se fige et se voile
 * à l'ouverture ; fermeture par Échap, par le fond, ou par une action.
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

  const t = (event) => () => {
    closeDialog();
    track(event, { source: `dialog:${source}` });
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <motion.button
            type="button"
            aria-label="Fermer"
            onClick={closeDialog}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="absolute inset-0 cursor-default bg-bark/55 backdrop-blur-md"
          />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-dialog-title"
            tabIndex={-1}
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 6, transition: { duration: 0.18, ease: EASE } }}
            transition={{ duration: 0.38, ease: EASE }}
            className="glass-light relative max-h-[calc(100svh-2rem)] w-full max-w-sm overflow-y-auto rounded-[28px] outline-none"
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
                className="-mr-1 grid h-10 w-10 flex-none place-items-center rounded-full text-ink/70 transition-colors duration-fast hover:bg-ink/5 hover:text-ink"
              >
                <svg width="13" height="13" viewBox="0 0 14 14" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M1 1l12 12M13 1L1 13" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* Les gestes, sans détail : le libellé suffit. */}
            <div className="space-y-2 px-5 pb-5">
              <Row to="/devis" icon={QuoteIcon} label="Devis gratuit" onClick={t(EVENTS.QUOTE_CTA)} primary compact />
              <Row href={whatsappUrl()} icon={WhatsappIcon} label="WhatsApp" onClick={t(EVENTS.WHATSAPP_CLICK)} compact />
              {BRAND.phones.map((p) => (
                <Row
                  key={p.tel}
                  href={`tel:${p.tel}`}
                  icon={PhoneIcon}
                  label={`Appeler ${p.name}`}
                  hint={p.number}
                  onClick={t(EVENTS.PHONE_CLICK)}
                  compact
                />
              ))}
              <Row
                href={`mailto:${BRAND.email}`}
                icon={MailIcon}
                label="Nous écrire"
                hint={EMAIL_DISPLAY}
                onClick={t(EVENTS.EMAIL_CLICK)}
                compact
              />
            </div>

            {/* Les réseaux, en barre d'icônes comme sur /liens. */}
            <ul className="flex justify-center gap-2.5 border-t border-ink/10 px-5 py-4">
              {SOCIALS.map(({ key, label, icon: Icon }) =>
                BRAND.socials[key] ? (
                  <li key={key}>
                    <a
                      href={BRAND.socials[key]}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      onClick={t(EVENTS.SOCIAL_CLICK)}
                      className="grid h-11 w-11 place-items-center rounded-md border border-ink/[0.09] bg-shell text-ink/70 transition-all duration-fast ease-soft hover:border-ink/20 hover:text-ink active:translate-y-px"
                    >
                      <Icon width="18" height="18" />
                    </a>
                  </li>
                ) : null
              )}
            </ul>
      </motion.div>
    </div>
      )}
    </AnimatePresence>
  );
}