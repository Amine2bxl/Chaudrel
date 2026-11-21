/**
 * Réglages de mouvement partagés - une seule courbe pour tout le site.
 *
 * EASE est la même courbe que `--ease-soft` en CSS : une sortie
 * exponentielle, rapide au départ, qui se pose sans rebond. Aucune entrée
 * n'utilise d'ease-in (elle paraît lente à démarrer).
 */
export const EASE = [0.22, 1, 0.36, 1];

/** Ressort des éléments qui suivent le pointeur ou un état (pastille active). */
export const SPRING = { type: 'spring', stiffness: 420, damping: 38, mass: 0.8 };
