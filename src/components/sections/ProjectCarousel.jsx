import { Link } from 'react-router-dom';
import { Container, SectionHeading, TextLink } from '@/components/ui';
import Reveal from '@/lib/reveal';
import { EVENTS, track } from '@/lib/analytics';
import { imageAttrs } from '@/lib/image';
import { cn } from '@/lib/utils';
import { ArrowIcon } from '@/components/ui/Icons';

/* Mosaïque par groupe de cinq, sur deux étages : une grande photo et deux
   petites empilées, puis l'inverse (une moyenne, une grande). Les cases
   suivent la grille, la photo remplit sa case : aucun vide entre les blocs. */
const BIG = { col: 'lg:col-span-7 lg:row-span-2', sizes: '(min-width: 1024px) 56vw, 100vw' };
const SMALL = { col: 'lg:col-span-5', sizes: '(min-width: 1024px) 40vw, 100vw' };
const TALL = { col: 'lg:col-span-5 lg:row-span-2', sizes: '(min-width: 1024px) 40vw, 100vw' };
const FULL = { col: 'lg:col-span-12 lg:row-span-2', sizes: '100vw' };
const MOSAIC = [BIG, SMALL, SMALL, TALL, BIG];
function cellFor(i, n) {
  // Dernière case : elle comble son étage (seule : toute la largeur).
  if (i === n - 1 && i % 5 === 0) return FULL;
  if (i === n - 1 && i % 5 === 1) return TALL;
  if (i === n - 1 && i % 5 === 3) return FULL;
  return MOSAIC[i % 5];
}

/**
 * Les chantiers, en mosaïque : de grandes photos de tailles alternées, la
 * nature des travaux et le titre posés en bas de la photo. La photo se
 * découvre une fois à l'apparition, puis avance très légèrement au survol ;
 * rien ne bouge au défilement.
 *
 * Le nom `ProjectCarousel` est conservé : c'est l'unique façon d'afficher
 * des chantiers (accueil, /realisations, pages métier).
 */
export default function ProjectCarousel({
  projects = [],
  sectionLabel = 'Nos chantiers',
  title = '',
  link,
}) {
  if (!projects.length) return null;

  return (
    <section aria-label={sectionLabel} className="py-section">
      <Container>
        {title && (
          <SectionHeading title={title} className="mb-block">
            {link && (
              <TextLink to={link.to} className="flex-none">
                {link.label}
              </TextLink>
            )}
          </SectionHeading>
        )}

        <ul className="grid gap-4 lg:auto-rows-[15.5rem] lg:grid-cols-12 lg:gap-5">
          {projects.map((p, i) => {
            const l = cellFor(i, projects.length);
            return (
              <li key={p.slug} className={cn('aspect-[4/3] lg:aspect-auto', l.col)}>
                <Link
                  to={`/realisations/${p.slug}`}
                  onClick={() => track(EVENTS.PROJECT_VIEW, { project: p.slug, source: 'grid' })}
                  className="group relative block h-full overflow-hidden rounded-[24px] bg-sand"
                >
                  <Reveal from="veil" delay={(i % 5) * 70} className="h-full">
                    {/* Le volet anime ce bloc ; le survol anime la photo : deux transform séparés. */}
                    <img
                      {...imageAttrs(p.cover.src, l.sizes)}
                      alt={p.cover.alt}
                      width={p.cover.w}
                      height={p.cover.h}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition-transform duration-700 ease-soft group-hover:scale-[1.04]"
                    />
                  </Reveal>
                  {/* Légende sur la photo : un fondu sombre en bas, jamais un cadre. */}
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 bg-gradient-to-t from-bark/90 via-bark/50 to-transparent p-5 pt-16 sm:p-7 sm:pt-20">
                    <div>
                      <p className="t-label text-gold-light">{p.type}</p>
                      <h3 className="mt-2 font-display text-[1.5rem] leading-tight text-white sm:text-[1.75rem]">{p.title}</h3>
                      {p.location && <p className="t-small mt-1 text-white/75">{p.location}</p>}
                    </div>
                    <span
                      aria-hidden="true"
                      className="grid h-11 w-11 flex-none place-items-center rounded-full bg-white/10 text-white transition-[background-color,transform] duration-200 ease-soft group-hover:bg-white/20 group-active:scale-95"
                    >
                      <ArrowIcon size={18} className="transition-transform duration-200 ease-soft group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
