import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

/*
 * Coverflow 3D — une publication au centre, ses voisins pivotés en profondeur.
 *
 * Composant générique, sans dépendance au routing ni aux données du site :
 * il ne connaît que des éléments « carte » — image, titre, sous-titre, legende,
 * libellé et URL d'action. Les pages le nourrissent comme elles l'entendent
 * (les réalisations, les services, un futur usage) et l'action de la carte
 * revient à elles via `onCardClick`.
 *
 * La profondeur est construite sur des décalages exprimés en **pourcentage de la
 * largeur de carte**, pas en pixels : la composition tient d'elle-même de 360 px
 * à 1440 px. `rotateY` est appliqué sur chaque voisin, le plan central reste
 * droit — c'est lui que l'œil doit lire.
 *
 * Accessibilité :
 *  · `role="group"` + `aria-roledescription="carrousel"`, flèches clavier quand
 *    le plateau a le focus, annonce `aria-live` du changement ;
 *  · le défilement automatique se coupe au survol, quand l'onglet est caché,
 *    et avec `prefers-reduced-motion`.
 */

/* Géométrie des plans : décalage en fois la largeur de carte. */
const SIDE = 0.86;
const FAR = 1.55;

export default function CoverFlowCarousel({
  items = [],
  sectionLabel = '',
  title = '',
  text = '',
  autoplay = true,
  autoplayDelay = 6000,
  className = '',
  onCtaClick,
  onCardClick,
  children,
  regionLabel = 'Galerie',
}) {
  const [index, setIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const touchStartX = useRef(0);
  const liveRef = useRef(null);
  const total = items.length;

  const go = useCallback(
    (delta) => setIndex((i) => (i + delta + total) % total),
    [total]
  );

  useEffect(() => {
    if (!autoplay || isHovered || total <= 1) return undefined;
    if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      return undefined;
    }
    const interval = setInterval(() => go(1), autoplayDelay);
    const onVisibility = () => {
      if (document.hidden) clearInterval(interval);
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [autoplay, autoplayDelay, isHovered, total, go]);

  const onKeyDown = useCallback(
    (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        go(-1);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        go(1);
      }
    },
    [go]
  );

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(diff) > 45) go(diff < 0 ? 1 : -1);
  };

  // Annonce du changement pour les lecteurs d'écran, sans voler le focus.
  useEffect(() => {
    const node = liveRef.current;
    if (node && items?.[index]) {
      node.textContent = `${index + 1} sur ${total} — ${items[index].titleLine1}`;
    }
  }, [index, items, total]);

  if (!items || items.length === 0) return null;

  /** Position d'un élément par rapport à l'actif, en tenant compte de la boucle. */
  const offsetOf = (i) => {
    const raw = i - index;
    if (raw > total / 2) return raw - total;
    if (raw < -total / 2) return raw + total;
    return raw;
  };

  const stage = (i) => {
    const offset = offsetOf(i);
    const dir = Math.sign(offset) || 1;
    const abs = Math.abs(offset);

    if (offset === 0) {
      return {
        transform: 'translate(-50%, -50%) scale(1) rotateY(0deg)',
        opacity: 1,
        z: 30,
        filter: 'brightness(1)',
      };
    }
    if (abs === 1) {
      return {
        transform: `translate(-50%, -50%) translateX(${dir * SIDE * 100}%) scale(0.84) rotateY(${dir * -24}deg)`,
        opacity: 0.62,
        z: 20,
        filter: 'brightness(0.72)',
      };
    }
    if (abs === 2) {
      return {
        transform: `translate(-50%, -50%) translateX(${dir * FAR * 100}%) scale(0.68) rotateY(${dir * -38}deg)`,
        opacity: 0.35,
        z: 10,
        filter: 'brightness(0.52) blur(1px)',
      };
    }
    return { transform: 'translate(-50%, -50%) scale(0.4) rotateY(0deg)', opacity: 0, z: 0, filter: 'brightness(0.4) blur(2px)' };
  };

  const handleCardClick = (item, isCenter, i) => {
    if (isCenter) onCardClick?.(item);
    else setIndex(i);
  };

  return (
    <section
      className={cn('relative overflow-hidden border-y border-cream/10 py-section text-cream select-none', className)}
      style={{
        backgroundColor: '#120d0a',
        color: '#ffffff',
        fontFamily: 'var(--font-ui)',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Ambiance : la photo du projet courant, floutée et assombrie, derrière
          le plateau — elle prolonge la teinte du chantier au lieu du vide. */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <img
          src={items[index]?.img}
          alt=""
          loading="lazy"
          decoding="async"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'brightness(0.2) blur(36px)',
            transform: 'scale(1.12)',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at center, rgba(18,13,10,0.25) 0%, rgba(18,13,10,0.94) 100%)',
          }}
        />
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-4 sm:px-8">
        {/* En-tête du bloc — libellé, titre éventuel, phrase éventuelle. */}
        {(sectionLabel || title || text) && (
          <div className="mb-12 text-center lg:mb-14">
            {sectionLabel && (
              <div className="flex items-center justify-center gap-3">
                <span className="block h-px w-9" style={{ background: 'linear-gradient(90deg, transparent, var(--c-gold-light))' }} />
                <h3
                  className="t-label"
                  style={{ color: 'var(--c-gold-light)' }}
                >
                  {sectionLabel}
                </h3>
                <span className="block h-px w-9" style={{ background: 'linear-gradient(90deg, var(--c-gold-light), transparent)' }} />
              </div>
            )}
            {title && <h2 className="t-h2 mx-auto mt-6 max-w-[20ch] text-balance text-cream">{title}</h2>}
            {text && <p className="t-lead mx-auto mt-5 max-w-[52ch] text-cream/60">{text}</p>}
          </div>
        )}

        {/* Plateau 3D */}
        <div
          role="group"
          aria-roledescription="carrousel"
          aria-label={regionLabel}
          tabIndex={total > 1 ? 0 : undefined}
          onKeyDown={onKeyDown}
          className="relative outline-none focus-visible:ring-2 focus-visible:ring-gold-light focus-visible:ring-offset-4 focus-visible:ring-offset-[#120d0a]"
          style={{ height: 'clamp(400px, 66vh, 520px)', perspective: '1500px' }}
        >
          {items.map((item, i) => {
            const g = stage(i);
            const isCenter = offsetOf(i) === 0;

            return (
              <article
                key={item.key ?? i}
                onClick={() => handleCardClick(item, isCenter, i)}
                aria-hidden={!isCenter}
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  width: 'min(74vw, 340px)',
                  aspectRatio: '2 / 3',
                  borderRadius: '18px',
                  overflow: 'hidden',
                  backgroundColor: '#171311',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  transform: g.transform,
                  opacity: g.opacity,
                  zIndex: g.z,
                  filter: g.filter,
                  transformOrigin: 'center center',
                  transition: 'all 700ms cubic-bezier(0.25, 1, 0.5, 1)',
                  willChange: 'transform, opacity',
                  boxShadow: isCenter
                    ? '0 30px 70px rgba(0,0,0,0.85), 0 0 40px rgba(201,174,131,0.2)'
                    : '0 18px 40px rgba(0,0,0,0.55)',
                  cursor: isCenter ? 'pointer' : 'pointer',
                  pointerEvents: g.z > 0 ? 'auto' : 'none',
                }}
              >
                <img
                  src={item.img}
                  alt={item.titleLine1}
                  loading="lazy"
                  decoding="async"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />

                {/* Vignette sombre pour la lisibilité du texte */}
                <div
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background:
                      'linear-gradient(180deg, rgba(0,0,0,0.42) 0%, rgba(0,0,0,0.08) 28%, rgba(0,0,0,0.62) 62%, rgba(0,0,0,0.95) 100%)',
                    pointerEvents: 'none',
                    zIndex: 10,
                  }}
                />

                {/* Contenu — visible uniquement sur la carte centrale */}
                <div
                  style={{
                    position: 'relative',
                    zIndex: 20,
                    width: '100%',
                    height: '100%',
                    padding: '20px 18px 22px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    textAlign: 'center',
                    opacity: isCenter ? 1 : 0,
                    transform: isCenter ? 'translateY(0)' : 'translateY(16px)',
                    transition: 'opacity 500ms ease, transform 500ms ease',
                    pointerEvents: isCenter ? 'auto' : 'none',
                  }}
                >
                  {item.tag && (
                    <div style={{ textAlign: 'right', width: '100%', paddingRight: '4px' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          fontSize: '0.72rem',
                          fontWeight: 600,
                          letterSpacing: '0.08em',
                          color: 'var(--c-gold-light)',
                          textShadow: '0 2px 6px rgba(0,0,0,0.8)',
                        }}
                      >
                        {item.tag}
                      </span>
                    </div>
                  )}

                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '3px',
                      marginTop: 'auto',
                      paddingBottom: '4px',
                    }}
                  >
                    <h3
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 'clamp(1.3rem, 3vw, 1.6rem)',
                        fontWeight: 400,
                        textTransform: 'uppercase',
                        letterSpacing: '0.03em',
                        color: '#ffffff',
                        margin: 0,
                        lineHeight: 1.1,
                        textShadow: '0 3px 12px rgba(0,0,0,0.95)',
                      }}
                    >
                      {item.titleLine1}
                    </h3>

                    {item.titleLine2 && (
                      <span
                        style={{
                          fontSize: '0.95rem',
                          fontWeight: 600,
                          letterSpacing: '0.05em',
                          color: 'rgba(255,255,255,0.92)',
                          lineHeight: 1.25,
                          textShadow: '0 3px 10px rgba(0,0,0,0.9)',
                        }}
                      >
                        {item.titleLine2}
                      </span>
                    )}

                    <div
                      style={{
                        width: '34px',
                        height: '2px',
                        backgroundColor: 'var(--c-gold-light)',
                        borderRadius: '2px',
                        margin: '6px auto 5px',
                        boxShadow: '0 0 8px rgba(201,174,131,0.7)',
                      }}
                    />

                    {item.desc && (
                      <p
                        style={{
                          fontSize: '0.82rem',
                          color: 'rgba(255,255,255,0.9)',
                          maxWidth: '280px',
                          margin: '0 0 12px',
                          lineHeight: 1.35,
                          textShadow: '0 2px 8px rgba(0,0,0,0.9)',
                        }}
                      >
                        {item.desc}
                      </p>
                    )}

                    <a
                      href={item.ctaUrl || '#'}
                      tabIndex={isCenter ? 0 : -1}
                      onClick={(e) => {
                        if (onCtaClick) {
                          e.preventDefault();
                          e.stopPropagation();
                          onCtaClick(item);
                        }
                      }}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '7px',
                        padding: '8px 18px',
                        borderRadius: '9999px',
                        background: 'linear-gradient(135deg, var(--c-gold-light) 0%, #a48256 100%)',
                        color: '#16100b',
                        fontSize: '0.7rem',
                        fontWeight: 800,
                        letterSpacing: '0.14em',
                        textTransform: 'uppercase',
                        textDecoration: 'none',
                        boxShadow: '0 4px 14px rgba(0,0,0,0.45), 0 0 15px rgba(201,174,131,0.25)',
                        cursor: 'pointer',
                        transition: 'transform 200ms ease, box-shadow 200ms ease',
                      }}
                    >
                      <span>{item.ctaText || 'Voir le chantier'}</span>
                      <ArrowRight width={13} height={13} strokeWidth={2.4} aria-hidden="true" />
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Flèches — posées aux bords du plateau, à mi-hauteur. */}
        {total > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Précédent"
              className="absolute left-3 top-[54%] z-40 grid h-11 w-11 -translate-y-1/2 cursor-pointer place-items-center rounded-full border border-cream/20 bg-black/50 text-cream transition-all duration-fast ease-soft hover:scale-105 hover:bg-black/70 active:scale-95 sm:left-0 sm:h-12 sm:w-12 lg:-left-6"
              style={{ backdropFilter: 'blur(8px)' }}
            >
              <ChevronLeft width={20} height={20} strokeWidth={2.4} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Suivant"
              className="absolute right-3 top-[54%] z-40 grid h-11 w-11 -translate-y-1/2 cursor-pointer place-items-center rounded-full border border-cream/20 bg-black/50 text-cream transition-all duration-fast ease-soft hover:scale-105 hover:bg-black/70 active:scale-95 sm:right-0 sm:h-12 sm:w-12 lg:-right-6"
              style={{ backdropFilter: 'blur(8px)' }}
            >
              <ChevronRight width={20} height={20} strokeWidth={2.4} aria-hidden="true" />
            </button>
          </>
        )}

        {/* Repères */}
        {total > 1 && (
          <div className="mt-10 flex items-center justify-center gap-2.5">
            {items.map((item, i) => (
              <button
                key={item.key ?? i}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Aller au chantier ${i + 1} : ${item.titleLine1}`}
                aria-current={i === index ? 'true' : undefined}
                className="grid h-6 w-6 cursor-pointer place-items-center rounded-full"
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    'block rounded-full transition-all duration-fast ease-soft',
                    i === index ? 'h-2 w-7' : 'h-1.5 w-1.5',
                    i === index ? 'bg-gold-light' : 'bg-cream/25 hover:bg-cream/50'
                  )}
                />
              </button>
            ))}
          </div>
        )}

        {children}
      </div>

      <p ref={liveRef} aria-live="polite" className="sr-only" />
    </section>
  );
}

export { CoverFlowCarousel };
export const Component = CoverFlowCarousel;