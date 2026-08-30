import { useEffect, useRef, useState } from 'react';
import { METHOD } from '@/data/method';
import { ICONS } from '@/components/ui/BrandIcons';
import { cn } from '@/lib/utils';

/**
 * Les étapes d'un chantier, en frise vivante.
 *
 * Le geste de la référence, sans l'effet de stock : une ligne qui se trace, un
 * point de lumière qui la parcourt, quatre repères qui se posent l'un après
 * l'autre avec leur symbole. Quand le point atteint la livraison, elle se scelle
 * en vert - c'est la seule couleur du site réservée à un état achevé.
 *
 * La lumière n'est pas décorative : elle relie les étapes entre elles, du
 * premier geste au dernier. Elle s'écrit une fois, puis se tait.
 */

const reducedMotion =
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

export default function ProcessTimeline({ steps = METHOD, tone = 'dark', className }) {
  const light = tone === 'light'; // « light » = texte clair sur fond sombre
  const ref = useRef(null);
  const [drawn, setDrawn] = useState(reducedMotion);
  const [sealed, setSealed] = useState(false);

  /* Le point atteint la dernière étape (3 s après le tracé), et c'est là que
      la livraison se scelle. */
  useEffect(() => {
    if (!drawn) return undefined;
    const id = setTimeout(() => setSealed(true), 3100);
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

  /** Le repère : un symbole sur sa pastille, le rang en médaillon. La dernière
      passe au vert et troque son numéro pour une coche quand le point l'a
      rejointe. */
  const Node = ({ step, last = false }) => {
    const done = last && sealed;
    const Icon = ICONS[step.icon];
    const Check = ICONS.check;
    return (
      <span className="relative grid place-items-center">
        <span
          className={cn(
            'relative grid h-12 w-12 place-items-center rounded-lg border transition-colors duration-[700ms] ease-soft',
            done
              ? light
                ? 'border-green-light bg-green-light text-bark'
                : 'border-green bg-green text-cream'
              : light
                ? 'border-cream/25 bg-cream/[0.06] text-cream/90'
                : 'border-gold/25 bg-gold/[0.07] text-gold'
          )}
        >
          {Icon ? <Icon width={22} height={22} /> : null}
        </span>

        {/* Le rang en médaillon, sur l'épaule de la pastille. */}
        <span
          className={cn(
            'absolute -right-1.5 -top-1.5 grid h-6 w-6 place-items-center rounded-full border transition-colors duration-[700ms] ease-soft',
            done
              ? light
                ? 'border-green-light bg-bark text-cream'
                : 'border-green bg-bark text-cream'
              : light
                ? 'border-cream/30 bg-cream text-bark'
                : 'border-ink/20 bg-shell text-ink'
          )}
        >
          {done ? (
            <Check width={13} height={13} draw />
          ) : (
            <span className="t-num text-[0.6875rem] leading-none">{step.n}</span>
          )}
        </span>
      </span>
    );
  };

  return (
    <div ref={ref} className={className}>
      {/* ---------- Frise horizontale (ordinateur) ---------- */}
      <div className="relative hidden lg:block">
        {/* Rail de base */}
        <span
          aria-hidden="true"
          className={cn('absolute h-px', light ? 'bg-cream/15' : 'bg-ink/12')}
          style={{ left: 20, right: 20, top: 31 }}
        />
        {/* Progression : la ligne se remplit d'or au tracé. */}
        <span
          aria-hidden="true"
          className={cn(
            'absolute left-5 h-[3px] rounded-full transition-transform duration-[1400ms] ease-soft',
            light ? 'bg-gold-light' : 'bg-gold'
          )}
          style={{
            right: 20,
            top: 29.5,
            transformOrigin: 'left',
            transform: drawn ? 'scaleX(1)' : 'scaleX(0)',
          }}
        />
        {/* Le point qui parcourt la ligne, du premier au dernier repère. */}
        {drawn && !reducedMotion && (
          <span
            aria-hidden="true"
            className="timeline-orb absolute h-3 w-3 translate-x-[-50%] rounded-full bg-gold-light"
            style={{ top: 25 }}
          />
        )}

        <ol className="relative grid grid-cols-4 gap-x-8">
          {steps.map((s, i) => (
            <li
              key={s.n}
              className={cn(
                'relative pt-20 text-center transition-opacity duration-slow',
                drawn ? 'opacity-100' : 'opacity-0'
              )}
              style={{ transitionDelay: `${150 + i * 130}ms` }}
            >
              <span className="absolute left-1/2 top-2 -translate-x-1/2">
                <Node step={s} last={i === steps.length - 1} />
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
          className={cn('absolute w-px transition-transform duration-[1400ms] ease-soft', light ? 'bg-cream/15' : 'bg-ink/12')}
          style={{
            left: 18,
            top: 6,
            bottom: 6,
            transformOrigin: 'top',
            transform: drawn ? 'scaleY(1)' : 'scaleY(0)',
          }}
        />

        <ol className="relative">
          {steps.map((s, i) => (
            <li
              key={s.n}
              className={cn(
                'relative flex gap-5 pb-10 transition-opacity duration-slow last:pb-0',
                drawn ? 'opacity-100' : 'opacity-0'
              )}
              style={{ transitionDelay: `${150 + i * 130}ms` }}
            >
              <span className="relative z-10 mt-0.5 flex-none">
                <Node step={s} last={i === steps.length - 1} />
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