/**
 * FAQ générale.
 *
 * Les réponses ne s'appuient que sur des informations vérifiées : les six
 * métiers annoncés par chaudrelrenovation.be, la zone d'intervention confirmée
 * par Chaudrel, et les engagements confirmés (devis gratuit sans engagement,
 * réponse sous 48 h ouvrées, un seul interlocuteur).
 *
 * ⚠️ Aucun prix ni durée de chantier n'est affirmé. Les durées de la V1
 * (« 3 à 6 semaines pour une cuisine ») n'ont pas été confirmées et ne sont
 * pas reprises.
 */

import { BRAND } from '@/data/site';

export const FAQS = [
  {
    q: 'Quels travaux réalisez-vous ?',
    a: "Six métiers : rénovation complète, finitions intérieures, aménagement extérieur, toiture, façade et gros œuvre de piscine. Le contenu exact de chaque métier est détaillé sur la page Services.",
  },
  {
    q: 'Où intervenez-vous ?',
    a: `${BRAND.zoneSentence} Bruxelles reste notre ancrage, mais nous nous déplaçons dans les dix provinces.`,
  },
  {
    q: 'Le devis est-il gratuit ?',
    a: 'Oui, devis gratuit et sans engagement, visite comprise. Vous décrivez votre projet, nous venons voir le lieu, puis vous recevez un devis détaillé poste par poste.',
  },
  {
    q: 'Sous combien de temps répondez-vous ?',
    a: `${BRAND.promises.responseTime}. Nous convenons ensuite d'un créneau de visite, en général sous quelques jours.`,
  },
  {
    q: 'Comment se déroule un projet ?',
    a: "En quatre étapes : contact et visite, devis détaillé, chantier, puis livraison faite ensemble. Vous savez à tout moment où en sont les travaux.",
  },
  {
    q: 'Puis-je habiter chez moi pendant les travaux ?',
    a: "Souvent oui, selon l'ampleur du chantier. On en parle lors de la visite, et le devis vous le confirme par écrit.",
  },
  {
    q: 'Coordonnez-vous les corps de métier ?',
    a: 'Oui. Vous traitez avec une seule personne, du premier rendez-vous à la remise des clés ; il n’y a rien à coordonner de votre côté.',
  },
  {
    q: 'Qui suit le chantier ?',
    a: "Un interlocuteur unique, présent sur place. C'est une entreprise familiale fondée en 2009, et le patron passe sur les chantiers.",
  },
  {
    q: 'Fournissez-vous les matériaux ?',
    a: 'Oui, nous pouvons fournir ou poser les vôtres. Le devis distingue toujours la fourniture de la pose.',
  },
  {
    q: 'Travaillez-vous avec un architecte ?',
    a: "Volontiers, avec l'architecte de votre choix. Si votre projet en exige un, nous vous le disons dès la visite.",
  },
];