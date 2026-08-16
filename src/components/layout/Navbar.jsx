import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { BRAND, LOGO, NAV, whatsappUrl } from '@/data/site';
import { EVENTS, track } from '@/lib/analytics';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui';

/** Deux lignes qui deviennent une croix — pas d'icône importée. */
function MenuIcon({ open, dark }) {
  const bar = cn('block h-px w-6 transition-all duration-300 ease-soft', dark ? 'bg-ink' : 'bg-paper');
  return (
    <span className="relative flex h-6 w-6 flex-col items-center justify-center gap-[6px]">
      <span className={cn(bar, open && 'translate-y-[3.5px] rotate-45')} />
      <span className={cn(bar, open && '-translate-y-[3.5px] -rotate-45')} />
    </span>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  // Les pages avec un en-tête sombre plein écran laissent la barre transparente.
  const overHero = pathname === '/' || pathname.startsWith('/realisations/') || pathname.startsWith('/services/');
  const dark = scrolled || open || !overHero;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-colors duration-500',
        scrolled || open ? 'bg-paper' : 'bg-transparent'
      )}
    >
      <a
        href="#main"
        className="t-label sr-only focus:not-sr-only focus:absolute focus:left-5 focus:top-5 focus:z-50 focus:bg-ink focus:px-4 focus:py-3 focus:text-paper"
      >
        Aller au contenu
      </a>

      <div
        className={cn(
          'mx-auto flex w-full max-w-page items-center justify-between px-5 transition-all duration-500 sm:px-8 lg:px-12',
          scrolled ? 'py-3.5' : 'py-5'
        )}
      >
        <Link to="/" className="flex items-center gap-3" aria-label="Chaudrel — accueil">
          <img src={LOGO} alt="" aria-hidden="true" width="34" height="34" className="h-[34px] w-[34px] object-contain" />
          <span
            className={cn(
              'font-display text-[17px] uppercase tracking-[0.22em] transition-colors duration-500',
              dark ? 'text-ink' : 'text-paper'
            )}
          >
            {BRAND.name}
          </span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Navigation principale">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'link-line t-label pb-1 transition-colors duration-300',
                  dark ? 'text-ink/70 hover:text-ink' : 'text-paper/80 hover:text-paper',
                  isActive && (dark ? 'text-signal' : 'text-signal-light')
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
          {/* Une entreprise de rénovation se choisit souvent au téléphone :
              le numéro reste visible, à côté du devis, jamais caché en pied de
              page. */}
          <a
            href={`tel:${BRAND.phones[0].tel}`}
            onClick={() => track(EVENTS.PHONE_CLICK, { source: 'navbar' })}
            className={cn(
              't-small ml-2 tabular-nums transition-colors duration-300',
              dark ? 'text-ink/65 hover:text-ink' : 'text-paper/80 hover:text-paper'
            )}
          >
            {BRAND.phones[0].number}
          </a>

          <Button
            to="/devis"
            variant={dark ? 'solid' : 'solidLight'}
            size="sm"
            onClick={() => track(EVENTS.QUOTE_CTA, { source: 'navbar' })}
          >
            Demander un devis
          </Button>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
          className="flex h-11 w-11 items-center justify-center lg:hidden"
        >
          <MenuIcon open={open} dark={dark} />
        </button>
      </div>

      {open && (
        <div className="panel-in border-t border-ink/10 bg-paper lg:hidden">
          <nav className="px-5 pb-8 pt-2 sm:px-8" aria-label="Navigation mobile">
            <ul>
              {[{ label: 'Accueil', to: '/' }, ...NAV].map((item, i) => (
                <li key={item.to} className="border-b border-ink/10">
                  <NavLink
                    to={item.to}
                    style={{ animationDelay: `${i * 35}ms` }}
                    className={({ isActive }) =>
                      cn('panel-in block py-4 font-display text-[1.75rem]', isActive ? 'text-signal' : 'text-ink')
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-col gap-3">
              <Button to="/devis" variant="solid" onClick={() => track(EVENTS.QUOTE_CTA, { source: 'menu' })}>
                Demander un devis
              </Button>
              <Button
                href={whatsappUrl()}
                variant="outline"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track(EVENTS.WHATSAPP_CLICK, { source: 'menu' })}
              >
                WhatsApp
              </Button>
            </div>

            <a
              href={`tel:${BRAND.phones[0].tel}`}
              onClick={() => track(EVENTS.PHONE_CLICK, { source: 'menu' })}
              className="t-small mt-6 block text-ink/65"
            >
              {BRAND.phones[0].number}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
