import { useCallback, useEffect, useRef } from 'react';
import { imageAttrs, SIZES } from '@/lib/image';
import { cn } from '@/lib/utils';

const clamp = (v) => Math.min(100, Math.max(0, v));

/**
 * Comparateur avant / après : on fait glisser la porte.
 *
 * Deux photos superposées ; l'« après » est rogné depuis la gauche
 * (`clip-path: inset`) à la position de la poignée - une porte bronze sur un
 * filet crème. Glisser au doigt ou à la souris, flèches du clavier (pas de
 * 5 %), Début / Fin. La position s'écrit directement dans le style : aucun
 * rendu React pendant le geste, rien ne tourne à l'arrêt.
 *
 * Au premier passage à l'écran, la porte s'entrouvre une fois pour montrer
 * qu'elle se manipule (sauf si l'on a demandé moins de mouvement).
 *
 * N'afficher qu'avec deux photos prises du même point de vue : une
 * comparaison entre deux lieux différents tromperait le visiteur.
 */
export default function BeforeAfter({ before, after, label, ratio = 'aspect-[16/10]', className, start = 50 }) {
  const frameRef = useRef(null);
  const afterRef = useRef(null);
  const handleRef = useRef(null);
  const knobRef = useRef(null);
  const pos = useRef(start);

  const paint = useCallback((v) => {
    pos.current = clamp(v);
    afterRef.current.style.clipPath = `inset(0 0 0 ${pos.current}%)`;
    handleRef.current.style.transform = `translateX(${pos.current}%)`;
    knobRef.current.setAttribute('aria-valuenow', String(Math.round(pos.current)));
    knobRef.current.setAttribute('aria-valuetext', `${Math.round(pos.current)} % avant, ${Math.round(100 - pos.current)} % après`);
  }, []);

  const fromPointer = (e) => {
    const r = frameRef.current.getBoundingClientRect();
    paint(((e.clientX - r.left) / r.width) * 100);
  };

  const onPointerDown = (e) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    e.currentTarget.setPointerCapture(e.pointerId);
    fromPointer(e);
  };
  const onPointerMove = (e) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) fromPointer(e);
  };

  const onKeyDown = (e) => {
    const step = { ArrowLeft: -5, ArrowRight: 5, PageDown: -10, PageUp: 10 }[e.key];
    if (step !== undefined) paint(pos.current + step);
    else if (e.key === 'Home') paint(0);
    else if (e.key === 'End') paint(100);
    else return;
    e.preventDefault();
  };

  // Indice, une seule fois : la porte s'entrouvre puis revient.
  useEffect(() => {
    const el = frameRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const s = pos.current;
        const timing = { duration: 1400, easing: 'cubic-bezier(0.65, 0, 0.35, 1)' };
        afterRef.current.animate(
          [{ clipPath: `inset(0 0 0 ${s}%)` }, { clipPath: `inset(0 0 0 ${s + 14}%)` }, { clipPath: `inset(0 0 0 ${s}%)` }],
          timing
        );
        handleRef.current.animate(
          [{ transform: `translateX(${s}%)` }, { transform: `translateX(${s + 14}%)` }, { transform: `translateX(${s}%)` }],
          timing
        );
      },
      { threshold: 0.6 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <figure className={cn('on-dark', className)}>
      <div
        ref={frameRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        className={cn(
          'relative cursor-ew-resize touch-pan-y select-none overflow-hidden rounded-[28px] bg-bark',
          ratio
        )}
      >
        <img
          {...imageAttrs(before, SIZES.half)}
          alt={`${label}, avant travaux`}
          width="1200"
          height="800"
          loading="lazy"
          decoding="async"
          draggable="false"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <img
          ref={afterRef}
          {...imageAttrs(after, SIZES.half)}
          alt={`${label}, après travaux`}
          width="1200"
          height="800"
          loading="lazy"
          decoding="async"
          draggable="false"
          style={{ clipPath: `inset(0 0 0 ${start}%)` }}
          className="absolute inset-0 h-full w-full object-cover"
        />

        <span className="t-label glass-dark absolute left-4 top-4 rounded-full bg-bark/50 px-3.5 py-2 text-cream">
          Avant
        </span>
        <span className="t-label glass-dark absolute right-4 top-4 rounded-full bg-bark/50 px-3.5 py-2 text-cream">
          Après
        </span>

        {/* La poignée : un filet crème et la porte bronze, déplacés ensemble. */}
        <div
          ref={handleRef}
          className="pointer-events-none absolute inset-0"
          style={{ transform: `translateX(${start}%)` }}
        >
          <span aria-hidden="true" className="absolute inset-y-0 left-0 w-0.5 -translate-x-1/2 bg-cream/90 shadow-lift" />
          <button
            ref={knobRef}
            type="button"
            role="slider"
            aria-label={`Comparer avant et après - ${label}`}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={start}
            onKeyDown={onKeyDown}
            className="pointer-events-auto absolute left-0 top-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize place-items-center rounded-full bg-bark/60 shadow-lift ring-1 ring-cream/30 backdrop-blur-md transition-transform duration-200 hover:scale-105 active:scale-95"
          >
            <svg viewBox="0 0 40 40" className="h-8 w-8" aria-hidden="true">
              <path d="M17 13 L23 10 L23 30 L17 28 Z" fill="var(--bronze-grain)" className="fill-gold" />
              <path d="M11 17 8 20l3 3M29 17l3 3-3 3" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="text-cream" />
            </svg>
          </button>
        </div>
      </div>

      {label && <figcaption className="t-small mt-4 text-cream/70">{label}</figcaption>}
    </figure>
  );
}
