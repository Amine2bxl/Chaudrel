import { Link } from 'react-router-dom';
import { Container, SectionHeading, TextLink } from '@/components/ui';
import Reveal from '@/lib/reveal';
import { EVENTS, track } from '@/lib/analytics';
import { imageAttrs } from '@/lib/image';
import { cn } from '@/lib/utils';
import { ArrowIcon } from '@/components/ui/Icons';

/**
 * Les chantiers : de grandes photos sur deux colonnes, la légende dans une
 * plaque de verre posée sur la photo (vrai flou d'arrière-plan). Un dernier
 * chantier seul sur sa rangée prend toute la largeur. Rien ne bouge au
 * défilement ; au survol, la photo avance à peine.
 *
 * Le nom `ProjectCarousel` est conservé : c'est l'unique façon d'afficher
 * des chantiers (accueil, /realisations, pages métier).
 */
export default function ProjectCarousel({ projects = [], sectionLabel = 'Nos chantiers', title = '', link }) {
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

        <ul className="grid gap-4 md:grid-cols-2 lg:gap-5">
          {projects.map((p, i) => {
            const wide = i === projects.length - 1 && i % 2 === 0;
            return (
              <li key={p.slug} className={cn(wide && 'md:col-span-2')}>
                <Reveal from="veil" delay={(i % 2) * 90} className={cn('rounded-[24px] bg-sand', wide ? 'aspect-[4/3] md:aspect-[21/9]' : 'aspect-[4/3]')}>
                  <Link
                    to={`/realisations/${p.slug}`}
                    onClick={() => track(EVENTS.PROJECT_VIEW, { project: p.slug, source: 'grid' })}
                    className="group relative block h-full w-full overflow-hidden rounded-[24px]"
                  >
                    <img
                      {...imageAttrs(p.cover.src, wide ? '100vw' : '(min-width: 768px) 50vw, 100vw')}
                      alt={p.cover.alt}
                      width={p.cover.w}
                      height={p.cover.h}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition-transform duration-700 ease-soft group-hover:scale-[1.03]"
                    />
                    <span className="glass-dark absolute inset-x-3 bottom-3 [background:rgb(17_15_13/0.55)] flex items-center justify-between gap-4 rounded-[18px] px-4 py-3 sm:inset-x-auto sm:left-4 sm:bottom-4 sm:min-w-[19rem] sm:px-5">
                      <span className="min-w-0">
                        <span className="t-label block text-gold-light">{p.type}</span>
                        <span className="mt-1 block truncate text-[17px] font-medium text-ink">{p.title}</span>
                      </span>
                      <ArrowIcon
                        size={18}
                        className="flex-none text-ink/80 transition-transform duration-200 ease-soft group-hover:translate-x-0.5"
                      />
                    </span>
                  </Link>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
