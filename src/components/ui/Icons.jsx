/**
 * Icônes Chaudrel - dessinées pour la marque, pas tirées d'une bibliothèque.
 *
 * Grille 24 px, trait 1,6 en `currentColor`, extrémités arrondies : le même
 * dessin que BrandIcons. Signature : la porte du logo (un trapèze entrouvert)
 * sert de porte à chaque bâtiment. Décoratives par défaut (`aria-hidden`) ;
 * le texte voisin porte le sens.
 */
const make = (body) =>
  function Icon({ size = 22, className, ...props }) {
    return (
      <svg
        viewBox="0 0 24 24"
        width={size}
        height={size}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        focusable="false"
        className={className}
        {...props}
      >
        {body}
      </svg>
    );
  };

/* La porte du logo à l'échelle d'une icône : bord gauche court, bord droit long. */
const Door = ({ x = 10.5, y = 20.5 }) => <path d={`M${x} ${y}v-4.6l3-1.4v6`} />;

/** Maison - rénovation complète, « chez vous ». */
export const HouseIcon = make(
  <>
    <path d="M3.5 10.8 12 4l8.5 6.8" />
    <path d="M5.5 9.3v11.2h13V9.3" />
    <Door />
  </>
);

/** Toiture - versant, tuiles, cheminée. */
export const RoofIcon = make(
  <>
    <path d="M2.5 14 12 6l9.5 8" />
    <path d="M5.5 11.5v9h13v-9" />
    <path d="M8.5 14.5h7M7 17.5h10" />
    <path d="M16 8.4V4.5h2.2v5.7" />
  </>
);

/** Façade - pignon, fenêtres, porte. */
export const FacadeIcon = make(
  <>
    <path d="M4.5 20.5V6.5L12 3l7.5 3.5v14" />
    <path d="M8 9.5h2M14 9.5h2M8 13h2M14 13h2" />
    <Door />
  </>
);

/** Châssis - dormant, meneau, traverse, poignée. */
export const WindowIcon = make(
  <>
    <rect x="5" y="3.5" width="14" height="17" rx="1" />
    <path d="M12 3.5v17M5 12h14" />
    <path d="M14 15.5v2" />
  </>
);

/** Finitions - rouleau de peinture. */
export const RollerIcon = make(
  <>
    <rect x="3.5" y="4" width="13" height="4.5" rx="1.2" />
    <path d="M16.5 6.2h3v4.6H12v3.4" />
    <path d="M12 14.2v6.3" />
  </>
);

/** Aménagement extérieur - allée vers l'horizon, arbre. */
export const LandscapeIcon = make(
  <>
    <path d="M2.5 12h19" />
    <path d="M8 20.5 10.8 12M16 20.5 13.2 12" />
    <path d="M18.5 12V8.8" />
    <circle cx="18.5" cy="6.5" r="2.3" />
  </>
);

/** Piscine - échelle et vague. */
export const PoolIcon = make(
  <>
    <path d="M8 3.5v10M13.5 3.5v10M8 6.8h5.5M8 10h5.5" />
    <path d="M2.5 17.5c1.6 0 1.6 1.2 3.2 1.2s1.6-1.2 3.2-1.2 1.6 1.2 3.1 1.2 1.6-1.2 3.2-1.2 1.6 1.2 3.2 1.2 1.6-1.2 3.1-1.2" />
  </>
);

/** Visite - mètre ruban : on vient mesurer. */
export const TapeIcon = make(
  <>
    <circle cx="9" cy="10" r="5.5" />
    <circle cx="9" cy="10" r="1.6" />
    <path d="M9 15.5h11.5v3H9" />
    <path d="M13 15.5v1.5M16 15.5v1.5M19 15.5v1.5" />
  </>
);

/** Devis - document poste par poste. */
export const QuoteDocIcon = make(
  <>
    <path d="M6 3.5h8.5l3.5 3.5v13.5H6z" />
    <path d="M14.5 3.5V7H18" />
    <path d="M9 11h6M9 14h6M9 17h3.5" />
  </>
);

/** Chantier - truelle. */
export const TrowelIcon = make(
  <>
    <path d="M10.5 13.5 19 5l1.5 1.5-8.5 8.5z" />
    <path d="M10.5 13.5 8 16" />
    <path d="M8 16 4 20" strokeWidth="2.4" />
  </>
);

/** Livraison - la clé. */
export const KeyIcon = make(
  <>
    <circle cx="7.5" cy="12" r="3.8" />
    <path d="M11.3 12h9.2M17 12v3M20 12v2.4" />
  </>
);

/** Interlocuteur - une personne, un seul fil. */
export const PersonIcon = make(
  <>
    <circle cx="12" cy="8" r="3.5" />
    <path d="M5 20.5c.8-3.6 3.6-5.5 7-5.5s6.2 1.9 7 5.5" />
  </>
);

/** Repli / dépli (FAQ) - une croix qui pivote en moins. */
export const PlusIcon = make(<path d="M12 5v14M5 12h14" />);

/** Direction - aller vers. */
export const ArrowIcon = make(<path d="M4 12h16M14 6l6 6-6 6" />);

/** Lien sortant. */
export const ArrowUpRightIcon = make(<path d="M7 17 17 7M9 7h8v8" />);

/** Un symbole par métier (slug de src/data/services.js). */
export const SERVICE_ICONS = {
  'renovation-complete': HouseIcon,
  'finitions-interieures': RollerIcon,
  'amenagement-exterieur': LandscapeIcon,
  toiture: RoofIcon,
  facade: FacadeIcon,
  piscine: PoolIcon,
};
