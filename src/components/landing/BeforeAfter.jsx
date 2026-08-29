import { useState, useRef, useCallback } from 'react';
import { MoveHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import { IMAGES } from '@/lib/content';

const PROJECTS = IMAGES.beforeAfter;

function Slider({ before, after, label, type, location }) {
  const [pos, setPos] = useState(50);
  const containerRef = useRef(null);
  const dragging = useRef(false);

  const calcPos = useCallback((clientX) => {
    const rect = containerRef.current.getBoundingClientRect();
    setPos((Math.max(0, Math.min(clientX - rect.left, rect.width)) / rect.width) * 100);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[420px] lg:h-[560px] overflow-hidden cursor-ew-resize select-none rounded-[2rem] bg-brand-ink"
      onMouseDown={(e) => { dragging.current = true; calcPos(e.clientX); }}
      onMouseMove={(e) => { if (dragging.current) calcPos(e.clientX); }}
      onMouseUp={() => { dragging.current = false; }}
      onMouseLeave={() => { dragging.current = false; }}
      onTouchStart={(e) => { dragging.current = true; calcPos(e.touches[0].clientX); }}
      onTouchMove={(e) => { if (dragging.current) { e.preventDefault(); calcPos(e.touches[0].clientX); } }}
      onTouchEnd={() => { dragging.current = false; }}
      role="img"
      aria-label={`Glissez pour voir la transformation avant/après de ${label}`}
    >
      <img
        src={after}
        alt={`Après — ${label}`}
        className="absolute inset-0 w-full h-full object-cover"
        draggable={false}
        loading="lazy"
      />

      <div className="absolute inset-0 overflow-hidden" style={{ width: `${pos}%` }}>
        <img
          src={before}
          alt={`Avant — ${label}`}
          className="absolute inset-0 h-full object-cover"
          style={{ width: `${10000 / pos}%`, maxWidth: 'none' }}
          draggable={false}
        />
      </div>

      <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />

      <div className="absolute top-4 left-4 bg-black/55 backdrop-blur-sm text-white text-[10px] tracking-[0.22em] uppercase font-semibold px-3 py-1.5 rounded-full pointer-events-none">
        Avant
      </div>
      <div className="absolute top-4 right-4 bg-brand-gold text-white text-[10px] tracking-[0.22em] uppercase font-semibold px-3 py-1.5 rounded-full pointer-events-none">
        Après
      </div>

      <div
        className="absolute top-0 bottom-0 w-px bg-white/80 shadow-[0_0_12px_rgba(255,255,255,0.5)] pointer-events-none"
        style={{ left: `${pos}%` }}
      />

      <div
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white shadow-xl flex items-center justify-center pointer-events-none ring-2 ring-brand-gold/30"
        style={{ left: `${pos}%` }}
      >
        <MoveHorizontal className="w-4 h-4 text-brand-gold" strokeWidth={2} aria-hidden="true" />
      </div>

      <div className="absolute bottom-0 left-0 right-0 px-6 py-5 pointer-events-none flex items-end justify-between gap-4">
        <div>
          <p className="text-white font-display text-lg font-light leading-tight">{label}</p>
          <p className="text-white/55 text-[12px] mt-0.5">{type} · {location}</p>
        </div>
        <p className="text-white/35 text-[11px] tracking-wide hidden sm:block">Glissez le curseur</p>
      </div>
    </div>
  );
}

export default function BeforeAfter() {
  const [current, setCurrent] = useState(0);
  const prev = () => setCurrent((c) => (c - 1 + PROJECTS.length) % PROJECTS.length);
  const next = () => setCurrent((c) => (c + 1) % PROJECTS.length);
  const project = PROJECTS[current];

  return (
    <section className="py-10 md:py-12 lg:py-28 bg-brand-cream">
      <div className="max-w-7xl mx-auto px-5 lg:px-10">
        <div className="flex items-end justify-between mb-8 gap-4">
          <div>
            <p className="text-[11px] tracking-[0.25em] uppercase text-brand-gold font-semibold mb-2">
              Transformation Réelle
            </p>
            <h2 className="font-display text-3xl lg:text-4xl font-light text-brand-ink leading-tight">
              Avant & Après —{' '}
              <span className="italic text-brand-gold">La Différence Chaudrel</span>
            </h2>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={prev}
              aria-label="Projet précédent"
              className="w-9 h-9 rounded-full border border-brand-gold/25 flex items-center justify-center text-brand-ink/50 hover:bg-brand-gold hover:border-brand-gold hover:text-white transition-all duration-300"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-[12px] text-brand-ink/35 w-10 text-center" aria-live="polite">
              {current + 1}/{PROJECTS.length}
            </span>
            <button
              onClick={next}
              aria-label="Projet suivant"
              className="w-9 h-9 rounded-full border border-brand-gold/25 flex items-center justify-center text-brand-ink/50 hover:bg-brand-gold hover:border-brand-gold hover:text-white transition-all duration-300"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div key={project.id} className="ba-slide">
          <Slider {...project} />
        </div>

        <div className="flex justify-center gap-2 mt-5" role="tablist" aria-label="Sélecteur de projet">
          {PROJECTS.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              role="tab"
              aria-selected={i === current}
              aria-label={`Projet ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === current ? 'bg-brand-gold w-6' : 'bg-brand-gold/25 w-1.5'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}