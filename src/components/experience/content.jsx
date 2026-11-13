import { BRAND } from '@/data/site';
import { METHOD } from '@/data/method';
import { STORY } from '@/data/story';
import { STEPS } from './scene/storyboard.js';

/**
 * Textes de l'expérience d'accueil.
 *
 * Rien n'est inventé pour l'occasion : les promesses reprennent les quatre
 * étapes de `src/data/method.js` et les métiers de `src/data/services.js`.
 * `at` / `until` : fenêtre d'apparition dans le défilement (0 → 1), alignée
 * sur le storyboard de la scène.
 */
const step = (id) => STORY.find((s) => s.id === id);

export const CHAPTERS = [
  {
    ...step('concevoir'),
    title: (
      <>
        Tout commence sur <em>le papier.</em>
      </>
    ),
    text: `On vient voir le lieu, mesurer et écouter. ${METHOD[1].text}`,
    at: 0.155,
    until: 0.285,
  },
  {
    ...step('preparer'),
    title: (
      <>
        Chaque matière a <em>son métier.</em>
      </>
    ),
    text: 'Pierre, bois, enduits, couverture, menuiseries : six métiers, que nous coordonnons - ou un seul, si c’est ce dont vous avez besoin.',
    at: 0.325,
    until: 0.47,
  },
  {
    ...step('renover'),
    title: (
      <>
        Un chantier se lit <em>couche par couche.</em>
      </>
    ),
    text: METHOD[2].text,
    at: 0.52,
    until: 0.67,
  },
  {
    ...step('transformer'),
    title: (
      <>
        Du brut au fini, <em>poste par poste.</em>
      </>
    ),
    text: 'La finition monte des fondations à la toiture, dans l’ordre où un chantier se termine. Vous savez à tout moment ce qui est fait et ce qui vient ensuite.',
    at: 0.715,
    until: 0.865,
  },
  {
    ...step('reveler'),
    title: (
      <>
        Terminé quand <em>vous le dites.</em>
      </>
    ),
    text: 'On parcourt le chantier avec vous avant de rendre les clés. Ceci est une maquette ; ce qui suit, ce sont nos chantiers.',
    at: 0.93,
    until: 1.01,
  },
];

/** Index latéral : les six temps du film. */
export const INDEX = STORY.map((s, i) => ({ n: s.n, label: s.verb, at: STEPS[i].at }));

/** Annotations de la vue éclatée - chacune mène au métier correspondant. */
export const NOTES = [
  { key: 'toiture', n: '01', label: 'Toiture', to: '/services/toiture', side: 'right' },
  { key: 'facade', n: '02', label: 'Façade', to: '/services/facade', side: 'right' },
  { key: 'structure', n: '03', label: 'Structure', to: '/services/renovation-complete', side: 'left' },
  { key: 'finitions', n: '04', label: 'Finitions', to: '/services/finitions-interieures', side: 'left' },
  { key: 'exterieur', n: '05', label: 'Extérieurs', to: '/services/amenagement-exterieur', side: 'left' },
];
export const NOTES_WINDOW = { at: 0.545, until: 0.655, focus: 0.6 };

/** Étiquettes des échantillons : des matières, pas des promesses. */
export const MATERIALS = [
  { key: 'pierre', label: 'Pierre' },
  { key: 'chene', label: 'Chêne' },
  { key: 'bardage', label: 'Bardage' },
  { key: 'enduit', label: 'Enduit' },
  { key: 'dallage', label: 'Dallage' },
  { key: 'laiton', label: 'Laiton' },
];
export const MATERIALS_WINDOW = { at: 0.365, until: 0.455 };

/** Fiche du hero : uniquement des faits de `src/data/site.js`. */
export const SHEET = [
  ['Entreprise', BRAND.legalName],
  ['Siège', `${BRAND.address.city}, Bruxelles`],
  ['Depuis', String(BRAND.founded)],
  ['Zone', BRAND.zone],
  ['Interlocuteurs', BRAND.founders.map((f) => f.name).join(' & ')],
];
