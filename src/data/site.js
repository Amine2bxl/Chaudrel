/**
 * Identité de l'entreprise.
 * ⚠️ Toute valeur marquée TODO_VALIDATION doit être confirmée par Chaudrel
 *    avant mise en production (voir docs/VERIFICATION.md).
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
    street: 'Rue Henri Stacquet 49\u201151',
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
  /**
   * ⚠️ TODO_VALIDATION — horaires provisoires, posés pour que la fenêtre de
   * contact soit complète. À remplacer par les horaires réels avant mise en
   * ligne (voir docs/VERIFICATION.md). Ne pas publier en l'état.
   */
  hours: [
    { days: 'Lundi – Vendredi', time: '8h – 18h' },
    { days: 'Samedi', time: 'Sur rendez-vous' },
    { days: 'Dimanche', time: 'Fermé' },
  ],
  /**
   * Engagements confirmés par Chaudrel — les seuls affichables.
   * Écartés faute de confirmation : « 150+ projets », « 98 % de satisfaction »,
   * « 5 étoiles Google », « garantie 10 ans toiture ». Ils figurent sur la V1
   * mais nulle part sur chaudrelrenovation.be.
   */
  promises: {
    responseTime: 'Réponse sous 48 h',
    quote: 'Devis gratuit et sans engagement',
  },
  zone: 'Toute la Belgique',
  // Formulation d'usage : le siège ancre, la portée nationale étend. Le site
  // historique listait Bruxelles et le Brabant wallon ; l'entreprise couvre
  // aujourd'hui tout le pays, ce qui reste plus crédible énoncé depuis son
  // point d'attache que proclamé à plat.
  zoneLong: 'De Schaerbeek à toute la Belgique',
  zoneSentence:
    'Notre siège est à Schaerbeek. Nos chantiers, eux, ne s’arrêtent pas au ring : Bruxelles, le Brabant wallon, et les dix provinces.',
  zoneShort: 'Belgique',
  // Villes citées dans le SEO local. Le siège est à Bruxelles, l'intervention
  // couvre le pays — confirmé par Chaudrel comme zone commerciale.
  areaServed: [
    'Bruxelles',
    'Anvers',
    'Gand',
    'Bruges',
    'Louvain',
    'Hasselt',
    'Liège',
    'Namur',
    'Charleroi',
    'Mons',
    'Wavre',
    'Arlon',
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

export const whatsappUrl = (
  message = 'Bonjour Chaudrel, je souhaite un devis pour mon projet de rénovation.'
) => `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(message)}`;

/**
 * Quatre entrées, pas une de plus.
 * Un visiteur vient voir le travail, comprendre ce que Chaudrel prend en
 * charge, savoir comment ça se passe, puis appeler. « À propos » et « FAQ »
 * restent accessibles depuis l'accueil et le pied de page : ce sont des pages
 * qu'on consulte, pas des étapes du parcours.
 */
export const NAV = [
  { label: 'Services', to: '/services' },
  { label: 'Réalisations', to: '/realisations' },
  { label: 'À propos', to: '/a-propos' },
  { label: 'FAQ', to: '/faq' },
];

export const MOBILE_NAV = [
  { label: 'Accueil', to: '/' },
  { label: 'Réalisations', to: '/realisations' },
  { label: 'Devis', to: '/devis' },
];

/**
 * Trois preuves, uniquement des faits vérifiables.
 * Aucun compteur de chantiers ou de clients tant que Chaudrel n'a pas
 * communiqué de chiffre réel.
 */
export const PROOF = [
  { value: `Depuis ${BRAND.founded}`, label: "Entreprise fondée à Bruxelles" },
  { value: 'Toute la Belgique', label: 'Zone d’intervention' },
  { value: 'Un interlocuteur', label: 'Du devis à la livraison' },
];
