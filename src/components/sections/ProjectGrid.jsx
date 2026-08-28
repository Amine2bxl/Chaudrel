import { Link } from 'react-router-dom';
import Reveal from '@/lib/reveal';
import { EVENTS, track } from '@/lib/analytics';
import { cn } from '@/lib/utils';

/**
 * La galerie des chantiers — le juste milieu entre la une immersive (carrousel)
 * et la grille nue.
 *
 * Le premier chantier ouvre en grand, les autres le suivent en colonnes : on
 * parcourt le portfolio à l'allure d'un livre, sans se perdre. Chaque carte
 * dit clairement, dans cet ordre : le rang, le type, la commune, le nom.
 */
export default function ProjectGrid({ projects = [], className }) {
  return (
    <div className={cn('grid gap-12 sm:grid-cols-2 sm:gap-x-10 lg:gap-x-12 lg:gap-y-16', className)}>
      {projects.map((p, i) => {
        const lead = i === 0;

        return (
          <Reveal key={p.slug} delay={(i % 3) * 90} className={lead ? 'sm:col-span-2' : ''}>
            <Link
              to={`/realisations/${p.slug}`}
              onClick={() => track(EVENTS.PROJECT_VIEW, { project: p.slug, source: 'grid' })}
              className="group block h-full"
            >
              {/* L'image, en grand pour le premier chantier. */}
              <div
                className={cn(
                  'relative overflow-hidden rounded-lg bg-sand',
                  lead ? 'aspect-[16/9]' : 'aspect-[4/3]'
                )}
              >
                <img
                  src={p.cover.src}
                  alt={p.cover.alt}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover saturate-[0.97] transition-[transform,filter] duration-[1200ms] ease-soft group-hover:scale-[1.03] group-hover:saturate-100"
                />

                {/* Rang en filigrane, dans l'angle : donne l'échelle de la
                    série sans peser sur la photo. */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute right-5 top-4 font-display leading-[0.8] text-cream/70"
                  style={{ textShadow: '0 2px 12px rgba(0,0,0,0.5)' }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>

              {/* La légende se lit sous l'image, au calme : un filet, le type et
                  la commune, le nom en serif, et la flèche qui s'avance. */}
              <div className="mt-5 border-t border-ink/12 pt-4">
                <div className="flex items-start justify-between gap-6">
                  <div className="min-w-0">
                    <p className="t-label text-ink/55">
                      {p.type} <span aria-hidden="true" className="mx-1.5 text-ink/30">·</span> {p.location}
                    </p>
                    <h3
                      className={cn(
                        'font-display leading-tight tracking-[-0.01em] text-ink transition-colors duration-fast group-hover:text-gold',
                        lead ? 'mt-3 text-[1.6rem] sm:text-[1.9rem]' : 'mt-2 text-[1.4rem]'
                      )}
                    >
                      {p.title}
                    </h3>
                  </div>

                  <span
                    aria-hidden="true"
                    className={cn(
                      'grid flex-none place-items-center rounded-full border border-gold/30 text-gold transition-all duration-300 ease-soft group-hover:border-gold group-hover:bg-gold group-hover:text-cream',
                      lead ? 'mt-1 h-12 w-12' : 'mt-1 h-10 w-10'
                    )}
                  >
                    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" className="transition-transform duration-300 ease-soft group-hover:translate-x-0.5">
                      <path d="m6 2 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          </Reveal>
        );
      })}
    </div>
  );
}