import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

const VARIANTS = {
  up: 'rv rv-up',
  down: 'rv rv-down',
  left: 'rv rv-left',
  right: 'rv rv-right',
  fade: 'rv rv-fade',
  line: 'rv-line',
  lineY: 'rv-line-y',
  veil: 'rv-veil',
};

/**
 * Un seul IntersectionObserver par marge pour toute la page ; les rappels
 * sont retrouvés par une WeakMap. Créé à la demande : au prérendu,
 * `IntersectionObserver` n'existe pas.
 */
const callbacks = new WeakMap();
const observers = new Map();

function getObserver(margin) {
  if (typeof IntersectionObserver === 'undefined') return null;
  let observer = observers.get(margin);
  if (!observer) {
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) callbacks.get(entry.target)?.(entry.isIntersecting);
      },
      { rootMargin: margin, threshold: 0.05 }
    );
    observers.set(margin, observer);
  }
  return observer;
}

/**
 * Apparition au scroll, en CSS pur : une classe posée une fois, puis la
 * carte graphique fait le reste (transform + opacity seulement, jamais de
 * flou ni de propriété qui repeint la page). Aucun calcul par image, donc
 * aucune énergie dépensée une fois l'élément apparu.
 *
 * `from` : up (défaut), down, left, right, fade, line / lineY (filet qui se
 * dessine), veil (photo découverte par un volet qui glisse). `delay` en ms.
 */
export default function Reveal({
  children,
  as: Tag = 'div',
  from = 'up',
  delay = 0,
  once = true,
  margin = '0px 0px -8% 0px',
  className = '',
  style,
  ...rest
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || (visible && once)) return undefined;
    const observer = getObserver(margin);
    if (!observer) {
      setVisible(true);
      return undefined;
    }
    callbacks.set(el, (inView) => {
      if (inView) {
        setVisible(true);
        if (once) {
          observer.unobserve(el);
          callbacks.delete(el);
        }
      } else if (!once) setVisible(false);
    });
    observer.observe(el);
    return () => {
      observer.unobserve(el);
      callbacks.delete(el);
    };
  }, [once, margin, visible]);

  return (
    <Tag
      ref={ref}
      className={cn(VARIANTS[from] || VARIANTS.up, visible && 'is-in', className)}
      style={delay ? { '--rv-delay': `${delay}ms`, ...style } : style}
      {...rest}
    >
      {children}
    </Tag>
  );
}
