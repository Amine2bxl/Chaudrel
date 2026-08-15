import { useState } from 'react';
import { cn } from '@/lib/utils';

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
      <div className={cn('relative overflow-hidden bg-sand', ratio)}>
        <img
          key={src}
          src={src}
          alt={`${label} — ${showBefore ? 'avant' : 'après'} travaux`}
          loading="lazy"
          decoding="async"
          className="soft-in h-full w-full object-cover"
        />

        <div
          className="absolute bottom-0 left-0 flex"
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
                't-label px-5 py-3 transition-colors duration-300',
                b.active ? 'bg-cream text-ink' : 'bg-night/70 text-cream/70 hover:text-cream'
              )}
            >
              {b.text}
            </button>
          ))}
        </div>
      </div>

      <figcaption className={cn('t-small mt-4 border-t pt-3', light ? 'border-cream/15 text-cream/55' : 'border-ink/10 text-ink/50')}>
        {label}
      </figcaption>
    </figure>
  );
}
