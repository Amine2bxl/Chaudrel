import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { BRAND } from '@/data/site';
import { EVENTS, track } from '@/lib/analytics';
import { PhoneIcon } from '@/components/ui/BrandIcons';

/**
 * Les rangées de la carte de liens - partagées par la page `/liens`, la
 * fenêtre de contact et chaque section du site. Une seule source, pour que
 * tout garde exactement le même dessin.
 */

/** L'icône dans sa pastille ronde ; `accent` la passe en bronze clair. */
export function Chip({ icon: Icon, primary = false, compact = false, accent = false }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'grid flex-none place-items-center rounded-full transition-colors duration-fast',
        compact ? 'h-10 w-10' : 'h-11 w-11',
        primary ? 'bg-white/15 text-white' : 'bg-ink/[0.06] group-hover:bg-ink/10',
        !primary && (accent ? 'text-gold-light' : 'text-ink')
      )}
    >
      <Icon width={compact ? 16 : 17} height={compact ? 16 : 17} />
    </span>
  );
}

/** Une rangée : pastille, libellé, description, chevron. Sans `to` ni `href`,
    la rangée est une simple ligne d'information (ni lien, ni chevron).
    `compact` la resserre pour les fenêtres. */
export function Row({ to, href, icon, label, hint, onClick, primary = false, compact = false, className }) {
  const linked = Boolean(to || href);
  const inner = (
    <>
      <Chip icon={icon} primary={primary} compact={compact} />

      <span className="min-w-0 flex-1">
        <span className={cn('block text-[15px] font-medium leading-snug', primary ? 'text-white' : 'text-ink')}>{label}</span>
        {hint && (
          <span className={cn('mt-0.5 block t-small', primary ? 'text-white/80' : 'text-ink/70')}>{hint}</span>
        )}
      </span>

      {linked && (
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
            primary ? 'text-white/70' : 'text-ink/60'
          )}
        >
          <path d="m6 2 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </>
  );

  const classes = cn(
    'group flex w-full items-center gap-3.5 rounded-lg text-left',
    linked && 'transition-[background-color,border-color,box-shadow,transform] duration-200 ease-soft active:scale-[0.98]',
    compact ? 'px-4 py-3' : 'px-5 py-4',
    primary
      ? 'btn-solid'
      : cn('border border-ink/[0.09] bg-shell', linked && 'hover:border-ink/20 hover:shadow-soft'),
    className
  );

  if (to) {
    return (
      <Link to={to} onClick={onClick} className={classes}>
        {inner}
      </Link>
    );
  }
  if (href) {
    return (
      <a
        href={href}
        target={href.startsWith('http') ? '_blank' : undefined}
        rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
        onClick={onClick}
        className={classes}
      >
        {inner}
      </a>
    );
  }
  return <div className={classes}>{inner}</div>;
}

/** Intertitre de groupe : un mot, un filet. */
export function GroupLabel({ children }) {
  return (
    <div className="mb-4 mt-9 flex items-center gap-4 first:mt-0">
      <span className="t-label flex-none text-gold-deep">{children}</span>
      <span aria-hidden="true" className="h-px flex-1 bg-ink/10" />
    </div>
  );
}

/** Les deux fondateurs, une ligne directe chacun : le nom, le rôle, le numéro. */
export function FounderRows({ source, className }) {
  return (
    <div className={cn('space-y-2.5', className)}>
      {/* Dans l'ordre des numéros : le numéro principal d'abord. */}
      {BRAND.phones.map((phone) => {
        const f = BRAND.founders.find((x) => x.name === phone.name) || { name: phone.name, role: '' };
        return (
          <Row
            key={phone.tel}
            href={`tel:${phone.tel}`}
            icon={PhoneIcon}
            label={f.name}
            hint={f.role ? `${f.role} · ${phone.number}` : phone.number}
            onClick={() => track(EVENTS.PHONE_CLICK, { source })}
          />
        );
      })}
    </div>
  );
}
