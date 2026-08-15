import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import Reveal from '@/lib/reveal';
import { SERVICES } from '@/data/services';
import { EVENTS, track } from '@/lib/analytics';
import { cn } from '@/lib/utils';

/**
 * Les services en lignes éditoriales : numéro, nom, une phrase, flèche.
 * Une image d'aperçu suit le survol sur grand écran — sur mobile, la liste
 * reste une liste, sans carte ni fioriture.
 */
export default function ServiceList({ services = SERVICES, tone = 'dark', className }) {
  const light = tone === 'light';

  return (
    <ul className={cn('border-t', light ? 'border-cream/15' : 'border-ink/12', className)}>
      {services.map((s, i) => (
        <Reveal
          as="li"
          key={s.slug}
          delay={i * 60}
          className={cn('border-b', light ? 'border-cream/15' : 'border-ink/12')}
        >
          <Link
            to={`/services/${s.slug}`}
            onClick={() => track(EVENTS.SERVICE_VIEW, { service: s.slug })}
            className="group grid grid-cols-[auto_1fr_auto] items-center gap-x-5 py-6 sm:gap-x-8 sm:py-8 lg:grid-cols-[auto_minmax(0,22ch)_1fr_auto] lg:gap-x-10"
          >
            <span className={cn('t-num text-lg', light ? 'text-cream/30' : 'text-ink/25')}>
              {String(i + 1).padStart(2, '0')}
            </span>

            <h3
              className={cn(
                't-h2 text-[1.5rem] transition-colors duration-300 sm:text-[1.75rem] lg:text-[2rem]',
                light ? 'text-cream group-hover:text-gold' : 'text-ink group-hover:text-gold'
              )}
            >
              {s.title}
            </h3>

            <p
              className={cn(
                'col-span-2 col-start-2 t-small pr-4 lg:col-span-1 lg:col-start-auto',
                light ? 'text-cream/50' : 'text-ink/55'
              )}
            >
              {s.excerpt}
            </p>

            <ArrowUpRight
              className={cn(
                'col-start-3 row-start-1 h-5 w-5 transition-transform duration-300 ease-soft group-hover:-translate-y-1 group-hover:translate-x-1 lg:col-start-4',
                light ? 'text-cream/40' : 'text-ink/30'
              )}
              aria-hidden="true"
            />
          </Link>
        </Reveal>
      ))}
    </ul>
  );
}
