import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { EVENTS, track } from '@/lib/analytics';

/**
 * Galerie de chantiers — un projet au centre, les voisins entrevus derrière.
 *
 * La profondeur ne vient d'aucune perspective 3D : uniquement de la position,
 * de l'échelle, de la luminosité et du plan d'empilement. Un Coverflow incliné
 * daterait la page ; ici les cartes restent parallèles au plan de l'écran,
 * comme des tirages posés les uns derrière les autres.
 *
 * Le décalage latéral est exprimé en pourcentage de la largeur du plateau, pas
 * en pixels : la composition tient d'elle-même de 375 px à 1440 px.
 *
 * Pas de défilement automatique. Une galerie de chantiers se regarde au rythme
 * du visiteur, et un carrousel qui avance seul déplace l'image au moment où
 * l'œil s'y pose.
 */

/* Géométrie des trois plans visibles. Une seule source pour la position, la
   taille, la lumière et l'empilement — c'est ce qui garde la profondeur
   cohérente quand on change une valeur. */
const STAGE = {
  active: { x: 0, scale: 1, z: 30, dim: 0 },
  side: { x: 70, scale: 0.8, z: 10, dim: 0.62 },
};

export default function ProjectCarousel({ projects, className }) {
  const [index, setIndex] = useState(0);
  const count = projects?.length ?? 0;
  const regionId = useId();
  const liveRef = useRef(null);

  const go = useCallback(
    (delta) => setIndex((i) => (i + delta + count) % count),
    [count]
  );

  // Flèches du clavier quand la galerie a le focus : c'est le geste attendu
  // d'un carrousel, et il évite d'obliger à atteindre les boutons.
  const onKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      go(-1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      go(1);
    }
  };

  // Annonce du changement pour les lecteurs d'écran, sans voler le focus.
  useEffect(() => {
    const node = liveRef.current;
    if (node && projects?.[index]) {
      node.textContent = `${index + 1} sur ${count} — ${projects[index].title}, ${projects[index].location}`;
    }
  }, [index, count, projects]);

  if (!count) return null;

  /** Position d'un projet par rapport à l'actif, en tenant compte de la boucle. */
  const offsetOf = (i) => {
    const raw = i - index;
    if (raw > count / 2) return raw - count;
    if (raw < -count / 2) return raw + count;
    return raw;
  };

  return (
    <div className={cn('relative', className)}>
      {/* Le débordement des cartes latérales est coupé aux bords de la page,
          pas à ceux du plateau : elles doivent dépasser du projet central. */}
      <div
        role="group"
        aria-roledescription="carrousel"
        aria-label="Galerie des chantiers"
        id={regionId}
        tabIndex={0}
        onKeyDown={onKeyDown}
        className="relative overflow-hidden rounded-lg py-2 outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-4 focus-visible:ring-offset-cream"
      >
        {/* Plateau : sa largeur définit celle du projet central, et sert
            d'unité aux décalages latéraux. */}
        <div className="relative mx-auto w-full sm:w-[76%] lg:w-[64%]">
          {/* Donne sa hauteur au plateau ; les cartes sont en absolu. */}
          <div className="aspect-[4/3] sm:aspect-[16/9] lg:aspect-[2/1]" aria-hidden="true" />

          {projects.map((p, i) => {
            const offset = offsetOf(i);
            const isActive = offset === 0;
            const isSide = Math.abs(offset) === 1;
            const dir = Math.sign(offset);
            const g = isActive ? STAGE.active : STAGE.side;

            return (
              <article
                key={p.slug}
                aria-hidden={!isActive}
                className={cn(
                  'absolute inset-0 transition-[transform,opacity] duration-[600ms] ease-soft',
                  'motion-reduce:transition-none',
                  // Sur mobile, seul le projet actif existe : les voisins
                  // n'auraient pas la place d'être lisibles.
                  !isActive && 'pointer-events-none opacity-0 sm:opacity-100',
                  !isActive && !isSide && 'sm:opacity-0'
                )}
                style={{
                  zIndex: g.z,
                  transform: `translateX(${dir * g.x}%) scale(${g.scale})`,
                }}
              >
                <Link
                  to={`/realisations/${p.slug}`}
                  tabIndex={isActive ? undefined : -1}
                  onClick={() => track(EVENTS.PROJECT_VIEW, { project: p.slug, source: 'carousel' })}
                  className="group block h-full w-full overflow-hidden rounded-lg bg-sand shadow-lift"
                >
                  <div className="relative h-full w-full overflow-hidden">
                    <img
                      src={p.cover.src}
                      alt={p.cover.alt}
                      width={p.cover.w}
                      height={p.cover.h}
                      loading={isActive ? 'eager' : 'lazy'}
                      decoding="async"
                      fetchpriority={isActive ? 'high' : undefined}
                      sizes="(min-width: 1024px) 64vw, (min-width: 640px) 76vw, 100vw"
                      className={cn(
                        'h-full w-full object-cover transition-[transform,filter] duration-[1400ms] ease-soft',
                        isActive ? 'saturate-100 group-hover:scale-[1.03]' : 'saturate-[0.55]'
                      )}
                    />

                    {/* Voile de lecture au sommet : le titre s'y pose sans
                        boîte ni cadre. */}
                    <div
                      aria-hidden="true"
                      className="absolute inset-x-0 top-0 h-2/5 bg-gradient-to-b from-bark/70 to-transparent"
                    />

                    {/* Assombrissement des cartes latérales : c'est lui qui
                        fait reculer le plan, pas une perspective. */}
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-bark transition-opacity duration-[600ms] ease-soft motion-reduce:transition-none"
                      style={{ opacity: isActive ? 0 : STAGE.side.dim }}
                    />

                    <div
                      className={cn(
                        'absolute inset-x-0 top-0 p-5 text-center transition-opacity duration-[600ms] ease-soft sm:p-7',
                        isActive ? 'opacity-100' : 'opacity-0'
                      )}
                    >
                      <h3 className="font-display text-[1.375rem] leading-tight tracking-[-0.01em] text-cream sm:text-[1.75rem]">
                        {p.title}
                      </h3>
                      <p className="t-small mt-1 text-cream/75">
                        {p.type} · {p.location}
                      </p>
                    </div>
                  </div>
                </Link>
              </article>
            );
          })}

          {/* Flèches : posées sur les bords du projet central, à mi-hauteur,
              comme dans la référence. */}
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Chantier précédent"
            aria-controls={regionId}
            className="absolute left-2 top-1/2 z-40 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-cream text-ink shadow-lift transition-all duration-fast ease-soft hover:bg-shell hover:scale-105 active:scale-95 sm:-left-5 sm:h-12 sm:w-12"
          >
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
              <path d="M10 2 4 8l6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Chantier suivant"
            aria-controls={regionId}
            className="absolute right-2 top-1/2 z-40 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-cream text-ink shadow-lift transition-all duration-fast ease-soft hover:bg-shell hover:scale-105 active:scale-95 sm:-right-5 sm:h-12 sm:w-12"
          >
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
              <path d="m6 2 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* Repères : même langage que le point d'onglet actif de la navigation. */}
      <div className="mt-7 flex items-center justify-center gap-2.5">
        {projects.map((p, i) => (
          <button
            key={p.slug}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Aller au chantier ${i + 1} : ${p.title}`}
            aria-current={i === index ? 'true' : undefined}
            className="grid h-6 w-6 place-items-center rounded-full"
          >
            <span
              aria-hidden="true"
              className={cn(
                'block rounded-full transition-all duration-fast ease-soft',
                i === index ? 'h-2 w-2 bg-gold' : 'h-1.5 w-1.5 bg-ink/20 hover:bg-ink/40'
              )}
            />
          </button>
        ))}
      </div>

      <p ref={liveRef} aria-live="polite" className="sr-only" />
    </div>
  );
}
