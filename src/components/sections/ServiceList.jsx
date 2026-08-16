import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import Reveal from '@/lib/reveal';
import { SERVICES } from '@/data/services';
import { EVENTS, track } from '@/lib/analytics';
import { cn } from '@/lib/utils';

/**
 * Les services en lignes éditoriales : nom, une phrase, une pastille de lien.
 *
 * Pas de numérotation : les services ne se lisent pas dans l'ordre, un « 01 »
 * devant « Rénovation complète » ne dit rien. Pas de filet non plus — c'est la
 * surface qui se colore au survol qui délimite la ligne, et la pastille ronde
 * qui l'ancre.
 */
export default function ServiceList({ services = SERVICES, tone = 'dark', className }) {
  const light = tone === 'light';

  return (
    <ul className={cn('-mx-4 sm:-mx-5', className)}>
      {services.map((s, i) => (
        <Reveal
          as="li"
          key={s.slug}
          delay={i * 55}
          className={cn('border-b last:border-b-0', light ? 'border-cream/12' : 'border-ink/[0.09]')}
        >
          <Link
            to={`/services/${s.slug}`}
            onClick={() => track(EVENTS.SERVICE_VIEW, { service: s.slug })}
            className={cn(
              'group grid grid-cols-[1fr_auto] items-center gap-x-6 gap-y-2 rounded-lg px-4 py-5',
              'transition-colors duration-300 ease-soft sm:px-5 sm:py-6',
              'lg:grid-cols-[minmax(0,20ch)_1fr_auto] lg:gap-x-10',
              light ? 'hover:bg-cream/[0.05]' : 'hover:bg-shell'
            )}
          >
            <h3
              className={cn(
                'font-display text-[1.5rem] leading-[1.05] tracking-[-0.01em] transition-colors duration-300',
                'sm:text-[1.75rem] lg:text-[2rem]',
                light ? 'text-cream group-hover:text-umber-light' : 'text-ink group-hover:text-umber'
              )}
            >
              {s.title}
            </h3>

            <p
              className={cn(
                'col-span-2 col-start-1 t-small max-w-[52ch] lg:col-span-1 lg:col-start-2',
                light ? 'text-cream/65' : 'text-ink/65'
              )}
            >
              {s.excerpt}
            </p>

            {/* Pastille : même langage de forme que les boutons. Elle se remplit
                de brun au survol de toute la ligne. */}
            <span
              className={cn(
                'col-start-2 row-start-1 grid h-11 w-11 flex-none place-items-center rounded-full border',
                'transition-all duration-300 ease-soft lg:col-start-3',
                light
                  ? 'border-cream/30 text-cream/70 group-hover:border-umber-light group-hover:bg-umber-light group-hover:text-bark'
                  : 'border-ink/[0.18] text-ink/65 group-hover:border-umber group-hover:bg-umber group-hover:text-cream'
              )}
              aria-hidden="true"
            >
              <ArrowUpRight
                className="h-[18px] w-[18px] transition-transform duration-300 ease-soft group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                strokeWidth={1.75}
              />
            </span>
          </Link>
        </Reveal>
      ))}
    </ul>
  );
}
