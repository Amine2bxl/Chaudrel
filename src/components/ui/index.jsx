import { useId, useState } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { imageAttrs, SIZES as IMG_SIZES } from '@/lib/image';
import Reveal from '@/lib/reveal';

/* ============================================================
   Primitives — tout le site est composé de ces briques.
   ============================================================ */

export function Container({ className, children, as: Tag = 'div' }) {
  return <Tag className={cn('mx-auto w-full max-w-page px-5 sm:px-8 lg:px-12', className)}>{children}</Tag>;
}

/* Le site n'a plus qu'un sol. Les tons ne changent plus la couleur de fond —
   ils règlent la profondeur : `ground` est le sol, `surface` une surface posée
   dessus, `glow` une section que le halo vert traverse. Alterner des aplats
   clairs et sombres n'a plus de sens quand tout est sombre ; c'est la lumière
   qui sépare les sections, pas la teinte.

   Les noms clairs d'avant (`cream`, `white`, `shell`, `sand`) restent acceptés
   pour ne pas réécrire chaque page : ils pointent tous vers le sol. */
const TONES = {
  ground: 'bg-ground',
  surface: 'bg-surface',
  glow: 'bg-ground section-glow',

  cream: 'bg-ground',
  white: 'bg-surface',
  shell: 'bg-surface',
  sand: 'bg-surface',
  bark: 'bg-ground',
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
      className={cn('h-px w-full', tone === 'light' ? 'bg-cream/20' : 'bg-cream/15', className)}
    />
  );
}

export function Label({ children, tone = 'dark', className }) {
  return (
    <span className={cn('t-label', tone === 'light' ? 'text-cream/65' : 'text-cream/65', className)}>{children}</span>
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
export function SectionHeading({ title, text, tone = 'dark', align = 'stack', className, children }) {
  const light = tone === 'light';
  const split = align === 'split';

  return (
    <div className={cn(split && 'lg:grid lg:grid-cols-12 lg:gap-10', className)}>
      <Reveal className={cn(split && 'lg:col-span-7')}>
        {/* La largeur se pose sur le titre : `ch` se calcule sur la police de
            l'élément, pas sur celle du conteneur. */}
        <h2 className={cn('t-h2 max-w-[18ch] text-balance', light ? 'text-cream' : 'text-cream')}>{title}</h2>
      </Reveal>

      {(text || children) && (
        <Reveal
          delay={120}
          className={cn(
            'mt-5',
            split && 'lg:col-span-5 lg:mt-0 lg:self-end',
            light ? 'text-cream/60' : 'text-cream/65'
          )}
        >
          {text && <p className="t-lead measure">{text}</p>}
          {children}
        </Reveal>
      )}
    </div>
  );
}

/* ---------- Boutons ----------
   Règle de forme du site, tenue partout :
     · commandes (boutons, chips, pastilles) → pilule
     · médias et panneaux                    → 24 px
     · champs de saisie                      → 18 px

   Le crème est la couleur du site ; le graphite est celle des actions. Le brun
   ne sert qu'à signaler : page active, focus, repères. Une action primaire en
   brun ferait du brun la couleur dominante, ce qu'il n'est pas. */

/* L'action principale est cerclée, pas remplie.
   Sur un sol sombre, un aplat de laiton devient une tache : il attire l'œil
   mais écrase la photo derrière lui. Un filet de laiton sur du vide garde la
   même autorité en laissant passer le fond — c'est le geste de la référence,
   et c'est aussi le seul qui tienne posé sur une image de chantier.
   Le laiton clair donne 8,8:1 sur le sol : le libellé passe largement. */
const VARIANTS = {
  solid: 'border border-gold-light/60 text-gold-light hover:border-gold-light hover:bg-gold-light/10',
  solidLight: 'border border-gold-light/60 text-gold-light hover:border-gold-light hover:bg-gold-light/10',
  outline: 'border border-cream/20 text-cream hover:border-cream/45 hover:bg-cream/[0.06]',
  outlineLight: 'border border-cream/20 text-cream hover:border-cream/45 hover:bg-cream/[0.06]',
  /* Le seul aplat encore plein : réservé aux endroits où le laiton cerclé se
     poserait sur une surface déjà cernée — barre d'action mobile, page de
     liens. Du sol sur du laiton : 8,8:1. */
  fill: 'bg-gold-light text-ground hover:bg-gold-light/90',
};

const SIZES = {
  sm: 'px-5 py-3 text-[11px]',
  md: 'px-7 py-4 text-[11px]',
  lg: 'px-9 py-[1.15rem] text-[12px]',
};

/* Pastille de flèche logée dans la pilule. Elle donne la direction et se
   décale au survol. Décorative : le libellé dit déjà où l'on va. */
const ARROW_TONE = {
  solid: 'bg-gold-light/15 text-gold-light',
  solidLight: 'bg-gold-light/15 text-gold-light',
  outline: 'bg-cream/10 text-cream',
  outlineLight: 'bg-cream/10 text-cream',
  fill: 'bg-ground/15 text-ground',
};

function ArrowChip({ variant }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        '-mr-3 ml-1 grid h-7 w-7 flex-none place-items-center rounded-full',
        'transition-transform duration-300 ease-soft group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5',
        ARROW_TONE[variant]
      )}
    >
      <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M1.5 9.5 9.5 1.5M3.5 1.5h6v6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

export function Button({ to, href, variant = 'solid', size = 'md', arrow = false, className, children, ...rest }) {
  const classes = cn(
    'group/btn inline-flex items-center justify-center gap-2.5 whitespace-nowrap rounded-full font-semibold uppercase tracking-[0.14em]',
    'transition-[background-color,box-shadow,transform,border-color] duration-300 ease-soft',
    'active:translate-y-px',
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

/** Lien texte avec soulignement qui se déploie au survol. */
export function TextLink({ to, href, className, children, tone = 'dark', ...rest }) {
  const classes = cn(
    'link-line tap t-label inline-block pb-1',
    tone === 'light' ? 'text-cream' : 'text-cream',
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
export function Media({
  src,
  alt,
  ratio = 'aspect-[4/5]',
  className,
  imgClassName,
  priority = false,
  reveal = true,
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

  const shell = cn('overflow-hidden rounded-lg bg-raised', ratio, className);

  if (!reveal) return <div className={shell}>{img}</div>;

  return (
    <Reveal from="veil" className={shell}>
      {img}
    </Reveal>
  );
}

/**
 * Surface surélevée : coquille claire, arrondi de 24 px, ombre teintée.
 * À n'utiliser que lorsque le contenu est réellement détaché de la page —
 * un formulaire, un encart de contact. Une liste n'a pas besoin de boîte.
 */
export function Panel({ className, children, as: Tag = 'div', ...rest }) {
  return (
    <Tag className={cn('rounded-lg border border-cream/[0.07] bg-surface shadow-soft', className)} {...rest}>
      {children}
    </Tag>
  );
}

/**
 * Repli — un intitulé, un chevron qui pivote, du contenu qui se déploie.
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
    <div className={cn('overflow-hidden rounded-lg border border-cream/[0.09] bg-surface', className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={contentId}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors duration-fast hover:bg-cream/[0.05]"
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
          className={cn('flex-none text-cream/50 transition-transform duration-300 ease-soft', open && 'rotate-180')}
        >
          <path d="M2 5l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div id={contentId} className="border-t border-cream/[0.09] px-5 py-5">
          {children}
        </div>
      )}
    </div>
  );
}
