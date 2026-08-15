import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EVENTS, track } from '@/lib/analytics';

export default function ProjectCard({ project, className, aspect, priority = false }) {
  return (
    <Link
      to={`/realisations/${project.slug}`}
      onClick={() => track(EVENTS.PROJECT_VIEW, { project: project.slug })}
      className={cn('group relative block overflow-hidden bg-brand-sand', className)}
    >
      <div className={cn(aspect || project.coverAspect || 'aspect-[4/5]', 'overflow-hidden')}>
        <img
          src={project.cover}
          alt={`${project.type} — ${project.title}, ${project.location}`}
          loading={priority ? 'eager' : 'lazy'}
          decoding={priority ? 'sync' : 'async'}
          fetchpriority={priority ? 'high' : undefined}
          className="h-full w-full object-cover transition-transform duration-[900ms] ease-soft group-hover:scale-[1.04]"
        />
      </div>

      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-ink/75 via-brand-ink/10 to-transparent opacity-90"
        aria-hidden="true"
      />

      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 lg:p-7">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-brand-goldLight">{project.type}</p>
          <h3 className="mt-2 font-display text-xl font-light text-white lg:text-2xl">{project.title}</h3>
          <p className="mt-1 text-[12px] font-light text-white/60">{project.location}</p>
        </div>
        <span
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-white/30 text-white transition-colors duration-300 group-hover:border-brand-gold group-hover:bg-brand-gold"
          aria-hidden="true"
        >
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  );
}
