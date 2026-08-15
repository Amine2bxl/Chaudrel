import { useState } from 'react';
import { cn } from '@/lib/utils';

/**
 * Comparateur avant/après accessible : deux boutons, pas de drag.
 * Fonctionne au clavier, au tactile, et reste lisible sans JS (l'image
 * « après » est rendue par défaut).
 */
export default function BeforeAfter({ before, after, label, className, aspect = 'aspect-[4/3]' }) {
  const [showBefore, setShowBefore] = useState(false);
  const src = showBefore ? before : after;

  return (
    <figure className={cn('relative overflow-hidden bg-brand-sand', className)}>
      <div className={cn(aspect, 'overflow-hidden')}>
        <img
          key={src}
          src={src}
          alt={`${label} — ${showBefore ? 'avant' : 'après'} travaux`}
          loading="lazy"
          decoding="async"
          className="ba-slide h-full w-full object-cover"
        />
      </div>

      <div
        className="absolute left-4 top-4 inline-flex overflow-hidden rounded-full border border-white/25 bg-brand-ink/50 backdrop-blur-sm"
        role="group"
        aria-label={`Comparer avant et après — ${label}`}
      >
        {[
          { key: 'before', text: 'Avant', active: showBefore },
          { key: 'after', text: 'Après', active: !showBefore },
        ].map((b) => (
          <button
            key={b.key}
            type="button"
            aria-pressed={b.active}
            onClick={() => setShowBefore(b.key === 'before')}
            className={cn(
              'px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] transition-colors',
              b.active ? 'bg-brand-gold text-white' : 'text-white/75 hover:text-white'
            )}
          >
            {b.text}
          </button>
        ))}
      </div>

      <figcaption className="sr-only">{label} — comparaison avant / après travaux</figcaption>
    </figure>
  );
}
