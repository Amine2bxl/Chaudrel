/**
 * Services Chaudrel.
 * ⚠️ La liste doit être validée par Chaudrel : ne pas ajouter de prestation
 *    que l'entreprise ne réalise pas réellement (voir VERIFICATION.md).
 * Ajouter un service = ajouter un objet ici. Aucune modification de composant.
 */

export const SERVICES = [
  {
    slug: 'renovation-complete',
    title: 'Rénovation complète',
    subtitle: 'Clé en main',
    image: '/photos/pf-1.webp',
    excerpt:
      "Un seul interlocuteur pour l'ensemble du chantier : gros œuvre, techniques, finitions et livraison.",
    intro:
      "Chaudrel prend en charge la rénovation intégrale d'un appartement, d'une maison ou d'un commerce à Bruxelles et en périphérie. Coordination des corps de métier, planning, suivi de chantier et livraison : vous n'avez qu'un seul interlocuteur.",
    benefits: [
      'Un interlocuteur unique du premier contact à la livraison',
      'Coordination complète des corps de métier',
      'Planning établi et suivi à chaque étape',
      'Finitions soignées et chantier nettoyé à la livraison',
    ],
    works: [
      'Démolition et préparation',
      'Cloisonnement et maçonnerie',
      'Électricité et plomberie',
      'Sols, murs et plafonds',
      'Menuiserie et aménagement',
      'Finitions et nettoyage de fin de chantier',
    ],
    faqs: [
      {
        q: 'Gérez-vous les différents corps de métier ?',
        a: "Oui. Nous coordonnons l'ensemble des intervenants du chantier, vous n'avez qu'un seul interlocuteur.",
      },
      {
        q: 'Peut-on habiter le logement pendant les travaux ?',
        a: "Cela dépend de l'ampleur du chantier. Nous en discutons lors de la visite et l'indiquons dans le devis.",
      },
    ],
    projectTags: ['renovation-complete'],
  },
  {
    slug: 'cuisine',
    title: 'Cuisine',
    subtitle: "L'art culinaire",
    image: '/photos/svc-cuisine.webp',
    excerpt: 'Cuisines sur mesure — conception, matériaux nobles et pose clé en main.',
    intro:
      "Rénovation de cuisine à Bruxelles : conception de l'implantation, plans de travail en pierre ou en bois massif, îlot central, rangements sur mesure. Nous réalisons également les travaux techniques (électricité, plomberie, ventilation) liés à la cuisine.",
    benefits: [
      'Conception sur mesure adaptée à votre espace',
      'Matériaux durables sélectionnés avec vous',
      'Travaux techniques inclus (eau, électricité, évacuation)',
      'Pose et finitions réalisées par notre équipe',
    ],
    works: [
      'Dépose de l\'ancienne cuisine',
      'Adaptation électricité et plomberie',
      'Sol et revêtements muraux',
      'Pose des meubles et du plan de travail',
      'Crédence, éclairage et finitions',
    ],
    faqs: [
      {
        q: 'Fournissez-vous les meubles de cuisine ?',
        a: "Nous vous accompagnons dans le choix des matériaux et des fournisseurs. Le détail est précisé dans le devis.",
      },
    ],
    projectTags: ['cuisine'],
  },
  {
    slug: 'salle-de-bain',
    title: 'Salle de bain',
    subtitle: 'Sanctuaire privé',
    image: '/photos/svc-salle-de-bain.webp',
    excerpt: 'Douche à l\'italienne, pierre naturelle, robinetterie — rénovation complète.',
    intro:
      "Rénovation complète de salle de bain à Bruxelles et en périphérie : étanchéité, carrelage grand format, douche à l'italienne, baignoire, meubles et robinetterie. Un espace pensé pour durer et pour l'usage quotidien.",
    benefits: [
      'Étanchéité et évacuations traitées dans les règles',
      'Carrelage et pierre posés avec précision',
      'Plomberie et ventilation adaptées',
      'Résultat sobre et durable',
    ],
    works: [
      'Démolition et évacuation',
      'Plomberie et électricité',
      'Étanchéité et chape',
      'Carrelage sol et murs',
      'Pose des sanitaires et du mobilier',
    ],
    faqs: [
      {
        q: 'Combien de temps dure une salle de bain ?',
        a: 'La durée dépend de la surface et des travaux techniques. Nous vous donnons un planning précis avec le devis.',
      },
    ],
    projectTags: ['salle-de-bain'],
  },
  {
    slug: 'peinture',
    title: 'Peinture',
    subtitle: 'Finitions',
    image: '/photos/pf-2.webp',
    excerpt: 'Préparation des supports, enduits et mise en peinture intérieure.',
    intro:
      "Travaux de peinture intérieure : préparation et réparation des supports, enduits, sous-couche et finition. La qualité d'une peinture tient d'abord à la préparation du mur.",
    benefits: [
      'Supports préparés et réparés avant application',
      'Protection complète du chantier',
      'Finitions nettes sur les angles et les plinthes',
    ],
    works: ['Rebouchage et enduit', 'Ponçage', 'Sous-couche', 'Finition murs et plafonds', 'Boiseries'],
    faqs: [],
    projectTags: ['renovation-complete', 'appartement'],
  },
  {
    slug: 'electricite',
    title: 'Électricité',
    subtitle: 'Installations',
    image: '/photos/svc-nettoyage.webp',
    excerpt: 'Rénovation et adaptation de l\'installation électrique de votre logement.',
    intro:
      "Adaptation ou rénovation de l'installation électrique dans le cadre de vos travaux : points lumineux, prises, tableau, circuits dédiés.",
    // TODO_VALIDATION : préciser si Chaudrel prend en charge la mise en conformité
    // et le contrôle par un organisme agréé.
    benefits: [
      'Installation adaptée à vos usages réels',
      'Travaux coordonnés avec le reste du chantier',
    ],
    works: ['Tableau électrique', 'Points lumineux', 'Prises et interrupteurs', 'Circuits dédiés'],
    faqs: [],
    projectTags: ['renovation-complete'],
  },
  {
    slug: 'plomberie',
    title: 'Plomberie',
    subtitle: 'Sanitaire',
    image: '/photos/svc-salle-de-bain.webp',
    excerpt: 'Alimentation, évacuation et sanitaires dans le cadre de vos travaux.',
    intro:
      "Travaux de plomberie liés à la rénovation : alimentation, évacuations, déplacement de points d'eau et pose de sanitaires.",
    benefits: ['Réseaux repensés selon le nouvel aménagement', 'Coordination avec le carrelage et les finitions'],
    works: ['Alimentation eau chaude/froide', 'Évacuations', 'Déplacement de points d\'eau', 'Pose de sanitaires'],
    faqs: [],
    projectTags: ['salle-de-bain'],
  },
  {
    slug: 'sols-et-revetements',
    title: 'Sols & revêtements',
    subtitle: 'Matières',
    image: '/photos/pf-3.webp',
    excerpt: 'Carrelage, pierre naturelle, parquet et revêtements muraux.',
    intro:
      "Pose de sols et de revêtements : carrelage grand format, pierre naturelle, parquet, plinthes et raccords. Préparation du support et chape incluses lorsque nécessaire.",
    benefits: ['Support préparé et mis à niveau', 'Calepinage étudié avant la pose', 'Joints et raccords soignés'],
    works: ['Chape et ragréage', 'Carrelage', 'Pierre naturelle', 'Parquet', 'Plinthes et finitions'],
    faqs: [],
    projectTags: ['renovation-complete', 'maison'],
  },
  {
    slug: 'menuiserie',
    title: 'Menuiserie',
    subtitle: 'Sur mesure',
    image: '/photos/pf-4.webp',
    excerpt: 'Rangements, habillages et éléments bois réalisés sur mesure.',
    intro:
      "Menuiserie intérieure sur mesure : rangements intégrés, habillages, portes intérieures et éléments bois adaptés à votre espace.",
    benefits: ['Conception adaptée au centimètre', 'Bois sélectionné avec vous', 'Pose et ajustements sur place'],
    works: ['Rangements intégrés', 'Habillages', 'Portes intérieures', 'Éléments bois sur mesure'],
    faqs: [],
    projectTags: ['cuisine', 'appartement'],
  },
  {
    slug: 'amenagement-interieur',
    title: 'Aménagement intérieur',
    subtitle: 'Espaces',
    image: '/photos/pf-2.webp',
    excerpt: 'Repenser la distribution des pièces et la circulation de votre logement.',
    intro:
      "Réorganisation de l'espace : ouverture ou création de cloisons, redistribution des pièces, optimisation de la lumière et des circulations.",
    benefits: ['Étude de la distribution avant travaux', 'Optimisation de la lumière naturelle', 'Coordination complète des travaux'],
    works: ['Cloisons', 'Ouvertures', 'Faux plafonds', 'Éclairage intégré'],
    faqs: [],
    projectTags: ['appartement', 'maison'],
  },
];

export const getService = (slug) => SERVICES.find((s) => s.slug === slug);
