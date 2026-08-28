import { useEffect, useId, useRef, useState } from 'react';
import { METHOD } from '@/data/method';
import { ICONS } from '@/components/ui/BrandIcons';
import { cn } from '@/lib/utils';

/**
 * Les étapes d'un chantier, sur une courbe irrégulière.
 *
 * Pas une sinusoïde symétrique, pas une ligne droite : une courbe qui monte et
 * redescend sans se répéter — c'est la charge de travail (le contact ne coûte
 * rien, le chantier est le sommet, la livraison redescend au calme) dessinée
 * avec la main, pas avec une formule.
 *
 * Elle se trace au scroll (trait, halo flouté, remous sous la courbe), puis les
 * quatre repères se posent dessus en basculant depuis la profondeur. Le vert de
 * la livraison scelle la fin : c'est la seule couleur du site réservée à un
 * état achevé.
 *
 * Sur les petits écrans, la même courbe — irrégulière — passe dans les repères
 * en vertical.
 */

const W = 1000;
const H = 340;
const BASE = 46;

/* Les quatre points : abscisses et hauteurs volontairement irréguliers. */
const POINTS = [
  { x: 132, h: 102 },
  { x: 388, h: 190 },
  { x: 652, h: 250 },
  { x: 882, h: 140 },
].map((p, i) => ({ ...p, y: H - BASE - p.h, i }));

/* Tangentes inégales d'un segment à l'autre : c'est ce qui rend la courbe
   irrégulière (Catmull-Rom à facteurs variables). */
const KS = [0.18, 0.34, 0.16];
const CARD = 58;

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

export default function ProcessCurve({ steps = METHOD, tone = 'dark', className }) {
  const light = tone === 'light'; // « light » = texte clair sur fond sombre
  const uid = useId().replace(/:/g, '');
  const ref = useRef(null);
  const [drawn, setDrawn] = useState(reducedMotion);
  const [sealed, setSealed] = useState(false);

  const line = smoothPath(POINTS);
  const area = `${line} L ${POINTS[POINTS.length - 1].x} ${H} L ${POINTS[0].x} ${H} Z`;
  /* Longueur virtuelle du tracé pour l'écrire progressivement. */
  const LEN = 2600;

  useEffect(() => {
    if (!drawn) return undefined;
    const id = setTimeout(() => setSealed(true), 1900);
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
  const ghost = light ? 'text-cream/[0.08]' : 'text-ink/[0.07]';
  const goldStroke = `rgb(var(--c-gold${light ? '-light' : ''}-rgb))`;
  const greenStop = `rgb(var(--c-green${light ? '-light' : ''}-rgb))`;

  const Badge = ({ step, size = CARD, last = false }) => {
    const Icon = ICONS[step.icon];
    const done = last && sealed;
    return (
      <span className="relative grid place-items-center">
        {done && (
          <span
            aria-hidden="true"
            className={cn('seal-ring pointer-events-none absolute inset-0 rounded-md', light ? 'bg-green-light' : 'bg-green')}
          />
        )}
        <span
          className={cn(
            'relative grid place-items-center rounded-md transition-colors duration-[550ms] ease-soft',
            size === CARD ? 'shadow-lift' : 'shadow-soft',
            done
              ? light
                ? 'bg-green-light text-bark'
                : 'bg-green text-cream'
              : light
                ? 'bg-cream text-bark'
                : 'bg-shell text-ink'
          )}
          style={{ width: size, height: size }}
        >
          {Icon ? <Icon width={size * 0.42} height={size * 0.42} {...(last ? { draw: done } : {})} /> : null}
        </span>
      </span>
    );
  };

  return (
    <div ref={ref} className={className}>
      {/* ---------- Desktop : la courbe irrégulière ---------- */}
      <div className="relative hidden lg:block">
        {/* Le cadre donne la perspective aux cartes qui basculent. */}
        <div className="relative overflow-visible" style={{ height: H, perspective: '1200px' }}>
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="absolute inset-0 h-full w-full overflow-visible"
            role="img"
            aria-label={`Déroulé d'un chantier en ${steps.length} étapes, de ${steps[0].title} à ${steps[steps.length - 1].title}`}
          >
            <defs>
              <linearGradient id={`area-${uid}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="currentColor" stopOpacity="0.16" />
                <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
              </linearGradient>
              <linearGradient id={`stroke-${uid}`} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={goldStroke} />
                <stop offset="62%" stopColor={goldStroke} />
                <stop
                  offset="100%"
                  style={{ stopColor: sealed ? greenStop : goldStroke, transition: 'stop-color 550ms var(--ease-soft)' }}
                />
              </linearGradient>
            </defs>

            {/* Remous sous la courbe */}
            <path
              d={area}
              fill={`url(#area-${uid})`}
              className={cn('transition-opacity duration-[1000ms] ease-soft', accent, drawn ? 'opacity-100' : 'opacity-0')}
              style={{ transitionDelay: '600ms' }}
            />

            {/* Halo flouté : donne la profondeur au tracé */}
            <path
              d={line}
              fill="none"
              stroke={goldStroke}
              strokeWidth="16"
              strokeLinecap="round"
              opacity={drawn ? 0.35 : 0}
              style={{
                filter: 'blur(16px)',
                strokeDasharray: LEN,
                strokeDashoffset: drawn ? 0 : LEN,
                transition: 'stroke-dashoffset 2200ms var(--ease-soft), opacity 900ms ease',
              }}
            />

            {/* Le tracé lui-même */}
            <path
              d={line}
              fill="none"
              strokeWidth="2"
              strokeLinecap="round"
              stroke={`url(#stroke-${uid})`}
              style={{
                strokeDasharray: LEN,
                strokeDashoffset: drawn ? 0 : LEN,
                transition: 'stroke-dashoffset 2200ms var(--ease-soft)',
              }}
            />
          </svg>

          {/* Repères et chiffres fantômes, posés sur la courbe. */}
          {POINTS.map((p, i) => {
            const x = `${(p.x / W) * 100}%`;
            const y = `${(p.y / H) * 100}%`;
            const step = steps[i];

            return (
              <div key={step.n}>
                <span
                  aria-hidden="true"
                  className={cn(
                    'pointer-events-none absolute select-none font-display leading-[0.75] transition-opacity duration-[1200ms]',
                    'text-[6.5rem] xl:text-[7.5rem]',
                    ghost,
                    drawn ? 'opacity-100' : 'opacity-0'
                  )}
                  style={{
                    left: x,
                    top: y,
                    transform: 'translate(-50%, -64%)',
                    transitionDelay: `${700 + i * 120}ms`,
                  }}
                >
                  {i + 1}
                </span>

                <span
                  className="absolute z-10 transition-[opacity,transform] duration-[700ms] ease-soft"
                  style={{
                    left: x,
                    top: y,
                    transform: drawn
                      ? 'translate(-50%, -50%) rotateX(0deg) scale(1)'
                      : 'translate(-50%, -50%) rotateX(-28deg) translateY(16px) scale(0.84)',
                    opacity: drawn ? 1 : 0,
                    transformOrigin: 'center center',
                    transitionDelay: `${320 + i * 120}ms`,
                  }}
                >
                  <Badge step={step} last={i === steps.length - 1} />
                </span>
              </div>
            );
          })}
        </div>

        {/* Les textes, en liste ordonnée alignée sur les repères.
            La géométrie irrégulière ne se prête pas à une grille : chaque bloc
            est posé sous son point, à sa même abscisse. */}
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
      <MobileCurve light={light} steps={steps} drawn={drawn} sealed={sealed} accent={accent} Badge={Badge} />
    </div>
  );
}

/** La progression verticale : une courbe irrégulière mesurée sur le rendu, qui
    passe par chacun des repères — la seule façon de lui faire rejoindre
    exactement les badges, quelle que soit la hauteur de leurs textes. */
function MobileCurve({ light, steps, drawn, sealed, accent, Badge }) {
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

  const GUTTER = 46;
  /* Abscisses irrégulières dans la gouttière : pas deux segments pareils. */
  const X = [GUTTER / 2, GUTTER / 2 + 7, GUTTER / 2 - 7, GUTTER / 2];
  const path = smoothPath(dots.map((y, i) => ({ x: X[i % X.length], y })));
  const len = Math.round(listH * 1.35) || 1;

  return (
    <div className="relative lg:hidden">
      {/* la courbe derrière les repères */}
      <div className="absolute inset-y-0 left-0 w-[46px]">
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
            stroke="currentColor"
            strokeWidth="10"
            strokeLinecap="round"
            className={light ? 'text-cream/[0.14]' : 'text-ink/[0.10]'}
            style={{ filter: 'blur(8px)', strokeDasharray: len, strokeDashoffset: drawn ? 0 : len, transition: 'stroke-dashoffset 2000ms var(--ease-soft)' }}
          />
          <path
            d={path}
            fill="none"
            strokeWidth="2"
            strokeLinecap="round"
            style={{
              stroke: light ? 'rgb(201 174 131 / 0.8)' : 'rgb(140 118 78 / 0.8)',
              strokeDasharray: len,
              strokeDashoffset: drawn ? 0 : len,
              transition: 'stroke-dashoffset 2000ms var(--ease-soft)',
            }}
          />
        </svg>
      </div>

      <ol ref={listRef} className="relative">
        {steps.map((s, i) => {
          const last = i === steps.length - 1;
          return (
            <li
              key={s.n}
              className={cn(
                'relative flex gap-5 pb-9 transition-opacity duration-slow last:pb-0',
                drawn ? 'opacity-100' : 'opacity-0'
              )}
              style={{ transitionDelay: `${150 + i * 130}ms` }}
            >
              <span ref={(el) => { dotRefs.current[i] = el; }} className="relative z-10 mt-1 flex-none">
                <Badge step={s} size={46} last={last} />
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