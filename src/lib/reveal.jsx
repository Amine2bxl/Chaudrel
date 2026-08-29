import { useEffect, useRef, useState } from 'react';

/**
 * <Reveal> — équivalent léger de framer-motion `whileInView`.
 * Observe l'élément, applique `.rv.is-visible` quand il entre dans le viewport.
 * - `from` : direction de l'animation ('up' | 'down' | 'left' | 'right' | 'fade')
 * - `delay` : délai en ms
 * - `once` : one-shot (défaut true)
 *
 * Forwarde toutes les autres props vers l'élément rendu.
 */
export default function Reveal({
  children,
  as: Tag = 'div',
  from = 'up',
  delay = 0,
  once = true,
  margin = '-40px',
  className = '',
  ...rest
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || visible) return;

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

  const cls = [
    'rv',
    `rv-${from}`,
    visible ? 'is-visible' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <Tag ref={ref} className={cls} style={{ transitionDelay: `${delay}ms` }} {...rest}>
      {children}
    </Tag>
  );
}