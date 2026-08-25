import { useState } from 'react';
import { cn } from '@/lib/utils';
import { imageAttrs, SIZES } from '@/lib/image';

/**
 * Comparateur avant / après : deux boutons, pas de glissière.
 * Accessible au clavier, lisible au tactile, sans dépendance.
 */
export default function BeforeAfter({ before, after, label, ratio = 'aspect-[4/3]', className, tone = 'dark' }) {
  const [showBefore, setShowBefore] = useState(false);
  const src = showBefore ? before : after;
  const light = tone === 'light';

  return (
    <figure className={cn('group', className)}>
      <div className={cn('relative overflow-hidden rounded-lg bg-sand', ratio)}>
        <img
          key={src}
          {...imageAttrs(src, SIZES.half)}
          alt={`${label} — ${showBefore ? 'avant' : 'après'} travaux`}
          width="1200"
          height="800"
          loading="lazy"
          decoding="async"
          className="soft-in h-full w-full object-cover"
        />

        <div
          className="absolute bottom-3 left-3 flex gap-1 rounded-full bg-bark/45 p-1 backdrop-blur-md sm:bottom-4 sm:left-4"
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
                't-label rounded-full px-4 py-2.5 transition-colors duration-300',
                b.active ? 'bg-cream text-ink shadow-soft' : 'text-cream/75 hover:text-cream'
              )}
            >
              {b.text}
            </button>
          ))}
        </div>
      </div>

      <figcaption className={cn('t-small mt-4 border-t pt-3', light ? 'border-cream/15 text-cream/65' : 'border-ink/10 text-ink/65')}>
        {label}
      </figcaption>
    </figure>
  );
}
