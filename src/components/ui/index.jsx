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
  paper: 'bg-paper text-ink',
  white: 'bg-white text-ink',
  stone: 'bg-stone text-ink',
  carbon: 'bg-carbon text-paper',
};

export function Section({ id, tone = 'paper', className, children, ...rest }) {
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
      className={cn('h-px w-full', tone === 'light' ? 'bg-paper/20' : 'bg-ink/15', className)}
    />
  );
}

export function Label({ children, tone = 'dark', className }) {
  return (
    <span className={cn('t-label', tone === 'light' ? 'text-paper/65' : 'text-ink/65', className)}>{children}</span>
  );
}

/**
 * En-tête de section : un titre, et au besoin une phrase dessous.
 *
 * Deux règles tenues sur tout le site :
 * — pas de sur-titre par défaut. Un `label` se justifie une fois toutes les
 *   trois sections au maximum ; la place de la section dans la page suffit
 *   presque toujours à dire de quoi elle parle.
 * — le texte se met SOUS le titre, pas dans une colonne à droite. Le couple
 *   « gros titre à gauche / petit paragraphe à droite » est le tic de mise en
 *   page qui fait ressembler toutes les pages entre elles. `align="split"`
 *   reste disponible quand la colonne de droite porte autre chose qu'un
 *   paragraphe de remplissage.
 */
export function SectionHeading({ label, title, text, tone = 'dark', align = 'stack', className, children }) {
  const light = tone === 'light';
  const split = align === 'split';

  return (
    <div className={cn(split && 'lg:grid lg:grid-cols-12 lg:gap-10', className)}>
      <Reveal className={cn(split && 'lg:col-span-7')}>
        {label && (
          <div className="mb-5">
            <Label tone={tone}>{label}</Label>
          </div>
        )}
        {/* La largeur se pose sur le titre : `ch` se calcule sur la police de
            l'élément, pas sur celle du conteneur. */}
        <h2 className={cn('t-h2 max-w-[18ch] text-balance', light ? 'text-paper' : 'text-ink')}>{title}</h2>
      </Reveal>

      {(text || children) && (
        <Reveal
          delay={120}
          className={cn(
            'mt-5',
            split && 'lg:col-span-5 lg:mt-0 lg:self-end',
            light ? 'text-paper/60' : 'text-ink/65'
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
  solid: 'bg-ink text-paper hover:bg-signal',
  solidLight: 'bg-paper text-ink hover:bg-signal hover:text-paper',
  outline: 'border border-ink/25 text-ink hover:border-ink hover:bg-ink hover:text-paper',
  outlineLight: 'border border-paper/30 text-paper hover:bg-paper hover:text-ink',
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
    tone === 'light' ? 'text-paper' : 'text-ink',
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
    return <div className={cn('overflow-hidden bg-stone', ratio, className)}>{img}</div>;
  }

  return (
    <Reveal from="veil" className={cn('overflow-hidden bg-stone', ratio, className)}>
      {img}
    </Reveal>
  );
}
