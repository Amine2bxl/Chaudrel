import { Link } from 'react-router-dom';
import { SERVICES, serviceItems } from '@/data/services';
import { cn } from '@/lib/utils';
import Reveal from '@/lib/reveal';
import { RoundArrow } from '@/components/ui';

/**
 * Index des métiers : une ligne par métier, numérotée, séparée d'un filet.
 * Pas de grille de cartes. Au survol (bureau), la photo du métier apparaît
 * dans la ligne quand elle existe.
 * `headingLevel` : niveau des intitulés (h3 sous un h2 de section).
 */
export default function ServiceIndex({ services = SERVICES, headingLevel = 'h3', detailed = false }) {
  const H = headingLevel;
  return (
    <ol className="border-t border-ink/12">
      {services.map((s, i) => {
        const items = serviceItems(s);
        return (
          <Reveal as="li" key={s.slug} delay={i * 50} className="border-b border-ink/12">
            <Link
              to={`/services/${s.slug}`}
              className="group grid grid-cols-[2.5rem_1fr_auto] items-center gap-x-4 py-6 sm:grid-cols-[4rem_1fr_auto] sm:py-8 lg:grid-cols-[5rem_minmax(0,5fr)_minmax(0,5fr)_auto] lg:gap-x-8"
            >
              <span className="t-num self-start pt-1 text-[15px] text-gold-ink">{String(i + 1).padStart(2, '0')}</span>
              <div>
                <H className="t-h3 transition-transform duration-slow ease-soft group-hover:translate-x-1">{s.title}</H>
                <p className="mt-1.5 text-[14px] text-ink/70">{s.excerpt}</p>
              </div>
              <div className={cn('col-span-3 col-start-2 mt-4 lg:col-span-1 lg:col-start-3 lg:mt-0', !detailed && 'hidden lg:block')}>
                <p className="text-[13px] leading-relaxed text-ink/70">
                  {items.slice(0, detailed ? items.length : 5).join(' · ')}
                </p>
              </div>
              <div className="col-start-3 row-start-1 flex items-center gap-5 lg:col-start-4">
                {s.image && (
                  <span className="hidden h-16 w-14 overflow-hidden rounded-img opacity-0 transition-opacity duration-slow ease-soft group-hover:opacity-100 xl:block">
                    <img
                      src={s.image.src}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      width="56"
                      height="64"
                      className="photo h-full w-full object-cover"
                    />
                  </span>
                )}
                <RoundArrow />
              </div>
            </Link>
          </Reveal>
        );
      })}
    </ol>
  );
}
