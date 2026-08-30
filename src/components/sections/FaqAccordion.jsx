import { Plus } from 'lucide-react';
import Reveal from '@/lib/reveal';
import { cn } from '@/lib/utils';

/**
 * Accordéon de questions.
 *
 * La question dans la voix du site (serif), le texte en grotesque sous elle.
 * Une croix stable invite au geste ; quand la question s'ouvre, un trait
 * laiton entre avec la réponse et signale l'état sans lire le contenu.
 *
 * `tag` est un intitulé affiché au-dessus de la question (le métier, par
 * exemple), quand les questions viennent de sources différentes.
 */
export default function FaqAccordion({ items = [], tone = 'dark', className }) {
  if (!items.length) return null;
  const light = tone === 'light';

  return (
    <div className={cn('space-y-3', className)}>
      {items.map((f, i) => (
        <Reveal
          as="details"
          key={f.q + String(i)}
          delay={Math.min(i, 6) * 60}
          className={cn(
            'group overflow-hidden rounded-lg border transition-colors duration-300 ease-soft',
            'open:border-gold/60',
            light
              ? 'border-cream/15 bg-cream/[0.04] open:bg-cream/[0.06] hover:border-cream/30'
              : 'border-ink/[0.08] bg-shell open:bg-shell hover:border-ink/15'
          )}
        >
          <summary
            className={cn(
              'flex cursor-pointer list-none items-start justify-between gap-5 px-6 py-5 sm:px-7 sm:py-4',
              light ? 'text-cream' : 'text-ink'
            )}
          >
            <span className="min-w-0">
              {f.tag && (
                <span className={cn('t-label block pb-1', light ? 'text-gold-light' : 'text-gold')}>{f.tag}</span>
              )}
              <span className="block font-display text-[1.2rem] leading-snug tracking-[-0.01em] sm:text-[1.3rem]">
                {f.q}
              </span>
            </span>

            {/* La croix tourne sans jamais disparaître : on sait qu'on peut
                rabattre. */}
            <span
              className={cn(
                'mt-0.5 grid h-8 w-8 flex-none place-items-center rounded-full border transition-all duration-300 ease-soft group-open:rotate-45',
                light
                  ? 'border-cream/20 text-cream/70 group-open:border-gold-light group-open:text-gold-light'
                  : 'border-ink/[0.14] text-ink/60 group-open:border-gold group-open:text-gold'
              )}
              aria-hidden="true"
            >
              <Plus className="h-4 w-4" strokeWidth={1.75} />
            </span>
          </summary>

          <div className="px-6 pb-6 sm:px-7 sm:pb-6">
            <span
              aria-hidden="true"
              className={cn('mb-4 block h-px w-9 transition-colors duration-300', light ? 'bg-gold-light/70' : 'bg-gold/70')}
            />
            <p className={cn('faq-a t-body max-w-[62ch]', light ? 'text-cream/70' : 'text-ink/70')}>{f.a}</p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}