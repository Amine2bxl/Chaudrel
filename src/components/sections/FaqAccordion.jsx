import { Plus } from 'lucide-react';
import Reveal from '@/lib/reveal';
import { cn } from '@/lib/utils';

export default function FaqAccordion({ items = [], tone = 'dark', className }) {
  if (!items.length) return null;
  const light = tone === 'light';

  return (
    <div className={cn('space-y-2.5', className)}>
      {items.map((f, i) => (
        <Reveal
          as="details"
          key={f.q}
          delay={i * 50}
          className={cn(
            'group overflow-hidden rounded-lg border transition-colors duration-300',
            light
              ? 'border-cream/15 bg-cream/[0.04] open:bg-cream/[0.07] hover:border-cream/30'
              : 'border-cream/[0.08] bg-surface shadow-soft hover:border-cream/15'
          )}
        >
          <summary
            className={cn(
              't-h3 flex cursor-pointer list-none items-start justify-between gap-8 px-6 py-5 transition-colors duration-300 sm:px-7 sm:py-6',
              light ? 'hover:text-gold-light' : 'hover:text-gold',
              light ? 'text-cream' : 'text-cream'
            )}
          >
            <span>{f.q}</span>
            <Plus
              aria-hidden="true"
              strokeWidth={1.75}
              className="mt-1 h-5 w-5 flex-shrink-0 text-gold transition-transform duration-300 ease-soft group-open:rotate-45"
            />
          </summary>
          <p className={cn('t-body measure px-6 pb-6 pr-10 sm:px-7 sm:pb-7', light ? 'text-cream/65' : 'text-cream/65')}>
            {f.a}
          </p>
        </Reveal>
      ))}
    </div>
  );
}
