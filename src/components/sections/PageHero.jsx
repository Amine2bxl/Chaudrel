import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { imageAttrs } from '@/lib/image';
import { cn } from '@/lib/utils';
import { Container } from '@/components/ui';

/**
 * En-tête des pages intérieures.
 * Fil d'Ariane en petites capitales, titre en serif, introduction.
 * `image` : photo d'ouverture à droite (bureau) ou sous le titre (téléphone).
 * `aside` : contenu libre dans la colonne de droite quand il n'y a pas d'image.
 * Entrées jouées en CSS dès le premier rendu (voir index.css, `.enter`).
 */
export default function PageHero({ title, intro, image, breadcrumb = [], aside, meta, label, className }) {
  const twoCols = Boolean(image || aside);
  return (
    <header className={cn('pb-block pt-[calc(var(--header-h)+1.75rem)] lg:pt-[calc(var(--header-h)+3rem)]', className)}>
      <Container>
        {breadcrumb.length > 0 && (
          <nav aria-label="Fil d'Ariane" className="enter">
            <ol className="t-label flex flex-wrap items-center gap-x-2.5 gap-y-1 text-ink/60">
              {breadcrumb.map((c, i) => (
                <Fragment key={c.label}>
                  {i > 0 && (
                    <li aria-hidden="true" className="text-gold">
                      /
                    </li>
                  )}
                  <li>
                    {c.to ? (
                      <Link to={c.to} className="link-line tap hover:text-ink">
                        {c.label}
                      </Link>
                    ) : (
                      <span aria-current="page" className="text-ink">
                        {c.label}
                      </span>
                    )}
                  </li>
                </Fragment>
              ))}
            </ol>
          </nav>
        )}

        <div className={cn('mt-10 lg:mt-14', twoCols && 'grid gap-12 lg:grid-cols-12 lg:items-end lg:gap-12')}>
          <div className={cn(twoCols && 'lg:col-span-6')}>
            {label && <p className="eyebrow enter mb-6">{label}</p>}
            <h1 className="t-h1 enter d1 max-w-[18ch] text-balance">{title}</h1>
            {intro && <p className="t-lead enter d2 mt-6 max-w-[52ch] text-ink/70">{intro}</p>}
            {meta && <div className="enter d3 mt-8">{meta}</div>}
          </div>

          {image ? (
            <figure className="lg:col-span-6">
              <div className="enter-mask aspect-[4/3] overflow-hidden rounded-img bg-stone lg:aspect-[5/4]">
                <img
                  {...imageAttrs(image.src, '(min-width: 1024px) 46vw, 100vw', image.w)}
                  alt={image.alt}
                  width={image.w}
                  height={image.h}
                  fetchpriority="high"
                  decoding="async"
                  style={image.position ? { objectPosition: image.position } : undefined}
                  className="photo h-full w-full object-cover"
                />
              </div>
              {image.caption && <figcaption className="mt-3 text-[12px] text-ink/65">{image.caption}</figcaption>}
            </figure>
          ) : (
            aside && <div className="enter d3 lg:col-span-5 lg:col-start-8">{aside}</div>
          )}
        </div>
      </Container>
    </header>
  );
}
