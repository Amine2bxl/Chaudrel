import { useId, useState } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { imageAttrs, SIZES as IMG_SIZES } from '@/lib/image';
import Reveal from '@/lib/reveal';

/* ============================================================
   Primitives V6 - tout le site est composé de ces briques.
   Voir docs/DESIGN-SYSTEM.md pour les règles d'usage.
   ============================================================ */

export function Container({ className, children, as: Tag = 'div', ...rest }) {
  return (
    <Tag className={cn('mx-auto w-full max-w-page px-gutter', className)} {...rest}>
      {children}
    </Tag>
  );
}

const TONES = {
  ivory: 'bg-ivory text-ink',
  paper: 'bg-paper text-ink',
  stone: 'bg-stone text-ink',
  graphite: 'bg-graphite text-ivory on-dark',
  charcoal: 'bg-charcoal text-ivory on-dark',
};

export function Section({ id, tone = 'ivory', className, children, ...rest }) {
  return (
    <section id={id} className={cn('py-section', TONES[tone], className)} {...rest}>
      {children}
    </section>
  );
}

/**
 * Grand panneau sombre, coins arrondis, posé dans la page avec une marge
 * latérale : le geste des réalisations, de l'appel final et du pied de page.
 */
export function DarkPanel({ as: Tag = 'div', className, children, ...rest }) {
  return (
    <Tag
      className={cn('on-dark mx-auto max-w-[1440px] rounded-panel bg-graphite text-ivory', className)}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/** Filet horizontal qui se dessine à l'apparition. */
export function Rule({ tone = 'dark', className, delay = 0 }) {
  return (
    <Reveal
      from="line"
      delay={delay}
      className={cn('h-px w-full', tone === 'light' ? 'bg-ivory/15' : 'bg-ink/12', className)}
    />
  );
}

export function Label({ children, tone = 'dark', className, as: Tag = 'span' }) {
  return (
    <Tag className={cn('t-label', tone === 'light' ? 'text-ivory/60' : 'text-ink/65', className)}>{children}</Tag>
  );
}

/** Repère de section : un filet d'or et deux ou trois mots. */
export function Eyebrow({ children, tone = 'dark', className, as: Tag = 'p' }) {
  return <Tag className={cn('eyebrow', tone === 'light' && 'eyebrow-light', className)}>{children}</Tag>;
}

/**
 * En-tête de section. `label` : repère au-dessus du titre. `align="split"` :
 * titre à gauche, texte et action à droite (bureau seulement).
 * Un mot du titre peut être mis en valeur avec <em> : italique et or.
 */
export function SectionHeading({
  label,
  title,
  text,
  tone = 'dark',
  align = 'stack',
  as: Heading = 'h2',
  className,
  titleClassName,
  children,
}) {
  const light = tone === 'light';
  const split = align === 'split';
  return (
    <div className={cn(split && 'lg:grid lg:grid-cols-12 lg:items-end lg:gap-12', className)}>
      <Reveal className={cn(split && 'lg:col-span-7')}>
        {label && (
          <Eyebrow tone={tone} className="mb-5">
            {label}
          </Eyebrow>
        )}
        <Heading
          className={cn('t-h2 max-w-[22ch] text-balance', light ? 'text-ivory' : 'text-ink', titleClassName)}
        >
          {title}
        </Heading>
      </Reveal>
      {(text || children) && (
        <Reveal
          delay={100}
          className={cn('mt-5', split && 'lg:col-span-5 lg:mt-0', light ? 'text-ivory/70' : 'text-ink/70')}
        >
          {text && <p className="t-lead measure">{text}</p>}
          {children}
        </Reveal>
      )}
    </div>
  );
}

/* ---------- Boutons ----------
   Pilules, en bas de casse, Manrope semi-gras. Le graphite est la couleur
   des actions sur fond clair ; l'or champagne celle de l'action principale
   sur fond sombre. */
const VARIANTS = {
  solid: 'bg-graphite text-ivory hover:bg-charcoal',
  gold: 'bg-gold text-graphite hover:bg-gold-light',
  light: 'bg-ivory text-graphite hover:bg-paper',
  outline: 'border border-ink/20 text-ink hover:border-ink/60',
  outlineLight: 'border border-ivory/25 text-ivory hover:border-ivory/70',
};

const SIZES = {
  sm: 'h-10 px-5 text-[13px]',
  md: 'h-12 px-6 text-[13.5px]',
  lg: 'h-14 px-7 text-[14px]',
};

const ARROW_TONE = {
  solid: 'bg-ivory/12 text-ivory',
  gold: 'bg-graphite/10 text-graphite',
  light: 'bg-graphite/[0.07] text-graphite',
  outline: 'bg-ink/[0.06] text-ink',
  outlineLight: 'bg-ivory/10 text-ivory',
};

export function Arrow({ className, size = 11 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 11 11"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className={className}
    >
      <path d="M1.5 9.5 9.5 1.5M3.5 1.5h6v6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowChip({ variant }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        '-mr-3 ml-1 grid h-8 w-8 flex-none place-items-center rounded-full',
        'transition-transform duration-slow ease-soft group-hover/btn:rotate-45',
        ARROW_TONE[variant]
      )}
    >
      <Arrow />
    </span>
  );
}

export function Button({ to, href, variant = 'solid', size = 'md', arrow = false, className, children, ...rest }) {
  const classes = cn(
    'group/btn inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold tracking-[0.005em]',
    'transition-[background-color,border-color,color,transform] duration-300 ease-soft active:scale-[0.98]',
    VARIANTS[variant],
    SIZES[size],
    className
  );
  const content = (
    <>
      {children}
      {arrow && <ArrowChip variant={variant} />}
    </>
  );
  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {content}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} className={classes} {...rest}>
        {content}
      </a>
    );
  }
  return (
    <button type="button" className={classes} {...rest}>
      {content}
    </button>
  );
}

/** Bouton rond à flèche : l'action d'une carte. Décoratif si la carte est un lien. */
export function RoundArrow({ tone = 'dark', className }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'grid h-11 w-11 flex-none place-items-center rounded-full border transition-[background-color,border-color,color,transform] duration-slow ease-soft',
        tone === 'light'
          ? 'border-ivory/25 text-ivory group-hover:border-gold group-hover:bg-gold group-hover:text-graphite'
          : 'border-ink/20 text-ink group-hover:border-graphite group-hover:bg-graphite group-hover:text-ivory',
        'group-hover:rotate-45',
        className
      )}
    >
      <Arrow size={12} />
    </span>
  );
}

/** Lien texte avec flèche, souligné qui se déploie au survol. */
export function TextLink({ to, href, className, children, tone = 'dark', ...rest }) {
  const classes = cn(
    'link-line tap group inline-flex items-center gap-2 pb-0.5 text-[13.5px] font-semibold',
    tone === 'light' ? 'text-ivory' : 'text-ink',
    className
  );
  const arrow = (
    <Arrow className="flex-none transition-transform duration-fast ease-soft group-hover:rotate-45" />
  );
  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {children}
        {arrow}
      </Link>
    );
  }
  return (
    <a href={href} className={classes} {...rest}>
      {children}
      {arrow}
    </a>
  );
}

/** Étiquette en pilule : nature des travaux, statut. */
export function Tag({ children, tone = 'dark', className }) {
  return (
    <span
      className={cn(
        'inline-flex h-7 items-center rounded-full border px-3 text-[11.5px] font-medium',
        tone === 'light' ? 'border-ivory/20 text-ivory/80' : 'border-ink/15 text-ink/75',
        className
      )}
    >
      {children}
    </span>
  );
}

/**
 * Photographie au ratio contrôlé, révélée par un volet au défilement.
 * `drift` : légère parallaxe pilotée par le défilement (CSS seul).
 */
export function Media({
  src,
  alt,
  ratio = 'aspect-[4/5]',
  className,
  imgClassName,
  priority = false,
  reveal = true,
  drift = false,
  zoom = false,
  sizes = IMG_SIZES.half,
  width = 1200,
  height = 900,
  position,
}) {
  const img = (
    <img
      {...imageAttrs(src, sizes, width)}
      alt={alt}
      width={width}
      height={height}
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? 'sync' : 'async'}
      fetchpriority={priority ? 'high' : undefined}
      style={position ? { objectPosition: position } : undefined}
      className={cn('photo h-full w-full object-cover', imgClassName)}
    />
  );
  const frame = cn('relative overflow-hidden rounded-img bg-stone', drift && 'drift', zoom && 'zoom-media');
  if (!reveal) return <div className={cn(frame, ratio, className)}>{img}</div>;
  return (
    <Reveal from="veil" className={cn(ratio, className)}>
      <div className={cn(frame, 'h-full w-full')}>{img}</div>
    </Reveal>
  );
}

/** Surface claire surélevée : formulaire, encart. */
export function Panel({ className, children, as: Tag = 'div', ...rest }) {
  return (
    <Tag className={cn('rounded-lg border border-ink/[0.08] bg-paper', className)} {...rest}>
      {children}
    </Tag>
  );
}

/** Repli : un intitulé, un signe plus qui pivote, du contenu qui se déploie. */
export function Disclosure({ title, defaultOpen = false, className, children }) {
  const [open, setOpen] = useState(defaultOpen);
  const contentId = useId();
  return (
    <div className={cn('border-b border-ink/12', className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={contentId}
        className="flex w-full items-center justify-between gap-4 py-5 text-left"
      >
        <span className="t-h4">{title}</span>
        <PlusIcon open={open} />
      </button>
      {open && (
        <div id={contentId} className="faq-a pb-6">
          {children}
        </div>
      )}
    </div>
  );
}

export function PlusIcon({ open, tone = 'dark' }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'grid h-9 w-9 flex-none place-items-center rounded-full border transition-[transform,background-color,border-color] duration-300 ease-soft',
        tone === 'light' ? 'border-ivory/25' : 'border-ink/15',
        open && 'rotate-45',
        open && (tone === 'light' ? 'border-gold bg-gold text-graphite' : 'border-graphite bg-graphite text-ivory')
      )}
    >
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.4">
        <path d="M6 1v10M1 6h10" strokeLinecap="round" />
      </svg>
    </span>
  );
}
