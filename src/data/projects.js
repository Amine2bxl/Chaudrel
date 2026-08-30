/**
 * Réalisations Chaudrel - modèle de données unique.
 *
 * Ajouter un chantier = ajouter un objet dans PROJECTS. Aucun composant ni
 * aucune route à toucher : la page /realisations, les pages /realisations/[slug],
 * le sitemap, les métadonnées et les données structurées se régénèrent seuls.
 *
 * Schéma d'un projet :
 *   slug        identifiant d'URL (kebab-case, stable)
 *   title       nom du chantier
 *   type        nature, en clair (« Rénovation complète », « Cuisine sur mesure »)
 *   categories  ids de CATEGORIES, pour le filtre et les projets liés
 *   location    commune réelle
 *   year        année de livraison - null tant que Chaudrel ne l'a pas confirmée
 *               (TODO_VALIDATION). Affichée uniquement si renseignée.
 *   featured    mis en avant sur l'accueil et en tête de portfolio
 *   summary     une phrase, sert d'accroche et de meta description
 *   description paragraphe de contexte
 *   works       postes réellement réalisés
 *   materials   matières employées
 *   cover       image d'ouverture { src, alt, w, h }
 *   images      galerie [{ src, alt, w, h }] - alt factuels, jamais inventés
 *   beforeAfter { before, after } quand une comparaison existe
 *
 * ⚠️ Localisations, matériaux et descriptifs proviennent de la V1 et doivent
 *    être confirmés par Chaudrel avant publication (voir docs/VERIFICATION.md).
 *
 * ⚠️ PHOTOS - qualité inégale, signalée à Chaudrel. `pf-2` et `pf-3` sont des
 *    portraits basse définition (900×1125) ; les `ba-*` sont en 1200×800. Une
 *    vraie série de prises de vue reste le meilleur investisement visuel du
 *    site. Aucune image n'est inventée ni remplacée par du stock.
 */

export const CATEGORIES = [
  { id: 'renovation-complete', label: 'Rénovation complète' },
  { id: 'cuisine', label: 'Cuisine' },
  { id: 'salle-de-bain', label: 'Salle de bain' },
  { id: 'appartement', label: 'Appartement' },
  { id: 'maison', label: 'Maison' },
  { id: 'commerce', label: 'Commerce' },
];

const img = (src, alt, w, h) => ({ src, alt, w, h });

export const PROJECTS = [
  {
    slug: 'renovation-overijse',
    title: 'Rénovation Overijse',
    type: 'Rénovation complète',
    categories: ['renovation-complete', 'maison'],
    location: 'Overijse, Brabant flamand',
    year: null,
    featured: true,
    summary:
      "Rénovation complète d'une maison à Overijse, de la structure aux finitions, pièce après pièce.",
    description:
      "Chaudrel a mené la rénovation complète de cette maison à Overijse : reprise de la structure et des techniques, puis sols, murs et finitions pièce par pièce. Le client a suivi le chantier avec un seul interlocuteur, du premier débarras à la remise des clés.",
    works: ['Reprise de la structure', 'Électricité et plomberie', 'Sols, murs et plafonds', 'Peinture et finitions'],
    materials: [],
    cover: img('/story-before-after.webp', 'Rénovation à Overijse, pièce de vie après travaux', 1000, 1333),
    images: [img('/story-before-after.webp', 'Rénovation Overijse - pièce de vie après travaux', 1000, 1333)],
  },
  {
    slug: 'residence-uccle',
    title: 'Résidence Uccle',
    type: 'Rénovation complète',
    categories: ['renovation-complete', 'maison'],
    location: 'Uccle, Bruxelles',
    year: null,
    featured: true,
    summary:
      "Rénovation d'une maison familiale, de la structure aux finitions, avec un seul interlocuteur pour l'ensemble du chantier.",
    description:
      "Chaudrel a assuré la rénovation de cette résidence à Uccle : redistribution des espaces, reprise des techniques, sols, murs et finitions. L'objectif était de conserver le caractère du bâtiment tout en apportant le confort d'un logement contemporain.",
    works: ['Redistribution des espaces', 'Électricité et plomberie', 'Sols et revêtements', 'Peinture et finitions'],
    materials: ['Pierre naturelle', 'Bois massif'],
    cover: img('/photos/pf-1.webp', 'Maison familiale rénovée à Uccle, pièce de vie après travaux', 1400, 933),
    images: [img('/photos/pf-1.webp', 'Résidence Uccle - pièce de vie après rénovation complète', 1400, 933)],
  },
  {
    slug: 'cuisine-ixelles',
    title: 'Cuisine Ixelles',
    type: 'Cuisine sur mesure',
    categories: ['cuisine', 'appartement'],
    location: 'Ixelles, Bruxelles',
    year: null,
    featured: true,
    summary: 'Cuisine entièrement repensée : implantation, plan de travail et rangements sur mesure.',
    description:
      "Rénovation complète de la cuisine d'un appartement à Ixelles. L'implantation a été revue pour dégager un plan de travail continu et un espace de circulation confortable. Travaux techniques, pose et finitions réalisés par notre équipe.",
    works: [
      "Dépose de l'ancienne cuisine",
      'Électricité et plomberie',
      'Pose des meubles et du plan de travail',
      'Crédence et éclairage',
    ],
    materials: ['Marbre', 'Bois massif'],
    cover: img('/photos/pf-4.webp', 'Cuisine sur mesure à Ixelles, plan de travail continu après travaux', 1400, 933),
    images: [
      img('/photos/pf-4.webp', 'Cuisine Ixelles - vue d’ensemble après rénovation', 1400, 933),
      img('/photos/svc-cuisine.webp', 'Cuisine Ixelles - plan de travail et rangements sur mesure', 1200, 900),
    ],
    beforeAfter: { before: '/photos/ba-cuisine-avant.webp', after: '/photos/ba-cuisine-apres.webp' },
  },
  {
    slug: 'villa-tervuren',
    title: 'Villa Tervuren',
    type: 'Architecture intérieure',
    categories: ['renovation-complete', 'maison'],
    location: 'Tervuren',
    year: null,
    featured: true,
    summary: "Aménagement intérieur d'une villa : lumière, circulation et matières.",
    description:
      "Travaux d'aménagement intérieur d'une villa à Tervuren. Le projet portait sur la circulation entre les pièces de vie, l'apport de lumière naturelle et le choix de matières sobres et durables.",
    works: ['Cloisons et ouvertures', 'Éclairage intégré', 'Sols', 'Finitions'],
    materials: ['Bois massif', 'Enduits'],
    cover: img('/photos/pf-2.webp', 'Villa à Tervuren, intérieur après aménagement', 900, 1125),
    images: [img('/photos/pf-2.webp', 'Villa Tervuren - pièce de vie après aménagement intérieur', 900, 1125)],
  },
  {
    slug: 'terrasse-woluwe',
    title: 'Terrasse Woluwe',
    type: 'Aménagement extérieur',
    categories: ['maison'],
    location: 'Woluwe-Saint-Pierre',
    year: null,
    featured: true,
    summary: 'Terrasse et abords repensés en pierre naturelle.',
    description:
      "Rénovation de la terrasse et des abords d'une maison à Woluwe-Saint-Pierre : préparation du support, pose en pierre naturelle et raccords avec le jardin existant.",
    works: ['Préparation du support', 'Pose pierre naturelle', 'Raccords et finitions'],
    materials: ['Pierre naturelle'],
    cover: img('/photos/pf-3.webp', 'Terrasse en pierre naturelle à Woluwe-Saint-Pierre après travaux', 900, 1125),
    images: [img('/photos/pf-3.webp', 'Terrasse Woluwe - pierre naturelle et abords après rénovation', 900, 1125)],
    beforeAfter: { before: '/photos/ba-terrasse-avant.webp', after: '/photos/ba-terrasse-apres.webp' },
  },
  {
    slug: 'allee-uccle',
    title: 'Allée extérieure Uccle',
    type: 'Aménagement extérieur',
    categories: ['maison'],
    location: 'Uccle, Bruxelles',
    year: null,
    featured: false,
    summary: "Remplacement complet d'une allée dégradée.",
    description:
      "L'ancienne allée, fissurée et irrégulière, a été démolie et remplacée. Le support a été repris avant la pose du nouveau revêtement, avec traitement des raccords et des bordures.",
    works: ['Démolition', 'Reprise du support', 'Pose du revêtement', 'Bordures et raccords'],
    materials: ['Revêtement extérieur'],
    cover: img('/photos/ba-allee-apres.webp', 'Allée extérieure refaite à Uccle après travaux', 1200, 800),
    images: [img('/photos/ba-allee-apres.webp', 'Allée Uccle - revêtement extérieur après remplacement', 1200, 800)],
    beforeAfter: { before: '/photos/ba-allee-avant.webp', after: '/photos/ba-allee-apres.webp' },
  },
];

/* ---------- Accès ---------- */

export const getProject = (slug) => PROJECTS.find((p) => p.slug === slug);

export const projectsByCategory = (id) =>
  id === 'all' ? PROJECTS : PROJECTS.filter((p) => p.categories.includes(id));

export const activeCategories = () =>
  CATEGORIES.filter((c) => PROJECTS.some((p) => p.categories.includes(c.id)));

export const projectsForTags = (tags = [], limit = 3) =>
  PROJECTS.filter((p) => p.categories.some((c) => tags.includes(c))).slice(0, limit);

/** Nom lisible d'une catégorie. */
export const categoryLabel = (id) => CATEGORIES.find((c) => c.id === id)?.label ?? id;

/**
 * Projet précédent / suivant, en boucle sur l'ordre du portfolio.
 * Sert à la navigation éditoriale en bas de chaque page projet.
 */
export const projectSiblings = (slug) => {
  const i = PROJECTS.findIndex((p) => p.slug === slug);
  if (i === -1) return { prev: null, next: null };
  const prev = PROJECTS[(i - 1 + PROJECTS.length) % PROJECTS.length];
  const next = PROJECTS[(i + 1) % PROJECTS.length];
  return { prev: prev.slug === slug ? null : prev, next: next.slug === slug ? null : next };
};
