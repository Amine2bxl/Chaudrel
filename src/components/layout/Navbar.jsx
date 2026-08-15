import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, Phone } from 'lucide-react';
import { BRAND, LOGO, NAV, whatsappUrl } from '@/data/site';
import { EVENTS, track } from '@/lib/analytics';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
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
        'fixed inset-x-0 top-0 z-50 transition-all duration-500',
        scrolled || open ? 'bg-brand-cream/95 backdrop-blur-sm shadow-[0_1px_0_rgba(20,19,17,0.08)]' : 'bg-transparent'
      )}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-brand-ink focus:px-4 focus:py-2 focus:text-white"
      >
        Aller au contenu
      </a>

      <div className="mx-auto flex w-full max-w-[1360px] items-center justify-between px-5 py-4 lg:px-10 lg:py-5">
        <Link to="/" className="flex items-center gap-3" aria-label="Chaudrel — accueil">
          <img src={LOGO} alt="" aria-hidden="true" width="36" height="36" className="h-9 w-9 rounded-full object-cover" />
          <span
            className={cn(
              'font-display text-lg tracking-[0.18em] uppercase transition-colors',
              scrolled || open ? 'text-brand-ink' : 'text-white drop-shadow'
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
                  'text-[13px] font-medium tracking-wide transition-colors',
                  scrolled ? 'text-brand-ink/70 hover:text-brand-gold' : 'text-white/85 hover:text-white',
                  isActive && (scrolled ? 'text-brand-gold' : 'text-white underline underline-offset-8')
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
          <a
            href={`tel:${BRAND.phones[0].tel}`}
            onClick={() => track(EVENTS.PHONE_CLICK, { source: 'navbar' })}
            className={cn(
              'flex items-center gap-2 text-[13px] font-medium',
              scrolled ? 'text-brand-ink/70 hover:text-brand-gold' : 'text-white/85 hover:text-white'
            )}
          >
            <Phone className="h-4 w-4" aria-hidden="true" />
            {BRAND.phones[0].number}
          </a>
          <Button
            to="/devis"
            variant={scrolled ? 'primary' : 'gold'}
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
            'flex h-10 w-10 items-center justify-center rounded-full lg:hidden',
            scrolled || open ? 'text-brand-ink' : 'text-white'
          )}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="mm-overlay border-t border-brand-ink/10 bg-brand-cream lg:hidden">
          <nav className="flex flex-col px-5 py-6" aria-label="Navigation mobile">
            {[{ label: 'Accueil', to: '/' }, ...NAV].map((item, i) => (
              <NavLink
                key={item.to}
                to={item.to}
                style={{ animationDelay: `${i * 40}ms` }}
                className={({ isActive }) =>
                  cn(
                    'mm-link border-b border-brand-ink/8 py-4 font-display text-2xl font-light',
                    isActive ? 'text-brand-gold' : 'text-brand-ink'
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
            <div className="mt-6 flex flex-col gap-3">
              <Button to="/devis" variant="primary" onClick={() => track(EVENTS.QUOTE_CTA, { source: 'menu' })}>
                Demander un devis
              </Button>
              <Button
                href={whatsappUrl()}
                variant="outline"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track(EVENTS.WHATSAPP_CLICK, { source: 'menu' })}
              >
                Nous écrire sur WhatsApp
              </Button>
              <a
                href={`tel:${BRAND.phones[0].tel}`}
                onClick={() => track(EVENTS.PHONE_CLICK, { source: 'menu' })}
                className="py-2 text-center text-[13px] text-brand-ink/60"
              >
                {BRAND.phones[0].number}
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
