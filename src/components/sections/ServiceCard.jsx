import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EVENTS, track } from '@/lib/analytics';

export default function ServiceCard({ service, className }) {
  return (
    <Link
      to={`/services/${service.slug}`}
      onClick={() => track(EVENTS.SERVICE_VIEW, { service: service.slug })}
      className={cn(
        'group flex flex-col overflow-hidden border border-brand-ink/8 bg-white transition-colors duration-300 hover:border-brand-gold/40',
        className
      )}
    >
      <div className="aspect-[3/2] overflow-hidden bg-brand-sand">
        <img
          src={service.image}
          alt={`${service.title} — Chaudrel Rénovation`}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-[900ms] ease-soft group-hover:scale-[1.04]"
        />
      </div>
      <div className="flex flex-1 flex-col p-6 lg:p-7">
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-brand-gold">{service.subtitle}</p>
        <h3 className="mt-2 font-display text-2xl font-light text-brand-ink">{service.title}</h3>
        <p className="mt-3 flex-1 text-[14px] font-light leading-[1.75] text-brand-ink/60">{service.excerpt}</p>
        <span className="mt-6 inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-brand-ink transition-all duration-300 group-hover:gap-4 group-hover:text-brand-gold">
          Découvrir
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}
