/**
 * Réalisations Chaudrel - modèle de données unique.
 *
 * Ajouter un chantier = ajouter un objet dans PROJECTS. La page /realisations,
 * les pages /realisations/[slug], le sitemap, les métadonnées et les données
 * structurées se régénèrent seuls.
 *
 * ⚠️ V6 - CE QUI A CHANGÉ ET POURQUOI
 * Les fiches précédentes (« Cuisine Ixelles », « Villa Tervuren »,
 * « Terrasse Woluwe »…) reprenaient des titres de la V1 et leur associaient
 * des photos qui montraient tout autre chose : une porte d'entrée sous le
 * titre « terrasse en pierre naturelle », une façade sous « cuisine sur
 * mesure ». Un visiteur l'aurait vu au premier coup d'œil.
 *
 * Faute de savoir quelle photo appartient à quel chantier, les réalisations
 * sont regroupées en DOSSIERS, par nature de travaux, et chaque texte décrit
 * strictement ce que montrent les photos. Aucun lieu, aucune date, aucun
 * matériau n'est affiché tant que Chaudrel ne l'a pas confirmé.
 *
 * Dès que Chaudrel transmet un chantier documenté (lieu, année, postes, série
 * de photos d'un même chantier), il s'ajoute ici comme un projet à part
 * entière : `location`, `year` et `materials` s'affichent alors d'eux-mêmes.
 *
 * Schéma :
 *   slug        identifiant d'URL (kebab-case, stable)
 *   title       intitulé
 *   type        nature des travaux, en clair
 *   categories  ids de CATEGORIES (filtre, projets liés, services liés)
 *   location    commune - null tant que non confirmée (non affichée)
 *   year        année - null tant que non confirmée (non affichée)
 *   featured    présent dans le carrousel de l'accueil
 *   status      'livré' | 'en cours' - ce que montrent les photos
 *   summary     une phrase : accroche et meta description
 *   description paragraphe factuel
 *   works       ce qui est visible sur les photos (TODO_VALIDATION : périmètre
 *               exact à confirmer par Chaudrel)
 *   materials   [] tant que non documentés (non affichés)
 *   cover       image d'ouverture { src, alt, w, h }
 *   images      galerie [{ src, alt, w, h }] - alt descriptifs, jamais inventés
 *   beforeAfter { before, after } - uniquement pour une paire prise du même
 *               point de vue. Aucune des paires actuelles ne l'est (les
 *               fichiers `ba-*` montrent des façades différentes) : le
 *               comparateur reste donc inutilisé.
 */

export const CATEGORIES = [
  { id: 'facade', label: 'Façade' },
  { id: 'menuiseries', label: 'Châssis et portes' },
  { id: 'gros-oeuvre', label: 'Gros œuvre et extensions' },
  { id: 'toiture', label: 'Toiture' },
  { id: 'exterieur', label: 'Abords et garages' },
];

const img = (src, alt, w, h) => ({ src, alt, w, h });

export const PROJECTS = [
  {
    slug: 'facades-enduites',
    title: 'Façades enduites',
    type: 'Façade',
    categories: ['facade', 'exterieur'],
    location: null,
    year: null,
    featured: true,
    status: 'livré',
    summary:
      'Volumes enduits gris clair contre la brique, menuiseries anthracite et portes de garage sectionnelles.',
    description:
      "Deux façades. Sur la première, un volume enduit gris clair abrite deux portes de garage sectionnelles, entre une façade de brique sombre et une colonne vitrée. Sur la seconde, toute la façade est enduite : châssis anthracite, porte d'entrée vitrée et porte de garage la complètent, photographiés pendant les derniers travaux.",
    works: ['Enduit de façade', 'Portes de garage sectionnelles', "Châssis et porte d'entrée"],
    materials: [],
    cover: img(
      '/photos/facade-garages.webp',
      'Façade en brique sombre, volume enduit gris clair et deux portes de garage sectionnelles blanches',
      1920,
      1080
    ),
    images: [
      img(
        '/photos/facade-garages.webp',
        'Volume enduit gris clair, deux portes de garage sectionnelles et colonne vitrée',
        1920,
        1080
      ),
      img(
        '/photos/svc-piscine.webp',
        "Façade enduite grise, châssis anthracite, porte d'entrée vitrée et porte de garage, en fin de chantier",
        1200,
        900
      ),
    ],
  },
  {
    slug: 'chassis-et-volets',
    title: 'Châssis et volets',
    type: 'Châssis et portes',
    categories: ['menuiseries', 'facade'],
    location: null,
    year: null,
    featured: true,
    status: 'livré',
    summary:
      'Menuiseries anthracite et brunes posées dans des façades existantes, en brique comme en pierre, volets roulants compris.',
    description:
      "Des façades anciennes gardent leur parement ; seules les baies changent. Les photos montrent des châssis et portes anthracite dans la brique rouge, une façade de brique peinte en blanc équipée de menuiseries brunes et de caissons de volets, et une maison en pierre avec ses châssis blancs.",
    works: ['Châssis', 'Portes', 'Volets roulants', 'Raccords de façade'],
    materials: [],
    cover: img(
      '/photos/pf-2.webp',
      'Maison en brique rouge, châssis et porte anthracite, volets roulants',
      900,
      1125
    ),
    images: [
      img('/photos/pf-2.webp', 'Maison en brique rouge, châssis et porte anthracite, volets roulants', 900, 1125),
      img('/photos/pf-1.webp', 'Façade de brique sur deux niveaux, châssis anthracite neufs', 1400, 933),
      img(
        '/photos/svc-salle-de-bain.webp',
        'Brique peinte en blanc, fenêtre et porte brunes avec caissons de volets roulants',
        1200,
        900
      ),
      img(
        '/photos/ba-cuisine-avant.webp',
        "Porte d'entrée et fenêtre anthracite sur une façade de brique, pendant la pose",
        1200,
        800
      ),
      img('/photos/ba-terrasse-avant.webp', 'Maison en pierre, châssis blancs', 1200, 800),
      img('/photos/ba-allee-avant.webp', 'Volet roulant anthracite, vue rapprochée', 1200, 800),
    ],
  },
  {
    slug: 'portes-d-entree',
    title: "Portes d'entrée",
    type: 'Châssis et portes',
    categories: ['menuiseries'],
    location: null,
    year: null,
    featured: true,
    status: 'livré',
    summary: "Portes d'entrée posées dans la maçonnerie existante : vitrages, impostes et poignées droites.",
    description:
      "Trois portes, trois façades. Une porte bleu nuit à vitrages latéraux sur un seuil en pierre ; une porte taupe à fentes vitrées et poignée droite ; une porte anthracite à quatre jours carrés, posée dans la brique.",
    works: ["Portes d'entrée", 'Vitrages et impostes', 'Raccords de maçonnerie'],
    materials: [],
    cover: img(
      '/photos/pf-3.webp',
      "Porte d'entrée bleu nuit à vitrages, façade de brique et seuil en pierre",
      900,
      1125
    ),
    images: [
      img('/photos/pf-3.webp', "Porte d'entrée bleu nuit à vitrages, façade de brique et seuil en pierre", 900, 1125),
      img('/photos/svc-cuisine.webp', "Porte d'entrée taupe, fentes vitrées et poignée droite", 1200, 900),
      img('/photos/ba-cuisine-apres.webp', "Porte d'entrée anthracite à quatre jours carrés, dans la brique", 1200, 800),
    ],
  },
  {
    slug: 'extensions-baies-vitrees',
    title: 'Extensions et baies vitrées',
    type: 'Gros œuvre',
    categories: ['gros-oeuvre'],
    location: null,
    year: null,
    featured: true,
    status: 'en cours',
    summary: 'Nouveaux volumes ouverts par de grandes baies en aluminium, photographiés en cours de chantier.',
    description:
      "Deux extensions de plain-pied, saisies avant les finitions extérieures. Les grandes baies aluminium sont posées, l'enduit est en cours, les abords sont encore à faire.",
    works: ['Gros œuvre', 'Baies vitrées aluminium', 'Enduit'],
    materials: [],
    cover: img(
      '/photos/ba-terrasse-apres.webp',
      'Extension enduite à grandes baies vitrées aluminium, en cours de chantier',
      1200,
      800
    ),
    images: [
      img(
        '/photos/ba-terrasse-apres.webp',
        'Extension enduite à grandes baies vitrées aluminium, en cours de chantier',
        1200,
        800
      ),
      img('/photos/svc-jardin.webp', 'Extension de plain-pied, portes vitrées aluminium, avant enduit', 1200, 900),
    ],
  },
  {
    slug: 'toitures-et-volumes',
    title: 'Toitures et volumes',
    type: 'Toiture',
    categories: ['toiture', 'gros-oeuvre'],
    location: null,
    year: null,
    featured: true,
    status: 'livré',
    summary: 'Couvertures sombres neuves, sur une maison de brique et sur un volume construit de neuf.',
    description:
      "Sur la première maison, une couverture neuve en tuiles sombres et un volume enduit au rez-de-chaussée. Sur la seconde, un bâtiment en brique grise sous une toiture sombre, photographié à la fin du gros œuvre.",
    works: ['Couverture', 'Rives et zinguerie', 'Volume enduit'],
    materials: [],
    cover: img(
      '/photos/pf-4.webp',
      'Maison en brique rouge, toiture neuve en tuiles sombres et volume enduit au rez-de-chaussée',
      1400,
      933
    ),
    images: [
      img(
        '/photos/pf-4.webp',
        'Maison en brique rouge, toiture neuve en tuiles sombres et volume enduit au rez-de-chaussée',
        1400,
        933
      ),
      img('/photos/svc-toiture.webp', 'Bâtiment en brique grise sous toiture sombre, abords en chantier', 1200, 900),
    ],
  },
  {
    slug: 'abords-et-garages',
    title: 'Abords et garages',
    type: 'Aménagement extérieur',
    categories: ['exterieur'],
    location: null,
    year: null,
    featured: true,
    status: 'livré',
    summary: "Allée asphaltée devant une grande maison en brique, et une rangée de garages à portes sectionnelles.",
    description:
      "Devant une grande maison en brique, une allée neuve en asphalte mène aux garages, bordée de pavés. Ailleurs, une rangée de garages en brique reçoit des portes sectionnelles blanches.",
    works: ['Allée et entrée de garage', 'Bordures', 'Portes de garage sectionnelles'],
    materials: [],
    cover: img(
      '/photos/abords-allee.webp',
      'Grande maison en brique, allée neuve en asphalte et garages',
      1000,
      1333
    ),
    images: [
      img('/photos/abords-allee.webp', 'Grande maison en brique, allée neuve en asphalte et garages', 1000, 1333),
      img('/photos/ba-allee-apres.webp', 'Rangée de garages en brique, portes sectionnelles blanches', 1200, 800),
    ],
  },
];

/**
 * Anciennes adresses (V1-V5) → dossier correspondant. Redirigées en 301 par
 * vercel.json et côté client par la page projet : aucun lien existant ne
 * tombe sur une 404. Chaque ancienne fiche pointe vers le dossier qui
 * contient sa photo d'origine.
 */
export const LEGACY_SLUGS = {
  'renovation-overijse': 'abords-et-garages',
  'residence-uccle': 'chassis-et-volets',
  'cuisine-ixelles': 'toitures-et-volumes',
  'villa-tervuren': 'chassis-et-volets',
  'terrasse-woluwe': 'portes-d-entree',
  'allee-uccle': 'abords-et-garages',
};

/* ---------- Accès ---------- */

export const getProject = (slug) => PROJECTS.find((p) => p.slug === slug);

export const projectsByCategory = (id) =>
  id === 'all' ? PROJECTS : PROJECTS.filter((p) => p.categories.includes(id));

export const activeCategories = () =>
  CATEGORIES.filter((c) => PROJECTS.some((p) => p.categories.includes(c.id)));

export const projectsForTags = (tags = [], limit = 3, exclude) =>
  PROJECTS.filter((p) => p.slug !== exclude && p.categories.some((c) => tags.includes(c))).slice(0, limit);

/** Nom lisible d'une catégorie. */
export const categoryLabel = (id) => CATEGORIES.find((c) => c.id === id)?.label ?? id;

/** Projet précédent / suivant, en boucle sur l'ordre du portfolio. */
export const projectSiblings = (slug) => {
  const i = PROJECTS.findIndex((p) => p.slug === slug);
  if (i === -1) return { prev: null, next: null };
  const prev = PROJECTS[(i - 1 + PROJECTS.length) % PROJECTS.length];
  const next = PROJECTS[(i + 1) % PROJECTS.length];
  return { prev: prev.slug === slug ? null : prev, next: next.slug === slug ? null : next };
};
