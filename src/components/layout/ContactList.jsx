import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

/**
 * Les rangées de la carte de liens - partagées entre la page `/liens` et la
 * fenêtre de contact. Une seule source, pour que les deux gardent exactement
 * le même design.
 */

/** Une rangée : icône dans sa pastille, libellé, description, chevron. */
export function Row({ to, href, icon: Icon, label, hint, onClick, primary = false, className }) {
  const inner = (
    <>
      <span
        aria-hidden="true"
        className={cn(
          'grid h-11 w-11 flex-none place-items-center rounded-full transition-colors duration-fast',
          primary ? 'bg-cream/20 text-cream' : 'bg-ink/[0.06] text-ink group-hover:bg-ink/10'
        )}
      >
        <Icon width="17" height="17" />
      </span>

      <span className="min-w-0 flex-1">
        <span className={cn('block t-label', primary ? 'text-cream' : 'text-ink')}>{label}</span>
        {hint && (
          <span className={cn('mt-1 block t-small', primary ? 'text-cream/90' : 'text-ink/55')}>{hint}</span>
        )}
      </span>

      <svg
        width="13"
        height="13"
        viewBox="0 0 16 16"
        aria-hidden="true"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        className={cn(
          'flex-none transition-transform duration-fast ease-soft group-hover:translate-x-0.5',
          primary ? 'text-cream/70' : 'text-ink/35'
        )}
      >
        <path d="m6 2 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </>
  );

  const classes = cn(
    'group flex w-full items-center gap-4 rounded-lg px-4 py-4 text-left transition-all duration-fast ease-soft active:translate-y-px sm:px-5',
    primary
      ? 'bg-gold-deep text-cream shadow-soft hover:bg-gold-hover hover:shadow-lift'
      : 'border border-ink/[0.09] bg-shell hover:border-ink/20 hover:shadow-soft',
    className
  );

  if (to) {
    return (
      <Link to={to} onClick={onClick} className={classes}>
        {inner}
      </Link>
    );
  }
  return (
    <a
      href={href}
      target={href?.startsWith('http') ? '_blank' : undefined}
      rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
      onClick={onClick}
      className={classes}
    >
      {inner}
    </a>
  );
}

/** Intertitre de groupe : un mot, un filet. */
export function GroupLabel({ children }) {
  return (
    <div className="mb-4 mt-9 flex items-center gap-4 first:mt-0">
      <span className="t-label flex-none text-ink/65">{children}</span>
      <span aria-hidden="true" className="h-px flex-1 bg-ink/10" />
    </div>
  );
}