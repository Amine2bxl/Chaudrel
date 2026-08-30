import { useEffect, useId, useRef, useState } from 'react';
import { METHOD } from '@/data/method';
import { ICONS } from '@/components/ui/BrandIcons';
import { cn } from '@/lib/utils';

/**
 * Les étapes d'un chantier, sur une courbe vivante.
 *
 * La courbe ne se répète pas : abscisses, hauteurs et tangentes changent d'un
 * segment à l'autre - c'est la charge de travail (le contact ne coûte rien, le
 * chantier est le sommet, la livraison redescend au calme), dessinée avec la
 * main plutôt qu'avec une formule.
 *
 * Elle vit de façon continue, sans se répéter : le trait s'écrit à l'arrivée,
 * un halo flouté le prolonge en profondeur, et une impulsion de lumière
 * parcourt la ligne d'un repère à l'autre. Quatre disques portent le symbole
 * et le rang ; la livraison se scelle en vert quand l'impulsion l'atteint.
 *
 * Sur mobile, la même courbe - verticale - passe dans les repères.
 */

const W = 1000;
const H = 320;
const BASE = 44;

/* Les repères : abscisses et hauteurs volontairement irréguliers. */
const POINTS = [
  { x: 132, h: 98 },
  { x: 392, h: 188 },
  { x: 655, h: 248 },
  { x: 884, h: 132 },
].map((p, i) => ({ ...p, y: H - BASE - p.h, i }));

/* Tangentes inégales d'un segment à l'autre : la courbe n'a pas de rythme
   régulier, c'est ce qui la rend humain plutôt que générique. */
const KS = [0.16, 0.32, 0.18];
const CARD = 48;

function smoothPath(points) {
  if (points.length < 2) return '';
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i += 1) {
    const p0 = points[i - 1] || points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] || p2;
    const k = KS[i % KS.length];
    d +=
      ` C ${(p1.x + (p2.x - p0.x) * k).toFixed(1)} ${(p1.y + (p2.y - p0.y) * k).toFixed(1)},` +
      ` ${(p2.x - (p3.x - p1.x) * k).toFixed(1)} ${(p2.y - (p3.y - p1.y) * k).toFixed(1)},` +
      ` ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return d;
}

const reducedMotion =
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

export default function ProcessTimeline({ steps = METHOD, tone = 'dark', className }) {
  const light = tone === 'light'; // « light » = texte clair sur fond sombre
  const uid = useId().replace(/:/g, '');
  const ref = useRef(null);
  const [drawn, setDrawn] = useState(reducedMotion);
  const [sealed, setSealed] = useState(false);

  const line = smoothPath(POINTS);
  const area = `${line} L ${POINTS[POINTS.length - 1].x} ${H} L ${POINTS[0].x} ${H} Z`;
  const LEN = 2200;

  useEffect(() => {
    if (!drawn) return undefined;
    const id = setTimeout(() => setSealed(true), 2600);
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

  return (
    <div ref={ref} className={className}>
      {/* ---------- Desktop : la courbe ---------- */}
      <div className="relative hidden lg:block">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full overflow-visible"
          role="img"
          aria-label={`Déroulé d'un chantier en ${steps.length} étapes, de ${steps[0].title} à ${steps[steps.length - 1].title}`}
        >
          <defs>
            <linearGradient id={`area-${uid}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0.14" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
            </linearGradient>
            <linearGradient id={`stroke-${uid}`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={goldStroke} />
              <stop offset="62%" stopColor={goldStroke} />
              <stop
                offset="100%"
                style={{ stopColor: sealed ? greenStop : goldStroke, transition: 'stop-color 600ms var(--ease-soft)' }}
              />
            </linearGradient>
            <filter id={`glow-${uid}`} x="-30%" y="-60%" width="160%" height="220%">
              <feGaussianBlur stdDeviation="12" />
            </filter>
          </defs>

          {/* Remous sous la courbe */}
          <path
            d={area}
            fill={`url(#area-${uid})`}
            className={cn('transition-opacity duration-[1000ms] ease-soft', accent, drawn ? 'opacity-100' : 'opacity-0')}
            style={{ transitionDelay: '600ms' }}
          />

          {/* Halo flouté : la profondeur derrière le trait */}
          <path
            d={line}
            fill="none"
            stroke={goldStroke}
            strokeWidth="16"
            strokeLinecap="round"
            filter={`url(#glow-${uid})`}
            opacity={drawn ? 0.5 : 0}
            style={{
              strokeDasharray: LEN,
              strokeDashoffset: drawn ? 0 : LEN,
              transition: 'stroke-dashoffset 2200ms var(--ease-soft), opacity 900ms ease',
            }}
          />

          {/* Le trait lui-même */}
          <path
            d={line}
            fill="none"
            strokeWidth="2.5"
            strokeLinecap="round"
            stroke={`url(#stroke-${uid})`}
            style={{
              strokeDasharray: LEN,
              strokeDashoffset: drawn ? 0 : LEN,
              transition: 'stroke-dashoffset 2200ms var(--ease-soft)',
            }}
          />

          {/* L'impulsion qui parcourt la ligne : une lumière qui avance et
              ne se répète pas à l'infini (6 s, une fois la courbe tracée). */}
          {drawn && !reducedMotion && (
            <path
              d={line}
              fill="none"
              strokeLinecap="round"
              className={cn(light ? 'stroke-cream' : 'stroke-gold-light')}
              style={{
                strokeWidth: 3.5,
                strokeDasharray: '2 26',
                animation: `flow-dash 6000ms linear 2200ms infinite`,
              }}
            />
          )}
        </svg>

        {/* Repères posés sur la courbe, et leur chiffre en filigrane. */}
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
                'absolute z-10 transition-[opacity,transform] duration-[750ms] ease-soft',
                drawn ? 'opacity-100' : 'opacity-0'
              )}
              style={{
                left: `${(p.x / W) * 100}%`,
                top: `${(p.y / H) * 100}%`,
                transform: drawn
                  ? 'translate(-50%,-50%) rotateX(0deg) scale(1)'
                  : 'translate(-50%,-50%) rotateX(-32deg) translateY(14px) scale(0.7)',
                transitionDelay: `${280 + i * 150}ms`,
                perspective: '800px',
              }}
            >
              {/* Chiffre en filigrane derrière le repère */}
              <span
                aria-hidden="true"
                className={cn(
                  'pointer-events-none absolute select-none font-display leading-[0.75]',
                  'text-[6rem] xl:text-[7rem]',
                  ghost
                )}
                style={{
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -58%)',
                  transition: 'opacity 1200ms ease',
                  opacity: drawn ? 1 : 0,
                  transitionDelay: `${700 + i * 120}ms`,
                }}
              >
                {i + 1}
              </span>

              {/* La pastille */}
              <span
                className={cn(
                  'relative grid place-items-center rounded-xl border transition-colors duration-[700ms] ease-soft',
                  done
                    ? light
                      ? 'border-green-light bg-green-light text-bark'
                      : 'border-green bg-green text-cream'
                    : light
                      ? 'border-cream/25 bg-cream/[0.08] text-cream/90'
                      : 'border-gold/30 bg-gold/[0.09] text-gold',
                  !done && (light ? 'shadow-[0_18px_36px_-18px_rgb(255_255_255/0.35)]' : 'shadow-[0_18px_36px_-18px_rgb(0_0_0/0.5)]')
                )}
                style={{ width: CARD, height: CARD }}
              >
                {done ? (
                  <Check width={22} height={22} draw />
                ) : (
                  Icon && <Icon width={22} height={22} />
                )}
              </span>
            </span>
          );
        })}

        {/* Les textes, en liste ordonnée alignée sur les repères. */}
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
                  transitionDelay: `${480 + i * 120}ms`,
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

      {/* ---------- Mobile : la même courbe, en vertical ---------- */}
      <MobileCurve light={light} steps={steps} drawn={drawn} sealed={sealed} accent={accent} goldStroke={goldStroke} greenStop={greenStop} />
    </div>
  );
}

/** La progression verticale : une courbe irrégulière mesurée sur le rendu, qui
    passe par chacun des repères - la seule façon de lui faire rejoindre
    exactement les badges, quelle que soit la hauteur de leurs textes. */
function MobileCurve({ light, steps, drawn, sealed, accent, goldStroke, greenStop }) {
  const listRef = useRef(null);
  const dotRefs = useRef([]);
  const [dots, setDots] = useState([]);
  const [listH, setListH] = useState(0);
  const uid = useId().replace(/:/g, '');

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
  const X = [GUTTER / 2, GUTTER / 2 + 8, GUTTER / 2 - 8, GUTTER / 2];
  const path = smoothPath(dots.map((y, i) => ({ x: X[i % X.length], y })));
  const len = Math.round(listH * 1.35) || 1;

  return (
    <div className="relative lg:hidden">
      <div className="absolute inset-y-0 left-0 w-[52px]">
        <svg
          aria-hidden="true"
          viewBox={`0 0 ${GUTTER} ${listH}`}
          width={GUTTER}
          height={listH}
          className="absolute left-0 top-0"
          style={{ height: listH }}
        >
          <path
            d={path}
            fill="none"
            stroke={goldStroke}
            strokeWidth="10"
            strokeLinecap="round"
            opacity={drawn ? 0.35 : 0}
            style={{ filter: 'blur(8px)', strokeDasharray: len, strokeDashoffset: drawn ? 0 : len, transition: 'stroke-dashoffset 2000ms var(--ease-soft)' }}
          />
          <path
            d={path}
            fill="none"
            strokeWidth="2"
            strokeLinecap="round"
            style={{
              stroke: goldStroke,
              strokeDasharray: len,
              strokeDashoffset: drawn ? 0 : len,
              transition: 'stroke-dashoffset 2000ms var(--ease-soft)',
            }}
          />
          {drawn && !reducedMotion && (
            <path
              d={path}
              fill="none"
              strokeWidth="3"
              strokeLinecap="round"
              className={light ? 'stroke-cream' : 'stroke-gold-light'}
              style={{ strokeDasharray: '2 26', animation: 'flow-dash 6000ms linear 2000ms infinite' }}
            />
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
              className={cn(
                'relative flex gap-5 pb-10 transition-opacity duration-slow last:pb-0',
                drawn ? 'opacity-100' : 'opacity-0'
              )}
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
                      ? 'border-cream/25 bg-cream/[0.08] text-cream/90'
                      : 'border-gold/30 bg-gold/[0.09] text-gold'
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