/**
 * Détection des capacités, sans rien instancier de lourd.
 * Tout est appelé côté client uniquement (jamais au prérendu).
 */

export function canUseWebGL() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return false;
  try {
    const c = document.createElement('canvas');
    const gl = c.getContext('webgl2') || c.getContext('webgl');
    if (!gl) return false;
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return true;
  } catch {
    return false;
  }
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
