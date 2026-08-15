import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import Reveal from '@/lib/reveal';

/* ============================================================
   Primitives — tout le site est composé de ces briques.
   ============================================================ */

export function Container({ className, children, as: Tag = 'div' }) {
  return <Tag className={cn('mx-auto w-full max-w-page px-5 sm:px-8 lg:px-12', className)}>{children}</Tag>;
}

const TONES = {
  cream: 'bg-cream text-ink',
  white: 'bg-white text-ink',
  sand: 'bg-sand text-ink',
  night: 'bg-night text-cream',
};

export function Section({ id, tone = 'cream', className, children, ...rest }) {
  return (
    <section id={id} className={cn('py-20 md:py-28 lg:py-36', TONES[tone], className)} {...rest}>
      {children}
    </section>
  );
}

/** Filet horizontal qui se dessine à l'apparition. */
export function Rule({ tone = 'dark', className, delay = 0 }) {
  return (
    <Reveal
      from="line"
      delay={delay}
      className={cn('h-px w-full', tone === 'light' ? 'bg-cream/20' : 'bg-ink/15', className)}
    />
  );
}

export function Label({ children, tone = 'dark', className }) {
  return (
    <span className={cn('t-label', tone === 'light' ? 'text-cream/45' : 'text-ink/40', className)}>{children}</span>
  );
}

/**
 * En-tête de section éditorial : un label, un titre, et — au besoin — un texte
 * court placé en regard. Le titre reste court : le texte long va à droite.
 */
export function SectionHeading({ label, title, text, tone = 'dark', align = 'split', className, children }) {
  const light = tone === 'light';

  return (
    <div className={cn(align === 'split' && 'lg:grid lg:grid-cols-12 lg:gap-10', className)}>
      <Reveal className={cn(align === 'split' ? 'lg:col-span-7' : 'max-w-3xl')}>
        {label && (
          <div className="mb-6 flex items-center gap-4">
            <span className={cn('h-px w-8', light ? 'bg-gold' : 'bg-gold')} aria-hidden="true" />
            <Label tone={tone}>{label}</Label>
          </div>
        )}
        <h2 className={cn('t-h2', light ? 'text-cream' : 'text-ink')}>{title}</h2>
      </Reveal>

      {(text || children) && (
        <Reveal
          delay={120}
          className={cn(
            'mt-6 lg:mt-0',
            align === 'split' && 'lg:col-span-5 lg:self-end',
            light ? 'text-cream/60' : 'text-ink/60'
          )}
        >
          {text && <p className="t-body measure">{text}</p>}
          {children}
        </Reveal>
      )}
    </div>
  );
}

/* ---------- Boutons : deux variantes, rien de plus ---------- */

const VARIANTS = {
  solid: 'bg-ink text-cream hover:bg-gold',
  solidLight: 'bg-cream text-ink hover:bg-gold hover:text-cream',
  outline: 'border border-ink/25 text-ink hover:border-ink hover:bg-ink hover:text-cream',
  outlineLight: 'border border-cream/30 text-cream hover:bg-cream hover:text-ink',
};

const SIZES = {
  sm: 'px-5 py-2.5 text-[11px]',
  md: 'px-7 py-3.5 text-[11px]',
  lg: 'px-9 py-4 text-[12px]',
};

export function Button({ to, href, variant = 'solid', size = 'md', className, children, ...rest }) {
  const classes = cn(
    'inline-flex items-center justify-center gap-2.5 font-semibold uppercase tracking-[0.16em] transition-colors duration-300',
    VARIANTS[variant],
    SIZES[size],
    className
  );

  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {children}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} className={classes} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <button type="button" className={classes} {...rest}>
      {children}
    </button>
  );
}

/** Lien texte avec soulignement qui se déploie au survol. */
export function TextLink({ to, href, className, children, tone = 'dark', ...rest }) {
  const classes = cn(
    'link-line t-label inline-block pb-1',
    tone === 'light' ? 'text-cream' : 'text-ink',
    className
  );

  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} className={classes} {...rest}>
      {children}
    </a>
  );
}

/** Image au ratio contrôlé, révélée par un volet au scroll. */
export function Media({ src, alt, ratio = 'aspect-[4/5]', className, imgClassName, priority = false, reveal = true }) {
  const img = (
    <img
      src={src}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? 'sync' : 'async'}
      fetchpriority={priority ? 'high' : undefined}
      className={cn('h-full w-full object-cover', imgClassName)}
    />
  );

  if (!reveal) {
    return <div className={cn('overflow-hidden bg-sand', ratio, className)}>{img}</div>;
  }

  return (
    <Reveal from="veil" className={cn('overflow-hidden bg-sand', ratio, className)}>
      {img}
    </Reveal>
  );
}
