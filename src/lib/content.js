/**
 * Contenu du site et URLs d'images (Unsplash, libres de droits).
 * Remplacer ces URLs par des assets hébergés sur le site (par ex. Cloudinary,
 * Vercel Blob) pour un contrôle total et de meilleures performances LCP.
 */

export const BRAND = {
  name: 'Chaudrel',
  tagline: 'Rénovation',
  founded: 2009,
  email: 'Info@chaudrel.be',
  phones: [
    { name: 'Alberto', number: '+32 477 27 31 18', tel: '+32477273118' },
    { name: 'Matteo', number: '+32 493 97 25 17', tel: '+32493972517' },
  ],
  zone: 'Bruxelles & Périphérie',
  socials: {
    instagram: 'https://www.instagram.com/chaudrel_renovation/',
    facebook: 'https://www.facebook.com/profile.php?id=61574019493337',
    youtube: 'https://www.youtube.com/@chaudrelrenovations',
    tiktok: 'https://www.tiktok.com/@chaudrelrenovations',
  },
};

// Logo officiel Chaudrel (fichier dans /public, versionné dans Git).
// Chemin absolu servi par Vite depuis le dossier public/.
export const LOGO = '/chaudrel-logo.webp';

export const IMAGES = {
  hero: '/photos/hero.webp',
  beforeAfter: [
    {
      id: 'allee',
      label: 'Allée Extérieure',
      type: 'Asphalte Premium',
      location: 'Uccle, Bruxelles',
      before: '/photos/ba-allee-avant.webp',
      after: '/photos/ba-allee-apres.webp',
    },
    {
      id: 'cuisine',
      label: 'Cuisine Moderne',
      type: 'Marbre & Bois Massif',
      location: 'Ixelles, Bruxelles',
      before: '/photos/ba-cuisine-avant.webp',
      after: '/photos/ba-cuisine-apres.webp',
    },
    {
      id: 'terrasse',
      label: 'Terrasse & Jardin',
      type: 'Pierre Naturelle',
      location: 'Woluwe-Saint-Pierre',
      before: '/photos/ba-terrasse-avant.webp',
      after: '/photos/ba-terrasse-apres.webp',
    },
  ],
  services: [
    {
      id: 'cuisine',
      title: 'Cuisine',
      subtitle: "L'Art Culinaire",
      description:
        "Rénovation de cuisine haut de gamme à Bruxelles — plans de travail en marbre de Carrare, façades en bois massif, îlot central sur mesure. Chaudrel conçoit des cuisines fonctionnelles et élégantes qui valorisent votre bien immobilier.",
      shortDescription:
        "Cuisines sur mesure en marbre de Carrare et bois massif — conception et pose clé en main à Bruxelles.",
      image: '/photos/svc-cuisine.webp',
    },
    {
      id: 'salle-de-bain',
      title: 'Salle de Bain',
      subtitle: 'Sanctuaire Privé',
      description:
        "Rénovation complète de salle de bain à Bruxelles et périphérie — douche italienne, baignoire îlot, carrelage grand format en pierre naturelle, robinetterie premium. Un espace spa sur mesure pour votre quotidien.",
      shortDescription:
        "Douche italienne, baignoire îlot, pierre naturelle — votre salle de bain spa sur mesure.",
      image: '/photos/svc-salle-de-bain.webp',
    },
    {
      id: 'jardin',
      title: 'Jardin & Extérieur',
      subtitle: "Paysage d'Exception",
      description:
        "Aménagement paysager et rénovation d'extérieur en région bruxelloise — terrasse en pierre bleue belge, allée drainante, éclairage basse tension et espaces de vie outdoor clé en main. Expertise locale depuis 2009.",
      shortDescription:
        "Terrasse en pierre bleue, allée drainante, éclairage basse tension — extérieur clé en main.",
      image: '/photos/svc-jardin.webp',
    },
    {
      id: 'toiture',
      title: 'Toiture',
      subtitle: 'Protection & Noblesse',
      description:
        "Rénovation de toiture à Bruxelles — pose d'ardoise naturelle, zinc à joint debout, membrane EPDM, isolation thermique conforme aux normes PEB. Devis gratuit, garantie décennale, intervention rapide.",
      shortDescription:
        "Ardoise, zinc à joint debout, isolation PEB — toiture durable garantie décennale.",
      image: '/photos/svc-toiture.webp',
    },
    {
      id: 'piscine',
      title: 'Piscine',
      subtitle: 'Oasis Privée',
      description:
        "Construction et rénovation de piscine privée à Bruxelles — piscine à débordement, liner sur mesure, pompe à chaleur, carrelage mosaïque ou pierre naturelle. Intégration paysagère soignée pour une valeur ajoutée durable.",
      shortDescription:
        "Piscine à débordement, mosaïque, pompe à chaleur — valeur ajoutée durable.",
      image: '/photos/svc-piscine.webp',
    },
    {
      id: 'nettoyage',
      title: 'Nettoyage',
      subtitle: 'Finition Impeccable',
      description:
        "Service de nettoyage de fin de chantier et d'entretien haut de gamme à Bruxelles — dépoussiérage minutieux, nettoyage des vitres, traitement des sols, désinfection des sanitaires et remise au propre complète avant la livraison. Un chantier rendu clé en main, prêt à habiter.",
      shortDescription:
        "Nettoyage de fin de chantier haut de gamme — livraison prête à habiter.",
      image: '/photos/svc-nettoyage.webp',
    },
  ],
  portfolio: [
    {
      title: 'Résidence Uccle',
      type: 'Rénovation Complète',
      image: '/photos/pf-1.webp',
      span: 'lg:col-span-2',
      aspect: 'aspect-[3/2]',
    },
    {
      title: 'Villa Tervuren — Intérieur',
      type: 'Architecture Intérieure',
      image: '/photos/pf-2.webp',
      span: '',
      aspect: 'aspect-[4/5]',
    },
    {
      title: 'Terrasse Woluwe',
      type: 'Aménagement Extérieur',
      image: '/photos/pf-3.webp',
      span: '',
      aspect: 'aspect-[4/5]',
    },
    {
      title: 'Cuisine Ixelles',
      type: 'Cuisine Sur Mesure',
      image: '/photos/pf-4.webp',
      span: 'lg:col-span-2',
      aspect: 'aspect-[3/2]',
    },
  ],
  story: '/story-before-after.webp',
};