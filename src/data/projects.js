/**
 * Réalisations Chaudrel.
 * ⚠️ Photos réelles issues du dossier /public/photos.
 *    Localisations, matériaux et descriptifs doivent être confirmés par Chaudrel
 *    avant publication (voir VERIFICATION.md).
 *
 * Ajouter une réalisation = ajouter un objet ici :
 *   slug, title, category, cover, images[], before/after (optionnel), ...
 * Aucune modification de composant n'est nécessaire.
 */

export const CATEGORIES = [
  { id: 'renovation-complete', label: 'Rénovation complète' },
  { id: 'cuisine', label: 'Cuisine' },
  { id: 'salle-de-bain', label: 'Salle de bain' },
  { id: 'appartement', label: 'Appartement' },
  { id: 'maison', label: 'Maison' },
  { id: 'commerce', label: 'Commerce' },
];

export const PROJECTS = [
  {
    slug: 'residence-uccle',
    title: 'Résidence Uccle',
    type: 'Rénovation complète',
    categories: ['renovation-complete', 'maison'],
    location: 'Uccle, Bruxelles',
    cover: '/photos/pf-1.webp',
    coverAspect: 'aspect-[3/2]',
    featured: true,
    span: 'lg:col-span-2',
    summary:
      "Rénovation d'une maison familiale, de la structure aux finitions, avec un seul interlocuteur pour l'ensemble du chantier.",
    description:
      "Chaudrel a assuré la rénovation de cette résidence à Uccle : redistribution des espaces, reprise des techniques, sols, murs et finitions. L'objectif était de conserver le caractère du bâtiment tout en apportant le confort d'un logement contemporain.",
    works: ['Redistribution des espaces', 'Électricité et plomberie', 'Sols et revêtements', 'Peinture et finitions'],
    materials: ['Pierre naturelle', 'Bois massif'],
    images: ['/photos/pf-1.webp'],
  },
  {
    slug: 'cuisine-ixelles',
    title: 'Cuisine Ixelles',
    type: 'Cuisine sur mesure',
    categories: ['cuisine', 'appartement'],
    location: 'Ixelles, Bruxelles',
    cover: '/photos/pf-4.webp',
    coverAspect: 'aspect-[3/2]',
    featured: true,
    span: 'lg:col-span-2',
    summary: "Cuisine entièrement repensée : implantation, plan de travail et rangements sur mesure.",
    description:
      "Rénovation complète de la cuisine d'un appartement à Ixelles. L'implantation a été revue pour dégager un plan de travail continu et un espace de circulation confortable. Travaux techniques, pose et finitions réalisés par notre équipe.",
    works: ['Dépose de l\'ancienne cuisine', 'Électricité et plomberie', 'Pose des meubles et du plan de travail', 'Crédence et éclairage'],
    materials: ['Marbre', 'Bois massif'],
    images: ['/photos/pf-4.webp', '/photos/svc-cuisine.webp'],
    beforeAfter: { before: '/photos/ba-cuisine-avant.webp', after: '/photos/ba-cuisine-apres.webp' },
  },
  {
    slug: 'villa-tervuren',
    title: 'Villa Tervuren',
    type: 'Architecture intérieure',
    categories: ['renovation-complete', 'maison'],
    location: 'Tervuren',
    cover: '/photos/pf-2.webp',
    coverAspect: 'aspect-[4/5]',
    featured: true,
    span: '',
    summary: "Aménagement intérieur d'une villa : lumière, circulation et matières.",
    description:
      "Travaux d'aménagement intérieur d'une villa à Tervuren. Le projet portait sur la circulation entre les pièces de vie, l'apport de lumière naturelle et le choix de matières sobres et durables.",
    works: ['Cloisons et ouvertures', 'Éclairage intégré', 'Sols', 'Finitions'],
    materials: ['Bois massif', 'Enduits'],
    images: ['/photos/pf-2.webp'],
  },
  {
    slug: 'terrasse-woluwe',
    title: 'Terrasse Woluwe',
    type: 'Aménagement extérieur',
    categories: ['maison'],
    location: 'Woluwe-Saint-Pierre',
    cover: '/photos/pf-3.webp',
    coverAspect: 'aspect-[4/5]',
    featured: true,
    span: '',
    summary: 'Terrasse et abords repensés en pierre naturelle.',
    description:
      "Rénovation de la terrasse et des abords d'une maison à Woluwe-Saint-Pierre : préparation du support, pose en pierre naturelle et raccords avec le jardin existant.",
    works: ['Préparation du support', 'Pose pierre naturelle', 'Raccords et finitions'],
    materials: ['Pierre naturelle'],
    images: ['/photos/pf-3.webp'],
    beforeAfter: { before: '/photos/ba-terrasse-avant.webp', after: '/photos/ba-terrasse-apres.webp' },
  },
  {
    slug: 'allee-uccle',
    title: 'Allée extérieure Uccle',
    type: 'Aménagement extérieur',
    categories: ['maison'],
    location: 'Uccle, Bruxelles',
    cover: '/photos/ba-allee-apres.webp',
    coverAspect: 'aspect-[3/2]',
    featured: false,
    span: '',
    summary: "Remplacement complet d'une allée dégradée.",
    description:
      "L'ancienne allée, fissurée et irrégulière, a été démolie et remplacée. Le support a été repris avant la pose du nouveau revêtement, avec traitement des raccords et des bordures.",
    works: ['Démolition', 'Reprise du support', 'Pose du revêtement', 'Bordures et raccords'],
    materials: ['Revêtement extérieur'],
    images: ['/photos/ba-allee-apres.webp'],
    beforeAfter: { before: '/photos/ba-allee-avant.webp', after: '/photos/ba-allee-apres.webp' },
  },
];

export const getProject = (slug) => PROJECTS.find((p) => p.slug === slug);

export const projectsByCategory = (id) =>
  id === 'all' ? PROJECTS : PROJECTS.filter((p) => p.categories.includes(id));

export const activeCategories = () =>
  CATEGORIES.filter((c) => PROJECTS.some((p) => p.categories.includes(c.id)));

export const projectsForTags = (tags = [], limit = 3) =>
  PROJECTS.filter((p) => p.categories.some((c) => tags.includes(c))).slice(0, limit);
