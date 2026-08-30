import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { METHOD } from '@/data/method';
import { EVENTS, track } from '@/lib/analytics';
import { cn } from '@/lib/utils';

/**
 * Le parcours d'un chantier - une ligne, quatre repères, une arrivée.
 *
 * Une courbe fluide et sans nœud qui descend la page de haut à gauche vers
 * bas à droite : le déroulé se lit comme un parcours, pas comme un diagramme.
 * Quatre repères numérotés, un titre chacun, rien de plus - et, au bout, la
 * seule action qui compte : demander le devis.
 *
 * La ligne se trace à l'arrivée, une impulsion de lumière la parcourt
 * lentement, et chaque repère se pose avec son numéro.
 */

const W = 1000;
const H = 320;

/* Les repères : une diagonale souple, sans courbure brusque. */
const POINTS = [
  { x: 150, y: 80 },
  { x: 560, y: 142 },
  { x: 330, y: 236 },
  { x: 892, y: 256 },
];

/* Courbe lisse à travers les points : de larges courbures, aucun angle vif. */
function smoothPath() {
  const p = POINTS;
  let d = `M ${p[0].x} ${p[0].y}`;
  for (let i = 0; i < p.length - 1; i += 1) {
    const p0 = p[i - 1] || p[i];
    const p1 = p[i];
    const p2 = p[i + 1];
    const p3 = p[i + 2] || p2;
    const k = 0.24;
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
  const ref = useRef(null);
  const [drawn, setDrawn] = useState(reducedMotion);

  const line = smoothPath();
  const area = `${line} L ${POINTS[POINTS.length - 1].x} ${H} L ${POINTS[0].x} ${H} Z`;
  const LEN = 2200;

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

  const gold = light ? 'rgb(201 174 131)' : 'rgb(140 118 78)';
  const accent = light ? 'text-gold-light' : 'text-gold';

  return (
    <div ref={ref} className={className}>
      {/* ---------- Desktop : le parcours ---------- */}
      <div className="relative hidden lg:block">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full overflow-visible"
          role="img"
          aria-label={`Déroulé d'un chantier en ${steps.length} étapes, de ${steps[0].title} à ${steps[steps.length - 1].title}`}
        >
          <defs>
            <linearGradient id="j-area-light" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0.1" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Remous discret sous la courbe. */}
          <path
            d={area}
            fill="url(#j-area-light)"
            className={cn('transition-opacity duration-[1000ms] ease-soft', accent, drawn ? 'opacity-100' : 'opacity-0')}
            style={{ transitionDelay: '600ms' }}
          />

          {/* Le trait, avec son halo flou en profondeur. */}
          <path
            d={line}
            fill="none"
            stroke={gold}
            strokeWidth="14"
            strokeLinecap="round"
            opacity={drawn ? 0.25 : 0}
            style={{
              filter: 'blur(10px)',
              strokeDasharray: LEN,
              strokeDashoffset: drawn ? 0 : LEN,
              transition: 'stroke-dashoffset 2000ms var(--ease-soft), opacity 800ms ease',
            }}
          />
          <path
            d={line}
            fill="none"
            stroke={gold}
            strokeWidth="2"
            strokeLinecap="round"
            style={{
              strokeDasharray: LEN,
              strokeDashoffset: drawn ? 0 : LEN,
              transition: 'stroke-dashoffset 2000ms var(--ease-soft)',
            }}
          />

          {/* L'impulsion de lumière qui parcourt la ligne. */}
          {drawn && !reducedMotion && (
            <path
              d={line}
              fill="none"
              strokeLinecap="round"
              className={light ? 'stroke-cream' : 'stroke-gold-light'}
              style={{ strokeWidth: 3, strokeDasharray: '2 30', animation: 'flow-dash 6000ms linear 2100ms infinite' }}
            />
          )}
        </svg>

        {/* Les repères numérotés sur la ligne, le titre dessous. */}
        {POINTS.map((p, i) => {
          const step = steps[i];
          const done = i === POINTS.length - 1;
          return (
            <div
              key={step.n}
              className={cn(
                'absolute z-10 transition-[opacity,transform] duration-[800ms] ease-soft',
                drawn ? 'opacity-100' : 'opacity-0'
              )}
              style={{
                left: `${(p.x / W) * 100}%`,
                top: `${(p.y / H) * 100}%`,
                transform: drawn ? 'translate(-50%,-50%)' : 'translate(-50%,-50%) translateY(14px) scale(0.85)',
                transitionDelay: `${260 + i * 160}ms`,
              }}
            >
              <span
                className={cn(
                  'grid h-11 w-11 place-items-center rounded-full border-2 transition-colors duration-slow',
                  done
                    ? light
                      ? 'border-green-light bg-green-light text-bark'
                      : 'border-green bg-green text-cream'
                    : light
                      ? 'border-gold-light/60 bg-cream/[0.08] text-cream'
                      : 'border-gold/50 bg-shell text-ink'
                )}
              >
                <span className="t-num text-[0.8rem] leading-none">{step.n}</span>
              </span>
            </div>
          );
        })}

        {/* Les titres, sous chaque repère - rien de plus. */}
        <ol className="relative mt-16">
          {POINTS.map((p, i) => {
            const step = steps[i];
            return (
              <li
                key={step.n}
                className={cn(
                  'absolute w-[12rem] text-center transition-opacity duration-slow xl:w-[14rem]',
                  drawn ? 'opacity-100' : 'opacity-0'
                )}
                style={{
                  left: `${(p.x / W) * 100}%`,
                  transform: 'translateX(-50%)',
                  transitionDelay: `${420 + i * 140}ms`,
                }}
              >
                <h3 className={cn('t-h3 text-balance', light ? 'text-cream' : 'text-ink')}>{step.title}</h3>
              </li>
            );
          })}
        </ol>
      </div>

      {/* ---------- Mobile : le même parcours, en vertical ---------- */}
      <MobileJourney light={light} steps={steps} drawn={drawn} gold={gold} />

      {/* La sortie du parcours : une seule action. */}
      <div
        className={cn(
          'mt-12 text-center transition-opacity duration-slow',
          drawn ? 'opacity-100' : 'opacity-0'
        )}
        style={{ transitionDelay: '650ms' }}
      >
        <Link
          to="/devis"
          onClick={() => track(EVENTS.QUOTE_CTA, { source: 'method' })}
          className={cn(
            'inline-flex items-center gap-2.5 rounded-full px-8 py-4 text-[11px] font-semibold uppercase tracking-[0.14em] shadow-soft transition-all duration-300 ease-soft hover:shadow-lift active:translate-y-px',
            light ? 'bg-cream text-ink hover:bg-shell' : 'bg-gold-deep text-cream hover:bg-gold-hover'
          )}
        >
          Demander le devis
          <svg width="11" height="11" viewBox="0 0 16 16" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="m6 2 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>
    </div>
  );
}

/** La même progression en vertical, courbe mesurée sur le rendu. */
function MobileJourney({ light, steps, drawn, gold }) {
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
  const curve = smoothPoints(dots.map((y, i) => ({ x: X[i % X.length], y })));
  const len = Math.round(listH * 1.4) || 1;

  return (
    <div className="relative lg:hidden">
      <div className="absolute inset-y-0 left-0 w-[52px]">
        <svg aria-hidden="true" viewBox={`0 0 ${GUTTER} ${listH}`} width={GUTTER} height={listH} className="absolute left-0 top-0" style={{ height: listH }}>
          <path d={curve} fill="none" stroke={gold} strokeWidth="10" strokeLinecap="round" opacity={drawn ? 0.22 : 0} style={{ filter: 'blur(7px)', strokeDasharray: len, strokeDashoffset: drawn ? 0 : len, transition: 'stroke-dashoffset 1800ms var(--ease-soft)' }} />
          <path d={curve} fill="none" stroke={gold} strokeWidth="2" strokeLinecap="round" style={{ strokeDasharray: len, strokeDashoffset: drawn ? 0 : len, transition: 'stroke-dashoffset 1800ms var(--ease-soft)' }} />
        </svg>
      </div>

      <ol ref={listRef} className="relative">
        {steps.map((s, i) => {
          const last = i === steps.length - 1;
          return (
            <li
              key={s.n}
              className={cn('relative flex items-center gap-5 pb-9 transition-opacity duration-slow last:pb-0', drawn ? 'opacity-100' : 'opacity-0')}
              style={{ transitionDelay: `${120 + i * 140}ms` }}
            >
              <span
                ref={(el) => {
                  dotRefs.current[i] = el;
                }}
                className={cn(
                  'relative z-10 mt-0.5 grid h-11 w-11 flex-none place-items-center rounded-full border-2',
                  last
                    ? light
                      ? 'border-green-light bg-green-light text-bark'
                      : 'border-green bg-green text-cream'
                    : light
                      ? 'border-gold-light/60 bg-cream/[0.08] text-cream'
                      : 'border-gold/50 bg-shell text-ink'
                )}
                aria-hidden="true"
              >
                <span className="t-num text-[0.8rem] leading-none">{s.n}</span>
              </span>
              <h3 className={cn('t-h3', light ? 'text-cream' : 'text-ink')}>{s.title}</h3>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/** Courbe lisse de mesure (mobile). */
function smoothPoints(points) {
  if (points.length < 2) return '';
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i += 1) {
    const p0 = points[i - 1] || points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] || p2;
    const k = 0.24;
    d +=
      ` C ${(p1.x + (p2.x - p0.x) * k).toFixed(1)} ${(p1.y + (p2.y - p0.y) * k).toFixed(1)},` +
      ` ${(p2.x - (p3.x - p1.x) * k).toFixed(1)} ${(p2.y - (p3.y - p1.y) * k).toFixed(1)},` +
      ` ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return d;
}