import { useEffect, useId, useRef, useState } from 'react';
import { METHOD } from '@/data/method';
import { ICONS } from '@/components/ui/BrandIcons';
import { cn } from '@/lib/utils';

/**
 * Les étapes d'un chantier, en circuit.
 *
 * Pas de ligne droite : le parcours zigzague de haut à gauche vers bas à
 * droite, en diagonale irrégulière - chaque virage est une courbe, aucun n'est
 * symétrique, comme un circuit de course qui descend la page.
 *
 * Le temps est le sujet : c'est pourquoi on lit la piste (le ruban), sa ligne
 * de course (les pointillés qui avancent lentement) et les quatre stations qui
 * portent le symbole et le rang. La livraison se scelle en vert à l'arrivée.
 */

const W = 1000;
const H = 320;

/* Les quatre repères : la géométrie du circuit, volontairement irrégulière. */
const POINTS = [
  { x: 150, y: 70 },
  { x: 545, y: 148 },
  { x: 300, y: 240 },
  { x: 880, y: 260 },
];

/* Le tracé : courbures inégales autour des repères, un élan vers les hauteurs
   entre les deux premiers, une épingle à droite, un retour, puis la sortie. */
function circuitPath() {
  return [
    'M 150 70',
    'C 310 52, 420 110, 545 148',
    'C 652 182, 668 222, 566 226',
    'C 470 232, 380 250, 300 240',
    'C 475 226, 640 292, 880 260',
  ].join(' ');
}

const CARD = 48;
const reducedMotion =
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

export default function ProcessTimeline({ steps = METHOD, tone = 'dark', className }) {
  const light = tone === 'light'; // « light » = texte clair sur fond sombre
  const uid = useId().replace(/:/g, '');
  const ref = useRef(null);
  const [drawn, setDrawn] = useState(reducedMotion);
  const [sealed, setSealed] = useState(false);

  const line = circuitPath();
  const LEN = 2400;

  useEffect(() => {
    if (!drawn) return undefined;
    const id = setTimeout(() => setSealed(true), 3000);
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
      { rootMargin: '-60px', threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const accent = light ? 'text-gold-light' : 'text-gold';
  const ghost = light ? 'text-cream/[0.07]' : 'text-ink/[0.06]';
  const goldStroke = `rgb(var(--c-gold${light ? '-light' : ''}-rgb))`;
  const greenStop = `rgb(var(--c-green${light ? '-light' : ''}-rgb))`;
  const trackColour = light ? 'rgb(28 28 28 / 0.06)' : 'rgb(255 255 255 / 0.07)';

  return (
    <div ref={ref} className={className}>
      {/* ---------- Desktop : le circuit ---------- */}
      <div className="relative hidden lg:block">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full overflow-visible"
          role="img"
          aria-label={`Déroulé d'un chantier en ${steps.length} étapes, de ${steps[0].title} à ${steps[steps.length - 1].title}`}
        >
          <defs>
            <linearGradient id={`area-${uid}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0.1" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
            </linearGradient>
            <linearGradient id={`stroke-${uid}`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={goldStroke} />
              <stop offset="64%" stopColor={goldStroke} />
              <stop
                offset="100%"
                style={{ stopColor: sealed ? greenStop : goldStroke, transition: 'stop-color 600ms var(--ease-soft)' }}
              />
            </linearGradient>
            <filter id={`glow-${uid}`} x="-30%" y="-60%" width="160%" height="220%">
              <feGaussianBlur stdDeviation="11" />
            </filter>
          </defs>

          {/* Halo en profondeur, derrière la piste. */}
          <path
            d={line}
            fill="none"
            stroke={goldStroke}
            strokeWidth="22"
            strokeLinecap="round"
            filter={`url(#glow-${uid})`}
            opacity={drawn ? 0.45 : 0}
            style={{
              strokeDasharray: LEN,
              strokeDashoffset: drawn ? 0 : LEN,
              transition: 'stroke-dashoffset 2200ms var(--ease-soft), opacity 900ms ease',
            }}
          />

          {/* Le ruban de la piste : une surface, pas un trait. */}
          <path
            d={line}
            fill="none"
            stroke={trackColour}
            strokeWidth="34"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              strokeDasharray: LEN,
              strokeDashoffset: drawn ? 0 : LEN,
              transition: 'stroke-dashoffset 2200ms var(--ease-soft)',
            }}
          />

          {/* La ligne de course : pointillés dorés qui avancent lentement. */}
          <path
            d={line}
            fill="none"
            stroke={`url(#stroke-${uid})`}
            strokeWidth="2.5"
            strokeLinecap="round"
            style={{
              strokeDasharray: '12 18',
              strokeDashoffset: drawn ? 0 : LEN,
              transition: 'stroke-dashoffset 2200ms var(--ease-soft)',
            }}
          />
          {drawn && !reducedMotion && (
            <path
              d={line}
              fill="none"
              strokeLinecap="round"
              className={light ? 'stroke-cream/90' : 'stroke-gold-light'}
              style={{
                strokeWidth: 3.5,
                strokeDasharray: '3 27',
                animation: `flow-dash 6500ms linear 2400ms infinite`,
              }}
            />
          )}
        </svg>

        {/* Les stations posées sur le circuit, et leur rang en filigrane. */}
        {POINTS.map((p, i) => {
          const step = steps[i];
          const done = i === POINTS.length - 1 && sealed;
          const Icon = ICONS[step.icon];
          const Check = ICONS.check;
          return (
            <span
              key={step.n}
              aria-hidden={!drawn}
              className={cn(
                'absolute z-10 transition-[opacity,transform] duration-[800ms] ease-soft',
                drawn ? 'opacity-100' : 'opacity-0'
              )}
              style={{
                left: `${(p.x / W) * 100}%`,
                top: `${(p.y / H) * 100}%`,
                transform: drawn
                  ? 'translate(-50%,-50%) rotateX(0deg) scale(1)'
                  : 'translate(-50%,-50%) rotateX(-30deg) translateY(16px) scale(0.7)',
                transitionDelay: `${320 + i * 150}ms`,
              }}
            >
              <span
                aria-hidden="true"
                className={cn(
                  'pointer-events-none absolute select-none font-display leading-[0.75]',
                  'text-[5.5rem] xl:text-[6.5rem]',
                  ghost
                )}
                style={{
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -56%)',
                  opacity: drawn ? 1 : 0,
                  transition: 'opacity 1200ms ease',
                  transitionDelay: `${700 + i * 120}ms`,
                }}
              >
                {i + 1}
              </span>

              <span
                className={cn(
                  'relative grid place-items-center rounded-xl border transition-colors duration-[700ms] ease-soft',
                  done
                    ? light
                      ? 'border-green-light bg-green-light text-bark'
                      : 'border-green bg-green text-cream'
                    : light
                      ? 'border-cream/25 bg-cream/[0.09] text-cream/90'
                      : 'border-gold/30 bg-gold/[0.1] text-gold',
                  !done && (light ? 'shadow-[0_16px_32px_-16px_rgb(255_255_255/0.35)]' : 'shadow-[0_16px_32px_-16px_rgb(0_0_0/0.5)]')
                )}
                style={{ width: CARD, height: CARD }}
              >
                {done ? <Check width={22} height={22} draw /> : Icon && <Icon width={22} height={22} />}
              </span>
            </span>
          );
        })}

        {/* Les textes, alignés sous chaque station. */}
        <ol className="relative mt-12" style={{ height: '10rem' }}>
          {POINTS.map((p, i) => {
            const step = steps[i];
            return (
              <li
                key={step.n}
                className={cn(
                  'absolute w-[13rem] text-center transition-opacity duration-slow xl:w-[15rem]',
                  drawn ? 'opacity-100' : 'opacity-0'
                )}
                style={{
                  left: `${(p.x / W) * 100}%`,
                  transform: 'translateX(-50%)',
                  transitionDelay: `${500 + i * 120}ms`,
                }}
              >
                <span className={cn('t-label', accent)}>{step.n}</span>
                <h3 className={cn('t-h3 mt-3 text-balance', light ? 'text-cream' : 'text-ink')}>{step.title}</h3>
                <p className={cn('t-small mx-auto mt-2 max-w-[22ch]', light ? 'text-cream/65' : 'text-ink/65')}>
                  {step.text}
                </p>
              </li>
            );
          })}
        </ol>
      </div>

      {/* ---------- Mobile : le même circuit, en vertical ---------- */}
      <MobileCurve light={light} steps={steps} drawn={drawn} sealed={sealed} accent={accent} goldStroke={goldStroke} />
    </div>
  );
}

/** La progression verticale : une courbe irrégulière mesurée sur le rendu, qui
    passe par chacun des repères - la seule façon de lui faire rejoindre
    exactement les badges, quelle que soit la hauteur de leurs textes. */
function MobileCurve({ light, steps, drawn, sealed, accent, goldStroke }) {
  const listRef = useRef(null);
  const dotRefs = useRef([]);
  const [dots, setDots] = useState([]);
  const [listH, setListH] = useState(0);

  useEffect(() => {
    const wrap = listRef.current;
    if (!wrap || typeof ResizeObserver === 'undefined') return undefined;

    const measure = () => {
      const base = wrap.getBoundingClientRect();
      setDots(
        dotRefs.current.filter(Boolean).map((el) => {
          const r = el.getBoundingClientRect();
          return r.top - base.top + r.height / 2;
        })
      );
      setListH(Math.round(base.height));
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(wrap);
    return () => ro.disconnect();
  }, []);

  const GUTTER = 52;
  const X = [GUTTER / 2, GUTTER / 2 + 9, GUTTER / 2 - 9, GUTTER / 2];
  const path = smoothPath(dots.map((y, i) => ({ x: X[i % X.length], y })));
  const len = Math.round(listH * 1.4) || 1;
  const track = light ? 'rgb(28 28 28 / 0.06)' : 'rgb(255 255 255 / 0.07)';

  return (
    <div className="relative lg:hidden">
      <div className="absolute inset-y-0 left-0 w-[52px]">
        <svg aria-hidden="true" viewBox={`0 0 ${GUTTER} ${listH}`} width={GUTTER} height={listH} className="absolute left-0 top-0" style={{ height: listH }}>
          <defs>
            <linearGradient id="mv-glow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={goldStroke} />
              <stop offset="100%" stopColor={goldStroke} />
            </linearGradient>
          </defs>
          <path d={path} fill="none" stroke={goldStroke} strokeWidth="14" strokeLinecap="round" opacity={drawn ? 0.35 : 0} style={{ filter: 'blur(7px)', strokeDasharray: len, strokeDashoffset: drawn ? 0 : len, transition: 'stroke-dashoffset 2000ms var(--ease-soft)' }} />
          <path d={path} fill="none" stroke={track} strokeWidth="34" strokeLinecap="round" strokeLinejoin="round" style={{ strokeDasharray: len, strokeDashoffset: drawn ? 0 : len, transition: 'stroke-dashoffset 2000ms var(--ease-soft)' }} />
          <path d={path} fill="none" stroke={goldStroke} strokeWidth="2.5" strokeLinecap="round" style={{ strokeDasharray: '12 18', strokeDashoffset: drawn ? 0 : len, transition: 'stroke-dashoffset 2000ms var(--ease-soft)' }} />
          {drawn && !reducedMotion && (
            <path d={path} fill="none" strokeWidth="3" strokeLinecap="round" className={light ? 'stroke-cream/90' : 'stroke-gold-light'} style={{ strokeDasharray: '3 27', animation: 'flow-dash 6500ms linear 2200ms infinite' }} />
          )}
        </svg>
      </div>

      <ol ref={listRef} className="relative">
        {steps.map((s, i) => {
          const last = i === steps.length - 1;
          const done = last && sealed;
          const Icon = ICONS[s.icon];
          const Check = ICONS.check;
          return (
            <li
              key={s.n}
              className={cn('relative flex gap-5 pb-11 transition-opacity duration-slow last:pb-0', drawn ? 'opacity-100' : 'opacity-0')}
              style={{ transitionDelay: `${150 + i * 130}ms` }}
            >
              <span
                ref={(el) => {
                  dotRefs.current[i] = el;
                }}
                className={cn(
                  'relative z-10 mt-0.5 grid h-12 w-12 flex-none place-items-center rounded-xl border transition-colors duration-[700ms] ease-soft',
                  done
                    ? light
                      ? 'border-green-light bg-green-light text-bark'
                      : 'border-green bg-green text-cream'
                    : light
                      ? 'border-cream/25 bg-cream/[0.09] text-cream/90'
                      : 'border-gold/30 bg-gold/[0.1] text-gold'
                )}
                aria-hidden="true"
              >
                {done ? <Check width={22} height={22} draw /> : Icon && <Icon width={22} height={22} />}
              </span>
              <div>
                <span className={cn('t-label', accent)}>{s.n}</span>
                <h3 className={cn('t-h3 mt-2', light ? 'text-cream' : 'text-ink')}>{s.title}</h3>
                <p className={cn('t-small mt-2', light ? 'text-cream/65' : 'text-ink/65')}>{s.text}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/** Courbe lisse à travers des points, tangentes irrégulières (Catmull-Rom). */
function smoothPath(points) {
  if (points.length < 2) return '';
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i += 1) {
    const p0 = points[i - 1] || points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] || p2;
    const k = 0.22;
    d +=
      ` C ${(p1.x + (p2.x - p0.x) * k).toFixed(1)} ${(p1.y + (p2.y - p0.y) * k).toFixed(1)},` +
      ` ${(p2.x - (p3.x - p1.x) * k).toFixed(1)} ${(p2.y - (p3.y - p1.y) * k).toFixed(1)},` +
      ` ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return d;
}