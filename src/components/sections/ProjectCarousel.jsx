import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Eyebrow, TextLink } from '@/components/ui';
import Reveal from '@/lib/reveal';
import { EVENTS, track } from '@/lib/analytics';
import { imageAttrs } from '@/lib/image';
import { cn } from '@/lib/utils';

const SIZES = '(min-width: 1024px) 60vw, 86vw';
const pad2 = (n) => String(n).padStart(2, '0');

function Chevron({ dir }) {
  return (
    <svg width="18" height="10" viewBox="0 0 18 10" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.3">
      <path d={dir === 'prev' ? 'M17 5H1m4-4L1 5l4 4' : 'M1 5h16m-4-4 4 4-4 4'} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * Galerie des chantiers - l'unique façon de montrer des réalisations
 * (accueil, /realisations, pages de métier).
 *
 * Une cimaise, pas un carrousel de cartes : les photos sont accrochées à la
 * même hauteur, chacune dans ses proportions d'origine (aucun recadrage
 * forcé), et la rangée se parcourt comme on longe un mur d'exposition - au
 * doigt, à la molette horizontale, en tirant à la souris, au clavier.
 *
 * Défilement natif aimanté : pas d'autoplay, pas de bibliothèque. Le script
 * ne fait que trois choses - dire quelle photo est en tête, lui donner un
 * léger décalage de parallaxe, et tenir la barre de progression.
 *
 * Chaque photo et chaque titre mènent à la fiche du chantier.
 */
export default function ProjectCarousel({ projects = [], className = '', sectionLabel = 'Nos chantiers', title = '', text = '', link, sheet = false }) {
  const track_ = useRef(null);
  const bar = useRef(null);
  const [active, setActive] = useState(0);
  const drag = useRef(null);

  const measure = useCallback(() => {
    const el = track_.current;
    if (!el) return;
    const slides = [...el.children];
    const origin = el.scrollLeft + parseFloat(getComputedStyle(el).scrollPaddingLeft || 0);
    let best = 0;
    let bestD = Infinity;
    const vw = el.clientWidth;
    slides.forEach((s, i) => {
      const d = Math.abs(s.offsetLeft - origin);
      if (d < bestD) {
        bestD = d;
        best = i;
      }
      // Parallaxe : -1 (sort à gauche) → 1 (entre à droite)
      const centre = s.offsetLeft + s.offsetWidth / 2 - el.scrollLeft - vw / 2;
      s.style.setProperty('--p', Math.max(-1, Math.min(1, centre / vw)).toFixed(3));
    });
    // Au bout de la rangée, la dernière photo est « en tête » même si elle ne
    // peut pas venir s'aligner à gauche.
    const max = el.scrollWidth - vw;
    if (max > 0 && el.scrollLeft >= max - 2) best = slides.length - 1;
    setActive(best);
    if (bar.current) bar.current.style.transform = `scaleX(${max > 0 ? Math.max(0.04, el.scrollLeft / max) : 1})`;
  }, []);

  useEffect(() => {
    const el = track_.current;
    if (!el) return undefined;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(measure);
    };
    el.scrollLeft = 0;
    measure();
    el.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [measure, projects]);

  const go = (i) => {
    const el = track_.current;
    const s = el?.children[Math.max(0, Math.min(projects.length - 1, i))];
    if (!s) return;
    el.scrollTo({ left: s.offsetLeft - parseFloat(getComputedStyle(el).scrollPaddingLeft || 0), behavior: 'smooth' });
  };

  /* Tirer à la souris. Au doigt, le défilement natif fait déjà le travail. */
  const onPointerDown = (e) => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    drag.current = { x: e.clientX, left: track_.current.scrollLeft, moved: false };
  };
  const onPointerMove = (e) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.x;
    if (!d.moved && Math.abs(dx) > 6) {
      d.moved = true;
      track_.current.dataset.dragging = '';
      track_.current.setPointerCapture?.(e.pointerId);
    }
    if (d.moved) track_.current.scrollLeft = d.left - dx;
  };
  const endDrag = () => {
    const d = drag.current;
    drag.current = null;
    if (!d?.moved) return;
    const el = track_.current;
    // Le clic qui termine un glissé ne doit pas ouvrir la fiche.
    el.addEventListener('click', (ev) => ev.preventDefault(), { capture: true, once: true });
    setTimeout(() => delete el.dataset.dragging, 0);
  };

  const onKeyDown = (e) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      go(active + 1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      go(active - 1);
    }
  };

  if (!projects.length) return null;
  const current = projects[active] || projects[0];
  const Heading = title ? 'h3' : 'h2';

  return (
    <section className={cn('gallery on-dark bg-bark text-cream', sheet && 'sheet', className)} aria-roledescription="galerie" aria-label="Galerie des chantiers">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-6">
          <Reveal>
            {sectionLabel && (
              <Eyebrow tone="light" className="mb-6">
                {sectionLabel}
              </Eyebrow>
            )}
            {title && <h2 className="t-h2 max-w-[18ch] text-balance">{title}</h2>}
            {text && <p className="t-lead mt-4 max-w-[46ch] text-cream/70">{text}</p>}
          </Reveal>

          {projects.length > 1 && (
            <div className="flex items-center gap-5">
              <p className="t-label tabular-nums text-cream/70" aria-live="polite">
                <span className="text-cream">{pad2(active + 1)}</span> / {pad2(projects.length)}
                <span className="sr-only"> - {current.title}</span>
              </p>
              <div className="flex gap-2">
                {['prev', 'next'].map((dir) => (
                  <button
                    key={dir}
                    type="button"
                    onClick={() => go(active + (dir === 'prev' ? -1 : 1))}
                    disabled={dir === 'prev' ? active === 0 : active === projects.length - 1}
                    aria-label={dir === 'prev' ? 'Chantier précédent' : 'Chantier suivant'}
                    className="gallery-nav"
                  >
                    <Chevron dir={dir} />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </Container>

      <ol
        ref={track_}
        className="gallery-track"
        tabIndex={0}
        aria-label="Chantiers - flèches gauche et droite pour parcourir"
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        {projects.map((p, i) => (
          <li key={p.slug} className="gallery-slide" data-active={i === active ? '' : undefined} style={{ '--ar': p.cover.w / p.cover.h }}>
            <Reveal from="veil" delay={Math.min(i, 3) * 110} className="gallery-frame">
              <Link
                to={`/realisations/${p.slug}`}
                draggable="false"
                tabIndex={-1}
                aria-hidden="true"
                onClick={() => track(EVENTS.PROJECT_VIEW, { project: p.slug, source: 'gallery_photo' })}
              >
                <img
                  {...imageAttrs(p.cover.src, SIZES)}
                  alt=""
                  width={p.cover.w}
                  height={p.cover.h}
                  loading="lazy"
                  decoding="async"
                  draggable="false"
                  className="photo"
                />
              </Link>
            </Reveal>

            <div className="gallery-caption">
              <p className="t-label flex items-center gap-3 text-cream/75">
                <span className="t-num tracking-normal text-gold-light">{pad2(i + 1)}</span>
                {p.type}
              </p>
              {/* Sous un H2 de section, les chantiers sont des H3 ; sans lui
                  (page /realisations), ils sont les H2 de la page. */}
              <Heading className="gallery-title">
                <Link to={`/realisations/${p.slug}`} onClick={() => track(EVENTS.PROJECT_VIEW, { project: p.slug, source: 'gallery_title' })}>
                  {p.title}
                </Link>
              </Heading>
              <p className="t-small mt-1.5 text-cream/75">{p.location}</p>
            </div>
          </li>
        ))}
      </ol>

      <Container>
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="gallery-progress" aria-hidden="true">
            <span ref={bar} />
          </div>
          {link && (
            <TextLink to={link.to} tone="light">
              {link.label}
            </TextLink>
          )}
        </div>
      </Container>
    </section>
  );
}
