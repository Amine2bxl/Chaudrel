import { useEffect, useRef, useState } from 'react';
import { METHOD } from '@/data/method';
import { cn } from '@/lib/utils';
import Reveal from '@/lib/reveal';

/**
 * Méthode en quatre temps.
 * Bureau : à gauche, le numéro de l'étape en cours, collé pendant que les
 * étapes défilent à droite ; des pastilles permettent d'y sauter.
 * Téléphone : une liste simple, numérotée.
 */
export default function MethodSteps({ steps = METHOD, headingLevel = 'h3' }) {
  const H = headingLevel;
  const [active, setActive] = useState(0);
  const refs = useRef([]);

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(Number(e.target.dataset.i));
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    refs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const jump = (i) => refs.current[i]?.scrollIntoView({ behavior: 'smooth', block: 'center' });

  return (
    <div className="lg:grid lg:grid-cols-12 lg:gap-12">
      <div className="hidden lg:col-span-5 lg:block">
        <div className="sticky top-[calc(var(--header-h)+3rem)]">
          <div className="flex flex-wrap gap-2" role="tablist" aria-label="Étapes">
            {steps.map((s, i) => (
              <button
                key={s.n}
                type="button"
                role="tab"
                aria-selected={active === i}
                onClick={() => jump(i)}
                className={cn(
                  'h-9 rounded-full border px-4 text-[12.5px] font-medium transition-colors duration-fast',
                  active === i ? 'border-graphite bg-graphite text-ivory' : 'border-ink/15 text-ink/70 hover:border-ink/40'
                )}
              >
                {s.n} {s.title}
              </button>
            ))}
          </div>
          <p
            aria-hidden="true"
            className="t-num mt-12 text-[clamp(7rem,12vw,11rem)] leading-[0.8] text-transparent [-webkit-text-stroke:1px_rgb(var(--c-gold-deep-rgb))]"
          >
            {steps[active].n}
          </p>
          <p className="mt-6 font-display text-[28px] leading-tight">{steps[active].title}</p>
        </div>
      </div>

      <ol className="space-y-4 lg:col-span-7 lg:space-y-6">
        {steps.map((s, i) => (
          <li key={s.n} ref={(el) => (refs.current[i] = el)} data-i={i}>
            <Reveal
              className={cn(
                'rounded-lg border bg-paper p-6 transition-[border-color,box-shadow] duration-slow sm:p-8',
                active === i ? 'border-gold/60 shadow-soft' : 'border-ink/[0.08]'
              )}
            >
              <div className="flex items-baseline gap-4">
                <span className="t-num text-[15px] text-gold-ink">{s.n}</span>
                <H className="t-h3">{s.title}</H>
              </div>
              <p className="t-body mt-3 max-w-[52ch] text-ink/70">{s.text}</p>
              {s.receive && (
                <>
                  <p className="t-label mt-6 text-ink/60">Ce que vous recevez</p>
                  <ul className="mt-3 space-y-1.5 text-[14px] text-ink/75">
                    {s.receive.map((r) => (
                      <li key={r} className="flex gap-3">
                        <span aria-hidden="true" className="mt-[0.6em] h-px w-3 flex-none bg-gold" />
                        {r}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </Reveal>
          </li>
        ))}
      </ol>
    </div>
  );
}
