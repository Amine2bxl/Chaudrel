/**
 * Les étapes d'un chantier Chaudrel.
 *
 * Quatre, pas sept. Les sept précédentes décrivaient notre organisation
 * interne : « premier contact », « analyse du projet » et « visite » sont trois
 * lignes dans notre agenda, mais un seul moment pour le client — celui où
 * quelqu'un vient voir. Idem pour « planification » et « travaux ». Découper
 * plus fin ne rassure pas, ça dilue : sept titres se survolent, quatre se
 * lisent.
 *
 * Rien n'a été retiré du fond, seulement du découpage.
 *
 * `icon` désigne un symbole de BrandIcons — le repère posé sur la courbe.
 */
export const METHOD = [
  {
    n: '01',
    title: 'Contact et visite',
    icon: 'pin',
    text: 'Vous nous écrivez ou vous appelez. On vient voir le lieu, mesurer et écouter. Gratuit, sans engagement.',
  },
  {
    n: '02',
    title: 'Devis détaillé',
    icon: 'quote',
    text: 'Un devis poste par poste. Vous savez ce qui est inclus, et ce qui ne l’est pas, avant de décider.',
  },
  {
    n: '03',
    title: 'Chantier',
    icon: 'tools',
    text: 'Dates et ordre des travaux fixés avant de commencer. Un seul interlocuteur vous tient informé.',
  },
  {
    n: '04',
    title: 'Livraison',
    icon: 'check',
    text: 'On parcourt le chantier avec vous. Il est terminé quand vous le dites.',
  },
];
