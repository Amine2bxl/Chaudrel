import { useEffect, useRef, useState } from 'react';
import { METHOD } from '@/data/method';
import { ICONS } from '@/components/ui/BrandIcons';
import { cn } from '@/lib/utils';

/**
 * Les étapes d'un chantier, en frise.
 *
 * Une ligne, quatre repères, qui décrit le parcours sans le dessiner : le
 * chantier avance dans l'ordre, d'un point au suivant, jusqu'à la livraison qui
 * se scelle en vert. Rien de spectaculaire — c'est une promesse de sérieux, et
 * la mise en page se doit d'être aussi sobre que l'engagement.
 *
 * La frise se trace à l'apparition (le trait s'écrit, les repères suivent),
 * puis le dernier repère se scelle : le vert est la seule couleur du site
 * réservée à un état achevé.
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

  return (
    <div ref={ref} className={cn('', className)}>
      <div className="relative">
        {/* La frise : horizontale à partir du format tablette, verticale sur
            téléphone. Elle se dessine au scroll (scaleX) pour ceux qui la
            voient entrer. */}
        <span
          aria-hidden="true"
          className={cn(
            'absolute w-px bg-ink/12 transition-transform duration-[1400ms] ease-soft sm:hidden',
            light && 'bg-cream/18'
          )}
          style={{
            left: 18,
            top: 4,
            bottom: 4,
            transformOrigin: 'top',
            transform: drawn ? 'scaleY(1)' : 'scaleY(0)',
          }}
        />
        <span
          aria-hidden="true"
          className={cn(
            'absolute hidden h-px bg-ink/12 transition-transform duration-[1400ms] ease-soft lg:left-6 lg:right-6 sm:block',
            light && 'bg-cream/18'
          )}
          style={{
            left: 24,
            right: 24,
            top: 25,
            transformOrigin: 'left',
            transform: drawn ? 'scaleX(1)' : 'scaleX(0)',
          }}
        />

        <ol className="relative grid gap-y-10 pb-2 sm:grid-cols-2 sm:gap-x-8 lg:grid-cols-4 lg:gap-x-6">
          {steps.map((s, i) => {
            const last = i === steps.length - 1;
            const done = last && sealed;
            const CheckIcon = ICONS.check;

            return (
              <li
                key={s.n}
                className={cn(
                  'relative transition-opacity duration-slow pl-14 sm:pl-0 sm:pt-14',
                  drawn ? 'opacity-100' : 'opacity-0'
                )}
                style={{ transitionDelay: `${150 + i * 130}ms` }}
              >
                {/* Le repère : un disque sur la frise. Le dernier porte la
                    coche et se scelle en vert quand la frise est entière. */}
                <span
                  className={cn(
                    'absolute left-0 top-0 grid h-9 w-9 place-items-center rounded-full border-2 transition-colors duration-[600ms] ease-soft sm:top-[7px]',
                    done
                      ? light
                        ? 'border-green-light bg-green-light text-bark'
                        : 'border-green bg-green text-cream'
                      : light
                        ? 'border-cream/30 bg-cream text-cream'
                        : 'border-ink/20 bg-cream text-gold'
                  )}
                >
                  {last && done ? <CheckIcon width={15} height={15} draw /> : <span className="t-num text-[0.75rem]">{s.n}</span>}
                </span>

                <div>
                  <h3 className={cn('t-h3', light ? 'text-cream' : 'text-ink')}>{s.title}</h3>
                  <p className={cn('t-small mt-2', light ? 'text-cream/65' : 'text-ink/65')}>{s.text}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}