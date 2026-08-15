/**
 * Services Chaudrel.
 * ⚠️ La liste doit être validée par Chaudrel : ne pas ajouter de prestation
 *    que l'entreprise ne réalise pas réellement (voir docs/VERIFICATION.md).
 *
 * Ajouter un service = ajouter un objet ici. Aucun composant à modifier.
 * Règle d'écriture : `excerpt` = une phrase, `intro` = trois lignes maximum.
 */

export const SERVICES = [
  {
    slug: 'renovation-complete',
    title: 'Rénovation complète',
    image: '/photos/pf-1.webp',
    excerpt: "Tout le chantier, un seul interlocuteur.",
    intro:
      "Nous prenons en charge la rénovation entière d'un appartement, d'une maison ou d'un commerce : démolition, techniques, finitions, livraison. Vous parlez à une seule personne, du premier rendez-vous aux clés en main.",
    works: [
      'Démolition et préparation',
      'Cloisons et maçonnerie',
      'Électricité et plomberie',
      'Sols, murs et plafonds',
      'Menuiserie et aménagement',
      'Finitions et nettoyage de fin de chantier',
    ],
    faqs: [
      {
        q: 'Gérez-vous les différents corps de métier ?',
        a: "Oui. Nous coordonnons tous les intervenants du chantier. Vous n'avez qu'un seul interlocuteur.",
      },
      {
        q: 'Peut-on habiter le logement pendant les travaux ?',
        a: "Selon l'ampleur du chantier. Nous en parlons lors de la visite et l'indiquons dans le devis.",
      },
    ],
    projectTags: ['renovation-complete'],
  },
  {
    slug: 'cuisine',
    title: 'Cuisine',
    image: '/photos/svc-cuisine.webp',
    excerpt: 'Une pièce repensée, pas seulement des meubles posés.',
    intro:
      "Nous revoyons l'implantation, reprenons l'électricité et la plomberie, posons les sols, les meubles et le plan de travail. Vous choisissez les matériaux, nous nous occupons du reste.",
    works: [
      "Dépose de l'ancienne cuisine",
      'Électricité, eau, évacuation',
      'Sol et revêtements muraux',
      'Meubles et plan de travail',
      'Crédence, éclairage, finitions',
    ],
    faqs: [
      {
        q: 'Fournissez-vous les meubles ?',
        a: "Nous vous accompagnons dans le choix des matériaux et des fournisseurs. Le détail figure dans le devis.",
      },
    ],
    projectTags: ['cuisine'],
  },
  {
    slug: 'salle-de-bain',
    title: 'Salle de bain',
    image: '/photos/svc-salle-de-bain.webp',
    excerpt: "L'étanchéité d'abord, l'esthétique ensuite.",
    intro:
      "Douche à l'italienne, baignoire, carrelage grand format, meubles et robinetterie. Ce qui ne se voit pas — étanchéité, évacuations, ventilation — décide de la durée de vie de la pièce.",
    works: [
      'Démolition et évacuation',
      'Plomberie et électricité',
      'Étanchéité et chape',
      'Carrelage sol et murs',
      'Sanitaires et mobilier',
    ],
    faqs: [
      {
        q: 'Combien de temps dure le chantier ?',
        a: "Cela dépend de la surface et des travaux techniques. Le planning précis est remis avec le devis.",
      },
    ],
    projectTags: ['salle-de-bain'],
  },
  {
    slug: 'peinture',
    title: 'Peinture',
    image: '/photos/pf-2.webp',
    excerpt: 'La qualité d’une peinture se joue avant le premier coup de rouleau.',
    intro:
      "Rebouchage, enduit, ponçage, sous-couche, finition. Le chantier est protégé, les angles et les plinthes sont nets, la pièce est rendue propre.",
    works: ['Rebouchage et enduit', 'Ponçage', 'Sous-couche', 'Murs et plafonds', 'Boiseries'],
    faqs: [],
    projectTags: ['renovation-complete', 'appartement'],
  },
  {
    slug: 'electricite',
    title: 'Électricité',
    image: '/photos/svc-nettoyage.webp',
    excerpt: 'Une installation pensée pour votre usage réel.',
    intro:
      "Tableau, circuits, points lumineux, prises. Les travaux sont coordonnés avec le reste du chantier pour éviter de rouvrir ce qui vient d'être refermé.",
    // TODO_VALIDATION : préciser si Chaudrel prend en charge la mise en conformité
    // et le contrôle par un organisme agréé.
    works: ['Tableau électrique', 'Points lumineux', 'Prises et interrupteurs', 'Circuits dédiés'],
    faqs: [],
    projectTags: ['renovation-complete'],
  },
  {
    slug: 'plomberie',
    title: 'Plomberie',
    image: '/photos/svc-salle-de-bain.webp',
    excerpt: 'Les réseaux suivent le nouvel aménagement, pas l’inverse.',
    intro:
      "Alimentation, évacuations, déplacement de points d'eau et pose des sanitaires, en coordination avec le carrelage et les finitions.",
    works: ['Alimentation eau chaude / froide', 'Évacuations', "Déplacement de points d'eau", 'Pose de sanitaires'],
    faqs: [],
    projectTags: ['salle-de-bain'],
  },
  {
    slug: 'sols-et-revetements',
    title: 'Sols & revêtements',
    image: '/photos/pf-3.webp',
    excerpt: 'Un calepinage étudié avant la première découpe.',
    intro:
      "Carrelage, pierre naturelle, parquet. Le support est mis à niveau, la pose est calepinée à l'avance, les raccords et les plinthes sont soignés.",
    works: ['Chape et ragréage', 'Carrelage', 'Pierre naturelle', 'Parquet', 'Plinthes et finitions'],
    faqs: [],
    projectTags: ['renovation-complete', 'maison'],
  },
  {
    slug: 'menuiserie',
    title: 'Menuiserie',
    image: '/photos/pf-4.webp',
    excerpt: 'Du sur-mesure là où le standard ne tombe jamais juste.',
    intro:
      "Rangements intégrés, habillages, portes intérieures, éléments bois dessinés pour votre espace et ajustés sur place.",
    works: ['Rangements intégrés', 'Habillages', 'Portes intérieures', 'Éléments sur mesure'],
    faqs: [],
    projectTags: ['cuisine', 'appartement'],
  },
  {
    slug: 'amenagement-interieur',
    title: 'Aménagement intérieur',
    image: '/photos/pf-2.webp',
    excerpt: 'Parfois, il ne manque pas de place : il manque une cloison en moins.',
    intro:
      "Ouvrir, cloisonner, redistribuer. Nous étudions la circulation et la lumière avant de toucher au bâti, pour que l'espace serve vraiment votre quotidien.",
    works: ['Cloisons', 'Ouvertures', 'Faux plafonds', 'Éclairage intégré'],
    faqs: [],
    projectTags: ['appartement', 'maison'],
  },
];

export const getService = (slug) => SERVICES.find((s) => s.slug === slug);
