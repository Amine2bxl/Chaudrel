/**
 * Détection des capacités, sans rien instancier de lourd.
 * Tout est appelé côté client uniquement (jamais au prérendu).
 */

export function canUseWebGL() {
  /* Simple présence de l'API : créer un contexte pour « tester » coûte cher
     sur un petit appareil, et le moteur en créera un de toute façon. S'il
     échoue, la scène revient d'elle-même à sa version statique. */
  return typeof window !== 'undefined' && Boolean(window.WebGL2RenderingContext || window.WebGLRenderingContext);
}

/** Économie de données demandée par le visiteur : on ne charge pas la 3D. */
export function prefersSavedData() {
  return typeof navigator !== 'undefined' && navigator.connection?.saveData === true;
}

/**
 * Appareil à ménager : écran tactile, petite mémoire ou peu de cœurs.
 * La scène tourne alors avec des ombres et des textures réduites.
 */
export function isLowPower() {
  if (typeof window === 'undefined') return false;
  const coarse = window.matchMedia?.('(pointer: coarse)').matches;
  const mem = navigator.deviceMemory;
  const cores = navigator.hardwareConcurrency;
  return Boolean(coarse || (mem && mem <= 4) || (cores && cores <= 4));
}

/** `overflow: clip` est requis pour que la scène collante fonctionne (voir index.css). */
export function supportsStickyStage() {
  return typeof CSS !== 'undefined' && CSS.supports?.('overflow-x', 'clip') === true;
}
