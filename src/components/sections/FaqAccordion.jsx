import { ChevronDown } from 'lucide-react';
import Reveal from '@/lib/reveal';

export default function FaqAccordion({ items = [] }) {
  if (!items.length) return null;

  return (
    <Reveal from="fade" className="divide-y divide-brand-ink/10 border-y border-brand-ink/10">
      {items.map((f, i) => (
        <details key={i} className="group px-1 py-5 md:px-2">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-[15px] font-medium text-brand-ink transition-colors hover:text-brand-gold">
            <span>{f.q}</span>
            <ChevronDown
              aria-hidden="true"
              className="h-5 w-5 flex-shrink-0 text-brand-gold/70 transition-transform duration-200 group-open:rotate-180"
            />
          </summary>
          <p className="mt-3 max-w-3xl text-[14px] font-light leading-[1.85] text-brand-ink/60">{f.a}</p>
        </details>
      ))}
    </Reveal>
  );
}
