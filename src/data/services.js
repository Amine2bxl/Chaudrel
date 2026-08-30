/**
 * Métiers Chaudrel - source unique.
 *
 * Cette liste vient du site historique chaudrelrenovation.be, page par page :
 * finitions intérieures, aménagement extérieur, toiture, façade, gros œuvre de
 * piscine. Ce sont les métiers que l'entreprise annonce elle-même, avec ses
 * termes et ses marques (Metal Stud®, Gyproc®, EPDM®, Derbigum®, Velux®).
 *
 * La version précédente affichait des services repris de la V1 - électricité,
 * plomberie, menuiserie, cuisine, salle de bain en têtes de chapitre - que le
 * site historique ne présente nulle part comme des métiers. Ces travaux
 * existent bien, mais comme postes à l'intérieur d'un chantier : ils sont
 * revenus dans les `works` là où ils apparaissent réellement.
 *
 * Structure d'un métier :
 *   slug, title, image, excerpt (une phrase), intro (trois lignes maximum)
 *   groups  postes réels, groupés - c'est ce qui permet d'afficher la
 *           catégorie d'abord et le détail ensuite, plutôt qu'une liste de
 *           trente lignes d'entrée de jeu
 *   faqs    questions propres au métier
 *   projectTags  catégories de réalisations à rapprocher
 *
 * ⚠️ Ne jamais ajouter une prestation que l'entreprise ne réalise pas
 *    (voir docs/VERIFICATION.md).
 */

export const SERVICES = [
  {
    slug: 'renovation-complete',
    title: 'Rénovation complète',
    image: '/photos/pf-1.webp',
    excerpt: 'Tout le chantier, un seul interlocuteur.',
    intro:
      "Nous prenons en charge la rénovation entière d'un appartement, d'une maison ou d'un commerce : gros œuvre, techniques, finitions, livraison. Vous parlez à une seule personne, du premier rendez-vous aux clés en main.",
    groups: [
      {
        title: 'Le chantier',
        items: [
          'Démolition et préparation',
          'Cloisons et maçonnerie',
          'Électricité et plomberie',
          'Sols, murs et plafonds',
        ],
      },
      {
        title: 'La livraison',
        items: ['Menuiserie et aménagement', 'Finitions', 'Nettoyage de fin de chantier'],
      },
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
    slug: 'finitions-interieures',
    title: 'Finitions intérieures',
    image: '/photos/svc-cuisine.webp',
    excerpt: 'Le parachèvement, du sol au plafond.',
    intro:
      "C'est le métier d'origine de Chaudrel : tout ce qui vient après le gros œuvre et qui décide de l'allure finale d'une pièce. Sols, cloisons, plafonnage, peinture.",
    groups: [
      {
        title: 'Sols',
        items: ['Pose de chape', 'Carrelage', 'Parquet', 'Joints', 'Plinthes'],
      },
      {
        title: 'Murs et plafonds',
        items: [
          'Ossature bois ou Metal Stud®',
          'Isolation',
          'Pose de cloisons',
          'Pose de Gyproc®',
          'Plafonnage',
          'Enduisage',
        ],
      },
      {
        title: 'Peinture',
        items: ['Préparation des surfaces', 'Mise en peinture'],
      },
    ],
    faqs: [
      {
        q: 'Intervenez-vous seulement sur les finitions ?',
        a: "Oui, c'est possible. Nous reprenons un chantier au stade du parachèvement comme nous menons une rénovation complète.",
      },
      {
        q: 'Fournissez-vous les matériaux ?',
        a: "Nous pouvons les fournir ou poser les vôtres. Le devis distingue toujours la fourniture de la pose.",
      },
    ],
    projectTags: ['renovation-complete', 'appartement', 'maison'],
  },
  {
    slug: 'amenagement-exterieur',
    title: 'Aménagement extérieur',
    image: '/photos/svc-jardin.webp',
    excerpt: 'Du terrassement à la terrasse finie.',
    intro:
      "Nous préparons le terrain, posons les revêtements et montons les structures : allées, terrasses, annexes. Le support est repris avant la pose, c'est ce qui fait tenir un extérieur dans le temps.",
    groups: [
      {
        title: 'Terrain',
        items: ['Terrassement', 'Nivellement', 'Préparation de terrain'],
      },
      {
        title: 'Revêtements',
        items: [
          'Pavage',
          'Dallage',
          'Pose de bordures',
          'Céramiques extérieures',
          'Allées et entrées de garage',
          'Terrasses béton ou bois',
        ],
      },
      {
        title: 'Structures',
        items: ['Annexes', 'Vérandas', 'Pergolas', 'Carports', 'Abris de jardin'],
      },
    ],
    faqs: [
      {
        q: 'Reprenez-vous une allée existante ?',
        a: "Oui. Selon son état, nous la démolissons et reprenons le support avant de poser le nouveau revêtement.",
      },
    ],
    projectTags: ['maison'],
  },
  {
    slug: 'toiture',
    title: 'Toiture',
    image: '/photos/svc-toiture.webp',
    excerpt: 'Charpente, couverture, étanchéité, zinguerie.',
    intro:
      "Toitures inclinées et plates, en rénovation comme en construction. Nous reprenons la charpente, la couverture, l'isolation et l'évacuation des eaux.",
    groups: [
      {
        title: 'Charpente',
        items: ['Charpente traditionnelle', 'Charpente préfabriquée', 'Cheminée'],
      },
      {
        title: 'Couverture',
        items: [
          'Toiture inclinée en tuiles ou ardoises',
          'Toiture plate en EPDM® ou Derbigum®',
          'Pose de Velux® et fenêtres de toit',
          'Étanchéité',
          'Isolation',
        ],
      },
      {
        title: 'Zinguerie',
        items: ['Gouttières', 'Corniches', 'Chéneaux', "Descentes d'eau de pluie"],
      },
    ],
    faqs: [
      {
        q: 'Faites-vous les réparations ponctuelles ?',
        a: "Oui, comme les réfections complètes. Nous passons voir la toiture avant de chiffrer quoi que ce soit.",
      },
    ],
    projectTags: ['maison'],
  },
  {
    slug: 'facade',
    title: 'Façade',
    image: '/photos/pf-2.webp',
    excerpt: 'Création, ravalement, isolation par l’extérieur.',
    intro:
      "La façade protège le bâtiment autant qu'elle le montre. Nous la créons, la ravalons, l'isolons et reprenons les joints.",
    groups: [
      {
        title: 'Traitement',
        items: ['Création de façade', 'Ravalement', 'Isolation'],
      },
      {
        title: 'Parements et finitions',
        items: ['Briques de parement', 'Crépi', 'Cimentage', 'Étanchéité', 'Joints et rejointoiement'],
      },
    ],
    faqs: [
      {
        q: "L'isolation de façade change-t-elle l'aspect du bâtiment ?",
        a: "Oui, elle modifie l'épaisseur des murs et le parement. Nous en parlons avant, avec les options possibles.",
      },
    ],
    projectTags: ['maison'],
  },
  {
    slug: 'piscine',
    title: 'Piscine',
    image: '/photos/svc-piscine.webp',
    excerpt: 'Le gros œuvre, du terrassement aux finitions.',
    intro:
      "Nous réalisons la partie construction d'une piscine : creuser, maçonner, étanchéifier, finir les contours. Une piscine tient d'abord à son gros œuvre.",
    groups: [
      {
        title: 'Gros œuvre',
        items: ['Terrassement', 'Maçonnerie', 'Pose ou construction du bassin'],
      },
      {
        title: 'Finitions',
        items: ['Étanchéité', 'Contours', 'Raccords et finitions'],
      },
    ],
    faqs: [
      {
        q: 'Vous occupez-vous aussi de la technique ?',
        a: "Nous prenons en charge le gros œuvre et les finitions. Pour la filtration et le traitement de l'eau, nous travaillons avec un spécialiste.",
      },
    ],
    projectTags: ['maison'],
  },
];

export const getService = (slug) => SERVICES.find((s) => s.slug === slug);

/** Tous les postes d'un métier, à plat - pour les listes courtes et le SEO. */
export const serviceItems = (service) => (service.groups ?? []).flatMap((g) => g.items);
