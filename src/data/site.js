/**
 * Données d'identité de l'entreprise.
 * ⚠️ Toute valeur marquée TODO_VALIDATION doit être confirmée par Chaudrel
 *    avant mise en production (voir VERIFICATION.md).
 */

export const SITE_URL = 'https://chaudrel.be';

export const BRAND = {
  name: 'Chaudrel',
  legalName: 'Chaudrel Rénovation',
  tagline: 'Transformer un espace. Créer un lieu.',
  founded: 2009,
  email: 'Info@chaudrel.be',
  vat: 'BE0812283245',
  address: {
    street: 'Rue Henri Stacquet 49-51',
    postalCode: '1030',
    city: 'Schaerbeek',
    region: 'Bruxelles-Capitale',
    country: 'BE',
    geo: { lat: 50.868, lng: 4.3806 },
  },
  phones: [
    { name: 'Alberto', number: '+32 477 27 31 18', tel: '+32477273118' },
    { name: 'Matteo', number: '+32 493 97 25 17', tel: '+32493972517' },
  ],
  // TODO_VALIDATION : confirmer le numéro utilisé pour WhatsApp Business.
  whatsapp: '32477273118',
  zone: 'Bruxelles & périphérie',
  areaServed: [
    'Bruxelles',
    'Schaerbeek',
    'Uccle',
    'Ixelles',
    'Woluwe-Saint-Pierre',
    'Woluwe-Saint-Lambert',
    'Etterbeek',
    'Waterloo',
    'Tervuren',
    'La Hulpe',
    'Rixensart',
  ],
  socials: {
    instagram: 'https://www.instagram.com/chaudrel_renovation/',
    facebook: 'https://www.facebook.com/profile.php?id=61574019493337',
    youtube: 'https://www.youtube.com/@chaudrelrenovations',
    tiktok: 'https://www.tiktok.com/@chaudrelrenovations',
  },
  founders: [
    { name: 'Alberto', role: "Maître d'œuvre" },
    { name: 'Matteo', role: 'Design & relation client' },
  ],
};

export const LOGO = '/chaudrel-logo.webp';

export const whatsappUrl = (message = 'Bonjour Chaudrel, je souhaite un devis pour mon projet de rénovation.') =>
  `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(message)}`;

export const NAV = [
  { label: 'Réalisations', to: '/realisations' },
  { label: 'Services', to: '/services' },
  { label: 'Notre méthode', to: '/methode' },
  { label: 'À propos', to: '/a-propos' },
  { label: 'FAQ', to: '/faq' },
];

export const MOBILE_NAV = [
  { label: 'Accueil', to: '/' },
  { label: 'Réalisations', to: '/realisations' },
  { label: 'Devis', to: '/devis' },
];

/**
 * Éléments de confiance affichés sous le Hero.
 * Uniquement des faits vérifiables (année de fondation, TVA, zone).
 * Aucun compteur de projets/clients tant que Chaudrel ne l'a pas confirmé.
 */
export const TRUST = [
  { value: `Depuis ${BRAND.founded}`, label: "Années d'expérience" },
  { value: 'Bruxelles', label: 'Et sa périphérie' },
  { value: 'Devis gratuit', label: 'Et sans engagement' },
  { value: BRAND.vat, label: "Entreprise enregistrée" },
];
