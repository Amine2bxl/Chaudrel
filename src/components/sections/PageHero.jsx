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

  return (
    <header className={cn('relative isolate overflow-hidden', hasImage ? 'bg-night' : 'bg-cream')}>
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
          <div className="absolute inset-0 -z-10 bg-night/70" aria-hidden="true" />
        </>
      )}

      <Container className={cn('pb-14 pt-28 lg:pb-20 lg:pt-40', hasImage && 'pb-20 lg:pb-28')}>
        {breadcrumb.length > 0 && (
          <nav aria-label="Fil d'Ariane" className="mb-10">
            <ol className={cn('t-label flex flex-wrap items-center gap-2', hasImage ? 'text-cream/45' : 'text-ink/35')}>
              {breadcrumb.map((b, i) => (
                <li key={b.to || b.label} className="flex items-center gap-2">
                  {i > 0 && <span aria-hidden="true">/</span>}
                  {b.to ? (
                    <Link to={b.to} className="transition-colors hover:text-gold">
                      {b.label}
                    </Link>
                  ) : (
                    <span aria-current="page" className={hasImage ? 'text-cream/70' : 'text-ink/60'}>
                      {b.label}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}

        <div className="lg:grid lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            {label && (
              <div className="mb-6 flex items-center gap-4">
                <span className="h-px w-8 bg-gold" aria-hidden="true" />
                <span className={cn('t-label', hasImage ? 'text-cream/60' : 'text-ink/40')}>{label}</span>
              </div>
            )}
            <h1 className={cn('t-h1', hasImage ? 'text-cream' : 'text-ink')}>{title}</h1>
          </div>

          {(intro || aside) && (
            <div className={cn('mt-8 lg:col-span-5 lg:mt-0 lg:self-end', hasImage ? 'text-cream/65' : 'text-ink/60')}>
              {intro && <p className="t-body measure">{intro}</p>}
              {aside}
            </div>
          )}
        </div>
      </Container>
    </header>
  );
}
