import { cn } from '@/lib/utils';

/**
 * Accordéon de questions : `<details>` natif - lisible et utilisable sans
 * JavaScript, annoncé correctement par les lecteurs d'écran. Une ligne par
 * question, compacte ; la réponse glisse sous la question.
 */
export default function FaqAccordion({ items = [], tone = 'dark', className, headingLevel = 'h3' }) {
  const light = tone === 'light';
  const H = headingLevel;
  return (
    <div className={cn('space-y-2.5', className)}>
      {items.map((f, i) => (
        <details
          key={f.q}
          className={cn(
            'group rounded-lg border transition-colors duration-fast',
            light
              ? 'border-ivory/12 bg-ivory/[0.03] open:bg-ivory/[0.06] hover:border-ivory/25'
              : 'border-ink/[0.08] bg-paper hover:border-ink/20 open:border-ink/15'
          )}
          {...(i === 0 && f.open ? { open: true } : {})}
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-5 px-5 py-4 sm:px-6 sm:py-5 [&::-webkit-details-marker]:hidden">
            <span>
              {f.tag && (
                <span className={cn('t-label mb-1.5 block', light ? 'text-gold' : 'text-gold-ink')}>{f.tag}</span>
              )}
              <H className={cn('text-[15.5px] font-semibold leading-snug', light ? 'text-ivory' : 'text-ink')}>{f.q}</H>
            </span>
            <span
              aria-hidden="true"
              className={cn(
                'grid h-9 w-9 flex-none place-items-center rounded-full border transition-[transform,background-color,border-color,color] duration-300 ease-soft group-open:rotate-45',
                light
                  ? 'border-ivory/25 text-ivory group-open:border-gold group-open:bg-gold group-open:text-graphite'
                  : 'border-ink/15 text-ink group-open:border-graphite group-open:bg-graphite group-open:text-ivory'
              )}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.4">
                <path d="M6 1v10M1 6h10" strokeLinecap="round" />
              </svg>
            </span>
          </summary>
          <p
            className={cn(
              'faq-a px-5 pb-5 text-[14.5px] leading-relaxed sm:px-6 sm:pb-6 max-w-[64ch]',
              light ? 'text-ivory/70' : 'text-ink/70'
            )}
          >
            {f.a}
          </p>
        </details>
      ))}
    </div>
  );
}
