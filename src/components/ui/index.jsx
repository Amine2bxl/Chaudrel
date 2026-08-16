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
  white: 'bg-shell text-ink', // « white » historique : coquille, jamais blanc pur
  shell: 'bg-shell text-ink',
  sand: 'bg-sand text-ink',
  bark: 'bg-bark text-cream',
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
        <h2 className={cn('t-h2 max-w-[18ch] text-balance', light ? 'text-cream' : 'text-ink')}>{title}</h2>
      </Reveal>

      {(text || children) && (
        <Reveal
          delay={120}
          className={cn(
            'mt-5',
            split && 'lg:col-span-5 lg:mt-0 lg:self-end',
            light ? 'text-cream/60' : 'text-ink/65'
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

const VARIANTS = {
  solid: 'bg-ink text-cream shadow-soft hover:bg-bark hover:shadow-lift',
  solidLight: 'bg-cream text-ink shadow-soft hover:bg-shell hover:shadow-lift',
  outline: 'border border-ink/15 bg-shell/70 text-ink hover:border-ink/30 hover:bg-shell hover:shadow-soft',
  outlineLight: 'border border-cream/25 text-cream hover:border-cream/60 hover:bg-cream/10',
};

const SIZES = {
  sm: 'px-5 py-3 text-[11px]',
  md: 'px-7 py-4 text-[11px]',
  lg: 'px-9 py-[1.15rem] text-[12px]',
};

export function Button({ to, href, variant = 'solid', size = 'md', className, children, ...rest }) {
  const classes = cn(
    'inline-flex items-center justify-center gap-2.5 whitespace-nowrap rounded-full font-semibold uppercase tracking-[0.14em]',
    'transition-[background-color,box-shadow,transform,border-color] duration-300 ease-soft',
    'active:translate-y-px',
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

  const shell = cn('overflow-hidden rounded-lg bg-sand', ratio, className);

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
    <Tag className={cn('rounded-lg border border-ink/[0.07] bg-shell shadow-soft', className)} {...rest}>
      {children}
    </Tag>
  );
}
