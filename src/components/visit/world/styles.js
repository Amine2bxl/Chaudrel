/**
 * Matières et finitions - données seules (aucune dépendance à three.js), pour
 * que l'interface puisse les lire sans charger le moteur 3D.
 */

/**
 * Bibliothèque : chaque entrée est une matière concrète.
 *   type   fonction GLSL
 *   size   côté de la dalle (m) - la texture se répète à cette échelle
 *   tint / tint2  teintes (sRGB)
 *   bump   intensité du relief
 *   res    'hi' : définition pleine (sols, plans de travail), sinon moitié
 *   pbr    réglages du matériau (metalness, rugosité, etc.)
 */
export const LIBRARY = {
  travertine: { type: 'travertine', size: 1.2, tint: '#d9c9b1', tint2: '#c4ab88', bump: 5, res: 'hi' },
  // bloc massif : même pierre, sans joints (tables, piètements, plans)
  travertineBlock: { type: 'travertine', size: 6, tint: '#dacbb4', tint2: '#c4ab88', bump: 4 },
  travertineWarm: { type: 'travertine', size: 1.2, tint: '#d6c1a2', tint2: '#b9976d', bump: 5, res: 'hi' },
  marble: { type: 'marble', size: 1.6, tint: '#efebe5', tint2: '#8f8578', bump: 1, res: 'hi' },
  marbleDark: { type: 'marble', size: 1.6, tint: '#2e2b29', tint2: '#b9a891', bump: 1, res: 'hi' },
  chevronOak: { type: 'chevron', size: 1.2, tint: '#b88d62', tint2: '#8a6440', bump: 4, res: 'hi' },
  chevronWalnut: { type: 'chevron', size: 1.2, tint: '#6e4c34', tint2: '#3e2a1d', bump: 4, res: 'hi' },
  oakPlanks: { type: 'planks', size: 2.4, tint: '#c09a72', tint2: '#8a6440', bump: 3.5, res: 'hi' },
  walnut: { type: 'walnut', size: 1.2, tint: '#6b4a33', tint2: '#3b2719', bump: 2 },
  oakVeneer: { type: 'walnut', size: 1.2, tint: '#b99467', tint2: '#8f6a45', bump: 2 },
  plaster: { type: 'plaster', size: 2.0, tint: '#eee8de', tint2: '#d9cdbd', bump: 3 },
  plasterGrey: { type: 'plaster', size: 2.0, tint: '#d7d2ca', tint2: '#bdb5aa', bump: 3 },
  concreteBlock: { type: 'concrete', size: 2.4, tint: '#b3ada4', tint2: '#968f85', bump: 2 },
  concrete: { type: 'concrete', size: 2.4, tint: '#a9a39a', tint2: '#8d867c', bump: 3, res: 'hi' },
  boucle: { type: 'boucle', size: 0.18, tint: '#ebe5da', bump: 6 },
  linen: { type: 'linen', size: 0.12, tint: '#e3dccf', bump: 3 },
  linenSage: { type: 'linen', size: 0.12, tint: '#a8ad98', bump: 3 },
  wool: { type: 'wool', size: 0.8, tint: '#ddd3c3', tint2: '#b9ab95', bump: 2 },
  brass: { type: 'brushed', size: 0.4, tint: '#c9a467', bump: 1 },
  steel: { type: 'steel', size: 0.6, tint: '#1d1d1c', bump: 1 },
  lawn: { type: 'lawn', size: 5, tint: '#5f7340', tint2: '#7f8f4f', bump: 2 },
  pavers: { type: 'pavers', size: 1.8, tint: '#c9bfae', tint2: '#8b8273', bump: 4 },
  screed: { type: 'screed', size: 3, tint: '#9a968f', tint2: '#6f6a61', bump: 3, res: 'hi' },
  rawPlaster: { type: 'rawplaster', size: 2.4, tint: '#cfccc6', tint2: '#d9b8a6', bump: 3 },
  brick: { type: 'brick', size: 1.2, tint: '#8f4a32', tint2: '#5e3324', bump: 6, res: 'hi' },
};

/**
 * Styles : trois finitions pour la même maison. Un style associe chaque
 * emplacement (sol de pierre, parquet, menuiserie…) à une matière.
 */
export const STYLES = {
  'travertin-chene': {
    name: 'Travertin & chêne',
    line: 'Pierre claire, chêne naturel, enduit à la chaux.',
    labels: { stone: 'Travertin adouci', chevron: 'Chêne, point de Hongrie', oak: 'Chêne, lames larges', joinery: 'Noyer', marble: 'Marbre Calacatta', plaster: 'Enduit à la chaux', metal: 'Laiton brossé', fabric: 'Bouclette', glass: 'Verre clair' },
    slots: { stone: 'travertine', stoneSolid: 'travertineBlock', chevron: 'chevronOak', oak: 'oakPlanks', joinery: 'walnut', marble: 'marble', plaster: 'plaster', metal: 'brass', fabric: 'boucle' },
  },
  'marbre-noyer': {
    name: 'Marbre & noyer',
    line: 'Noyer en point de Hongrie, marbre sombre, laiton.',
    labels: { stone: 'Travertin miel', chevron: 'Noyer, point de Hongrie', oak: 'Chêne, lames larges', joinery: 'Chêne clair', marble: 'Marbre Nero', plaster: 'Enduit gris', metal: 'Laiton brossé', fabric: 'Lin sauge', glass: 'Verre clair' },
    slots: { stone: 'travertineWarm', stoneSolid: 'travertineBlock', chevron: 'chevronWalnut', oak: 'oakPlanks', joinery: 'oakVeneer', marble: 'marbleDark', plaster: 'plasterGrey', metal: 'brass', fabric: 'linenSage' },
  },
  'beton-laiton': {
    name: 'Béton & laiton',
    line: 'Béton ciré, chêne clair, acier noirci.',
    labels: { stone: 'Béton ciré', chevron: 'Béton ciré', oak: 'Chêne, lames larges', joinery: 'Chêne clair', marble: 'Marbre Calacatta', plaster: 'Enduit à la chaux', metal: 'Acier noirci', fabric: 'Bouclette', glass: 'Verre clair' },
    slots: { stone: 'concrete', stoneSolid: 'concreteBlock', chevron: 'concrete', oak: 'oakPlanks', joinery: 'oakVeneer', marble: 'marble', plaster: 'plaster', metal: 'steel', fabric: 'boucle' },
  },
};
export const DEFAULT_STYLE = 'travertin-chene';

