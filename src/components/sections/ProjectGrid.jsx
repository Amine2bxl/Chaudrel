import { Link } from 'react-router-dom';
import Reveal from '@/lib/reveal';
import { EVENTS, track } from '@/lib/analytics';
import { cn } from '@/lib/utils';

/**
 * La galerie des chantiers.
 *
 * Le premier chantier ouvre en une immersive : sa photo pleine largeur, le
 * titre posé dessus et un appel à l'ouvrir. Les suivants se lisent en
 * colonnes, titre sous l'image. Une seule page, deux rythmes de lecture - on
 * s'arrête sur la une, on parcourt le reste.
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

                {/* La une : le titre vit sur la photo, sous un voile. */}
                {lead ? (
                  <>
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-t from-bark/90 via-bark/25 to-transparent"
                    />
                    <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
                      <p className="t-label text-cream/80">
                        {p.type} <span aria-hidden="true" className="mx-1.5 text-cream/40">·</span> {p.location}
                      </p>
                      <h3 className="mt-2 font-display text-[1.6rem] leading-tight tracking-[-0.01em] text-cream transition-colors duration-fast group-hover:text-gold-light sm:text-[2.1rem]">
                        {p.title}
                      </h3>
                      <span className="mt-5 inline-flex items-center gap-2 rounded-full bg-gold-deep px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-cream shadow-soft transition-all duration-300 ease-soft group-hover:bg-gold-hover group-hover:shadow-lift">
                        Voir le chantier
                        <svg width="11" height="11" viewBox="0 0 16 16" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6">
                          <path d="m6 2 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute right-5 top-4 font-display leading-[0.8] text-cream/70"
                      style={{ textShadow: '0 2px 12px rgba(0,0,0,0.5)' }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>

                    {/* La légende se lit sous l'image, au calme. */}
                    <div className="mt-5 border-t border-ink/12 pt-4">
                      <div className="flex items-start justify-between gap-6">
                        <div className="min-w-0">
                          <p className="t-label text-ink/55">
                            {p.type} <span aria-hidden="true" className="mx-1.5 text-ink/30">·</span> {p.location}
                          </p>
                          <h3 className="mt-2 font-display text-[1.4rem] leading-tight tracking-[-0.01em] text-ink transition-colors duration-fast group-hover:text-gold">
                            {p.title}
                          </h3>
                        </div>
                        <span
                          aria-hidden="true"
                          className="mt-1 grid h-10 w-10 flex-none place-items-center rounded-full border border-gold/30 text-gold transition-all duration-300 ease-soft group-hover:border-gold group-hover:bg-gold group-hover:text-cream"
                        >
                          <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" className="transition-transform duration-300 ease-soft group-hover:translate-x-0.5">
                            <path d="m6 2 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </Link>
          </Reveal>
        );
      })}
    </div>
  );
}