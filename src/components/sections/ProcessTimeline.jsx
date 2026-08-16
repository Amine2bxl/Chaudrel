import Reveal from '@/lib/reveal';
import { METHOD } from '@/data/method';
import { cn } from '@/lib/utils';

/**
 * Progression du chantier.
 * Desktop : ligne horizontale qui se dessine, points et numéros au-dessus.
 * Mobile  : timeline verticale, ligne qui descend au scroll.
 * Aucune librairie : deux transforms CSS et un IntersectionObserver.
 */
export default function ProcessTimeline({ tone = 'dark', steps = METHOD, className }) {
  const light = tone === 'light';
  const line = light ? 'bg-paper/25' : 'bg-ink/15';
  const dot = light ? 'bg-paper' : 'bg-ink';
  // Chiffres d'étape : gros corps, donc lisibles plus clairs (seuil « large text »).
  const num = light ? 'text-paper/45' : 'text-ink/40';
  const title = light ? 'text-paper' : 'text-ink';
  const text = light ? 'text-paper/65' : 'text-ink/65';

  return (
    <div className={className}>
      {/* ---------- Desktop ---------- */}
      <ol className="relative hidden lg:grid" style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}>
        <Reveal
          from="line"
          className={cn('absolute left-0 right-0 top-[7px] h-px', line)}
          aria-hidden="true"
        />

        {steps.map((s, i) => (
          <li key={s.n} className="relative pr-6">
            <Reveal from="fade" delay={200 + i * 110}>
              <span className={cn('block h-[13px] w-[13px] border', light ? 'border-paper/35' : 'border-ink/25')}>
                <span className={cn('mt-[3px] ml-[3px] block h-[5px] w-[5px]', dot)} />
              </span>
            </Reveal>

            <Reveal from="up" delay={260 + i * 110} className="mt-7">
              <span className={cn('t-num block text-3xl', num)}>{s.n}</span>
              <h3 className={cn('t-h3 mt-3', title)}>{s.title}</h3>
              <p className={cn('t-small mt-2 pr-2', text)}>{s.text}</p>
            </Reveal>
          </li>
        ))}
      </ol>

      {/* ---------- Mobile ---------- */}
      <ol className="relative lg:hidden">
        <Reveal
          from="lineY"
          className={cn('absolute bottom-6 left-[6px] top-2 w-px', line)}
          aria-hidden="true"
        />

        {steps.map((s, i) => (
          <li key={s.n} className="relative pb-10 pl-10 last:pb-0">
            <Reveal
              from="fade"
              delay={i * 90}
              className={cn(
                'absolute left-0 top-1 h-[13px] w-[13px] border',
                light ? 'border-paper/35 bg-carbon' : 'border-ink/25 bg-paper'
              )}
            >
              <span className={cn('mt-[3px] ml-[3px] block h-[5px] w-[5px]', dot)} />
            </Reveal>

            <Reveal from="up" delay={i * 90}>
              <span className={cn('t-label', num)}>{s.n}</span>
              <h3 className={cn('t-h3 mt-2', title)}>{s.title}</h3>
              <p className={cn('t-small mt-1.5', text)}>{s.text}</p>
            </Reveal>
          </li>
        ))}
      </ol>
    </div>
  );
}
