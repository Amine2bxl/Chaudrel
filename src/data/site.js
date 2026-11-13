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
  // Graphie telle que Chaudrel l'écrit - conservée pour les `mailto:` et le
  // JSON-LD. Voir EMAIL_DISPLAY plus bas pour l'affichage.
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
  // Numéro WhatsApp publié par Chaudrel sur son Linktree (linktr.ee/chaudrel,
  // vérifié en V6) : celui de Matteo.
  whatsapp: '32493972517',
  /**
   * ⚠️ TODO_VALIDATION - horaires provisoires, posés pour que la fenêtre de
   * contact soit complète. À remplacer par les horaires réels avant mise en
   * ligne (voir docs/VERIFICATION.md). Ne pas publier en l'état.
   */
  hours: [
    { days: 'Lundi - Vendredi', time: '8h - 18h' },
    { days: 'Samedi', time: 'Sur rendez-vous' },
    { days: 'Dimanche', time: 'Fermé' },
  ],
  /**
   * Engagements confirmés par Chaudrel - les seuls affichables.
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
  // couvre le pays - confirmé par Chaudrel comme zone commerciale.
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
  /**
   * Profils vérifiés en V6 :
   *  - Instagram et Facebook : liens publiés par Chaudrel sur linktr.ee/chaudrel.
   *    L'ancienne adresse Facebook (`facebook.com/chaudrel_renovation`) ne peut
   *    pas exister - Facebook refuse le tiret bas dans un nom de page.
   *  - TikTok : le compte `@chaudrel_renovation` existe (« Chaudrel Rénovation »).
   *    La graphie `@chaudrelrenovations` de docs/RESEAUX-SOCIAUX.md n'existe pas.
   *  - YouTube : `@chaudrelrenovations` renvoie 404. Retiré tant que Chaudrel
   *    n'a pas communiqué l'adresse de sa chaîne.
   */
  socials: {
    instagram: 'https://www.instagram.com/chaudrel_renovation/',
    facebook: 'https://www.facebook.com/profile.php?id=61574019493337',
    tiktok: 'https://www.tiktok.com/@chaudrel_renovation',
  },
  /** Page Linktree existante de Chaudrel (vérifiée en V6). */
  linktree: 'https://linktr.ee/chaudrel',
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
 * Navigation principale : ce qu'on vient voir (les chantiers), ce que
 * Chaudrel prend en charge, comment ça se passe, qui c'est. Le logo ramène à
 * l'accueil ; « Contact » ouvre la fenêtre de coordonnées ; la FAQ et les
 * mentions vivent au pied de page.
 */
export const NAV = [
  { label: 'Réalisations', to: '/realisations' },
  { label: 'Services', to: '/services' },
  { label: 'Méthode', to: '/methode' },
  { label: 'À propos', to: '/a-propos' },
];

export const MOBILE_NAV = [
  { label: 'Accueil', to: '/' },
  { label: 'Réalisations', to: '/realisations' },
  { label: 'Devis', to: '/devis' },
];

/**
 * Deux faits, uniquement vérifiables.
 * Aucun compteur de chantiers ou de clients tant que Chaudrel n'a pas
 * communiqué de chiffre réel.
 */
export const PROOF = [
  { value: '17 ans d’expérience', label: 'Depuis 2009' },
  { value: 'Un interlocuteur', label: 'Du devis à la livraison' },
];

/**
 * L'adresse telle qu'on l'affiche : en minuscules.
 *
 * Chaudrel l'écrit « Info@… ». À l'écran, la majuscule se lit comme une faute
 * de frappe, et elle n'apparaissait que sur certaines pages - la même adresse
 * s'écrivait de deux façons selon l'endroit. La casse d'une adresse n'a aucun
 * effet chez les fournisseurs courants : seul l'affichage change, le `mailto:`
 * et le JSON-LD gardent la graphie d'origine.
 */
export const EMAIL_DISPLAY = BRAND.email.toLowerCase();
