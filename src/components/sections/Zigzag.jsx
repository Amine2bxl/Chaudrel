import { Link } from 'react-router-dom';
import { Container, TextLink } from '@/components/ui';
import Reveal from '@/lib/reveal';
import { imageAttrs } from '@/lib/image';
import { cn } from '@/lib/utils';

/**
 * Rangées en zigzag : une grande photo d'un côté, le titre et le texte de
 * l'autre, puis l'inverse à la rangée suivante. Pour les pages qui
 * présentent une liste (métiers, chantiers) : une chose à la fois, en grand.
 *
 * `items` : { key, to, image: { src, alt, w, h }, title, meta?, text, extra?, cta, onClick? }
 */
export default function Zigzag({ items = [] }) {
  return (
    <section className="py-section">
      <Container className="space-y-20 lg:space-y-28">
        {items.map((it, i) => (
          <article key={it.key} className="grid items-center gap-8 lg:grid-cols-12 lg:gap-16">
            <Reveal from="veil" className={cn('overflow-hidden rounded-[28px] bg-sand lg:col-span-7', i % 2 === 1 && 'lg:order-last')}>
              <Link to={it.to} onClick={it.onClick} tabIndex={-1} aria-hidden="true" className="group block">
                <img
                  {...imageAttrs(it.image.src, '(min-width: 1024px) 56vw, 100vw')}
                  alt=""
                  width={it.image.w}
                  height={it.image.h}
                  loading={i === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                  className="aspect-[4/3] h-full w-full object-cover transition-transform duration-700 ease-soft group-hover:scale-[1.03]"
                />
              </Link>
            </Reveal>
            <Reveal delay={100} className="lg:col-span-5">
              <h2 className="t-h2 max-w-[16ch] text-balance">{it.title}</h2>
              {it.meta && <p className="t-small mt-3 text-gold-light">{it.meta}</p>}
              <p className="t-body measure mt-5 text-ink/75">{it.text}</p>
              {it.extra}
              <TextLink to={it.to} onClick={it.onClick} className="mt-7">
                {it.cta}
              </TextLink>
            </Reveal>
          </article>
        ))}
      </Container>
    </section>
  );
}
