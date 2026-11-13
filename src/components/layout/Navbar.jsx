import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { BRAND, LOGO, NAV, EMAIL_DISPLAY } from '@/data/site';
import { EVENTS, track } from '@/lib/analytics';
import { cn } from '@/lib/utils';
import { useContactDialog } from '@/lib/contactDialog';
import { Button } from '@/components/ui';

function MenuIcon({ open }) {
  const bar = 'block h-px w-5 bg-current transition-transform duration-300 ease-soft';
  return (
    <span className="relative flex h-5 w-5 flex-col items-center justify-center gap-[5px]">
      <span className={cn(bar, open && 'translate-y-[3px] rotate-45')} />
      <span className={cn(bar, open && '-translate-y-[3px] -rotate-45')} />
    </span>
  );
}

export function Wordmark({ tone = 'dark', className }) {
  return (
    <Link to="/" className={cn('flex items-center gap-3', className)} aria-label="Chaudrel Rénovation - accueil">
      <span className="grid h-10 w-10 flex-none place-items-center overflow-hidden rounded-full bg-white ring-1 ring-ink/10">
        <img src={LOGO} alt="" aria-hidden="true" width="40" height="40" className="h-full w-full object-cover" />
      </span>
      <span className="flex flex-col leading-none">
        <span className={cn('font-display text-[22px] leading-none', tone === 'light' ? 'text-ivory' : 'text-ink')}>
          {BRAND.name}
        </span>{' '}
        <span
          className={cn(
            'mt-1 text-[9.5px] font-semibold uppercase tracking-[0.2em]',
            tone === 'light' ? 'text-ivory/65' : 'text-ink/70'
          )}
        >
          Rénovation
        </span>
      </span>
    </Link>
  );
}

/**
 * En-tête : le mot-symbole à gauche, la navigation dans une capsule au centre,
 * l'action à droite. Transparent en haut de page, posé sur un voile ivoire
 * dès qu'on défile. Au téléphone, un panneau graphite plein écran.
 */
export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { openDialog } = useContactDialog();
  const { pathname } = useLocation();

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 16);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const linkClass = ({ isActive }) =>
    cn(
      'relative rounded-full px-4 py-2 text-[13px] font-medium transition-colors duration-fast',
      isActive ? 'bg-graphite text-ivory' : 'text-ink/75 hover:text-ink'
    );

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <a
        href="#main"
        className="sr-only text-[13px] font-semibold focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-graphite focus:px-5 focus:py-3 focus:text-ivory"
      >
        Aller au contenu
      </a>

      <div
        className={cn(
          'transition-[background-color,border-color,backdrop-filter] duration-slow ease-soft',
          'border-b',
          scrolled && !open ? 'border-ink/[0.07] bg-ivory/85 backdrop-blur-xl' : 'border-transparent bg-transparent'
        )}
      >
        <div className="mx-auto flex h-header w-full max-w-page items-center justify-between gap-6 px-gutter">
          <Wordmark tone={open ? 'light' : 'dark'} className="relative z-10" />

          <nav
            className="hidden items-center gap-1 rounded-full border border-ink/[0.08] bg-paper/80 p-1 backdrop-blur lg:flex"
            aria-label="Navigation principale"
          >
            {NAV.map((item) => (
              <NavLink key={item.to} to={item.to} className={linkClass}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden items-center gap-5 lg:flex">
            <button
              type="button"
              onClick={() => openDialog('navbar')}
              className="link-line tap text-[13px] font-medium text-ink/75 hover:text-ink"
            >
              Contact
            </button>
            <Button to="/devis" size="sm" arrow onClick={() => track(EVENTS.QUOTE_CTA, { source: 'navbar' })}>
              Demander un devis
            </Button>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
            className={cn(
              'relative z-10 grid h-11 w-11 place-items-center rounded-full border transition-colors duration-fast lg:hidden',
              open ? 'border-ivory/25 text-ivory' : 'border-ink/15 bg-paper/70 text-ink backdrop-blur'
            )}
          >
            <MenuIcon open={open} />
          </button>
        </div>
      </div>

      {open && (
        <div id="mobile-menu" className="on-dark fixed inset-0 z-0 flex flex-col bg-graphite text-ivory lg:hidden">
          <nav
            className="mx-auto flex w-full max-w-page flex-1 flex-col px-gutter pb-8 pt-[calc(var(--header-h)+1.5rem)]"
            aria-label="Navigation mobile"
          >
            <ul className="border-t border-ivory/10">
              {[{ label: 'Accueil', to: '/' }, ...NAV, { label: 'Questions fréquentes', to: '/faq' }].map((item, i) => (
                <li key={item.to} className="border-b border-ivory/10">
                  <NavLink
                    to={item.to}
                    end={item.to === '/'}
                    style={{ animationDelay: `${60 + i * 40}ms` }}
                    className={({ isActive }) =>
                      cn(
                        'panel-in flex items-baseline justify-between gap-4 py-4 font-display text-[30px] leading-tight',
                        isActive ? 'text-gold-light' : 'text-ivory'
                      )
                    }
                  >
                    {item.label}
                    <span className="text-[12px] font-sans text-ivory/40">{String(i + 1).padStart(2, '0')}</span>
                  </NavLink>
                </li>
              ))}
            </ul>

            <div className="mt-auto space-y-6 pt-10">
              <Button
                to="/devis"
                variant="gold"
                size="lg"
                arrow
                className="w-full"
                onClick={() => track(EVENTS.QUOTE_CTA, { source: 'mobile_menu' })}
              >
                Demander un devis
              </Button>
              <div className="grid grid-cols-2 gap-4 text-[13px]">
                {BRAND.phones.map((p) => (
                  <a
                    key={p.tel}
                    href={`tel:${p.tel}`}
                    onClick={() => track(EVENTS.PHONE_CLICK, { source: 'mobile_menu', who: p.name })}
                    className="text-ivory/75"
                  >
                    <span className="block text-ivory/45">{p.name}</span>
                    {p.number}
                  </a>
                ))}
              </div>
              <a href={`mailto:${BRAND.email}`} className="block text-[13px] text-ivory/75">
                {EMAIL_DISPLAY}
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
