import { Link } from 'react-router-dom';
import { BRAND, EMAIL_DISPLAY, NAV } from '@/data/site';
import { useContactDialog } from '@/lib/contactDialog';
import { EVENTS, track } from '@/lib/analytics';
import SocialLinks from '@/components/layout/SocialLinks';
import Reveal from '@/lib/reveal';

/**
 * Pied de page - le logo en grand, puis trois colonnes courtes : où aller,
 * qui appeler, où nous suivre. Les coordonnées y figurent en clair : c'est là
 * qu'on les cherche, et c'est la même adresse que celle de la fiche Google
 * (nom, adresse, téléphone identiques partout pour le référencement local).
 *
 * pb mobile = hauteur de la barre d'action fixe, sinon elle recouvre la
 * dernière ligne.
 */
export default function Footer() {
  const year = new Date().getFullYear();
  const { openDialog } = useContactDialog();
  const { address } = BRAND;

  const link = 'link-line text-cream/70 transition-colors duration-200 hover:text-cream';
  const heading = 't-label text-gold-light';

  return (
    <footer className="on-dark relative overflow-hidden bg-bark text-cream">
      <div className="mx-auto w-full max-w-page px-5 pb-[calc(80px+1.5rem)] pt-20 sm:px-8 lg:px-12 lg:pb-10 lg:pt-28">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
          <Reveal className="lg:col-span-5">
            <Link to="/" aria-label="Chaudrel Rénovation - accueil" className="block w-fit">
              <img src="/logo-cream.svg" alt="" width="1056" height="660" className="h-auto w-[220px] sm:w-[260px]" />
            </Link>
            <p className="t-body mt-8 max-w-[34ch] text-cream/70">
              Façades, toitures, châssis et rénovations complètes. Depuis Schaerbeek, dans toute la Belgique.
            </p>
          </Reveal>

          <Reveal delay={80} className="lg:col-span-2">
            <h2 className={heading}>Le site</h2>
            <ul className="t-small mt-6 space-y-3">
              {NAV.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className={link}>
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/methode" className={link}>
                  Notre méthode
                </Link>
              </li>
              <li>
                <Link to="/devis" className={link}>
                  Devis gratuit
                </Link>
              </li>
            </ul>
          </Reveal>

          <Reveal delay={140} className="lg:col-span-3">
            <h2 className={heading}>Nous joindre</h2>
            <ul className="t-small mt-6 space-y-3">
              {BRAND.phones.map((p) => (
                <li key={p.tel} className="flex items-baseline gap-3">
                  <span className="w-16 flex-none text-cream/50">{p.name}</span>
                  <a
                    href={`tel:${p.tel}`}
                    onClick={() => track(EVENTS.PHONE_CLICK, { source: 'footer' })}
                    className={`${link} tabular-nums`}
                  >
                    {p.number}
                  </a>
                </li>
              ))}
              <li className="flex items-baseline gap-3">
                <span className="w-16 flex-none text-cream/50">E-mail</span>
                <a href={`mailto:${BRAND.email}`} className={link}>
                  {EMAIL_DISPLAY}
                </a>
              </li>
              <li className="flex items-baseline gap-3">
                <span className="w-16 flex-none text-cream/50">Siège</span>
                <address className="not-italic text-cream/70">
                  {address.street}
                  <br />
                  {address.postalCode} {address.city}
                </address>
              </li>
            </ul>
          </Reveal>

          <Reveal delay={200} className="lg:col-span-2">
            <h2 className={heading}>Les chantiers</h2>
            <p className="t-small mt-6 text-cream/60">En cours, en photos et en vidéo.</p>
            <div className="mt-5">
              <SocialLinks tone="light" source="footer" />
            </div>
          </Reveal>
        </div>

        <div className="t-small mt-20 flex flex-col gap-4 border-t border-cream/10 pt-6 text-cream/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {BRAND.legalName} · TVA {BRAND.vat}
          </p>
          <nav className="flex flex-wrap gap-x-6 gap-y-2" aria-label="Pied de page">
            <button type="button" onClick={() => openDialog('footer')} className={link}>
              Nous joindre
            </button>
            <Link to="/liens" className={link}>
              Tous nos liens
            </Link>
            <Link to="/legal/politique-mentions" className={link}>
              Mentions légales
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
