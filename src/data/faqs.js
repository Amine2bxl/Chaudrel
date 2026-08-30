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
    a: "Six métiers : rénovation complète, finitions intérieures, aménagement extérieur, toiture, façade et gros œuvre de piscine. Le détail est sur la page Services.",
  },
  {
    q: 'Où intervenez-vous ?',
    a: `${BRAND.zoneSentence} Bruxelles est notre ancrage, mais nous nous déplaçons dans les dix provinces.`,
  },
  {
    q: 'Le devis est-il gratuit ?',
    a: `Oui, gratuit et sans engagement, visite comprise. Nous répondons sous ${BRAND.promises.responseTime.toLowerCase()} puis vous remettons un devis détaillé.`,
  },
  {
    q: 'Combien de temps durent les travaux ?',
    a: "Cela dépend de l'ampleur et de l'état du bâtiment. Le planning précis accompagne le devis, et le calendrier est fixé avant de commencer.",
  },
  {
    q: 'Comment se déroule un projet ?',
    a: "En quatre étapes : contact et visite, devis détaillé, chantier, puis livraison faite ensemble. Un seul interlocuteur vous tient informé.",
  },
  {
    q: 'Puis-je habiter chez moi pendant les travaux ?',
    a: "Souvent oui, selon l'ampleur du chantier. On en parle à la visite, et le devis vous le confirme par écrit.",
  },
  {
    q: 'Qui mène le chantier ?',
    a: "Un interlocuteur unique, présent sur place. C'est une entreprise familiale fondée en 2009, et le patron passe sur les chantiers.",
  },
  {
    q: 'Fournissez-vous les matériaux ?',
    a: 'Oui, ou nous posons les vôtres. Le devis distingue toujours la fourniture de la pose.',
  },
];