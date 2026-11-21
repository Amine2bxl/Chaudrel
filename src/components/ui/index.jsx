import { useId, useState } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { imageAttrs, SIZES as IMG_SIZES } from '@/lib/image';
import Reveal from '@/lib/reveal';
import usePointerGlow from '@/lib/usePointerGlow';

/* ============================================================
   Primitives - tout le site est composé de ces briques.
   ============================================================ */

export function Container({ className, children, as: Tag = 'div' }) {
  return <Tag className={cn('mx-auto w-full max-w-page px-5 sm:px-8 lg:px-12', className)}>{children}</Tag>;
}

const TONES = {
  cream: 'bg-cream text-ink',
  white: 'bg-shell text-ink', // « white » historique : coquille, jamais blanc pur
  shell: 'bg-shell text-ink',
  sand: 'bg-sand text-ink',
  // `on-dark` déclenche la compensation typographique du texte clair.
  bark: 'bg-bark text-cream on-dark',
  night: 'bg-bark text-cream on-dark',
};

export function Section({ id, tone = 'cream', className, children, ...rest }) {
  return (
    <section id={id} className={cn('py-section', TONES[tone], className)} {...rest}>
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
    <span className={cn('t-label', tone === 'light' ? 'text-cream/65' : 'text-ink/65', className)}>{children}</span>
  );
}

/**
 * En-tête de section : le titre seul. Pas de phrase dessous, pas de sur-titre :
 * la section se lit à son titre et à ce qu'elle montre. `children` se pose en
 * regard (un lien, une commande), jamais un paragraphe.
 */
export function SectionHeading({ title, tone = 'dark', className, children }) {
  return (
    <div className={cn('flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between', className)}>
      <Reveal>
        {/* La largeur se pose sur le titre : `ch` se calcule sur sa police. */}
        <h2 className={cn('t-h2 max-w-[18ch] text-balance', tone === 'light' ? 'text-cream' : 'text-ink')}>{title}</h2>
      </Reveal>
      {children}
    </div>
  );
}

/* ---------- Boutons ----------
   Commandes en pilule, libellé en casse normale. L'action de la marque - le
   devis - porte le bronze de la porte du logo, libellé en noir chaud (5,0:1).
   Au clic, le bouton s'enfonce légèrement (scale 0.97) : la pression se
   voit sans attendre la page suivante. */

const VARIANTS = {
  // Libellé en `bark` : foncé dans tous les contextes (5,6:1 sur le bronze).
  solid: 'btn-bronze',
  solidLight: 'bg-cream text-ink shadow-soft hover:bg-shell hover:shadow-lift',
  outline: 'btn-glass',
  outlineLight: 'btn-glass',
};

const SIZES = {
  sm: 'h-10 px-5 text-[14px]',
  md: 'h-12 px-6 text-[15px]',
  lg: 'h-14 px-7 text-[15px]',
};

/* Pastille de flèche logée dans la pilule : elle donne la direction et
   glisse au survol. Décorative - le libellé dit déjà où l'on va. */
const ARROW_TONE = {
  solid: 'bg-white/15 text-[#fffdf8]',
  solidLight: 'bg-ink/[0.08] text-ink',
  outline: 'bg-white/10 text-[#eae0d3]',
  outlineLight: 'bg-white/10 text-[#eae0d3]',
};

function ArrowChip({ variant }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        '-mr-3 ml-1 grid h-8 w-8 flex-none place-items-center rounded-full',
        'transition-transform duration-300 ease-soft group-hover/btn:translate-x-0.5',
        ARROW_TONE[variant]
      )}
    >
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M1.5 6h9M7 2.5 10.5 6 7 9.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

export function Button({ to, href, variant = 'solid', size = 'md', arrow = false, className, children, ...rest }) {
  const classes = cn(
    'group/btn inline-flex items-center justify-center gap-2.5 whitespace-nowrap rounded-full font-medium tracking-[-0.005em]',
    'transition-[background-color,box-shadow,transform,border-color] duration-200 ease-soft',
    'active:scale-[0.97]',
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

/** Lien texte avec soulignement qui se déploie au survol. La flèche est
    toujours là : un lien discreet doit quand même dire qu'il mène quelque
    part, et elle se décale au survol. */
export function TextLink({ to, href, className, children, tone = 'dark', ...rest }) {
  const classes = cn(
    'link-line tap group t-label inline-flex items-center gap-1.5 pb-1',
    tone === 'light' ? 'text-cream' : 'text-ink',
    className
  );

  const arrow = (
    <svg
      width="11"
      height="11"
      viewBox="0 0 11 11"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="flex-none transition-transform duration-fast ease-soft group-hover:translate-x-0.5"
    >
      <path d="M1 5.5h9M6.5 2 10 5.5 6.5 9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
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

/** Image au ratio contrôlé, révélée par un volet au scroll. */
export function Media({
  src,
  alt,
  ratio = 'aspect-[4/5]',
  className,
  imgClassName,
  priority = false,
  reveal = true,
  revealFrom = 'veil',
  sizes = IMG_SIZES.half,
  width = 1200,
  height = 900,
}) {
  const img = (
    <img
      {...imageAttrs(src, sizes)}
      alt={alt}
      // Dimensions déclarées : le navigateur réserve la place avant que la
      // photo arrive. Sans elles, le texte qui suit saute au chargement.
      // Le cadre impose déjà son rapport ; ces valeurs ne servent qu'au calcul.
      width={width}
      height={height}
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? 'sync' : 'async'}
      fetchpriority={priority ? 'high' : undefined}
      className={cn('h-full w-full object-cover', imgClassName)}
    />
  );

  const shell = cn('overflow-hidden rounded-lg bg-sand', ratio, className);

  if (!reveal) return <div className={shell}>{img}</div>;

  return (
    <Reveal from={revealFrom ?? 'veil'} className={shell}>
      {img}
    </Reveal>
  );
}

/**
 * Carte de verre - celle de la page de liens, reprise par chaque section du
 * site : un seul matériau pour tout le corps des pages. Le reflet suit le
 * pointeur. `glass` : vrai verre dépoli (flou d'arrière-plan), à poser sur une
 * photo (voir `Scene`). `pad` et `radius` se remplacent en entier (pas de fusion de
 * classes ici). Pas de flou d'arrière-plan : derrière, il n'y a qu'un dégradé, le
 * flou ne s'y verrait pas et coûterait à chaque image du défilement.
 */
export function Panel({ pad = 'p-5 sm:p-8', radius = 'rounded-[28px]', glass = false, className, children, as: Tag = 'div', ...rest }) {
  const glow = usePointerGlow();
  return (
    <Tag
      {...glow}
      className={cn(
        glass ? 'glass-dark' : 'glass-light [-webkit-backdrop-filter:none] [backdrop-filter:none]',
        pad,
        radius,
        className
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/**
 * Repli - un intitulé, un chevron qui pivote, du contenu qui se déploie.
 *
 * Motif repris du `StreakCard` de 21st.dev, réécrit dans notre système : le
 * composant d'origine dépendait de shadcn et d'un `StreakCalendar` absent, et
 * apportait ses propres jetons (`bg-card`, `text-primary`) en parallèle des
 * nôtres. Seule la mécanique était utile.
 *
 * `aria-expanded` + `aria-controls` : un lecteur d'écran annonce l'état et
 * trouve la zone pilotée.
 */
export function Disclosure({ title, defaultOpen = false, className, children }) {
  const [open, setOpen] = useState(defaultOpen);
  const contentId = useId();

  return (
    <div className={cn('overflow-hidden rounded-lg border border-ink/[0.09] bg-shell', className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={contentId}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors duration-fast hover:bg-cream/60"
      >
        <span className="t-h3">{title}</span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          aria-hidden="true"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          className={cn('flex-none text-ink/70 transition-transform duration-300 ease-soft', open && 'rotate-180')}
        >
          <path d="M2 5l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div id={contentId} className="border-t border-ink/[0.09] px-5 py-5">
          {children}
        </div>
      )}
    </div>
  );
}

/**
 * Scène : une section posée sur une photo voilée de sombre. Les panneaux
 * `glass` qu'elle contient floutent réellement la photo : c'est là, et
 * seulement là, que le verre a quelque chose à montrer.
 */
export function Scene({ image, veil = 'bg-[#110F0D]/75', className, children, ...rest }) {
  return (
    <section className={cn('relative isolate overflow-hidden py-section', className)} {...rest}>
      {image && (
        <img
          {...imageAttrs(image, IMG_SIZES.full)}
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          className="absolute inset-0 -z-20 h-full w-full object-cover"
        />
      )}
      <div aria-hidden="true" className={cn('absolute inset-0 -z-10', veil)} />
      {children}
    </section>
  );
}
