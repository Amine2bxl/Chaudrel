import { BRAND } from '@/data/site';
import { METHOD } from '@/data/method';

/**
 * Textes de l'expérience d'accueil.
 *
 * Rien n'est inventé pour l'occasion : les promesses reprennent les quatre
 * étapes de `src/data/method.js` et les métiers de `src/data/services.js`.
 * `at` / `until` : fenêtre d'apparition dans le défilement (0 → 1), alignée
 * sur le storyboard de la scène.
 */
export const CHAPTERS = [
  {
    id: 'exploration',
    n: '02',
    label: 'Visite',
    title: 'Lire le lieu avant d’y toucher.',
    text: METHOD[0].text,
    at: 0.17,
    until: 0.36,
  },
  {
    id: 'couches',
    n: '03',
    label: 'Corps de métier',
    title: 'Un chantier se lit couche par couche.',
    text: 'Toiture, façade, structure, finitions, extérieurs : chaque poste a son métier. Nous les coordonnons tous - ou un seul, si c’est ce dont vous avez besoin.',
    at: 0.42,
    until: 0.63,
  },
  {
    id: 'renovation',
    n: '04',
    label: 'Chantier',
    title: 'Du brut au fini, poste par poste.',
    text: METHOD[2].text,
    at: 0.68,
    until: 0.86,
  },
  {
    id: 'resultat',
    n: '05',
    label: 'Livraison',
    title: 'Terminé quand vous le dites.',
    text: 'On parcourt le chantier avec vous avant de rendre les clés. Ceci est une maquette ; ce qui suit, ce sont nos chantiers.',
    at: 0.93,
    until: 1.01,
  },
];

/** Index latéral : les cinq temps du film. */
export const INDEX = [
  { n: '01', label: 'Architecture', at: 0 },
  { n: '02', label: 'Visite', at: 0.27 },
  { n: '03', label: 'Couches', at: 0.52 },
  { n: '04', label: 'Chantier', at: 0.77 },
  { n: '05', label: 'Livraison', at: 1 },
];

/** Annotations de la vue éclatée - chacune mène au métier correspondant. */
export const NOTES = [
  { key: 'toiture', n: '01', label: 'Toiture', to: '/services/toiture', side: 'right' },
  { key: 'facade', n: '02', label: 'Façade', to: '/services/facade', side: 'right' },
  { key: 'structure', n: '03', label: 'Structure', to: '/services/renovation-complete', side: 'left' },
  { key: 'finitions', n: '04', label: 'Finitions', to: '/services/finitions-interieures', side: 'left' },
  { key: 'exterieur', n: '05', label: 'Extérieurs', to: '/services/amenagement-exterieur', side: 'left' },
];

/** Fiche du hero : uniquement des faits de `src/data/site.js`. */
export const SHEET = [
  ['Entreprise', BRAND.legalName],
  ['Siège', `${BRAND.address.city}, Bruxelles`],
  ['Depuis', String(BRAND.founded)],
  ['Zone', BRAND.zone],
  ['Interlocuteurs', BRAND.founders.map((f) => f.name).join(' & ')],
];
