import { Link } from 'react-router-dom';
import { Container, SectionHeading, TextLink } from '@/components/ui';
import Reveal from '@/lib/reveal';
import { EVENTS, track } from '@/lib/analytics';
import { imageAttrs } from '@/lib/image';
import { cn } from '@/lib/utils';
import { ArrowIcon } from '@/components/ui/Icons';

/* Rythme de la grille, par groupe de quatre : grand / petit décalé, puis
   petit / grand décalé. Deux colonnes inégales, jamais une rangée de cartes
   identiques. */
const LAYOUT = [
  { col: 'lg:col-span-7', ratio: 'aspect-[4/3]', sizes: '(min-width: 1024px) 56vw, 100vw' },
  { col: 'lg:col-span-5 lg:mt-24', ratio: 'aspect-[4/5]', sizes: '(min-width: 1024px) 40vw, 100vw' },
  { col: 'lg:col-span-5', ratio: 'aspect-[4/5]', sizes: '(min-width: 1024px) 40vw, 100vw' },
  { col: 'lg:col-span-7 lg:mt-24', ratio: 'aspect-[4/3]', sizes: '(min-width: 1024px) 56vw, 100vw' },
];
const WIDE = { col: 'lg:col-span-12', ratio: 'aspect-[4/3] lg:aspect-[21/9]', sizes: '100vw' };

/**
 * Les chantiers, en grille éditoriale : de grandes photos sur deux colonnes
 * de tailles alternées, la nature des travaux et le titre en légende. La
 * photo se découvre une fois à l'apparition, puis avance très légèrement au
 * survol ; rien ne bouge au défilement.
 *
 * Le nom `ProjectCarousel` est conservé : c'est l'unique façon d'afficher
 * des chantiers (accueil, /realisations, pages métier).
 */
export default function ProjectCarousel({
  projects = [],
  sectionLabel = 'Nos chantiers',
  title = '',
  text = '',
  link,
}) {
  if (!projects.length) return null;

  return (
    <section aria-label={sectionLabel} className="bg-cream py-section">
      <Container>
        {title && (
          <div className="mb-block flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading title={title} text={text} />
            {link && (
              <TextLink to={link.to} className="flex-none">
                {link.label}
              </TextLink>
            )}
          </div>
        )}

        <ul className="grid gap-x-8 gap-y-14 lg:grid-cols-12">
          {projects.map((p, i) => {
            // Dernier chantier seul sur sa rangée : il prend toute la largeur.
            const alone = i === projects.length - 1 && i % 2 === 0;
            const l = alone ? WIDE : LAYOUT[i % LAYOUT.length];
            const to = `/realisations/${p.slug}`;
            return (
              <li key={p.slug} className={l.col}>
                <Link
                  to={to}
                  onClick={() => track(EVENTS.PROJECT_VIEW, { project: p.slug, source: 'grid' })}
                  className="group block"
                >
                  <Reveal from="veil" className={cn('overflow-hidden rounded-[24px] bg-sand', l.ratio)}>
                    {/* Le volet anime ce bloc ; le survol anime la photo : deux transform séparés. */}
                    <div className="h-full w-full">
                      <img
                        {...imageAttrs(p.cover.src, l.sizes)}
                        alt={p.cover.alt}
                        width={p.cover.w}
                        height={p.cover.h}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover transition-transform duration-700 ease-soft group-hover:scale-[1.04]"
                      />
                    </div>
                  </Reveal>
                  <div className="mt-5 flex items-start justify-between gap-6">
                    <div>
                      <p className="t-label text-gold-deep">{p.type}</p>
                      <h3 className="mt-2.5 font-display text-[1.75rem] leading-tight text-ink">{p.title}</h3>
                      {p.location && <p className="t-small mt-1 text-ink/70">{p.location}</p>}
                    </div>
                    <span
                      aria-hidden="true"
                      className="mt-1 grid h-11 w-11 flex-none place-items-center rounded-full border border-ink/15 text-ink/70 transition-[border-color,color,transform] duration-200 ease-soft group-hover:border-gold group-hover:text-gold-deep group-active:scale-95"
                    >
                      <ArrowIcon
                        size={18}
                        className="transition-transform duration-200 ease-soft group-hover:translate-x-0.5"
                      />
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>

        {link && !title && (
          <div className="mt-14 text-center">
            <TextLink to={link.to}>{link.label}</TextLink>
          </div>
        )}
      </Container>
    </section>
  );
}
