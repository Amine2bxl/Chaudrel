import { Link } from 'react-router-dom';
import Reveal from '@/lib/reveal';
import { cn } from '@/lib/utils';
import { EVENTS, track } from '@/lib/analytics';

/**
 * Composition éditoriale des réalisations.
 * `variant="editorial"` : tailles et décalages variables (accueil).
 * `variant="grid"`      : grille régulière pour la page portfolio.
 * Le texte est sous l'image, pas posé dessus : l'image reste lisible.
 */

export function ProjectItem({ project, ratio = 'aspect-[4/5]', priority = false, className, delay = 0 }) {
  return (
    <Reveal from="fade" delay={delay} className={className}>
      <Link
        to={`/realisations/${project.slug}`}
        onClick={() => track(EVENTS.PROJECT_VIEW, { project: project.slug })}
        className="group block"
      >
        <div className={cn('overflow-hidden bg-sand', ratio)}>
          <img
            src={project.cover}
            alt={`${project.type} — ${project.title}, ${project.location}`}
            loading={priority ? 'eager' : 'lazy'}
            decoding={priority ? 'sync' : 'async'}
            fetchpriority={priority ? 'high' : undefined}
            className="h-full w-full object-cover transition-transform duration-[1200ms] ease-soft group-hover:scale-[1.03]"
          />
        </div>

        <div className="mt-5 flex items-baseline justify-between gap-6 border-t border-ink/10 pt-4">
          <div>
            <h3 className="t-h3 transition-colors duration-300 group-hover:text-gold">{project.title}</h3>
            <p className="t-small mt-1 text-ink/45">{project.location}</p>
          </div>
          <span className="t-label whitespace-nowrap text-ink/35">{project.type}</span>
        </div>
      </Link>
    </Reveal>
  );
}

export default function ProjectGrid({ projects, variant = 'grid', className }) {
  if (variant === 'editorial') {
    const [first, second, third, fourth, ...rest] = projects;

    return (
      <div className={cn('space-y-16 lg:space-y-24', className)}>
        {first && (
          <ProjectItem project={first} ratio="aspect-[16/10] lg:aspect-[21/9]" priority />
        )}

        {(second || third) && (
          <div className="grid gap-12 md:grid-cols-12 md:gap-8">
            {second && <ProjectItem project={second} ratio="aspect-[4/5]" className="md:col-span-7" />}
            {third && (
              <ProjectItem project={third} ratio="aspect-[3/4]" delay={120} className="md:col-span-5 md:pt-24" />
            )}
          </div>
        )}

        {fourth && <ProjectItem project={fourth} ratio="aspect-[16/10]" className="md:mx-auto md:w-11/12" />}

        {rest.length > 0 && (
          <div className="grid gap-12 md:grid-cols-2 md:gap-8">
            {rest.map((p, i) => (
              <ProjectItem key={p.slug} project={p} ratio="aspect-[4/3]" delay={i * 100} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={cn('grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3', className)}>
      {projects.map((p, i) => (
        <ProjectItem
          key={p.slug}
          project={p}
          ratio="aspect-[4/5]"
          priority={i < 2}
          delay={(i % 3) * 90}
        />
      ))}
    </div>
  );
}
