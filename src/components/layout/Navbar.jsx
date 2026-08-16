import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { BRAND, LOGO, NAV, whatsappUrl } from '@/data/site';
import { EVENTS, track } from '@/lib/analytics';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui';

/** Deux lignes qui deviennent une croix — pas d'icône importée. */
function MenuIcon({ open, dark }) {
  const bar = cn('block h-px w-6 transition-all duration-300 ease-soft', dark ? 'bg-ink' : 'bg-cream');
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
    <header className="fixed inset-x-0 top-0 z-50">
      <a
        href="#main"
        className="t-label sr-only focus:not-sr-only focus:absolute focus:left-5 focus:top-5 focus:z-50 focus:rounded-full focus:bg-umber focus:px-5 focus:py-3 focus:text-cream"
      >
        Aller au contenu
      </a>

      {/* Au repos la barre flotte sur la photo, sans fond. Dès le premier
          défilement elle se pose : une capsule crème, arrondie comme le reste
          du site, portée par une ombre teintée plutôt que par un filet. */}
      <div
        className={cn(
          'mx-auto flex w-full items-center justify-between transition-all duration-500 ease-soft',
          scrolled || open
            ? 'my-2.5 w-[calc(100%-1.25rem)] max-w-[1240px] rounded-full bg-cream/95 px-4 py-2.5 shadow-soft backdrop-blur-md sm:my-3 sm:px-5 lg:px-6'
            : 'my-0 max-w-page bg-transparent px-5 py-5 sm:px-8 lg:px-12'
        )}
      >
        <Link to="/" className="group flex items-center gap-3" aria-label="Chaudrel — accueil">
          {/* Pastille ronde : aucune arête, aucun cadre carré. */}
          <span
            className={cn(
              'grid h-10 w-10 place-items-center overflow-hidden rounded-full transition-all duration-500 ease-soft',
              dark ? 'bg-shell shadow-soft' : 'bg-cream/15 backdrop-blur-sm'
            )}
          >
            <img
              src={LOGO}
              alt=""
              aria-hidden="true"
              width="40"
              height="40"
              className="h-full w-full scale-[1.02] rounded-full object-cover"
            />
          </span>
          <span
            className={cn(
              'font-display text-[15px] font-semibold uppercase tracking-[0.26em] transition-colors duration-500 sm:text-[16px]',
              dark ? 'text-ink' : 'text-cream'
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
                  dark ? 'text-ink/70 hover:text-ink' : 'text-cream/80 hover:text-cream',
                  isActive && (dark ? 'text-umber' : 'text-umber-light')
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
              dark ? 'text-ink/65 hover:text-ink' : 'text-cream/80 hover:text-cream'
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
          className={cn(
            'grid h-11 w-11 place-items-center rounded-full transition-colors duration-300 lg:hidden',
            dark ? 'hover:bg-ink/5' : 'bg-cream/10 backdrop-blur-sm'
          )}
        >
          <MenuIcon open={open} dark={dark} />
        </button>
      </div>

      {open && (
        <div className="mx-auto w-full max-w-[1280px] px-2.5 lg:hidden">
          <nav
            className="panel-in overflow-hidden rounded-xl bg-cream p-5 shadow-lift sm:p-6"
            aria-label="Navigation mobile"
          >
            <ul className="divide-y divide-ink/10">
              {[{ label: 'Accueil', to: '/' }, ...NAV].map((item, i) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    style={{ animationDelay: `${i * 35}ms` }}
                    className={({ isActive }) =>
                      cn(
                        'panel-in block py-4 font-display text-[1.625rem] tracking-[-0.03em] transition-colors',
                        isActive ? 'text-umber' : 'text-ink'
                      )
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>

            <div className="mt-7 flex flex-col gap-3">
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
              className="t-small mt-6 block tabular-nums text-ink/65"
            >
              {BRAND.phones[0].number}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
