/**
 * Le fil du site : une seule histoire, en six verbes.
 *
 * Elle est racontée en entier par la maquette 3D de l'accueil, et chaque page
 * en porte un temps (repère en tête de page, rappel en pied de page). Six
 * mots, toujours dans cet ordre, toujours écrits de la même façon : c'est ce
 * qui fait qu'on ne change pas d'univers en changeant de page.
 */
export const STORY = [
  { id: 'imaginer', n: '01', verb: 'Imaginer' },
  { id: 'concevoir', n: '02', verb: 'Concevoir' },
  { id: 'preparer', n: '03', verb: 'Préparer' },
  { id: 'renover', n: '04', verb: 'Rénover' },
  { id: 'transformer', n: '05', verb: 'Transformer' },
  { id: 'reveler', n: '06', verb: 'Révéler' },
];

export const storyStep = (id) => STORY.find((s) => s.id === id);

/**
 * Le temps que porte chaque page. Les fiches héritent de leur rubrique.
 *   devis         on imagine son projet, on le décrit
 *   à propos      ceux qui conçoivent
 *   méthode, FAQ  ce qui se prépare avant le chantier
 *   services      les métiers du chantier
 *   réalisations  ce qui a été transformé, puis révélé
 */
export const PAGE_STEP = {
  '/devis': 'imaginer',
  '/visite': 'transformer',
  '/a-propos': 'concevoir',
  '/methode': 'preparer',
  '/faq': 'preparer',
  '/services': 'renover',
  '/realisations': 'reveler',
};

export function stepForPath(path = '/') {
  const pathname = path.length > 1 ? path.replace(/\/+$/, '') : path;
  const key = Object.keys(PAGE_STEP).find((p) => pathname === p || pathname.startsWith(`${p}/`));
  if (!key) return null;
  // Une fiche de chantier montre la transformation ; la galerie, le résultat.
  if (key === '/realisations' && pathname !== key) return storyStep('transformer');
  return storyStep(PAGE_STEP[key]);
}
