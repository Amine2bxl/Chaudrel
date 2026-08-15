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

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setVisible(false);
        }
      },
      { rootMargin: margin, threshold: 0.05 }
    );

    observer.observe(el);
    return () => observer.disconnect();
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
