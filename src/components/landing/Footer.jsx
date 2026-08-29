import { Instagram, Facebook, Youtube } from 'lucide-react';
import { BRAND, LOGO } from '@/lib/content';

// TikTok : icône inline (pas dans lucide-react)
function TikTokIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.3 6.3 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.75a4.85 4.85 0 01-1.01-.06z" />
    </svg>
  );
}

const SERVICES = ['Cuisine', 'Salle de Bain', 'Jardin & Extérieur', 'Toiture', 'Piscine', 'Rénovation Complète'];
const COMPANY_LINKS = [
  { label: 'Découvrir notre histoire', href: '#story' },
  { label: 'Toutes nos réalisations', href: '#portfolio' },
  { label: 'Lire les avis', href: '#testimonials' },
  { label: 'Questions fréquentes', href: '#faq' },
  { label: 'Nous contacter', href: '#contact' },
];
const SOCIALS = [
  { href: BRAND.socials.instagram, Icon: Instagram, label: 'Instagram' },
  { href: BRAND.socials.facebook, Icon: Facebook, label: 'Facebook' },
  { href: BRAND.socials.youtube, Icon: Youtube, label: 'YouTube' },
  { href: BRAND.socials.tiktok, Icon: TikTokIcon, label: 'TikTok' },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#0D0D0D] text-white/40">
      <div className="h-px bg-gradient-to-r from-transparent via-brand-gold/30 to-transparent" aria-hidden="true" />

      <div className="max-w-7xl mx-auto px-5 lg:px-10 py-10 md:py-14 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 mb-14">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="h-14 w-14 lg:h-16 lg:w-16 rounded-2xl overflow-hidden flex-shrink-0 border border-brand-gold/40 bg-white p-1 flex items-center justify-center">
                <img src={LOGO} alt={`${BRAND.name} ${BRAND.tagline}`} className="h-full w-full object-contain" width="64" height="64" />
              </div>
              <div>
                <p className="font-display text-xl lg:text-2xl font-semibold text-white tracking-wide leading-none">
                  {BRAND.name.toUpperCase()}
                </p>
                <p className="text-[9px] tracking-[0.22em] uppercase text-brand-gold font-medium mt-1">
                  {BRAND.tagline}
                </p>
              </div>
            </div>
            <p className="text-[13px] font-light leading-relaxed max-w-xs">
              La passion de rénover, le plaisir d'habiter. Rénovation haut de gamme à Bruxelles.
            </p>
            <div className="flex gap-3 mt-6">
              {SOCIALS.map(({ href, Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 flex items-center justify-center rounded-2xl bg-white/6 hover:bg-brand-gold/20 hover:text-brand-gold border border-white/8 transition-all duration-300"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[10px] tracking-[0.2em] uppercase text-brand-gold font-semibold mb-5">Services</p>
            <ul className="space-y-2.5">
              {SERVICES.map((s) => (
                <li key={s}>
                  <a href="#services" className="text-[13px] font-light hover:text-brand-gold transition-colors duration-200">
                    {s}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[10px] tracking-[0.2em] uppercase text-brand-gold font-semibold mb-5">Entreprise</p>
            <ul className="space-y-2.5">
              {COMPANY_LINKS.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="text-[13px] font-light hover:text-brand-gold transition-colors duration-200">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[10px] tracking-[0.2em] uppercase text-brand-gold font-semibold mb-5">Contact</p>
            <div className="space-y-2.5 text-[13px] font-light">
              <a href={`mailto:${BRAND.email}`} className="block hover:text-brand-gold transition-colors duration-200">
                {BRAND.email}
              </a>
              {BRAND.phones.map((p) => (
                <a key={p.name} href={`tel:${p.tel}`} className="block hover:text-brand-gold transition-colors duration-200">
                  {p.name} — {p.number}
                </a>
              ))}
              <p>{BRAND.zone}</p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[11px] tracking-wide">© {year} {BRAND.name} Rénovation. Tous droits réservés.</p>
          <div className="flex gap-5">
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent('chaudrel:open-legal'))}
              className="text-[11px] tracking-wide hover:text-brand-gold transition-colors duration-200 cursor-pointer"
            >
              Politiques &amp; Mentions légales
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}