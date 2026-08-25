/**
 * FAQ générale.
 *
 * Les réponses ne s'appuient que sur des informations vérifiées : les métiers
 * annoncés par chaudrelrenovation.be, la zone d'intervention confirmée par
 * Chaudrel, et les deux engagements confirmés (devis gratuit sans engagement,
 * réponse sous 48 h).
 *
 * ⚠️ Aucun prix ni durée de chantier n'est affirmé. La V1 annonçait « 3 à 6
 *    semaines pour une cuisine » et « 2 à 4 mois pour une rénovation
 *    complète » : ces durées n'ont pas été confirmées, elles ne sont donc pas
 *    reprises. Les entrées `pending: true` sont exclues du JSON-LD FAQPage.
 */

import { BRAND } from '@/data/site';

export const FAQS = [
  {
    q: 'Quels travaux réalisez-vous ?',
    a: "Six métiers : la rénovation complète, les finitions intérieures (chape, carrelage, parquet, cloisons, plafonnage, peinture), l'aménagement extérieur (terrassement, pavage, terrasses, annexes), la toiture (charpente, couverture, étanchéité, zinguerie), la façade (ravalement, isolation, parement, rejointoiement) et le gros œuvre de piscine.",
  },
  {
    q: 'Où intervenez-vous ?',
    a: `${BRAND.zoneSentence} Notre ancrage historique reste Bruxelles et sa périphérie, mais nous nous déplaçons dans les dix provinces.`,
  },
  {
    q: 'Le devis est-il gratuit ?',
    a: "Oui, gratuit et sans engagement. Vous décrivez votre projet, nous venons voir le lieu, puis nous remettons un devis détaillé poste par poste. Nous répondons à votre demande sous 48 heures.",
  },
  {
    q: 'Comment se déroule un projet ?',
    a: "En quatre étapes : contact et visite, devis détaillé, chantier, livraison. Un seul interlocuteur suit le chantier du début à la fin.",
  },
  {
    q: 'Prenez-vous en charge une rénovation complète ?',
    a: "Oui, du gros œuvre aux finitions, pour un appartement, une maison ou un commerce. Nous coordonnons tous les corps de métier : vous n'avez qu'un seul contact.",
  },
  {
    q: 'Quels matériaux utilisez-vous ?',
    a: "Cela dépend du poste : tuiles ou ardoises en toiture inclinée, EPDM® ou Derbigum® en toiture plate, Gyproc® et ossature Metal Stud® en cloisons, briques de parement, crépi ou cimentage en façade. Nous pouvons fournir les matériaux ou poser les vôtres ; le devis distingue toujours la fourniture de la pose.",
  },
  {
    q: 'Combien de temps durent les travaux ?',
    a: "La durée dépend de l'ampleur du chantier et de l'état du bâtiment. Nous vous remettons un planning précis avec le devis, et le calendrier est fixé avant le premier jour de travaux.",
  },
  {
    q: 'Qui suit le chantier ?',
    a: "Un interlocuteur unique, présent sur le chantier. C'est une entreprise familiale : le patron passe sur les chantiers, et vous savez à tout moment où en sont les travaux.",
  },
  {
    q: 'Travaillez-vous avec des architectes ?',
    a: "Nous collaborons volontiers avec l'architecte de votre choix. Si votre projet en nécessite un, nous vous le disons dès la visite.",
  },
];
