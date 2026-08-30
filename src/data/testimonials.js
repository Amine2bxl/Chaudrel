/**
 * Avis clients.
 *
 * ⚠️ ATTENTION - CONTENU À VALIDER AVANT MISE EN PRODUCTION
 * Ces avis proviennent de la V1 du site et n'ont PAS été vérifiés.
 * Chaudrel doit confirmer chaque avis (texte, prénom, projet, date) ou le
 * remplacer par un vrai avis Google. Aucun avis n'a été inventé ici.
 * Conformément au RGPD et aux règles sur les avis en ligne, seuls le prénom
 * et l'initiale du nom sont affichés.
 *
 * TESTIMONIALS_VALIDATED : passer à true une fois la validation faite.
 */

export const TESTIMONIALS_VALIDATED = false;

// TODO_VALIDATION : lien vers la fiche Google Business de Chaudrel.
export const GOOGLE_REVIEWS_URL = null;

export const TESTIMONIALS = [
  {
    id: 'av',
    name: 'Alexandre V.',
    location: 'Uccle, Bruxelles',
    rating: 5,
    date: 'Mars 2025',
    project: 'Rénovation complète',
    quote:
      "Chaudrel a transformé notre villa de fond en comble. La qualité des matériaux, la précision des finitions et le sérieux de l'équipe sont sans égal. Alberto et Matteo ont su réaliser notre vision à la perfection.",
  },
  {
    id: 'sd',
    name: 'Sophie D.',
    location: 'Ixelles, Bruxelles',
    rating: 5,
    date: 'Février 2025',
    project: 'Cuisine & salle de bain',
    quote:
      "Notre cuisine est désormais le cœur de notre maison. Les matériaux sélectionnés par Chaudrel, les finitions, tout est soigné. Délais respectés à la lettre.",
  },
  {
    id: 'mw',
    name: 'Marc W.',
    location: 'Tervuren',
    rating: 5,
    date: 'Janvier 2025',
    project: 'Extérieur',
    quote:
      "Deux chantiers menés en parallèle avec une organisation impeccable. Le résultat dépasse nos attentes. Merci à toute l'équipe Chaudrel.",
  },
  {
    id: 'cl',
    name: 'Catherine L.',
    location: 'Woluwe-Saint-Pierre',
    rating: 5,
    date: 'Décembre 2024',
    project: 'Allée extérieure',
    quote:
      "La transformation de notre allée est spectaculaire. Propre, rapide, et un résultat magnifique.",
  },
  {
    id: 'pm',
    name: 'Philippe M.',
    location: 'Waterloo',
    rating: 5,
    date: 'Novembre 2024',
    project: 'Rénovation complète',
    quote:
      "Chaudrel a pris en charge la rénovation intégrale de notre maison. Un seul interlocuteur pour tout gérer, c'est un luxe en soi. Aucune surprise.",
  },
  {
    id: 'ir',
    name: 'Isabelle R.',
    location: 'Uccle, Bruxelles',
    rating: 5,
    date: 'Octobre 2024',
    project: 'Terrasse',
    quote:
      "La rénovation de notre terrasse a été réalisée avec un soin exceptionnel. Nous avons enfin l'espace extérieur dont nous rêvions.",
  },
];
