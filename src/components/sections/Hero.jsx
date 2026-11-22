import { useEffect, useId, useRef } from 'react';
import { Button } from '@/components/ui';
import { BronzeGradient, DOOR_POINTS, LETTERS_PATH, MONO_VIEWBOX } from '@/components/ui/Logo';
import { PhoneIcon, WhatsappIcon } from '@/components/ui/BrandIcons';
import { BRAND, whatsappUrl } from '@/data/site';
import { EVENTS, track } from '@/lib/analytics';
import { imageAttrs, SIZES } from '@/lib/image';
import usePointerGlow from '@/lib/usePointerGlow';

/* Repère du monogramme : viewBox « x y largeur hauteur » du tracé d'origine. */
const [VX, VY, VW, VH] = MONO_VIEWBOX.split(' ').map(Number);
const DOOR_D = `M${DOOR_POINTS.map((p) => p.join(' ')).join(' L')} Z`;
/* Centre de la porte, en fraction du monogramme : c'est là qu'on entre. */
const ORIGIN_X = ((DOOR_POINTS.reduce((s, p) => s + p[0], 0) / 4 - VX) / VW) * 100;
const ORIGIN_Y = ((DOOR_POINTS.reduce((s, p) => s + p[1], 0) / 4 - VY) / VH) * 100;
/* Les gonds : le bord gauche de la porte. */
const HINGE = `${((DOOR_POINTS[0][0] - VX) / VW) * 100}% 50%`;
/* La nuit autour de la porte : un grand aplat percé de la porte, assez large
   pour couvrir l'écran à l'échelle 1 sur n'importe quelle largeur. */
const M = 2400;
const MASK_D = `M${VX - M} ${VY - M} H${VX + VW + M} V${VY + VH + M} H${VX - M} Z ${DOOR_D}`;

const HEADLINE = 'Du premier plan à la dernière clé.';

const clamp01 = (v) => Math.min(1, Math.max(0, v));
const range = (p, a, b) => clamp01((p - a) / (b - a));
const ZOOM = 34;
/** Grossissement : lent au départ, puis on traverse la porte. */
const zoom = (p) => 1 + Math.pow(range(p, 0, 0.82), 2.4) * (ZOOM - 1);

/* Chaque couche en fonction de la progression p (0 → 1). Échantillonnées en
   images clés, elles sont ensuite jouées par le navigateur seul. */
const LAYERS = {
  door: (p) => ({ transform: `scale(${zoom(p)})` }),
  letters: (p) => ({ opacity: 1 - range(p, 0.08, 0.3) }),
  /* La porte finit de s'ouvrir, puis s'efface ; la lumière ensuite. */
  panel: (p) => ({ transform: `rotateY(${44 * range(p, 0, 0.16)}deg)`, opacity: 1 - range(p, 0.1, 0.24) }),
  light: (p) => ({ opacity: 1 - range(p, 0.12, 0.3) }),
  mask: (p) => ({ opacity: 1 - range(p, 0.55, 0.86) }),
  glow: (p) => ({ opacity: 1 - range(p, 0, 0.35) }),
  photo: (p) => ({ transform: `scale(${1.14 - 0.14 * range(p, 0.25, 0.8)})` }),
  intro: (p) => ({ opacity: 1 - range(p, 0, 0.16), transform: `translateY(${-32 * range(p, 0, 0.16)}px)` }),
  fade: (p) => ({ opacity: 1 - range(p, 0, 0.12) }),
  final: (p) => ({ opacity: range(p, 0.8, 0.98), transform: `translateY(${28 * (1 - range(p, 0.8, 0.98))}px)` }),
};
const STOPS = 32;
const framesFor = (fn) => Array.from({ length: STOPS + 1 }, (_, i) => ({ offset: i / STOPS, ...fn(i / STOPS) }));

/* L'intro se joue une fois par chargement de page : une fois vue, `data-intro`
   reste posé sur <html> tant qu'on navigue dans le site ; F5 le remet à zéro. */
const ZOOM_DELAY = 2400; // après l'ouverture de la porte (CSS, ~2,5 s)
const ZOOM_MS = 2400;

/**
 * Hero - la porte du logo s'ouvre sur une maison.
 *
 * À chaque chargement (arrivée sur le site, F5) : le monogramme CR sur la
 * nuit, la promesse et les trois issues (devis, appel, WhatsApp) ; la porte
 * s'entrouvre, puis la caméra la traverse toute seule jusqu'à la photo, et
 * une carte de verre porte l'offre. Aucun défilement à faire ; un geste
 * (molette, toucher, touche) passe directement à la fin. Retour sur l'accueil
 * en naviguant, et `prefers-reduced-motion` : la photo et la carte d'emblée.
 *
 * Performance : la nuit est un aplat percé de la porte que l'on agrandit par
 * `transform` ; les couches sont des Web Animations jouées par la carte
 * graphique, une seule fois. À l'arrêt, rien ne tourne.
 *
 * La photo est une image d'ambiance : elle ne montre pas un chantier
 * Chaudrel et n'est jamais légendée comme tel.
 */
export default function Hero() {
  const sectionRef = useRef(null);
  const refs = useRef({});
  const gid = useId().replace(/:/g, '');
  const glow = usePointerGlow();
  const bind = (name) => (el) => {
    refs.current[name] = el;
  };

  useEffect(() => {
    const root = document.documentElement;
    const seen = () => {
      root.dataset.intro = 'seen';
    };
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (root.dataset.intro === 'seen' || reduce || !sectionRef.current?.animate) return seen();

    const animations = [];
    for (const [name, fn] of Object.entries(LAYERS)) {
      const els = name === 'fade' ? [refs.current.fade, refs.current.fade2, refs.current.fade3] : [refs.current[name]];
      for (const el of els) {
        if (el) animations.push(el.animate(framesFor(fn), { duration: ZOOM_MS, delay: ZOOM_DELAY, fill: 'both' }));
      }
    }

    // Un geste pendant l'intro la termine sans faire défiler la page : on
    // arrive sur l'accueil, et c'est le geste suivant qui descend.
    const skip = (e) => {
      if (e.type !== 'keydown') e.preventDefault();
      animations.forEach((a) => a.finish());
      gestures.forEach((g) => window.removeEventListener(g, skip));
    };
    const gestures = ['wheel', 'touchmove', 'keydown'];
    gestures.forEach((g) => window.addEventListener(g, skip, { passive: false }));
    let alive = true;
    const t0 = performance.now();
    Promise.all(animations.map((a) => a.finished))
      .then(() => {
        if (!alive) return;
        seen();
        // L'état final est désormais tenu par le CSS : on libère les animations.
        animations.forEach((a) => a.cancel());
      })
      .catch(() => {});

    return () => {
      alive = false;
      gestures.forEach((g) => window.removeEventListener(g, skip));
      animations.forEach((a) => a.cancel());
      // Quitter l'accueil en pleine intro compte comme vue (le double montage
      // de StrictMode, lui, est immédiat et ne compte pas).
      if (performance.now() - t0 > 300) seen();
    };
  }, []);

  const words = HEADLINE.split(' ');

  return (
    <section ref={sectionRef} aria-label="Chaudrel Rénovation" className="door-hero on-dark relative bg-bark">
      <div className="door-stage sticky top-0 flex h-[100svh] min-h-[560px] flex-col items-center justify-center overflow-hidden text-cream">
        {/* La maison derrière la porte. */}
        <img
          ref={bind('photo')}
          {...imageAttrs('/photos/hero.webp', SIZES.full)}
          alt="Maison contemporaine à façade sombre, intérieur éclairé à la tombée du jour"
          width="1920"
          height="1080"
          decoding="async"
          fetchpriority="low"
          className="door-photo absolute inset-0 h-full w-full object-cover"
        />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-bark/90 via-bark/20 to-bark/45" />

        {/* La porte : la nuit percée, le monogramme, le panneau bronze. */}
        <div
          ref={bind('door')}
          aria-hidden="true"
          className="door-mono relative z-[1] aspect-[476/372] [container-type:inline-size] w-[min(72vw,360px,58svh)] sm:w-[min(50vw,460px,60svh)] lg:w-[min(38vw,540px,62vh)]"
          style={{ transformOrigin: `${ORIGIN_X}% ${ORIGIN_Y}%` }}
        >
          <svg
            ref={bind('mask')}
            viewBox={MONO_VIEWBOX}
            className="door-mask absolute inset-0 h-full w-full overflow-visible"
          >
            <path d={MASK_D} fillRule="evenodd" fill="rgb(var(--c-bark-rgb))" />
          </svg>
          <div className="door-letters-in absolute inset-0">
            <svg ref={bind('letters')} viewBox={MONO_VIEWBOX} className="door-letters absolute inset-0 h-full w-full">
              <path d={LETTERS_PATH} fillRule="evenodd" className="fill-cream" />
            </svg>
          </div>
          {/* La lumière de la maison, dans l'embrasure : on la voit quand la porte s'entrouvre. */}
          <div className="door-light-in absolute inset-0">
            <svg ref={bind('light')} viewBox={MONO_VIEWBOX} className="absolute inset-0 h-full w-full">
              <defs>
                <linearGradient id={`${gid}-light`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#F7E4BC" />
                  <stop offset="1" stopColor="#D6A964" />
                </linearGradient>
              </defs>
              <path d={DOOR_D} fill={`url(#${gid}-light)`} />
            </svg>
          </div>
          {/* La porte sur ses gonds : elle s'entrouvre vers l'intérieur, poignée d'abord. */}
          <div className="door-letters-in absolute inset-0" style={{ perspective: '60cqw', perspectiveOrigin: HINGE }}>
            <div className="door-panel-in absolute inset-0" style={{ transformOrigin: HINGE }}>
              <svg
                ref={bind('panel')}
                viewBox={MONO_VIEWBOX}
                className="door-panel absolute inset-0 h-full w-full"
                style={{ transformOrigin: HINGE }}
              >
                <defs>
                  <BronzeGradient id={gid} />
                </defs>
                <path d={DOOR_D} fill={`url(#${gid})`} />
                {/* En tournant, la porte quitte la lumière : elle s'assombrit un peu. */}
                <path d={DOOR_D} className="door-shade fill-bark" />
                {/* Un panneau en creux et une petite béquille ton sur ton : une porte, sans rien ajouter au logo. */}
                <path d="M607 544 L660 514 L660 656.6 L607 638.4 Z" className="fill-none stroke-bark/25" strokeWidth="0.8" />
                <g transform="rotate(-6 659 585.3)">
                  <g className="door-handle fill-bark/60">
                    <rect x="650" y="584" width="10" height="2.6" rx="1.3" />
                    <circle cx="659" cy="585.3" r="2.4" />
                  </g>
                </g>
              </svg>
            </div>
          </div>
        </div>

        {/* Lueur chaude derrière le monogramme. */}
        <div
          ref={bind('glow')}
          aria-hidden="true"
          className="door-glow pointer-events-none absolute inset-0 z-[2] bg-[radial-gradient(640px_480px_at_50%_40%,rgb(var(--c-gold-rgb)/0.13),transparent_70%)]"
        />

        {/* Promesse et actions du premier écran. */}
        <div
          ref={bind('intro')}
          className="door-intro relative z-[3] mt-9 flex w-full flex-col items-center px-5 text-center"
        >
          <h1 className="t-h1 max-w-[16ch] text-balance sm:max-w-none" aria-label={HEADLINE}>
            {words.map((w, i) => (
              <span key={i} aria-hidden="true" className="inline-block overflow-hidden pb-[0.12em] align-bottom">
                <span className="door-word inline-block" style={{ animationDelay: `${650 + i * 55}ms` }}>
                  {w}
                  {i < words.length - 1 && ' '}
                </span>
              </span>
            ))}
          </h1>

          <div
            data-page-cta
            {...glow}
            className="door-bar glass-dark mt-8 flex w-full max-w-[22rem] items-center gap-1.5 rounded-full p-1.5 sm:w-auto sm:max-w-none"
          >
            <Button
              to="/devis"
              size="lg"
              className="flex-1 sm:flex-none"
              onClick={() => track(EVENTS.QUOTE_CTA, { source: 'hero' })}
            >
              Devis gratuit
            </Button>
            <a
              href={`tel:${BRAND.phones[0].tel}`}
              onClick={() => track(EVENTS.PHONE_CLICK, { source: 'hero' })}
              aria-label={`Appeler ${BRAND.phones[0].name} au ${BRAND.phones[0].number}`}
              className="flex h-14 flex-none items-center justify-center gap-2.5 rounded-full px-5 text-[15px] font-medium text-cream transition-[background-color,transform] duration-200 hover:bg-cream/10 active:scale-[0.97]"
            >
              <PhoneIcon width={16} height={16} aria-hidden="true" />
              <span className="hidden tabular-nums sm:inline">{BRAND.phones[0].number}</span>
            </a>
            <a
              href={whatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track(EVENTS.WHATSAPP_CLICK, { source: 'hero' })}
              aria-label="Écrire sur WhatsApp"
              className="flex h-14 flex-none items-center justify-center gap-2.5 rounded-full px-5 text-[15px] font-medium text-cream transition-[background-color,transform] duration-200 hover:bg-cream/10 active:scale-[0.97]"
            >
              <WhatsappIcon width={17} height={17} />
              <span className="hidden sm:inline">WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Repères de coin. */}
        <p
          ref={bind('fade')}
          className="door-fade t-label absolute bottom-8 left-8 z-[3] hidden text-cream/70 md:block lg:left-12"
        >
          Rénovation · depuis {BRAND.founded}
        </p>
        <p
          ref={bind('fade2')}
          className="door-fade t-label absolute bottom-8 right-8 z-[3] hidden text-right leading-[1.9] text-cream/70 md:block lg:right-12"
        >
          Bruxelles
          <br />
          Toute la Belgique
        </p>
        <span
          ref={bind('fade3')}
          aria-hidden="true"
          className="door-fade absolute bottom-0 left-1/2 z-[3] h-12 w-px -translate-x-1/2 bg-gradient-to-b from-transparent to-gold-light/70"
        />

        {/* Derrière la porte : l'offre, sur une carte de verre. */}
        <div
          ref={bind('final')}
          data-page-cta
          {...glow}
          className="door-final glass-dark absolute inset-x-4 bottom-4 z-[4] rounded-[28px] p-6 sm:inset-x-auto sm:bottom-10 sm:left-8 sm:w-[34rem] sm:p-9 lg:bottom-40 lg:left-12"
        >
          <h2 className="t-h2">Bienvenue chez vous.</h2>
          <p className="t-lead mt-4 text-cream/85">
            Façades, toitures, châssis et rénovations complètes. {BRAND.founders[0].name} et {BRAND.founders[1].name}{' '}
            suivent chaque chantier en personne, du devis à la remise des clés.
          </p>
          <div className="mt-7 flex flex-col gap-2.5 sm:flex-row">
            <Button to="/devis" size="lg" arrow onClick={() => track(EVENTS.QUOTE_CTA, { source: 'hero_card' })}>
              Demander un devis gratuit
            </Button>
            <Button to="/realisations" variant="outlineLight" size="lg">
              Nos réalisations
            </Button>
          </div>
          <p className="t-small mt-5 text-cream/70">
            {BRAND.promises.quote} · {BRAND.promises.responseTime}
          </p>
        </div>
      </div>
    </section>
  );
}
