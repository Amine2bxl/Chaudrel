import { useEffect, useState } from 'react';
import { Phone, X, Mail } from 'lucide-react';
import { BRAND, LOGO } from '@/lib/content';
import { useMenu } from '@/lib/menu-context';

const NAV_LINKS = [
  { label: 'Services', href: '#services' },
  { label: 'Réalisations', href: '#portfolio' },
  { label: 'Notre Histoire', href: '#story' },
  { label: 'Avis Clients', href: '#testimonials' },
  { label: 'FAQ', href: '#faq' },
];

// Variante des libellés pour le menu mobile — pour différencier les ancres
// (éviter anchor texts identiques entre Navbar desktop, Navbar mobile et Footer).
const MOBILE_LABELS = {
  'Services': 'Nos services',
  'Réalisations': 'Voir nos réalisations',
  'Notre Histoire': 'Lire notre histoire',
  'Avis Clients': 'Tous les avis',
  'FAQ': 'Voir la FAQ',
};

function Brand({ id = 'chaudrel-brand-desktop', variant = 'desktop' }) {
  const isMobile = variant === 'mobile';
  return (
    <a
      href="#top"
      id={id}
      className="flex items-center gap-2.5 group"
      aria-label="Chaudrel Rénovation — retour en haut"
    >
      <div
        className={`${isMobile ? 'h-9 w-9' : 'h-11 w-11'} rounded-xl bg-white p-0.5 ring-1 ring-brand-gold/30 flex items-center justify-center${isMobile ? ' flex-shrink-0' : ''}`}
      >
        <img
          src={LOGO}
          alt={`Logo ${BRAND.name} — entreprise de rénovation`}
          className="h-full w-full object-contain"
          width={isMobile ? 36 : 44}
          height={isMobile ? 36 : 44}
        />
      </div>
      <span className={`flex flex-col leading-none ${isMobile ? 'min-w-0' : ''}`}>
        <span
          className={`font-display tracking-[0.1em] font-semibold text-brand-ink ${isMobile ? 'text-base truncate' : 'text-lg lg:text-xl'}`}
        >
          {BRAND.name.toUpperCase()}
        </span>
        <span className="text-[9px] tracking-[0.2em] uppercase text-brand-gold font-medium">
          {isMobile ? 'Menu principal' : BRAND.tagline}
        </span>
      </span>
    </a>
  );
}

/** PC : CTA consultation. */
function DesktopCTA() {
  return (
    <a
      href="#contact"
      className="px-5 py-2.5 bg-brand-gold text-white text-[12px] tracking-[0.12em] uppercase font-semibold rounded-full hover:bg-[#5E4F34] transition-all duration-300 shadow-lg shadow-brand-gold/20"
    >
      Consultation gratuite
    </a>
  );
}

export default function Navbar() {
  const { open: mobileOpen, close: closeMenu } = useMenu();

  return (
    <>
      {/* PC : navbar fixe, layout 3 colonnes strictes (logo | nav centrée | CTA unique),
          pas d'espace transparent au-dessus, pas de chevauchement. */}
      <header className="hidden lg:block fixed top-0 left-0 right-0 z-50 bg-white border-b border-brand-gold/15">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-[auto_1fr_auto] items-center h-[76px] gap-8">
            {/* Gauche : Brand */}
            <div className="flex items-center justify-start">
              <Brand />
            </div>

            {/* Centre : navigation principale, centrée horizontalement */}
            <nav
              className="flex items-center justify-center gap-1"
              aria-label="Navigation principale"
            >
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="px-3.5 py-2 rounded-full text-[13px] font-medium tracking-wide transition-all duration-200 text-brand-ink/70 hover:bg-brand-gold/10 hover:text-brand-gold"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Droite : icône téléphone + CTA consultation, symétriques à droite */}
            <div className="flex items-center justify-end gap-3">
              {/* Icône téléphone : ouvre le formulaire de contact (#contact) au lieu de l'app d'appel système,
                  pour rester aligné avec le bouton "Consultation gratuite" juste à côté. Sur mobile, le clic
                  pour appeler reste pertinent (voir MobileBar), mais en haut de page PC on veut centraliser
                  toutes les demandes via le formulaire. */}
              <a
                href="#contact"
                aria-label="Accéder au formulaire de contact"
                title="Demander une consultation gratuite"
                className="h-10 w-10 flex items-center justify-center rounded-full bg-brand-cream border border-brand-gold/30 text-brand-gold hover:bg-brand-gold hover:text-white hover:border-brand-gold transition-all duration-300"
              >
                <Phone className="w-4 h-4" aria-hidden="true" />
              </a>
              <DesktopCTA />
            </div>
          </div>
        </div>
      </header>

      {/* Feuille de menu mobile/tablette — animation CSS pure (zéro framer-motion).
          Layout symétrique : header compact (logo + fermer) / grille 2 col / footer 3 boutons carrés identiques. */}
      {mobileOpen && (
        <div
          id="main-mobile-menu"
          className="lg:hidden fixed inset-0 z-[60] bg-white flex flex-col mm-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Menu principal"
        >
          {/* Header compact — pas d'espace transparent au-dessus */}
          <div className="flex items-center justify-between px-4 h-14 border-b border-gray-100 flex-shrink-0">
            <Brand variant="mobile" id="chaudrel-brand-mobile" />
            <button
              onClick={closeMenu}
              className="h-10 w-10 flex items-center justify-center rounded-full bg-brand-ink text-white active:scale-95 transition-transform flex-shrink-0"
              aria-label="Fermer le menu"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>

          {/* Liens : grille 2 colonnes symétrique */}
          <nav
            className="flex-1 overflow-y-auto px-4 py-6"
            aria-label="Navigation mobile"
          >
            <div className="grid grid-cols-2 gap-3">
              {NAV_LINKS.map((link, i) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={closeMenu}
                  style={{ animationDelay: `${i * 40}ms` }}
                  className="mm-link flex items-center justify-center text-center min-h-[64px] px-3 py-3 bg-brand-cream/40 hover:bg-brand-gold/10 border border-brand-gold/15 hover:border-brand-gold/40 rounded-3xl font-display text-base font-light text-brand-ink hover:text-brand-gold transition-all duration-200"
                >
                  {MOBILE_LABELS[link.label] || link.label}
                </a>
              ))}
              <a
                href="#contact"
                onClick={closeMenu}
                style={{ animationDelay: `${NAV_LINKS.length * 40}ms` }}
                className="mm-link col-span-2 flex items-center justify-center text-center min-h-[64px] px-3 py-3 bg-brand-gold text-white hover:bg-brand-goldLight rounded-3xl font-display text-base font-medium tracking-wide transition-all duration-200"
              >
                Contact
              </a>
            </div>
          </nav>

          {/* Footer : 3 actions rapides en grille symétrique (boutons carrés identiques) */}
          <div className="px-4 pb-6 pt-4 border-t border-gray-100 flex-shrink-0">
            <div className="grid grid-cols-3 gap-2">
              <a
                href={`tel:${BRAND.phones[1].tel}`}
                className="flex flex-col items-center justify-center gap-1.5 min-h-[72px] py-2 bg-brand-cream/40 border border-brand-gold/20 rounded-3xl hover:bg-brand-gold/10 active:scale-95 transition-all"
              >
                <Phone className="w-5 h-5 text-brand-gold" aria-hidden="true" />
                <span className="text-[10px] tracking-[0.12em] uppercase font-semibold text-brand-ink">Appeler</span>
              </a>
              <a
                href={`mailto:${BRAND.email}`}
                className="flex flex-col items-center justify-center gap-1.5 min-h-[72px] py-2 bg-brand-cream/40 border border-brand-gold/20 rounded-3xl hover:bg-brand-gold/10 active:scale-95 transition-all"
              >
                <Mail className="w-5 h-5 text-brand-gold" aria-hidden="true" />
                <span className="text-[10px] tracking-[0.12em] uppercase font-semibold text-brand-ink">Email</span>
              </a>
              <a
                href="#contact"
                onClick={closeMenu}
                className="flex flex-col items-center justify-center gap-1.5 min-h-[72px] py-2 bg-brand-gold text-white rounded-3xl hover:bg-brand-goldLight active:scale-95 transition-all"
              >
                <X className="w-5 h-5 hidden" aria-hidden="true" />
                <span className="w-5 h-5 flex items-center justify-center text-lg font-semibold leading-none" aria-hidden="true">→</span>
                <span className="text-[10px] tracking-[0.12em] uppercase font-semibold">Devis</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}