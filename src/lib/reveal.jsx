import { motion } from 'motion/react';
import { EASE, REVEAL } from '@/lib/motion';

/**
 * Apparition au scroll, portée par Motion (`whileInView`).
 *
 * `from` : up (défaut, monte en sortant d'un léger flou), down, left, right,
 * fade, line / lineY (filet qui se dessine), veil (image découverte de haut
 * en bas par un volet). `delay` en millisecondes, comme avant.
 *
 * `prefers-reduced-motion` est géré globalement par <MotionConfig
 * reducedMotion="user"> : les déplacements disparaissent, l'opacité reste.
 */
const CREATED = new Map();
const motionTag = (as) => {
  if (typeof as === 'string') return motion[as];
  if (!CREATED.has(as)) CREATED.set(as, motion.create(as));
  return CREATED.get(as);
};

export default function Reveal({
  children,
  as = 'div',
  from = 'up',
  delay = 0,
  once = true,
  margin = '-60px',
  className = '',
  style,
  ...rest
}) {
  const Tag = motionTag(as);
  const transition = { duration: from === 'line' || from === 'lineY' ? 1.1 : 0.9, ease: EASE, delay: delay / 1000 };
  const viewport = { once, margin };

  if (from === 'veil') {
    // Le volet porte sur l'enfant, pas sur l'élément observé : un élément
    // entièrement rogné n'intersecte plus rien.
    return (
      <Tag className={className} style={style} initial="hidden" whileInView="show" viewport={viewport} {...rest}>
        <motion.div
          className="h-full w-full"
          variants={{ hidden: { clipPath: 'inset(0 0 100% 0)' }, show: { clipPath: 'inset(0 0 0% 0)' } }}
          transition={{ duration: 1.2, ease: EASE, delay: delay / 1000 }}
        >
          <motion.div
            className="h-full w-full"
            variants={{ hidden: { scale: 1.08 }, show: { scale: 1 } }}
            transition={{ duration: 1.6, ease: EASE, delay: delay / 1000 }}
          >
            {children}
          </motion.div>
        </motion.div>
      </Tag>
    );
  }

  const v = REVEAL[from] || REVEAL.up;
  const origin = from === 'line' ? 'left center' : from === 'lineY' ? 'center top' : undefined;

  return (
    <Tag
      className={className}
      style={origin ? { transformOrigin: origin, ...style } : style}
      initial="hidden"
      whileInView="show"
      viewport={viewport}
      variants={v}
      transition={transition}
      {...rest}
    >
      {children}
    </Tag>
  );
}
