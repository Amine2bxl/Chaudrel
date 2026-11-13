import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { PROJECTS } from '@/data/projects';
import { SIZES } from '@/lib/image';
import { cn } from '@/lib/utils';
import Reveal from '@/lib/reveal';
import { Button, Container, DarkPanel, Eyebrow, Media, RoundArrow, Tag } from '@/components/ui';

const pad2 = (n) => String(n).padStart(2, '0');

function NavButton({ dir, onClick, disabled, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="grid h-11 w-11 place-items-center rounded-full border border-ivory/25 text-ivory transition-[background-color,border-color,opacity] duration-fast hover:border-gold hover:bg-gold hover:text-graphite disabled:pointer-events-none disabled:opacity-30"
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
        <path d={dir < 0 ? 'M8.5 2.5 4 7l4.5 4.5' : 'M5.5 2.5 10 7l-4.5 4.5'} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

/**
 * 03 · Réalisations - un grand panneau graphite, un carrousel de dossiers.
 * Défilement natif aimanté ; flèches, compteur, clavier et glisser à la
 * souris en plus. Aucune bibliothèque.
 */
export default function ProjectCarousel({
  projects = PROJECTS.filter((p) => p.featured),
  label = 'Réalisations',
  title = (
    <>
      Des chantiers réels, <em>photographiés tels quels.</em>
    </>
  ),
  text = 'Pas de mise en scène ni d’images de synthèse : chaque photo vient d’un chantier Chaudrel.',
  headingLevel = 'h2',
  className,
}) {
  const track = useRef(null);
  const [active, setActive] = useState(0);
  const [edges, setEdges] = useState({ start: true, end: false });
  const H = headingLevel;
  const SlideH = { h1: 'h2', h2: 'h3' }[H] ?? 'h4';

  const sync = useCallback(() => {
    const el = track.current;
    if (!el) return;
    const slides = [...el.children];
    const left = el.scrollLeft;
    let best = 0;
    let dist = Infinity;
    slides.forEach((s, i) => {
      const d = Math.abs(s.offsetLeft - el.firstElementChild.offsetLeft - left);
      if (d < dist) {
        dist = d;
        best = i;
      }
    });
    setActive(best);
    setEdges({ start: left < 4, end: left + el.clientWidth >= el.scrollWidth - 4 });
  }, []);

  useEffect(() => {
    const el = track.current;
    if (!el) return undefined;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(sync);
    };
    sync();
    el.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [sync]);

  const go = (dir) => {
    const el = track.current;
    if (!el) return;
    const slide = el.children[Math.min(Math.max(active + dir, 0), el.children.length - 1)];
    el.scrollTo({ left: slide.offsetLeft - el.firstElementChild.offsetLeft, behavior: 'smooth' });
  };

  /* Glisser à la souris : le doigt et le pavé tactile défilent déjà. */
  const drag = useRef(null);
  const onPointerDown = (e) => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    drag.current = { x: e.clientX, left: track.current.scrollLeft, moved: false };
  };
  const onPointerMove = (e) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.x;
    if (!d.moved && Math.abs(dx) > 6) {
      d.moved = true;
      track.current.classList.add('is-dragging');
    }
    if (d.moved) track.current.scrollLeft = d.left - dx;
  };
  const endDrag = () => {
    const d = drag.current;
    drag.current = null;
    if (!d?.moved) return;
    const el = track.current;
    el.classList.remove('is-dragging');
    // Laisse l'aimantation reprendre depuis la position relâchée.
    requestAnimationFrame(() => go(0));
  };

  const onKeyDown = (e) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      go(1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      go(-1);
    }
  };

  return (
    <div className={cn('px-2 sm:px-3', className)}>
      <DarkPanel as="section" aria-roledescription="carrousel" aria-label={label} className="overflow-hidden py-section">
        <Container className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <Reveal className="lg:col-span-7">
            <Eyebrow tone="light">{label}</Eyebrow>
            <H className="t-h2 mt-5 max-w-[20ch] text-balance text-ivory">{title}</H>
            {text && <p className="t-lead mt-5 max-w-[48ch] text-ivory/65">{text}</p>}
          </Reveal>
          <Reveal delay={100} className="flex items-center justify-between gap-6 lg:col-span-5 lg:justify-end">
            <p className="t-num text-[15px] text-ivory/60" aria-live="polite">
              <span className="text-ivory">{pad2(active + 1)}</span> / {pad2(projects.length)}
            </p>
            <div className="flex items-center gap-2">
              <NavButton dir={-1} onClick={() => go(-1)} disabled={edges.start} label="Réalisation précédente" />
              <NavButton dir={1} onClick={() => go(1)} disabled={edges.end} label="Réalisation suivante" />
            </div>
          </Reveal>
        </Container>

        <ul
          ref={track}
          className="rc-track mt-block"
          tabIndex={0}
          aria-label="Réalisations - flèches gauche et droite pour défiler"
          onKeyDown={onKeyDown}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerLeave={endDrag}
        >
          {projects.map((p, i) => (
            <li
              key={p.slug}
              className="rc-slide"
              aria-roledescription="diapositive"
              aria-label={`${i + 1} sur ${projects.length}`}
            >
              <Link to={`/realisations/${p.slug}`} className="group block" draggable="false">
                <Media
                  src={p.cover.src}
                  alt={p.cover.alt}
                  width={p.cover.w}
                  height={p.cover.h}
                  ratio="aspect-[4/5]"
                  sizes={SIZES.slide}
                  zoom
                />
                <div className="mt-5 flex flex-wrap gap-2">
                  <Tag tone="light">{p.type}</Tag>
                  {p.status === 'en cours' && <Tag tone="light">En cours de chantier</Tag>}
                </div>
                <div className="mt-4 flex items-start justify-between gap-5">
                  <div>
                    <SlideH className="t-h3 text-ivory">{p.title}</SlideH>
                    <p className="t-small mt-2 line-clamp-2 max-w-[38ch] text-ivory/60">{p.summary}</p>
                  </div>
                  <RoundArrow tone="light" />
                </div>
              </Link>
            </li>
          ))}
        </ul>

        <Container className="mt-block flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="rc-progress w-full sm:max-w-sm" aria-hidden="true">
            <span style={{ transform: `scaleX(${(active + 1) / projects.length})` }} />
          </div>
          <Button to="/realisations" variant="outlineLight" arrow>
            Toutes les réalisations
          </Button>
        </Container>
      </DarkPanel>
    </div>
  );
}
