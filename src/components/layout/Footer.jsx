import { Link } from 'react-router-dom';
import { BRAND, EMAIL_DISPLAY, NAV, whatsappUrl } from '@/data/site';
import { SERVICES } from '@/data/services';
import { EVENTS, track } from '@/lib/analytics';
import { useContactDialog } from '@/lib/contactDialog';
import SocialLinks from '@/components/layout/SocialLinks';
import { Wordmark } from '@/components/layout/Navbar';
import { Button, Container, DarkPanel } from '@/components/ui';

function Column({ title, children }) {
  return (
    <div>
      <p className="t-label text-gold">{title}</p>
      <ul className="mt-5 space-y-3 text-[14px]">{children}</ul>
    </div>
  );
}

const linkClass = 'link-line text-ivory/75 transition-colors duration-fast hover:text-ivory';

/**
 * Pied de page : un panneau graphite détaché du bord, comme les grands blocs
 * de la page. Présentation, quatre colonnes, le mot-symbole en filigrane,
 * puis la ligne légale.
 */
export default function Footer() {
  const { openDialog } = useContactDialog();
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer px-2 pb-2 sm:px-3 sm:pb-3">
      <DarkPanel className="overflow-hidden">
        <Container className="pt-16 sm:pt-20">
          <div className="grid gap-10 border-b border-ivory/10 pb-12 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-6">
              <Wordmark tone="light" />
              <p className="mt-6 max-w-[44ch] text-[14px] leading-relaxed text-ivory/65">
                Entreprise de rénovation fondée en {BRAND.founded}, basée à {BRAND.address.city}. Rénovation complète,
                façade, toiture, finitions et extérieurs, partout en Belgique.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 lg:col-span-6 lg:justify-end">
              <Button
                to="/devis"
                variant="gold"
                arrow
                onClick={() => track(EVENTS.QUOTE_CTA, { source: 'footer' })}
              >
                Demander un devis
              </Button>
              <Button variant="outlineLight" onClick={() => openDialog('footer')}>
                Nous contacter
              </Button>
            </div>
          </div>

          <div className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-12">
            <div className="lg:col-span-3">
              <Column title="Le site">
                <li>
                  <Link to="/" className={linkClass}>
                    Accueil
                  </Link>
                </li>
                {NAV.map((n) => (
                  <li key={n.to}>
                    <Link to={n.to} className={linkClass}>
                      {n.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link to="/faq" className={linkClass}>
                    Questions fréquentes
                  </Link>
                </li>
                <li>
                  <Link to="/devis" className={linkClass}>
                    Devis gratuit
                  </Link>
                </li>
              </Column>
            </div>

            <div className="lg:col-span-3">
              <Column title="Métiers">
                {SERVICES.map((s) => (
                  <li key={s.slug}>
                    <Link to={`/services/${s.slug}`} className={linkClass}>
                      {s.title}
                    </Link>
                  </li>
                ))}
              </Column>
            </div>

            <div className="lg:col-span-3">
              <Column title="Nous joindre">
                {BRAND.phones.map((p) => (
                  <li key={p.tel}>
                    <a
                      href={`tel:${p.tel}`}
                      onClick={() => track(EVENTS.PHONE_CLICK, { source: 'footer', who: p.name })}
                      className={linkClass}
                    >
                      <span className="text-ivory/45">{p.name} · </span>
                      {p.number}
                    </a>
                  </li>
                ))}
                <li>
                  <a
                    href={whatsappUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => track(EVENTS.WHATSAPP_CLICK, { source: 'footer' })}
                    className={linkClass}
                  >
                    WhatsApp
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:${BRAND.email}`}
                    onClick={() => track(EVENTS.EMAIL_CLICK, { source: 'footer' })}
                    className={linkClass}
                  >
                    {EMAIL_DISPLAY}
                  </a>
                </li>
              </Column>
            </div>

            <div className="lg:col-span-3">
              <Column title="Adresse">
                <li className="text-ivory/75">
                  <address className="not-italic leading-relaxed">
                    {BRAND.address.street}
                    <br />
                    {BRAND.address.postalCode} {BRAND.address.city}
                  </address>
                </li>
                <li className="text-ivory/55">TVA {BRAND.vat}</li>
                <li className="text-ivory/55">Intervention : {BRAND.zone.toLowerCase()}</li>
              </Column>
              <div className="mt-8">
                <SocialLinks tone="light" source="footer" size="sm" />
              </div>
            </div>
          </div>
        </Container>

        {/* Mot-symbole décoratif : dessiné par le CSS (`::before`), il n'est
            pas du texte - ni pour un lecteur d'écran, ni pour un audit de contraste. */}
        <div aria-hidden="true" data-word="Chaudrel" className="footer-wordmark -mb-[0.12em] text-center" />

        <Container className="flex flex-col gap-3 border-t border-ivory/10 py-6 text-[12.5px] text-ivory/55 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {BRAND.legalName}
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            <li>
              <Link to="/legal/politique-mentions" className={linkClass}>
                Mentions légales et confidentialité
              </Link>
            </li>
            <li>
              <Link to="/liens" className={linkClass}>
                Tous nos liens
              </Link>
            </li>
          </ul>
        </Container>
      </DarkPanel>
    </footer>
  );
}
