import { useMotionValue, useMotionValueEvent, useScroll } from 'motion/react';

/**
 * Progression du défilement d'une section (0 → 1), relayée par une valeur
 * Motion ordinaire.
 *
 * Le relais est voulu : passée directement à `useTransform`, la progression
 * de `useScroll({ target })` est confiée à l'API ScrollTimeline du
 * navigateur, qui se trompe de plage pour une cible (opacités inversées
 * constatées en novembre 2026, Motion 12.43). Une valeur intermédiaire
 * garde le calcul côté Motion.
 */
export default function useSectionProgress(ref, offset = ['start end', 'end start']) {
  const { scrollYProgress } = useScroll({ target: ref, offset });
  const progress = useMotionValue(0);
  useMotionValueEvent(scrollYProgress, 'change', (v) => progress.set(v));
  return progress;
}
