import { Link } from 'react-router-dom';
import { BRAND, LOGO } from '@/data/site';
import { useContactDialog } from '@/lib/contactDialog';
import SocialLinks from '@/components/layout/SocialLinks';

/**
 * Pied de page - une ligne, rien de plus.
 *
 * Il ne répète ni la navigation (présente en haut de chaque écran), ni les
 * coordonnées (dans la fenêtre de contact), ni le devis (le bloc de conversion
 * juste au-dessus ne parle que de ça). Un pied de page qui redit tout est un
 * deuxième site posé sous le premier.
 *
 * Il reste donc : qui édite, où trouver les liens, et les réseaux - renvoyés
 * ici depuis l'ancien rail latéral (supprimé) : le pied de page et la fenêtre
 * de contact sont les seuls endroits où on les cherche sans qu'ils pèsent sur
 * la navigation.
 *
 * pb mobile = hauteur de la barre d'action fixe, sinon elle recouvre la
 * dernière ligne.
 */
export default function Footer() {
  const year = new Date().getFullYear();
  const { openDialog } = useContactDialog();

  const link = 'link-line tap t-small text-cream/60 transition-colors duration-fast hover:text-cream';

  return (
    <footer className="border-t border-cream/10 bg-bark text-cream">
      <div className="mx-auto w-full max-w-page px-5 pb-[calc(66px+1rem)] pt-5 sm:px-8 lg:px-12 lg:pb-6 lg:pt-6">
        <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-4">
          <Link to="/" className="flex flex-none items-center gap-2.5" aria-label="Chaudrel - accueil">
            <span className="grid h-7 w-7 flex-none place-items-center overflow-hidden rounded-[0.5rem] bg-cream/10">
              <img src={LOGO} alt="" aria-hidden="true" width="28" height="28" className="h-full w-full object-cover" />
            </span>
            <span className="font-wordmark text-[15px] uppercase leading-none tracking-[0.2em]">{BRAND.name}</span>
          </Link>

          <nav className="flex flex-wrap items-center gap-x-6 gap-y-2" aria-label="Pied de page">
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

          <p className="t-small flex-none text-cream/35">
            © {year} {BRAND.legalName}
          </p>
        </div>

        {/* Réseaux - depuis le rail latéral, que le pied de page et la fenêtre
            de contact remplacent : une seule ligne, en fin de page. */}
        <div className="mt-5 flex items-center justify-between gap-4 border-t border-cream/10 pt-5">
          <span className="t-small text-cream/40">Suivez les chantiers en cours</span>
          <SocialLinks tone="light" source="footer" />
        </div>
      </div>
    </footer>
  );
}