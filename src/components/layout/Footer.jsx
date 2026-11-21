import { Link } from 'react-router-dom';
import { BRAND, EMAIL_DISPLAY, NAV } from '@/data/site';
import { useContactDialog } from '@/lib/contactDialog';
import { EVENTS, track } from '@/lib/analytics';
import SocialLinks from '@/components/layout/SocialLinks';
import { MailIcon, PhoneIcon, PinIcon } from '@/components/ui/BrandIcons';

/**
 * Pied de page compact, en trois bandes :
 *   1. le logo et la phrase de la marque | les coordonnées en clair
 *      (nom, adresse, téléphones : identiques à la fiche Google) ;
 *   2. le plan du site sur une ligne | les réseaux ;
 *   3. les mentions.
 *
 * pb mobile = hauteur de la barre d'action fixe, sinon elle recouvre la
 * dernière ligne.
 */
export default function Footer() {
  const year = new Date().getFullYear();
  const { openDialog } = useContactDialog();
  const { address } = BRAND;
  const link = 'link-line text-cream/75 transition-colors duration-200 hover:text-cream';

  return (
    <footer className="on-dark border-t border-cream/10 bg-bark text-cream">
      <div className="mx-auto w-full max-w-page px-5 pb-[calc(80px+1rem)] pt-12 sm:px-8 lg:px-12 lg:pb-8 lg:pt-14">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" aria-label="Chaudrel Rénovation - accueil" className="flex-none">
              <img src="/logo-cream.svg" alt="" width="1056" height="660" className="h-auto w-[132px]" />
            </Link>
            <p className="t-small max-w-[26ch] text-cream/70">
              Façades, toitures, châssis et rénovations complètes. Depuis Schaerbeek, dans toute la Belgique.
            </p>
          </div>

          <address className="t-small grid gap-x-10 gap-y-2 not-italic sm:grid-cols-2">
            {BRAND.phones.map((p) => (
              <a
                key={p.tel}
                href={`tel:${p.tel}`}
                onClick={() => track(EVENTS.PHONE_CLICK, { source: 'footer' })}
                className={`${link} inline-flex w-fit items-center gap-2.5 tabular-nums`}
              >
                <PhoneIcon width={15} height={15} aria-hidden="true" className="flex-none text-gold-light" />
                <span className="text-cream/55">{p.name}</span>
                {p.number}
              </a>
            ))}
            <a href={`mailto:${BRAND.email}`} className={`${link} inline-flex w-fit items-center gap-2.5`}>
              <MailIcon width={15} height={15} aria-hidden="true" className="flex-none text-gold-light" />
              {EMAIL_DISPLAY}
            </a>
            <span className="inline-flex items-center gap-2.5 text-cream/75">
              <PinIcon width={15} height={15} aria-hidden="true" className="flex-none text-gold-light" />
              {address.street}, {address.postalCode} {address.city}
            </span>
          </address>
        </div>

        <div className="mt-10 flex flex-col gap-6 border-t border-cream/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <nav aria-label="Plan du site" className="t-small flex flex-wrap gap-x-6 gap-y-2">
            {NAV.map((item) => (
              <Link key={item.to} to={item.to} className={link}>
                {item.label}
              </Link>
            ))}
            <Link to="/methode" className={link}>
              Méthode
            </Link>
            <Link to="/devis" className="link-line text-gold-light">
              Devis gratuit
            </Link>
          </nav>
          <SocialLinks tone="light" source="footer" size="sm" />
        </div>

        <div className="t-small mt-6 flex flex-col gap-3 text-cream/55 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {BRAND.legalName} · TVA {BRAND.vat}
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <button type="button" onClick={() => openDialog('footer')} className={link}>
              Nous joindre
            </button>
            <Link to="/liens" className={link}>
              Tous nos liens
            </Link>
            <Link to="/legal/politique-mentions" className={link}>
              Mentions légales
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
