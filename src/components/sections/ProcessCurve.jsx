import { useEffect, useMemo, useRef, useState } from 'react';
import { METHOD } from '@/data/method';
import { cn } from '@/lib/utils';

/**
 * Les étapes d'un chantier, posées sur une courbe.
 *
 * La ligne droite ponctuée de sept points ne racontait rien : elle mesurait un
 * axe. Un chantier ne se lit pas comme un axe — il monte à la préparation,
 * s'aplatit pendant les travaux, redescend à la livraison. La courbe suit ce
 * profil, et chaque étape est posée dessus à sa hauteur réelle.
 *
 * Tout est calculé une fois, en SVG, sans dépendance : le tracé s'écrit au
 * scroll (`stroke-dasharray`), les points apparaissent derrière lui. Sur les
 * petits écrans la courbe devient verticale — même donnée, autre lecture.
 */

/* Hauteur relative de chaque étape, de 0 (bas) à 1 (haut).
   Contact et livraison au niveau du sol, planification au sommet. */
const PROFILE = [0.18, 0.42, 0.62, 0.8, 0.94, 0.62, 0.2];

const W = 1000;
const H = 260;
const PAD_X = 40;

/** Courbe de Catmull-Rom convertie en Bézier cubique : lisse, sans à-coups. */
function smoothPath(points) {
  if (points.length < 2) return '';
  let d = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
  for (let i = 0; i < points.length - 1; i += 1) {
    const p0 = points[i - 1] || points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] || p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return d;
}

export default function ProcessCurve({ steps = METHOD, tone = 'dark', className }) {
  const light = tone === 'light'; // « light » = texte clair sur fond sombre
  const ref = useRef(null);
  const [drawn, setDrawn] = useState(false);
  const [active, setActive] = useState(null);

  const { points, line, area } = useMemo(() => {
    const span = (W - PAD_X * 2) / (steps.length - 1);
    const pts = steps.map((s, i) => ({
      x: PAD_X + i * span,
      y: H - 30 - (PROFILE[i] ?? 0.5) * (H - 70),
      step: s,
    }));
    const d = smoothPath(pts);
    return { points: pts, line: d, area: `${d} L ${pts[pts.length - 1].x} ${H} L ${pts[0].x} ${H} Z` };
  }, [steps]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setDrawn(true);
          io.disconnect();
        }
      },
      { rootMargin: '-80px', threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const stroke = light ? 'stroke-umber-light' : 'stroke-umber';
  const dot = light ? 'fill-umber-light' : 'fill-umber';

  return (
    <div ref={ref} className={className}>
      {/* ---------- Desktop : la courbe ---------- */}
      <div className="hidden lg:block">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full overflow-visible"
          role="img"
          aria-label={`Déroulé d'un chantier en ${steps.length} étapes, de ${steps[0].title} à ${steps[steps.length - 1].title}`}
        >
          <defs>
            <linearGradient id="chaudrel-curve-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0.14" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Remplissage sous la courbe : donne du corps au tracé sans le
              charger. Il apparaît une fois la ligne écrite. */}
          <path
            d={area}
            fill="url(#chaudrel-curve-fill)"
            className={cn(
              'transition-opacity duration-[900ms] ease-soft',
              light ? 'text-umber-light' : 'text-umber',
              drawn ? 'opacity-100' : 'opacity-0'
            )}
            style={{ transitionDelay: '700ms' }}
          />

          <path
            d={line}
            fill="none"
            strokeWidth="2"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            className={stroke}
            style={{
              strokeDasharray: 2400,
              strokeDashoffset: drawn ? 0 : 2400,
              transition: 'stroke-dashoffset 1600ms var(--ease-soft)',
            }}
          />

          {/* Le graphique ne capte pas la souris : c'est la légende, en dessous,
              qui pilote l'étape active. Deux surfaces de survol aux frontières
              différentes se contredisaient — le point surligné n'était pas
              toujours celui dont la phrase s'affichait. */}
          {points.map((p, i) => (
            <g key={p.step.n} className="pointer-events-none">
              <line
                x1={p.x}
                y1={p.y}
                x2={p.x}
                y2={H - 8}
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
                className={cn(
                  'transition-opacity duration-slow',
                  light ? 'stroke-cream/20' : 'stroke-ink/15',
                  drawn ? (active === i ? 'opacity-100' : 'opacity-40') : 'opacity-0'
                )}
                style={{ transitionDelay: `${700 + i * 90}ms` }}
              />
              <circle
                cx={p.x}
                cy={p.y}
                r={active === i ? 7 : 5}
                className={cn(
                  dot,
                  'transition-[r,opacity] duration-slow ease-soft',
                  drawn ? 'opacity-100' : 'opacity-0'
                )}
                style={{ transitionDelay: `${700 + i * 90}ms` }}
              />
            </g>
          ))}
        </svg>

        {/* Sous chaque point, le numéro et le titre — rien de plus : sept
            colonnes de paragraphe se cassent en bouillie dès 1280 px. La phrase
            de l'étape s'affiche dans une zone de lecture unique, sous le
            graphique, ce qui garde l'alignement avec les points. */}
        <ol className="mt-7 grid" style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}>
          {steps.map((s, i) => (
            <li
              key={s.n}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              className={cn(
                'px-2 transition-opacity duration-slow',
                drawn ? 'opacity-100' : 'opacity-0',
                active !== null && active !== i && 'opacity-50'
              )}
              style={{ transitionDelay: `${900 + i * 90}ms` }}
            >
              <span className={cn('t-label block', light ? 'text-umber-light' : 'text-umber')}>{s.n}</span>
              <h3 className={cn('t-h3 mt-2 text-balance', light ? 'text-cream' : 'text-ink')}>{s.title}</h3>
              {/* Le texte reste dans le document pour les lecteurs d'écran et
                  l'indexation ; seule sa présentation change. */}
              <span className="sr-only">{s.text}</span>
            </li>
          ))}
        </ol>

        <p
          aria-hidden="true"
          className={cn(
            'mt-10 min-h-[3.25rem] max-w-[62ch] border-t pt-6 t-lead transition-opacity duration-slow',
            light ? 'border-cream/15 text-cream/70' : 'border-ink/12 text-ink/70',
            drawn ? 'opacity-100' : 'opacity-0'
          )}
          style={{ transitionDelay: '1500ms' }}
        >
          {steps[active ?? 0].text}
        </p>
      </div>

      {/* ---------- Mobile : la même progression, à la verticale ---------- */}
      <ol className="relative lg:hidden">
        <span
          aria-hidden="true"
          className={cn(
            'absolute bottom-8 left-[7px] top-2 w-px origin-top transition-transform duration-[1200ms] ease-soft',
            light ? 'bg-umber-light/40' : 'bg-umber/30',
            drawn ? 'scale-y-100' : 'scale-y-0'
          )}
        />
        {steps.map((s, i) => (
          <li key={s.n} className="relative pb-9 pl-9 last:pb-0">
            <span
              aria-hidden="true"
              className={cn(
                'absolute left-0 top-[7px] h-[15px] w-[15px] rounded-full border-[3px] transition-opacity duration-slow',
                light ? 'border-umber-light bg-bark' : 'border-umber bg-cream',
                drawn ? 'opacity-100' : 'opacity-0'
              )}
              style={{ transitionDelay: `${i * 110}ms` }}
            />
            <span className={cn('t-label block', light ? 'text-umber-light' : 'text-umber')}>{s.n}</span>
            <h3 className={cn('t-h3 mt-1.5', light ? 'text-cream' : 'text-ink')}>{s.title}</h3>
            <p className={cn('t-small mt-1.5', light ? 'text-cream/65' : 'text-ink/65')}>{s.text}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
