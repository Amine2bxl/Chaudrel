import { Link } from 'react-router-dom';
import { Instagram, Facebook, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import { BRAND, LOGO, NAV, whatsappUrl } from '@/data/site';
import { SERVICES } from '@/data/services';
import { EVENTS, track } from '@/lib/analytics';

const SOCIALS = [
  { key: 'instagram', label: 'Instagram', icon: Instagram },
  { key: 'facebook', label: 'Facebook', icon: Facebook },
  { key: 'youtube', label: 'YouTube', icon: Youtube },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-brand-dark pb-24 pt-16 text-white lg:pb-16 lg:pt-24">
      <div className="mx-auto w-full max-w-[1360px] px-5 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3">
              <img src={LOGO} alt="" aria-hidden="true" width="40" height="40" className="h-10 w-10 rounded-full object-cover" />
              <span className="font-display text-lg uppercase tracking-[0.18em]">{BRAND.name}</span>
            </div>
            <p className="mt-5 max-w-xs text-[14px] font-light leading-relaxed text-white/45">
              {BRAND.tagline} Entreprise de rénovation à Bruxelles et en périphérie depuis {BRAND.founded}.
            </p>
            <div className="mt-6 flex gap-3">
              {SOCIALS.map(({ key, label, icon: Icon }) => (
                <a
                  key={key}
                  href={BRAND.socials[key]}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  onClick={() => track(EVENTS.SOCIAL_CLICK, { network: key })}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/60 transition-colors hover:border-brand-gold hover:text-brand-goldLight"
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          <nav aria-label="Pages" className="text-[14px]">
            <h2 className="eyebrow text-brand-goldLight">Navigation</h2>
            <ul className="space-y-3 text-white/55">
              <li>
                <Link to="/" className="transition-colors hover:text-white">
                  Accueil
                </Link>
              </li>
              {NAV.map((n) => (
                <li key={n.to}>
                  <Link to={n.to} className="transition-colors hover:text-white">
                    {n.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/devis" className="transition-colors hover:text-white">
                  Demander un devis
                </Link>
              </li>
            </ul>
          </nav>

          <nav aria-label="Services" className="text-[14px]">
            <h2 className="eyebrow text-brand-goldLight">Services</h2>
            <ul className="space-y-3 text-white/55">
              {SERVICES.slice(0, 6).map((s) => (
                <li key={s.slug}>
                  <Link to={`/services/${s.slug}`} className="transition-colors hover:text-white">
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="text-[14px]">
            <h2 className="eyebrow text-brand-goldLight">Contact</h2>
            <ul className="space-y-3 text-white/55">
              {BRAND.phones.map((p) => (
                <li key={p.tel}>
                  <a
                    href={`tel:${p.tel}`}
                    onClick={() => track(EVENTS.PHONE_CLICK, { source: 'footer', name: p.name })}
                    className="flex items-center gap-2 transition-colors hover:text-white"
                  >
                    <Phone className="h-4 w-4 text-brand-gold" aria-hidden="true" />
                    {p.number}
                    <span className="text-white/30">· {p.name}</span>
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={`mailto:${BRAND.email}`}
                  onClick={() => track(EVENTS.EMAIL_CLICK, { source: 'footer' })}
                  className="flex items-center gap-2 transition-colors hover:text-white"
                >
                  <Mail className="h-4 w-4 text-brand-gold" aria-hidden="true" />
                  {BRAND.email}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-gold" aria-hidden="true" />
                <address className="not-italic">
                  {BRAND.address.street}
                  <br />
                  {BRAND.address.postalCode} {BRAND.address.city}
                </address>
              </li>
              <li>
                <a
                  href={whatsappUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => track(EVENTS.WHATSAPP_CLICK, { source: 'footer' })}
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-[12px] transition-colors hover:border-brand-gold hover:text-white"
                >
                  Nous écrire sur WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-8 text-[12px] text-white/35 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {BRAND.legalName} — TVA {BRAND.vat}
          </p>
          <a href="/legal/politique-mentions" className="transition-colors hover:text-white/70">
            Mentions légales & confidentialité
          </a>
        </div>
      </div>
    </footer>
  );
}
