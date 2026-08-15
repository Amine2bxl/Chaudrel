import { Plus } from 'lucide-react';
import Reveal from '@/lib/reveal';
import { cn } from '@/lib/utils';

export default function FaqAccordion({ items = [], tone = 'dark', className }) {
  if (!items.length) return null;
  const light = tone === 'light';

  return (
    <div className={cn('border-t', light ? 'border-cream/15' : 'border-ink/12', className)}>
      {items.map((f, i) => (
        <Reveal
          as="details"
          key={f.q}
          delay={i * 50}
          className={cn('group border-b', light ? 'border-cream/15' : 'border-ink/12')}
        >
          <summary
            className={cn(
              't-h3 flex cursor-pointer list-none items-start justify-between gap-8 py-6 transition-colors duration-300 hover:text-gold',
              light ? 'text-cream' : 'text-ink'
            )}
          >
            <span>{f.q}</span>
            <Plus
              aria-hidden="true"
              className="mt-0.5 h-5 w-5 flex-shrink-0 text-gold transition-transform duration-300 ease-soft group-open:rotate-45"
            />
          </summary>
          <p className={cn('t-body measure pb-7 pr-10', light ? 'text-cream/60' : 'text-ink/60')}>{f.a}</p>
        </Reveal>
      ))}
    </div>
  );
}
