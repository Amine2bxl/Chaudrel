/**
 * Réglages de mouvement partagés - une seule courbe pour tout le site.
 *
 * EASE est la même courbe que `--ease-soft` en CSS : une sortie
 * exponentielle, rapide au départ, qui se pose sans rebond. Aucune entrée
 * n'utilise d'ease-in (elle paraît lente à démarrer).
 */
export const EASE = [0.22, 1, 0.36, 1];

/** Durées en secondes, pour Motion. */
export const DUR = { fast: 0.18, base: 0.28, reveal: 0.9, slow: 1.2 };

/** Ressort des éléments qui suivent le pointeur ou un état (pastille active). */
export const SPRING = { type: 'spring', stiffness: 420, damping: 38, mass: 0.8 };

/** Entrées au scroll : les variantes que <Reveal> applique. */
export const REVEAL = {
  up: { hidden: { opacity: 0, y: 28, filter: 'blur(6px)' }, show: { opacity: 1, y: 0, filter: 'blur(0px)' } },
  down: { hidden: { opacity: 0, y: -20 }, show: { opacity: 1, y: 0 } },
  left: { hidden: { opacity: 0, x: -32 }, show: { opacity: 1, x: 0 } },
  right: { hidden: { opacity: 0, x: 32 }, show: { opacity: 1, x: 0 } },
  fade: { hidden: { opacity: 0 }, show: { opacity: 1 } },
  line: { hidden: { scaleX: 0 }, show: { scaleX: 1 } },
  lineY: { hidden: { scaleY: 0 }, show: { scaleY: 1 } },
};
