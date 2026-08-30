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
 * Observateur partagé.
 *
 * Chaque <Reveal> créait son propre IntersectionObserver : près de quatre-vingts
 * instances sur la page d'accueil, chacune avec son entrée dans la boucle de
 * calcul du navigateur. Un seul observateur par marge suffit, et les rappels
 * sont retrouvés par une WeakMap - pas de fuite quand un nœud disparaît.
 *
 * Créé à la demande : au prérendu, `IntersectionObserver` n'existe pas et rien
 * ne doit être instancié à l'import.
 */
const callbacks = new WeakMap();
const observers = new Map();

function getObserver(margin) {
  if (typeof IntersectionObserver === 'undefined') return null;
  let observer = observers.get(margin);
  if (!observer) {
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          callbacks.get(entry.target)?.(entry.isIntersecting);
        }
      },
      { rootMargin: margin, threshold: 0.05 }
    );
    observers.set(margin, observer);
  }
  return observer;
}

/**
 * Apparition au scroll, sans dépendance externe.
 * `from` choisit le type d'animation : translation, ligne qui se dessine
 * (line / lineY) ou image révélée par un volet (veil).
 * Les préférences `prefers-reduced-motion` sont gérées en CSS.
 */
export default function Reveal({
  children,
  as: Tag = 'div',
  from = 'up',
  delay = 0,
  once = true,
  margin = '-60px',
  className = '',
  style,
  ...rest
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || visible) return undefined;

    const observer = getObserver(margin);
    if (!observer) {
      // Pas d'API disponible : montrer le contenu plutôt que le cacher.
      setVisible(true);
      return undefined;
    }

    callbacks.set(el, (isIntersecting) => {
      if (isIntersecting) {
        setVisible(true);
        if (once) {
          observer.unobserve(el);
          callbacks.delete(el);
        }
      } else if (!once) {
        setVisible(false);
      }
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
      className={cn(VARIANTS[from] || VARIANTS.up, visible && 'is-visible', className)}
      style={{ transitionDelay: `${delay}ms`, ...style }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
