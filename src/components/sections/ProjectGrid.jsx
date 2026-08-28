import { Link } from 'react-router-dom';
import Reveal from '@/lib/reveal';
import { EVENTS, track } from '@/lib/analytics';
import { cn } from '@/lib/utils';

/**
 * La grille des chantiers — la vue d'ensemble de /realisations.
 *
 * Là où le carrousel de l'accueil montre un chantier à la fois, en grand, la
 * grille laisse parcourir tout le portfolio d'un coup d'œil : chaque carte dit,
 * clairement et dans cet ordre, ce que c'est (le type), où (la commune) et
 * comment ça s'appelle (le titre). Le titre ne recouvre pas l'image — il se
 * lit sous elle, sans effort.
 */
export default function ProjectGrid({ projects = [], className }) {
  return (
    <div className={cn('grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8', className)}>
      {projects.map((p, i) => (
        <Reveal key={p.slug} delay={(i % 3) * 90} className="h-full">
          <Link
            to={`/realisations/${p.slug}`}
            onClick={() => track(EVENTS.PROJECT_VIEW, { project: p.slug, source: 'grid' })}
            className="group block h-full overflow-hidden rounded-lg border border-ink/[0.07] bg-shell shadow-soft transition-all duration-300 ease-soft hover:-translate-y-1 hover:shadow-lift"
          >
            {/* L'image, révélée par un volet au scroll. */}
            <div className="relative aspect-[4/3] overflow-hidden bg-sand">
              <img
                src={p.cover.src}
                alt={p.cover.alt}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover saturate-[0.97] transition-[transform,filter] duration-[1200ms] ease-soft group-hover:scale-[1.045] group-hover:saturate-100"
              />
              {/* Pastille du type, dans l'image : d'où l'on voit tout de suite
                  de quoi il s'agit sans lire une ligne. */}
              <span className="absolute left-4 top-4 rounded-full bg-bark/55 px-3 py-1.5 text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-cream backdrop-blur-sm">
                {p.type}
              </span>
            </div>

            {/* Le titre se lit sous l'image, au calme. */}
            <div className="flex items-center justify-between gap-4 p-5 sm:p-6">
              <div className="min-w-0">
                <p className="t-small text-ink/55">{p.location}</p>
                <h3 className="t-h3 mt-1.5 truncate text-ink transition-colors duration-fast group-hover:text-gold">
                  {p.title}
                </h3>
              </div>
              <span
                aria-hidden="true"
                className="-mr-1 grid h-10 w-10 flex-none place-items-center rounded-full bg-gold text-cream transition-transform duration-300 ease-soft group-hover:translate-x-0.5"
              >
                <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="m6 2 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </div>
          </Link>
        </Reveal>
      ))}
    </div>
  );
}