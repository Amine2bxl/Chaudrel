import { useEffect } from 'react';
import { Phone, Mail, Menu } from 'lucide-react';
import { BRAND, LOGO } from '@/lib/content';
import { useMenu } from '@/lib/menu-context';

/**
 * MobileBar — barre de navigation affichée UNIQUEMENT sur mobile et tablette.
 * Cachée sur PC (lg:hidden).
 *
 * Layout symétrique (gauche → droite) :
 *  - Bloc gauche : Logo + nom de marque (équilibré)
 *  - Bloc droit : Appeler | Email | Menu (3 actions identiques en taille)
 *
 * Verrouille le scroll du body quand le menu est ouvert.
 */
export default function MobileBar() {
  const { open, setOpen } = useMenu();

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [open]);

  return (
    <div
      className="lg:hidden fixed top-0 left-0 right-0 z-[55] bg-white border-b border-brand-gold/15 shadow-sm"
      role="toolbar"
      aria-label="Actions rapides"
    >
      <div className="max-w-screen-sm mx-auto px-4 flex items-center justify-between gap-3 h-14">
        <a
          href="#top"
          aria-label={`${BRAND.name} ${BRAND.tagline} — retour en haut`}
          className="flex items-center gap-2.5 group min-w-0"
        >
          <div className="h-10 w-10 rounded-xl bg-white p-0.5 ring-1 ring-brand-gold/30 flex items-center justify-center flex-shrink-0">
            <img src={LOGO} alt="Chaudrel Rénovation - logo" className="h-full w-full object-contain" />
          </div>
          <span className="flex flex-col leading-none min-w-0">
            <span className="font-display text-[15px] tracking-[0.1em] font-semibold text-brand-ink truncate">
              {BRAND.name.toUpperCase()}
            </span>
            <span className="text-[8px] tracking-[0.2em] uppercase text-brand-gold font-medium mt-0.5 truncate">
              Navigation mobile
            </span>
          </span>
        </a>

        <div className="flex items-center gap-2 flex-shrink-0">
          <a
            href={`tel:${BRAND.phones[1].tel}`}
            aria-label={`Appeler ${BRAND.phones[1].name}`}
            className="h-10 w-10 flex items-center justify-center rounded-full bg-brand-gold text-white shadow-md shadow-brand-gold/25 active:scale-95 transition-transform"
          >
            <Phone className="w-4 h-4" aria-hidden="true" />
          </a>
          <a
            href={`mailto:${BRAND.email}`}
            aria-label="Envoyer un email"
            className="h-10 w-10 flex items-center justify-center rounded-full bg-brand-cream text-brand-ink border border-brand-gold/30 active:scale-95 transition-transform"
          >
            <Mail className="w-4 h-4 text-brand-gold" aria-hidden="true" />
          </a>
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={open}
            aria-controls="main-mobile-menu"
            className="h-10 w-10 flex items-center justify-center rounded-full bg-brand-ink text-white active:scale-95 transition-transform"
          >
            <Menu className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
