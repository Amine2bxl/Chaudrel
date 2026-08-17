import { Link } from 'react-router-dom';
import { BRAND, LOGO, NAV } from '@/data/site';
import { useContactDialog } from '@/lib/contactDialog';
import { EVENTS, track } from '@/lib/analytics';

/**
 * Pied de page — un filet, une ligne.
 *
 * Il portait cinq colonnes et une trentaine de liens : un deuxième site posé
 * sous le premier. Tout ce qu'il répétait existe ailleurs et mieux — la
 * navigation est en haut de chaque écran, les coordonnées sont dans la fenêtre
 * de contact. Il ne reste que ce qu'un pied de page doit porter : qui édite le
 * site, où aller, et les mentions légales.
 *
 * pb mobile = hauteur de la barre d'action fixe, sinon elle recouvre la
 * dernière ligne.
 */
export default function Footer() {
  const year = new Date().getFullYear();
  const { openDialog } = useContactDialog();

  const link = 'link-line t-small text-cream/55 transition-colors duration-fast hover:text-cream';

  return (
    <footer className="border-t border-cream/10 bg-bark text-cream">
      <div className="mx-auto flex w-full max-w-page items-center justify-between gap-6 px-5 pb-[calc(66px+1rem)] pt-4 sm:px-8 lg:gap-8 lg:px-12 lg:pb-6 lg:pt-6">
        <Link to="/" className="flex flex-none items-center gap-2.5" aria-label="Chaudrel — accueil">
          <span className="grid h-7 w-7 flex-none place-items-center overflow-hidden rounded-[0.5rem] bg-cream/10">
            <img src={LOGO} alt="" aria-hidden="true" width="28" height="28" className="h-full w-full object-cover" />
          </span>
          <span className="font-wordmark text-[15px] uppercase leading-none tracking-[0.2em]">{BRAND.name}</span>
        </Link>

        {/* Sur mobile, ces liens répètent mot pour mot le menu déjà ouvert
            depuis la barre du haut, et la barre d'action porte déjà le devis et
            le contact. Le pied de page n'y garde que la signature. */}
        <nav className="hidden flex-wrap items-center gap-x-6 gap-y-2 lg:flex" aria-label="Pied de page">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} className={link}>
              {n.label}
            </Link>
          ))}
          <Link to="/a-propos" className={link}>
            À propos
          </Link>
          <Link to="/faq" className={link}>
            FAQ
          </Link>
          <button type="button" onClick={() => openDialog('footer')} className={link}>
            Nous joindre
          </button>
          <Link
            to="/devis"
            onClick={() => track(EVENTS.QUOTE_CTA, { source: 'footer' })}
            className="link-line t-small text-cream"
          >
            Demander un devis
          </Link>
        </nav>

        <p className="t-small flex-none text-right text-cream/40">
          <span className="hidden sm:inline">
            © {year} {BRAND.legalName} ·{' '}
          </span>
          <Link to="/legal/politique-mentions" className="link-line text-cream/55 transition-colors hover:text-cream">
            Mentions légales
          </Link>
        </p>
      </div>
    </footer>
  );
}
