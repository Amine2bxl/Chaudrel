import { Link } from 'react-router-dom';
import { Container, TextLink } from '@/components/ui';
import Reveal from '@/lib/reveal';
import { imageAttrs } from '@/lib/image';
import { cn } from '@/lib/utils';

/**
 * Une chose à la fois, en grand, sur trois mises en page qui tournent :
 *   1. « split » : grande photo d'un côté, texte de l'autre ;
 *   2. « duo »   : photo en hauteur et, s'il y en a une, une seconde photo
 *                  posée en décalé sur son coin ;
 *   3. « wide »  : photo panoramique pleine largeur, texte sur deux colonnes.
 * À chaque tour, les côtés s'inversent : jamais deux rangées identiques.
 *
 * `items` : { key, to, image: { src, w, h }, image2?, title, meta?, text, extra?, cta, onClick? }
 */
const KINDS = ['split', 'duo', 'wide'];

function Photo({ it, sizes, eager, className }) {
  return (
    <Link to={it.to} onClick={it.onClick} tabIndex={-1} aria-hidden="true" className={cn('group block', className)}>
      <img
        {...imageAttrs(it.src, sizes)}
        alt=""
        width={it.w}
        height={it.h}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        className="h-full w-full object-cover transition-transform duration-700 ease-soft group-hover:scale-[1.03]"
      />
    </Link>
  );
}

function Text({ it, className }) {
  return (
    <Reveal delay={100} className={className}>
      {it.title && <h2 className="t-h2 max-w-[16ch] text-balance">{it.title}</h2>}
      {it.meta && <p className="t-small mt-3 text-gold-light">{it.meta}</p>}
      {it.text && <p className={cn('t-body measure text-ink/75', it.title && 'mt-5')}>{it.text}</p>}
      {it.extra}
      {it.cta && (
        <TextLink to={it.to} onClick={it.onClick} className="mt-7">
          {it.cta}
        </TextLink>
      )}
    </Reveal>
  );
}

export default function Zigzag({ items = [] }) {
  return (
    <section className="py-section">
      <Container className="space-y-24 lg:space-y-36">
        {items.map((it, i) => {
          const kind = KINDS[i % 3];
          const flip = Math.floor(i / 3) % 2 === 1;
          const photo = { ...it.image, to: it.to, onClick: it.onClick };

          if (kind === 'wide') {
            return (
              <article key={it.key}>
                <Reveal from="veil" className="overflow-hidden rounded-[28px] bg-sand">
                  <Photo it={photo} sizes="100vw" eager={i === 0} className="aspect-[4/3] sm:aspect-[16/9] lg:aspect-[21/9]" />
                </Reveal>
                <div className="mt-10 grid gap-8 lg:grid-cols-12 lg:gap-16">
                  <Text it={{ title: it.title, meta: it.meta }} className="lg:col-span-5" />
                  <Text it={{ ...it, title: null, meta: null }} className="lg:col-span-7" />
                </div>
              </article>
            );
          }

          if (kind === 'duo') {
            const second = it.image2 && { ...it.image2, to: it.to, onClick: it.onClick };
            return (
              <article key={it.key} className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
                <div className={cn('relative lg:col-span-6', !flip && 'lg:order-last', second && 'pb-[14%]')}>
                  <Reveal
                    from="veil"
                    className={cn('overflow-hidden rounded-[28px] bg-sand', second ? 'w-[78%]' : 'w-full', second && !flip && 'ml-auto')}
                  >
                    <Photo it={photo} sizes="(min-width: 1024px) 40vw, 80vw" eager={i === 0} className="aspect-[4/5]" />
                  </Reveal>
                  {second && (
                    <Reveal
                      from="veil"
                      delay={140}
                      className={cn(
                        'absolute bottom-0 w-[48%] overflow-hidden rounded-[22px] bg-sand ring-[6px] ring-cream',
                        flip ? 'right-0' : 'left-0'
                      )}
                    >
                      <Photo it={second} sizes="(min-width: 1024px) 24vw, 48vw" className="aspect-square" />
                    </Reveal>
                  )}
                </div>
                <Text it={it} className="lg:col-span-6" />
              </article>
            );
          }

          return (
            <article key={it.key} className="grid items-center gap-8 lg:grid-cols-12 lg:gap-16">
              <Reveal from="veil" className={cn('overflow-hidden rounded-[28px] bg-sand lg:col-span-7', flip && 'lg:order-last')}>
                <Photo it={photo} sizes="(min-width: 1024px) 56vw, 100vw" eager={i === 0} className="aspect-[4/3]" />
              </Reveal>
              <Text it={it} className="lg:col-span-5" />
            </article>
          );
        })}
      </Container>
    </section>
  );
}
