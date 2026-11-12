import { useId, useState } from 'react';
import { cn } from '@/lib/utils';
import { imageAttrs, SIZES } from '@/lib/image';

/**
 * Comparateur avant / après à glissière.
 *
 * Les deux photos sont superposées, jamais étirées : même cadre, même
 * recadrage (`object-cover`), et un volet qui découvre l'une sur l'autre.
 *
 * La glissière est un `<input type="range">` natif posé sur l'image : il
 * apporte le clavier (flèches, Début / Fin), le tactile et l'annonce aux
 * lecteurs d'écran sans une ligne de gestion d'événements. `touch-action:
 * pan-y` laisse la page défiler verticalement quand le doigt part de l'image.
 */
export default function BeforeAfter({ before, after, label, ratio = 'aspect-[3/2]', className, tone = 'dark', sizes = SIZES.half }) {
  const [pos, setPos] = useState(50);
  const id = useId();
  const light = tone === 'light';

  const photo = (src, state) => (
    <img
      {...imageAttrs(src, sizes)}
      alt={`${label} - ${state} travaux`}
      width="1200"
      height="800"
      loading="lazy"
      decoding="async"
      draggable="false"
      className="absolute inset-0 h-full w-full select-none object-cover"
    />
  );

  return (
    <figure className={cn('group', className)}>
      <div className={cn('ba relative overflow-hidden rounded-lg bg-sand', ratio)} style={{ '--ba': `${pos}%` }}>
        {photo(after, 'après')}
        <div className="ba-before absolute inset-0">{photo(before, 'avant')}</div>

        <span className="t-label pointer-events-none absolute left-3 top-3 rounded-full bg-bark/55 px-3 py-2 text-cream backdrop-blur-sm sm:left-4 sm:top-4">
          Avant
        </span>
        <span className="t-label pointer-events-none absolute right-3 top-3 rounded-full bg-cream/85 px-3 py-2 text-ink backdrop-blur-sm sm:right-4 sm:top-4">
          Après
        </span>

        <span className="ba-handle" aria-hidden="true">
          <span>
            <svg width="18" height="10" viewBox="0 0 18 10" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M5 1 1 5l4 4M13 1l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </span>

        <label htmlFor={id} className="sr-only">
          Comparer avant et après - {label}
        </label>
        <input
          id={id}
          type="range"
          min="0"
          max="100"
          step="1"
          value={pos}
          onChange={(e) => setPos(Number(e.target.value))}
          aria-valuetext={`${pos} % de la photo « avant » visible`}
          className="ba-range"
        />
      </div>

      <figcaption className={cn('t-small mt-4 border-t pt-3', light ? 'border-cream/15 text-cream/65' : 'border-ink/10 text-ink/65')}>
        {label}
      </figcaption>
    </figure>
  );
}
