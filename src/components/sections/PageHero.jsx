import { Link } from 'react-router-dom';
import { Container } from '@/components/ui';
import { cn } from '@/lib/utils';

/**
 * En-tête de page interne : fil d'Ariane, label, H1, une phrase.
 * Sans image par défaut — le vide fait le travail. L'image reste possible
 * quand la page a un visuel qui mérite la pleine largeur.
 */
export default function PageHero({ label, title, intro, image, breadcrumb = [], aside }) {
  const hasImage = Boolean(image);
  // Le fil d'Ariane se termine déjà par le nom de la page : répéter ce nom
  // dans un sur-titre juste en dessous ne dit rien de plus. Le label ne sert
  // donc que sur les pages sans fil d'Ariane.
  const showLabel = Boolean(label) && breadcrumb.length === 0;

  return (
    <header className={cn('relative isolate overflow-hidden', hasImage ? 'bg-bark' : 'bg-cream')}>
      {hasImage && (
        <>
          <img
            src={image}
            alt=""
            aria-hidden="true"
            fetchpriority="high"
            decoding="sync"
            className="absolute inset-0 -z-10 h-full w-full object-cover"
          />
          <div className="absolute inset-0 -z-10 bg-bark/70" aria-hidden="true" />
        </>
      )}

      <Container className={cn('pb-14 pt-28 lg:pb-20 lg:pt-40', hasImage && 'pb-20 lg:pb-28')}>
        {breadcrumb.length > 0 && (
          <nav aria-label="Fil d'Ariane" className="mb-10">
            <ol className={cn('t-label flex flex-wrap items-center gap-2', hasImage ? 'text-cream/65' : 'text-ink/65')}>
              {breadcrumb.map((b, i) => (
                <li key={b.to || b.label} className="flex items-center gap-2">
                  {i > 0 && <span aria-hidden="true">/</span>}
                  {b.to ? (
                    <Link to={b.to} className="transition-colors hover:text-umber">
                      {b.label}
                    </Link>
                  ) : (
                    <span aria-current="page" className={hasImage ? 'text-cream/70' : 'text-ink/65'}>
                      {b.label}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}

        {/* La colonne de droite n'existe que si elle porte autre chose qu'un
            paragraphe : sinon le texte se lit sous le titre, à la bonne
            largeur de lecture. */}
        <div className={cn(aside && 'lg:grid lg:grid-cols-12 lg:gap-12')}>
          <div className={cn(aside && 'lg:col-span-7')}>
            {showLabel && (
              <p className={cn('t-label mb-5', hasImage ? 'text-cream/60' : 'text-ink/65')}>{label}</p>
            )}
            {/* `ch` se calcule sur la police de l'élément : la largeur se pose
                donc sur le titre, jamais sur le conteneur. */}
            <h1 className={cn('t-h1 max-w-[16ch] text-balance', hasImage ? 'text-cream' : 'text-ink')}>{title}</h1>
          </div>

          {(intro || aside) && (
            <div
              className={cn(
                'mt-6',
                aside && 'lg:col-span-5 lg:mt-0 lg:self-end',
                hasImage ? 'text-cream/65' : 'text-ink/65'
              )}
            >
              {intro && <p className="t-lead measure">{intro}</p>}
              {aside}
            </div>
          )}
        </div>
      </Container>
    </header>
  );
}
