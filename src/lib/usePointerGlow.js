import { useCallback } from 'react';

/**
 * Reflet du verre sous le pointeur : pose --mx / --my / --glow sur l'élément.
 * Écrit directement dans le style, sans état React, donc sans re-rendu.
 * Ignoré au toucher : un doigt n'a pas de survol.
 */
export default function usePointerGlow() {
  const onPointerMove = useCallback((e) => {
    if (e.pointerType !== 'mouse') return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - r.left}px`);
    el.style.setProperty('--my', `${e.clientY - r.top}px`);
    el.style.setProperty('--glow', '1');
  }, []);
  const onPointerLeave = useCallback((e) => {
    e.currentTarget.style.setProperty('--glow', '0');
  }, []);
  return { onPointerMove, onPointerLeave };
}
