import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { METHOD } from '@/data/method';
import { ICONS } from '@/components/ui/BrandIcons';
import { cn } from '@/lib/utils';

/**
 * Les étapes d'un chantier, posées sur une courbe.
 *
 * La courbe n'est pas un ornement : sa hauteur est la charge de travail. Le
 * premier contact ne coûte rien, le devis engage un peu, le chantier est le
 * sommet, la livraison redescend au calme. On lit le déroulé sans lire une
 * seule ligne — c'est tout ce qu'on demande à une illustration.
 *
 * Chaque étape porte son texte à côté d'elle, au-dessus ou en dessous du tracé
 * selon la place libre. La version précédente affichait les phrases une par
 * une, au survol, dans une zone unique sous le graphique : quatre lignes
 * courtes tiennent toutes en même temps, donc ni survol, ni état, ni phrase
 * qui disparaît quand la souris bouge.
 *
 * Sur les petits écrans la courbe devient un serpent vertical — même donnée,
 * autre lecture.
 */

/* Hauteur relative de chaque étape, de 0 (bas) à 1 (haut) : la charge. */
const PROFILE = [0.14, 0.46, 0.92, 0.36];

/* Côté où poser le texte. Le tracé occupe le reste. */
const ABOVE = [true, true, false, true];

const W = 1000;
const H = 300;
/* Marge latérale : assez large pour qu'un bloc de texte centré sur la première
   ou la dernière étape ne déborde pas du cadre. */
const PAD_X = 150;

/* Gouttière du serpent, en pixels : largeur de la colonne, les deux abscisses
   entre lesquelles le tracé oscille, et le diamètre du repère. Les repères de
   la liste se calent sur ces mêmes valeurs — une seule source, jamais de
   décalage. */
const SNAKE = { width: 60, left: 19, right: 41, dot: 38 };

/**
 * Trace le serpent à partir des positions réelles des repères.
 *
 * Les ordonnées viennent de la mise en page mesurée, pas d'un découpage en
 * parts égales : les étapes n'ont pas la même longueur de texte, donc pas la
 * même hauteur, et une courbe calculée à l'aveugle les rate toutes.
 */
function snakePath(ys) {
  if (ys.length < 2) return '';
  const xAt = (i) => (i % 2 === 0 ? SNAKE.left : SNAKE.right);
  let d = `M ${xAt(0)} ${ys[0].toFixed(1)}`;
  for (let i = 1; i < ys.length; i += 1) {
    const y0 = ys[i - 1];
    const y1 = ys[i];
    const dy = (y1 - y0) * 0.5;
    // Tangentes verticales aux deux extrémités : la courbe passe par le repère
    // sans casser, et le ventre se forme entre deux étapes.
    d += ` C ${xAt(i - 1)} ${(y0 + dy).toFixed(1)}, ${xAt(i)} ${(y1 - dy).toFixed(1)}, ${xAt(i)} ${y1.toFixed(1)}`;
  }
  return d;
}

/** Courbe de Catmull-Rom convertie en Bézier cubique : lisse, sans à-coups. */
function smoothPath(points) {
  if (points.length < 2) return '';
  let d = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
  for (let i = 0; i < points.length - 1; i += 1) {
    const p0 = points[i - 1] || points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] || p2;
    d +=
      ` C ${(p1.x + (p2.x - p0.x) / 6).toFixed(1)} ${(p1.y + (p2.y - p0.y) / 6).toFixed(1)},` +
      ` ${(p2.x - (p3.x - p1.x) / 6).toFixed(1)} ${(p2.y - (p3.y - p1.y) / 6).toFixed(1)},` +
      ` ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return d;
}

export default function ProcessCurve({ steps = METHOD, tone = 'dark', className }) {
  const light = tone === 'light'; // « light » = texte clair sur fond sombre
  // Identifiants uniques : deux courbes sur une même page partageraient sinon
  // leurs dégradés, et la seconde hériterait des couleurs de la première.
  const uid = useId().replace(/:/g, '');
  const fillId = `curve-fill-${uid}`;
  const strokeId = `curve-stroke-${uid}`;
  const ref = useRef(null);
  const [drawn, setDrawn] = useState(false);

  const { points, line, area } = useMemo(() => {
    const span = (W - PAD_X * 2) / (steps.length - 1);
    const pts = steps.map((s, i) => ({
      x: PAD_X + i * span,
      y: H - 24 - (PROFILE[i] ?? 0.5) * (H - 56),
      above: ABOVE[i] ?? true,
      step: s,
    }));
    const d = smoothPath(pts);
    return { points: pts, line: d, area: `${d} L ${pts[pts.length - 1].x} ${H} L ${pts[0].x} ${H} Z` };
  }, [steps]);

  /* La validation arrive après la courbe, pas avec elle. Tout allumer d'un coup
     ne raconte rien ; ici on voit le trait rejoindre la livraison, puis la
     livraison se valider. L'ordre est le message. */
  const [sealed, setSealed] = useState(false);
  useEffect(() => {
    if (!drawn) return undefined;
    const id = setTimeout(() => setSealed(true), 1700);
    return () => clearTimeout(id);
  }, [drawn]);

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

  /* ---------- Mesure du serpent (mobile) ---------- */
  const snakeRef = useRef(null);
  const dotRefs = useRef([]);
  const [dotYs, setDotYs] = useState([]);
  const [snakeH, setSnakeH] = useState(0);

  useEffect(() => {
    const wrap = snakeRef.current;
    if (!wrap || typeof ResizeObserver === 'undefined') return undefined;

    const measure = () => {
      const base = wrap.getBoundingClientRect();
      setDotYs(
        dotRefs.current.filter(Boolean).map((el) => {
          const r = el.getBoundingClientRect();
          return r.top - base.top + r.height / 2;
        })
      );
      setSnakeH(Math.round(base.height));
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(wrap);
    return () => ro.disconnect();
  }, [steps]);

  // Longueur du tracé, pour l'écrire au scroll. Majorée d'un quart : la marge
  // évite qu'un arrondi laisse un bout de courbe non dessiné.
  const snakeLen = Math.round((snakeH || 0) * 1.25) || 1;

  const accent = light ? 'text-gold-light' : 'text-gold';
  /* Les dégradés SVG ne lisent pas les classes Tailwind : ils prennent les
     mêmes jetons, directement. */
  const goldStop = `rgb(var(--c-gold${light ? '-light' : ''}-rgb))`;
  const greenStop = `rgb(var(--c-green${light ? '-light' : ''}-rgb))`;

  /**
   * Le repère posé sur le tracé : pastille pleine, symbole de l'étape.
   *
   * La dernière passe au vert quand le chantier est livré. Le vert n'est pas
   * une décoration de fin de liste : c'est la seule couleur du site réservée à
   * un état achevé, et la promesse qu'elle illustre — « il est terminé quand
   * vous le dites » — est la seule que le visiteur contrôle. C'est là que se
   * gagne la confiance, donc c'est là qu'on la marque.
   */
  const Badge = ({ step, size, last = false }) => {
    const Icon = ICONS[step.icon];
    const done = last && sealed;
    return (
      <span className="relative grid place-items-center">
        {/* L'onde part du bord de la pastille et s'efface. Décorative : le
            changement de couleur suffit à porter l'information. */}
        {done && (
          <span
            aria-hidden="true"
            className={cn(
              'seal-ring pointer-events-none absolute inset-0 rounded-md',
              light ? 'bg-green-light' : 'bg-green'
            )}
          />
        )}
        <span
          className={cn(
            'relative grid place-items-center rounded-md shadow-lift transition-colors duration-[550ms] ease-soft',
            done
              ? light
                ? 'bg-green-light text-bark'
                : 'bg-green text-cream'
              : light
                ? 'bg-ground text-bark'
                : 'bg-surface text-cream'
          )}
          style={{ width: size, height: size }}
        >
          {Icon ? (
            <Icon
              width={size * 0.42}
              height={size * 0.42}
              {...(last ? { draw: done } : {})}
            />
          ) : null}
        </span>
      </span>
    );
  };

  return (
    <div ref={ref} className={className}>
      {/* ---------- Desktop : la courbe ---------- */}
      {/* Le padding vertical fait la place aux textes, qui débordent
          volontairement du cadre du tracé. */}
      <div className="relative hidden pb-28 pt-24 lg:block">
        <div className="relative">
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="w-full overflow-visible"
            role="img"
            aria-label={`Déroulé d'un chantier en ${steps.length} étapes, de ${steps[0].title} à ${steps[steps.length - 1].title}`}
          >
            <defs>
              <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="currentColor" stopOpacity="0.16" />
                <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
              </linearGradient>

              {/* Le tracé vire au vert sur son dernier tiers, au moment où la
                  livraison se valide. Sans lui, la pastille verte serait un
                  accident isolé : c'est la ligne qui la rend inévitable. */}
              <linearGradient id={strokeId} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={goldStop} />
                <stop offset="66%" stopColor={goldStop} />
                <stop
                  offset="100%"
                  style={{ stopColor: sealed ? greenStop : goldStop, transition: 'stop-color 550ms var(--ease-soft)' }}
                />
              </linearGradient>
            </defs>

            {/* Remplissage sous la courbe : donne du corps au tracé sans le
                charger. Il apparaît une fois la ligne écrite. */}
            <path
              d={area}
              fill={`url(#${fillId})`}
              className={cn(
                'transition-opacity duration-[900ms] ease-soft',
                accent,
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
              stroke={`url(#${strokeId})`}
              style={{
                strokeDasharray: 2400,
                strokeDashoffset: drawn ? 0 : 2400,
                transition: 'stroke-dashoffset 1600ms var(--ease-soft)',
              }}
            />
          </svg>

          {/* Repères, chiffres fantômes et textes : en HTML par-dessus le
              tracé, aux mêmes coordonnées. La typographie reste celle du site,
              ce qu'un `<text>` SVG ne sait pas faire aussi bien. */}
          {points.map((p, i) => {
            const x = `${(p.x / W) * 100}%`;
            const y = `${(p.y / H) * 100}%`;
            return (
              <div key={p.step.n}>
                {/* Le chiffre en filigrane donne l'échelle et le rang sans
                    ajouter de bloc de texte. Décoratif : le rang est déjà
                    porté par la liste ordonnée du texte. */}
                <span
                  aria-hidden="true"
                  className={cn(
                    'pointer-events-none absolute select-none font-display leading-[0.75] transition-opacity duration-[1200ms] ease-soft',
                    'text-[7.5rem] xl:text-[9rem]',
                    light ? 'text-cream/[0.09]' : 'text-cream/[0.075]',
                    drawn ? 'opacity-100' : 'opacity-0'
                  )}
                  style={{
                    left: x,
                    top: y,
                    transform: 'translate(-50%, -62%)',
                    transitionDelay: `${800 + i * 110}ms`,
                  }}
                >
                  {i + 1}
                </span>

                <span
                  aria-hidden="true"
                  className={cn(
                    'absolute transition-[opacity,transform] duration-slow ease-soft',
                    drawn ? 'opacity-100' : 'opacity-0'
                  )}
                  style={{
                    // Transform en ligne : il porte le centrage ET l'entrée,
                    // qu'une classe utilitaire écraserait.
                    left: x,
                    top: y,
                    transform: `translate(-50%, -50%)${drawn ? '' : ' scale(0.6)'}`,
                    transitionDelay: `${900 + i * 110}ms`,
                  }}
                >
                  <Badge step={p.step} size={52} last={i === points.length - 1} />
                </span>
              </div>
            );
          })}

          {/* Les textes forment une vraie liste ordonnée : c'est l'ordre qui
              porte le sens, et un lecteur d'écran doit l'entendre. */}
          <ol>
            {points.map((p, i) => (
              <li
                key={p.step.n}
                className={cn(
                  // Largeur suivie sur l'écart entre étapes : à 1024 px il
                  // n'est que de 221 px, donc un bloc fixe de 15 rem
                  // chevaucherait son voisin.
                  'absolute w-[12.5rem] xl:w-[15rem] transition-opacity duration-slow',
                  drawn ? 'opacity-100' : 'opacity-0'
                )}
                style={{
                  left: `${(p.x / W) * 100}%`,
                  [p.above ? 'bottom' : 'top']: `calc(${p.above ? 100 - (p.y / H) * 100 : (p.y / H) * 100}% + 2.75rem)`,
                  transform: 'translateX(-50%)',
                  transitionDelay: `${1000 + i * 110}ms`,
                }}
              >
                <h3 className={cn('t-h3 text-balance', light ? 'text-cream' : 'text-cream')}>{p.step.title}</h3>
                <p className={cn('t-small mt-2', light ? 'text-cream/65' : 'text-cream/65')}>{p.step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* ---------- Mobile : la même progression, en serpent ----------
          Les ordonnées viennent de la mise en page réelle, mesurée après le
          rendu : c'est la seule façon de faire passer la courbe exactement par
          chaque repère. */}
      <div ref={snakeRef} className="relative lg:hidden">
        {snakeH > 0 && (
          <svg
            aria-hidden="true"
            viewBox={`0 0 ${SNAKE.width} ${snakeH}`}
            width={SNAKE.width}
            height={snakeH}
            className="absolute left-0 top-0"
            style={{ height: snakeH }}
          >
            <defs>
              <linearGradient id={`${strokeId}-v`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={goldStop} stopOpacity="0.45" />
                <stop offset="72%" stopColor={goldStop} stopOpacity="0.45" />
                <stop
                  offset="100%"
                  stopOpacity="0.95"
                  style={{ stopColor: sealed ? greenStop : goldStop, transition: 'stop-color 550ms var(--ease-soft)' }}
                />
              </linearGradient>
            </defs>
            <path
              d={snakePath(dotYs)}
              fill="none"
              strokeWidth="2"
              strokeLinecap="round"
              stroke={`url(#${strokeId}-v)`}
              style={{
                strokeDasharray: snakeLen,
                strokeDashoffset: drawn ? 0 : snakeLen,
                transition: 'stroke-dashoffset 1800ms var(--ease-soft)',
              }}
            />
          </svg>
        )}

        <ol className="relative">
          {steps.map((s, i) => (
            <li key={s.n} className="relative pb-10 last:pb-0" style={{ paddingLeft: SNAKE.width + 20 }}>
              {/* Même abscisse que la courbe : le repère est posé sur le
                  tracé, pas à côté. */}
              <span
                ref={(el) => {
                  dotRefs.current[i] = el;
                }}
                aria-hidden="true"
                className={cn('absolute top-0 transition-opacity duration-slow', drawn ? 'opacity-100' : 'opacity-0')}
                style={{
                  left: (i % 2 === 0 ? SNAKE.left : SNAKE.right) - SNAKE.dot / 2,
                  transitionDelay: `${300 + i * 130}ms`,
                }}
              >
                <Badge step={s} size={SNAKE.dot} last={i === steps.length - 1} />
              </span>
              <h3 className={cn('t-h3', light ? 'text-cream' : 'text-cream')}>{s.title}</h3>
              <p className={cn('t-small mt-2', light ? 'text-cream/65' : 'text-cream/65')}>{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
