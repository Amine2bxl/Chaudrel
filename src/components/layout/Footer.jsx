import { Link } from 'react-router-dom';
import { BRAND, LOGO, NAV, whatsappUrl } from '@/data/site';
import { SERVICES } from '@/data/services';
import { EVENTS, track } from '@/lib/analytics';

const SOCIALS = [
  { key: 'instagram', label: 'Instagram' },
  { key: 'facebook', label: 'Facebook' },
  { key: 'youtube', label: 'YouTube' },
  { key: 'tiktok', label: 'TikTok' },
];

function Column({ title, children }) {
  return (
    <div>
      <h2 className="t-label text-paper/65">{title}</h2>
      <ul className="mt-6 space-y-3">{children}</ul>
    </div>
  );
}

function Item({ to, href, children, onClick, external }) {
  const className = 'link-line t-small text-paper/65 transition-colors hover:text-paper';
  return (
    <li>
      {to ? (
        <Link to={to} className={className}>
          {children}
        </Link>
      ) : (
        <a
          href={href}
          onClick={onClick}
          {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          className={className}
        >
          {children}
        </a>
      )}
    </li>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-carbon pb-24 pt-20 text-paper lg:pb-14 lg:pt-28">
      <div className="mx-auto w-full max-w-page px-5 sm:px-8 lg:px-12">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <Link to="/" className="flex items-center gap-3" aria-label="Chaudrel — accueil">
              <img src={LOGO} alt="" aria-hidden="true" width="36" height="36" className="h-9 w-9 object-contain" />
              <span className="font-display text-[17px] uppercase tracking-[0.22em]">{BRAND.name}</span>
            </Link>
            <p className="t-small measure mt-6 text-paper/65">
              Entreprise de rénovation fondée en {BRAND.founded} à Bruxelles. Nous intervenons partout en Belgique.
            </p>
          </div>

          <nav className="lg:col-span-2" aria-label="Pages">
            <Column title="Navigation">
              <Item to="/">Accueil</Item>
              {NAV.map((n) => (
                <Item key={n.to} to={n.to}>
                  {n.label}
                </Item>
              ))}
              <Item to="/faq">FAQ</Item>
            </Column>
          </nav>

          <nav className="lg:col-span-2" aria-label="Services">
            <Column title="Services">
              {SERVICES.slice(0, 6).map((s) => (
                <Item key={s.slug} to={`/services/${s.slug}`}>
                  {s.title}
                </Item>
              ))}
            </Column>
          </nav>

          <div className="lg:col-span-2">
            <Column title="Contact">
              {BRAND.phones.map((p) => (
                <Item
                  key={p.tel}
                  href={`tel:${p.tel}`}
                  onClick={() => track(EVENTS.PHONE_CLICK, { source: 'footer', name: p.name })}
                >
                  {p.number}
                </Item>
              ))}
              <Item href={`mailto:${BRAND.email}`} onClick={() => track(EVENTS.EMAIL_CLICK, { source: 'footer' })}>
                {BRAND.email}
              </Item>
              <Item href={whatsappUrl()} external onClick={() => track(EVENTS.WHATSAPP_CLICK, { source: 'footer' })}>
                WhatsApp
              </Item>
              <li className="t-small pt-2 text-paper/65">
                <address className="not-italic">
                  {BRAND.address.street}
                  <br />
                  {BRAND.address.postalCode} {BRAND.address.city}
                </address>
              </li>
            </Column>
          </div>

          <div className="lg:col-span-2">
            <Column title="Suivre">
              {SOCIALS.map((s) => (
                <Item
                  key={s.key}
                  href={BRAND.socials[s.key]}
                  external
                  onClick={() => track(EVENTS.SOCIAL_CLICK, { network: s.key })}
                >
                  {s.label}
                </Item>
              ))}
            </Column>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-paper/12 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="t-small text-paper/65">
            © {year} {BRAND.legalName} — TVA {BRAND.vat}
          </p>
          <div className="flex gap-6">
            <Link to="/legal/politique-mentions" className="link-line t-small text-paper/65 hover:text-paper">
              Mentions légales
            </Link>
            <Link to="/legal/politique-mentions" className="link-line t-small text-paper/65 hover:text-paper">
              Confidentialité
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
