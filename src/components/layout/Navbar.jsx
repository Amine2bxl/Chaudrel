import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Phone } from 'lucide-react';
import { BRAND, LOGO, NAV } from '@/data/site';
import { EVENTS, track } from '@/lib/analytics';
import { cn } from '@/lib/utils';
import { useContactDialog } from '@/lib/contactDialog';
import { Button } from '@/components/ui';

/** Deux lignes qui deviennent une croix — pas d'icône importée. */
function MenuIcon({ open }) {
  const bar = 'block h-px w-6 bg-ink transition-all duration-fast ease-soft';
  return (
    <span className="relative flex h-6 w-6 flex-col items-center justify-center gap-[6px]">
      <span className={cn(bar, open && 'translate-y-[3.5px] rotate-45')} />
      <span className={cn(bar, open && '-translate-y-[3.5px] -rotate-45')} />
    </span>
  );
}

/** Logotype : carré aux coins adoucis, jamais rond, jamais à angle vif. */
function Wordmark() {
  return (
    <Link to="/" className="flex items-center gap-3" aria-label="Chaudrel — accueil">
      <span className="grid h-10 w-10 place-items-center overflow-hidden rounded-logo bg-shell shadow-soft">
        <img src={LOGO} alt="" aria-hidden="true" width="40" height="40" className="h-full w-full object-cover" />
      </span>
      <span className="font-wordmark text-[19px] uppercase leading-none tracking-[0.2em] text-ink sm:text-[21px]">
        {BRAND.name}
      </span>
    </Link>
  );
}

/**
 * Une seule barre de navigation pour tout le site.
 *
 * Elle ne change pas d'apparence selon la page : la version posée — capsule
 * crème, ombre teintée — est la seule. Un visiteur qui passe de l'accueil à une
 * page intérieure ne doit pas avoir l'impression de changer de site, et la
 * page où il se trouve doit se lire sans réfléchir : c'est le rôle du point
 * brun sous l'onglet actif.
 */
export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { openDialog } = useContactDialog();
  const { pathname } = useLocation();

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const linkClass = ({ isActive }) =>
    cn(
      'relative t-label pb-2 pt-1 transition-colors duration-fast',
      isActive ? 'text-ink' : 'text-ink/60 hover:text-ink'
    );

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <a
        href="#main"
        className="t-label sr-only focus:not-sr-only focus:absolute focus:left-5 focus:top-5 focus:z-50 focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-cream"
      >
        Aller au contenu
      </a>

      <div className="mx-auto my-2.5 flex w-[calc(100%-1.25rem)] max-w-[1240px] items-center justify-between rounded-full bg-cream/95 px-4 py-2.5 shadow-soft backdrop-blur-md sm:my-3 sm:px-5 lg:px-6">
        <Wordmark />

        <nav className="hidden items-center gap-6 lg:flex xl:gap-9" aria-label="Navigation principale">
          {NAV.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === '/'} className={linkClass}>
              {({ isActive }) => (
                <>
                  {item.label}
                  {/* Repère de page courante : un point, pas une couleur de
                      texte — il reste lisible pour qui distingue mal les
                      teintes, et il ne coûte rien à l'œil. */}
                  <span
                    aria-hidden="true"
                    className={cn(
                      'absolute inset-x-0 -bottom-0.5 mx-auto h-1 w-1 rounded-full bg-gold transition-opacity duration-fast',
                      isActive ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                </>
              )}
            </NavLink>
          ))}

          {/* Une seule action de contact : un icône, pas un numéro. Le numéro
              affiché ne faisait qu'appeler sans contexte ; l'icône ouvre la
              fenêtre qui porte toutes les coordonnées — appeler, WhatsApp,
              e-mail, horaires, adresse. */}
          <button
            type="button"
            onClick={() => openDialog('navbar')}
            aria-label="Nous joindre"
            title="Nous joindre"
            className="grid h-10 w-10 place-items-center rounded-full text-ink/70 transition-colors duration-fast hover:bg-ink/5 hover:text-ink"
          >
            <Phone size={18} strokeWidth={1.7} aria-hidden="true" />
          </button>

          <Button to="/devis" size="sm" onClick={() => track(EVENTS.QUOTE_CTA, { source: 'navbar' })}>
            Devis gratuit
          </Button>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
          className="grid h-11 w-11 place-items-center rounded-full transition-colors duration-fast hover:bg-ink/5 lg:hidden"
        >
          <MenuIcon open={open} />
        </button>
      </div>

      {open && (
        <div className="mx-auto w-full max-w-[1240px] px-2.5 lg:hidden">
          <nav className="panel-in overflow-hidden rounded-xl bg-cream p-5 shadow-lift sm:p-6" aria-label="Navigation mobile">
            <ul className="divide-y divide-ink/10">
              {NAV.map((item, i) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.to === '/'}
                    style={{ animationDelay: `${i * 35}ms` }}
                    className={({ isActive }) =>
                      cn(
                        'panel-in flex items-center justify-between gap-4 py-4 font-display text-[1.75rem] tracking-[-0.01em]',
                        isActive ? 'text-ink' : 'text-ink/60'
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {item.label}
                        {isActive && <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-gold" />}
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>

            <div className="mt-7 flex flex-col gap-3">
              <Button to="/devis" onClick={() => track(EVENTS.QUOTE_CTA, { source: 'menu' })}>
                Devis gratuit
              </Button>
              <Button variant="outline" onClick={() => openDialog('menu')}>
                Nous joindre
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