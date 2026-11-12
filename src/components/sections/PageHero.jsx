import { Link } from 'react-router-dom';
import { Container } from '@/components/ui';
import { BRAND } from '@/data/site';
import { cn } from '@/lib/utils';
import { imageAttrs, SIZES } from '@/lib/image';

/**
 * En-tête de page interne.
 *
 * Deux états, une même grille :
 *   sans image  fond crème, grand titre, beaucoup de vide - une page de garde ;
 *   avec image  la photo du chantier ou du métier occupe l'écran, le titre se
 *               pose en bas à gauche, comme une légende de revue.
 *
 * Dans les deux cas : un cartouche en tête (fil d'Ariane à gauche, repère de
 * marque à droite, filet dessous) et un titre à l'échelle `t-hero`.
 */
export default function PageHero({ title, intro, image, breadcrumb = [], aside, meta }) {
  const hasImage = Boolean(image);
  const soft = hasImage ? 'text-cream/75' : 'text-ink/65';

  return (
    <header className={cn('relative isolate overflow-hidden', hasImage ? 'flex min-h-[78svh] flex-col bg-bark text-cream' : 'bg-cream text-ink')}>
      {hasImage && (
        <>
          <img
            {...imageAttrs(image, SIZES.full)}
            alt=""
            aria-hidden="true"
            width="1920"
            height="1080"
            fetchpriority="high"
            decoding="sync"
            className="slow-zoom absolute inset-0 -z-10 h-full w-full object-cover"
          />
          {/* Le voile ne couvre pas la photo : il assoit le haut (navigation,
              cartouche) et le bas (titre), et laisse le milieu respirer. */}
          <div
            className="absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,rgb(var(--c-bark-rgb)/0.72)_0%,rgb(var(--c-bark-rgb)/0.2)_34%,rgb(var(--c-bark-rgb)/0.38)_58%,rgb(var(--c-bark-rgb)/0.92)_100%)]"
            aria-hidden="true"
          />
        </>
      )}

      <Container className={cn('pt-24 lg:pt-32', hasImage && 'flex flex-1 flex-col')}>
        {/* ---------- Cartouche ---------- */}
        <div className={cn('hero-in hero-d1 flex items-center justify-between gap-6 border-b pb-4', hasImage ? 'border-cream/20' : 'border-ink/15')}>
          {breadcrumb.length > 0 ? (
            <nav aria-label="Fil d'Ariane">
              <ol className={cn('t-label flex flex-wrap items-center gap-2', soft)}>
                {breadcrumb.map((b, i) => (
                  <li key={b.to || b.label} className="flex items-center gap-2">
                    {i > 0 && <span aria-hidden="true">/</span>}
                    {b.to ? (
                      <Link to={b.to} className={cn('tap transition-colors', hasImage ? 'hover:text-cream' : 'hover:text-ink')}>
                        {b.label}
                      </Link>
                    ) : (
                      <span aria-current="page" className={hasImage ? 'text-cream' : 'text-ink'}>
                        {b.label}
                      </span>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          ) : (
            <span />
          )}
          <p className={cn('t-label hidden whitespace-nowrap text-right sm:block', soft)}>{meta || `${BRAND.legalName} · ${BRAND.address.city}`}</p>
        </div>

        {/* ---------- Titre ---------- */}
        <div className={cn(hasImage ? 'mt-auto pb-12 pt-24 lg:pb-16' : 'pb-14 pt-12 lg:pb-20 lg:pt-20', aside && 'lg:grid lg:grid-cols-12 lg:items-end lg:gap-12')}>
          <div className={cn(aside && 'lg:col-span-7')}>
            {/* `ch` se calcule sur la police de l'élément : la largeur se pose
                donc sur le titre, jamais sur le conteneur. */}
            <h1 className="hero-in hero-d2 t-hero max-w-[17ch] text-balance">{title}</h1>
            {intro && <p className={cn('hero-in hero-d3 t-lead mt-6 max-w-[52ch] lg:mt-8', hasImage ? 'text-cream/80' : 'text-ink/65')}>{intro}</p>}
          </div>

          {aside && <div className={cn('hero-in hero-d4 mt-8 lg:col-span-5 lg:mt-0', soft)}>{aside}</div>}
        </div>
      </Container>
    </header>
  );
}
