import { useEffect, useRef, useState } from 'react';
import { METHOD } from '@/data/method';
import { ICONS } from '@/components/ui/BrandIcons';
import { cn } from '@/lib/utils';

/**
 * Les étapes d'un chantier, en frise.
 *
 * Sur grand écran : une ligne horizontale et quatre repères numérotés, la
 * livraison s'y scelle en vert. En dessous (mobile et tablette) : la même
 * frise tourne à la verticale, un rail à gauche sous les repères.
 *
 * Rien de spectaculaire, c'est voulu : le déroulé d'un chantier est une
 * promesse de sérieux, et la mise en page se veut aussi sobre que
 * l'engagement. Le trait s'écrit à l'apparition, les repères suivent.
 */

const reducedMotion =
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

export default function ProcessTimeline({ steps = METHOD, tone = 'dark', className }) {
  const light = tone === 'light'; // « light » = texte clair sur fond sombre
  const ref = useRef(null);
  const [drawn, setDrawn] = useState(reducedMotion);
  const [sealed, setSealed] = useState(false);

  useEffect(() => {
    if (!drawn) return undefined;
    const id = setTimeout(() => setSealed(true), 1500);
    return () => clearTimeout(id);
  }, [drawn]);

  useEffect(() => {
    if (reducedMotion) return undefined;
    const el = ref.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setDrawn(true);
          io.disconnect();
        }
      },
      { rootMargin: '-60px', threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /** Le repère : un disque sur la frise, la dernière passe au vert et porte la
      coche quand tout est arrivé (2 s après le tracé). */
  const Marker = ({ step, last = false }) => {
    const done = last && sealed;
    const Check = ICONS.check;
    return (
      <span
        className={cn(
          'grid h-9 w-9 place-items-center rounded-full border-2 transition-colors duration-[600ms] ease-soft',
          done
            ? light
              ? 'border-green-light bg-green-light text-bark'
              : 'border-green bg-green text-cream'
            : light
              ? 'border-cream/30 bg-cream text-cream'
              : 'border-ink/20 bg-cream text-gold'
        )}
      >
        {last && done ? (
          <Check width={15} height={15} draw />
        ) : (
          <span className="t-num text-[0.75rem]">{step.n}</span>
        )}
      </span>
    );
  };

  return (
    <div ref={ref} className={className}>
      {/* ---------- Frise horizontale (ordinateur) ---------- */}
      <div className="relative hidden lg:block">
        <span
          aria-hidden="true"
          className={cn('absolute h-px transition-transform duration-[1400ms] ease-soft', light ? 'bg-cream/18' : 'bg-ink/12')}
          style={{
            left: 20,
            right: 20,
            top: 25,
            transformOrigin: 'left',
            transform: drawn ? 'scaleX(1)' : 'scaleX(0)',
          }}
        />

        <ol className="relative grid grid-cols-4 gap-x-8">
          {steps.map((s, i) => (
            <li
              key={s.n}
              className={cn(
                'relative pt-16 text-center transition-opacity duration-slow',
                drawn ? 'opacity-100' : 'opacity-0'
              )}
              style={{ transitionDelay: `${150 + i * 130}ms` }}
            >
              <span className="absolute left-1/2 top-[7px] -translate-x-1/2">
                <Marker step={s} last={i === steps.length - 1} />
              </span>
              <h3 className={cn('t-h3 text-balance', light ? 'text-cream' : 'text-ink')}>{s.title}</h3>
              <p className={cn('t-small mx-auto mt-2 max-w-[24ch]', light ? 'text-cream/65' : 'text-ink/65')}>
                {s.text}
              </p>
            </li>
          ))}
        </ol>
      </div>

      {/* ---------- Frise verticale (mobile, tablette) ---------- */}
      <div className="relative lg:hidden">
        <span
          aria-hidden="true"
          className={cn('absolute w-px transition-transform duration-[1400ms] ease-soft', light ? 'bg-cream/18' : 'bg-ink/12')}
          style={{
            left: 18,
            top: 4,
            bottom: 4,
            transformOrigin: 'top',
            transform: drawn ? 'scaleY(1)' : 'scaleY(0)',
          }}
        />

        <ol className="relative">
          {steps.map((s, i) => (
            <li
              key={s.n}
              className={cn(
                'relative flex gap-5 pb-9 transition-opacity duration-slow last:pb-0',
                drawn ? 'opacity-100' : 'opacity-0'
              )}
              style={{ transitionDelay: `${150 + i * 130}ms` }}
            >
              <span className="relative z-10 mt-0.5 flex-none">
                <Marker step={s} last={i === steps.length - 1} />
              </span>
              <div>
                <h3 className={cn('t-h3', light ? 'text-cream' : 'text-ink')}>{s.title}</h3>
                <p className={cn('t-small mt-2', light ? 'text-cream/65' : 'text-ink/65')}>{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}