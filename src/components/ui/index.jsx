import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import Reveal from '@/lib/reveal';

/* ---------------- Layout ---------------- */

export function Container({ className, children, as: Tag = 'div' }) {
  return <Tag className={cn('mx-auto w-full max-w-[1360px] px-5 lg:px-10', className)}>{children}</Tag>;
}

export function Section({ id, className, tone = 'cream', children, ...rest }) {
  const tones = {
    cream: 'bg-brand-cream text-brand-ink',
    white: 'bg-white text-brand-ink',
    sand: 'bg-brand-sand text-brand-ink',
    dark: 'bg-brand-dark text-white',
  };
  return (
    <section id={id} className={cn('py-16 md:py-24 lg:py-32', tones[tone], className)} {...rest}>
      {children}
    </section>
  );
}

/* ---------------- Typographie ---------------- */

export function Eyebrow({ children, className }) {
  return <p className={cn('eyebrow mb-4', className)}>{children}</p>;
}

export function SectionHeading({ eyebrow, title, accent, intro, align = 'left', tone = 'light', className }) {
  const dark = tone === 'dark';
  return (
    <Reveal
      className={cn(
        'max-w-2xl',
        align === 'center' && 'mx-auto text-center',
        className
      )}
    >
      {eyebrow && <Eyebrow className={dark ? 'text-brand-goldLight' : undefined}>{eyebrow}</Eyebrow>}
      <h2
        className={cn(
          'h-display text-[2rem] sm:text-4xl lg:text-5xl',
          dark ? 'text-white' : 'text-brand-ink'
        )}
      >
        {title}
        {accent && (
          <>
            <br />
            <span className={cn('italic', dark ? 'text-brand-goldLight' : 'text-brand-gold')}>{accent}</span>
          </>
        )}
      </h2>
      {intro && (
        <p
          className={cn(
            'mt-5 text-[15px] font-light leading-[1.85]',
            dark ? 'text-white/55' : 'text-brand-ink/60'
          )}
        >
          {intro}
        </p>
      )}
    </Reveal>
  );
}

/* ---------------- Boutons ---------------- */

const BUTTON_VARIANTS = {
  primary: 'bg-brand-ink text-white hover:bg-brand-gold',
  gold: 'bg-brand-gold text-white hover:bg-brand-ink',
  outline: 'border border-brand-ink/20 text-brand-ink hover:border-brand-ink hover:bg-brand-ink hover:text-white',
  ghostLight: 'border border-white/30 text-white hover:bg-white hover:text-brand-ink',
};

const BUTTON_SIZES = {
  sm: 'px-5 py-2.5 text-[12px]',
  md: 'px-7 py-3.5 text-[13px]',
  lg: 'px-8 py-4 text-[13px]',
};

export function Button({
  to,
  href,
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...rest
}) {
  const cls = cn(
    'inline-flex items-center justify-center gap-2 rounded-full font-semibold uppercase tracking-[0.1em] transition-all duration-300',
    BUTTON_VARIANTS[variant],
    BUTTON_SIZES[size],
    className
  );

  if (to) {
    return (
      <Link to={to} className={cls} {...rest}>
        {children}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} className={cls} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <button type="button" className={cls} {...rest}>
      {children}
    </button>
  );
}

/* ---------------- Divers ---------------- */

export function Pill({ children, className }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border border-brand-ink/10 bg-white/80 px-3 py-1 text-[11px] font-medium tracking-wide text-brand-ink/70',
        className
      )}
    >
      {children}
    </span>
  );
}

export function Figure({ src, alt, className, imgClassName, aspect = 'aspect-[4/5]', priority = false, sizes }) {
  return (
    <div className={cn('overflow-hidden bg-brand-sand', aspect, className)}>
      <img
        src={src}
        alt={alt}
        sizes={sizes}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        fetchpriority={priority ? 'high' : undefined}
        className={cn('h-full w-full object-cover', imgClassName)}
      />
    </div>
  );
}
