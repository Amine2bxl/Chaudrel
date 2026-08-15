import { Link } from 'react-router-dom';
import { Container } from '@/components/ui';
import { cn } from '@/lib/utils';

/** En-tête de page interne — image optionnelle, fil d'Ariane, H1. */
export default function PageHero({ eyebrow, title, intro, image, breadcrumb = [], className }) {
  const hasImage = Boolean(image);

  return (
    <section
      className={cn(
        'relative overflow-hidden',
        hasImage ? 'bg-brand-dark' : 'border-b border-brand-ink/10 bg-brand-sand',
        className
      )}
    >
      {hasImage && (
        <>
          <img
            src={image}
            alt=""
            aria-hidden="true"
            fetchpriority="high"
            decoding="sync"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-brand-ink/65" aria-hidden="true" />
        </>
      )}

      <Container className={cn('relative pb-14 pt-32 lg:pb-20 lg:pt-40', hasImage && 'pb-20 lg:pb-28')}>
        {breadcrumb.length > 0 && (
          <nav aria-label="Fil d'Ariane" className="mb-6">
            <ol
              className={cn(
                'flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.14em]',
                hasImage ? 'text-white/50' : 'text-brand-ink/40'
              )}
            >
              {breadcrumb.map((b, i) => (
                <li key={b.to || b.label} className="flex items-center gap-2">
                  {i > 0 && <span aria-hidden="true">/</span>}
                  {b.to ? (
                    <Link to={b.to} className="transition-colors hover:text-brand-gold">
                      {b.label}
                    </Link>
                  ) : (
                    <span aria-current="page">{b.label}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}

        {eyebrow && <p className={cn('eyebrow', hasImage && 'text-brand-goldLight')}>{eyebrow}</p>}
        <h1
          className={cn(
            'h-display max-w-3xl text-[2.4rem] sm:text-5xl lg:text-6xl',
            hasImage ? 'text-white' : 'text-brand-ink'
          )}
        >
          {title}
        </h1>
        {intro && (
          <p
            className={cn(
              'mt-6 max-w-2xl text-[15px] font-light leading-[1.85] lg:text-base',
              hasImage ? 'text-white/65' : 'text-brand-ink/60'
            )}
          >
            {intro}
          </p>
        )}
      </Container>
    </section>
  );
}
