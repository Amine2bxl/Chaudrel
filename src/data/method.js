/**
 * Les étapes d'un chantier Chaudrel.
 *
 * Quatre, pas sept. Les sept précédentes décrivaient notre organisation
 * interne : « premier contact », « analyse du projet » et « visite » sont trois
 * lignes dans notre agenda, mais un seul moment pour le client - celui où
 * quelqu'un vient voir. Idem pour « planification » et « travaux ». Découper
 * plus fin ne rassure pas, ça dilue : sept titres se survolent, quatre se
 * lisent.
 *
 * Rien n'a été retiré du fond, seulement du découpage.
 *
 * `receive` : ce que le client a en main à la fin de l'étape - reformulation
 * du texte, sans promesse supplémentaire.
 */
export const METHOD = [
  {
    n: '01',
    title: 'Contact et visite',
    icon: 'pin',
    text: 'Vous nous écrivez ou vous appelez. On vient voir le lieu, mesurer et écouter. Gratuit, sans engagement.',
    receive: ['Un rendez-vous sur place', 'Un premier avis sur la faisabilité'],
  },
  {
    n: '02',
    title: 'Devis détaillé',
    icon: 'quote',
    text: 'Un devis poste par poste. Vous savez ce qui est inclus, et ce qui ne l’est pas, avant de décider.',
    receive: ['Un devis détaillé, poste par poste', 'La fourniture distinguée de la pose'],
  },
  {
    n: '03',
    title: 'Chantier',
    icon: 'tools',
    text: 'Dates et ordre des travaux fixés avant de commencer. Un seul interlocuteur vous tient informé.',
    receive: ['Les dates et l’ordre des travaux', 'Un interlocuteur unique pendant le chantier'],
  },
  {
    n: '04',
    title: 'Livraison',
    icon: 'check',
    text: 'On parcourt le chantier avec vous. Il est terminé quand vous le dites.',
    receive: ['Une visite de fin de chantier, ensemble'],
  },
];
