import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { Phone } from 'lucide-react';
import { BRAND, NAV } from '@/data/site';
import { EVENTS, track } from '@/lib/analytics';
import { cn } from '@/lib/utils';
import { useContactDialog } from '@/lib/contactDialog';
import { EASE, SPRING } from '@/lib/motion';
import usePointerGlow from '@/lib/usePointerGlow';
import { Button } from '@/components/ui';
import { Logo } from '@/components/ui/Logo';

/** Deux traits qui deviennent une croix. */
function MenuIcon({ open }) {
  const bar = 'block h-px w-6 bg-cream transition-transform duration-300 ease-soft';
  return (
    <span className="relative flex h-6 w-6 flex-col items-center justify-center gap-[6px]">
      <span className={cn(bar, open && 'translate-y-[3.5px] rotate-45')} />
      <span className={cn(bar, open && '-translate-y-[3.5px] -rotate-45')} />
    </span>
  );
}

/**
 * Une seule barre de navigation pour tout le site : une capsule de verre
 * nuit, la même sur fond clair comme sur photo, toujours visible.
 *
 * La page courante est marquée par une pastille de verre qui glisse d'un
 * onglet à l'autre (animation de mise en page partagée, `layoutId`).
 */
export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(null);
  const { openDialog } = useContactDialog();
  const { pathname } = useLocation();
  const glow = usePointerGlow();

  useEffect(() => setOpen(false), [pathname]);

  // Menu ouvert : la page derrière ne défile plus.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const isActive = (to) => (to === '/' ? pathname === '/' : pathname.startsWith(to));
  const pill = hovered ?? NAV.find((n) => isActive(n.to))?.to;

  return (
    <>
      <header className="on-dark fixed inset-x-0 top-0 z-50" style={{ viewTransitionName: 'site-nav' }}>
        <a
          href="#main"
          className="t-label sr-only focus:not-sr-only focus:absolute focus:left-5 focus:top-5 focus:z-50 focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-cream"
        >
          Aller au contenu
        </a>

        <div
          {...glow}
          className="glass-dark mx-auto mt-3 flex bg-bark/85 w-[calc(100%-1.25rem)] max-w-[1180px] items-center justify-between gap-6 rounded-full py-2 pl-5 pr-2 text-cream sm:mt-4 lg:pl-6"
        >
          <Link to="/" aria-label="Chaudrel - accueil" className="rounded-full">
            <Logo tone="cream" />
          </Link>

          <nav
            className="hidden items-center lg:flex"
            aria-label="Navigation principale"
            onMouseLeave={() => setHovered(null)}
          >
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                onMouseEnter={() => setHovered(item.to)}
                onFocus={() => setHovered(item.to)}
                onBlur={() => setHovered(null)}
                className={({ isActive: active }) =>
                  cn(
                    'relative rounded-full px-4 py-2.5 text-[14px] transition-colors duration-200',
                    active ? 'text-cream' : 'text-cream/70 hover:text-cream',
                  )
                }
              >
                {pill === item.to && (
                  <motion.span
                    layoutId="nav-pill"
                    transition={SPRING}
                    aria-hidden="true"
                    className="absolute inset-0 -z-10 rounded-full bg-cream/[0.1] ring-1 ring-inset ring-cream/[0.12]"
                  />
                )}
                {item.label}
                {isActive(item.to) && (
                  <span
                    aria-hidden="true"
                    className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-gold-light"
                  />
                )}
              </NavLink>
            ))}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            {/* Une seule action de contact : l'icône ouvre la fenêtre qui porte
              tous les canaux (appel, WhatsApp, e-mail, adresse). */}
            <button
              type="button"
              onClick={() => openDialog('navbar')}
              aria-label="Nous joindre"
              title="Nous joindre"
              className="grid h-10 w-10 place-items-center rounded-full text-cream/75 transition-[background-color,color,transform] duration-200 hover:bg-cream/10 hover:text-cream active:scale-[0.94]"
            >
              <Phone size={17} strokeWidth={1.7} aria-hidden="true" />
            </button>
            <Button to="/devis" size="sm" onClick={() => track(EVENTS.QUOTE_CTA, { source: 'navbar' })}>
              Devis gratuit
            </Button>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
            className="grid h-11 w-11 place-items-center rounded-full transition-[background-color,transform] duration-200 hover:bg-cream/10 active:scale-[0.94] lg:hidden"
          >
            <MenuIcon open={open} />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="on-dark fixed inset-x-2.5 bottom-2.5 top-[78px] z-40 overflow-y-auto rounded-[28px] lg:hidden"
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98, transition: { duration: 0.2, ease: EASE } }}
            transition={{ duration: 0.4, ease: EASE }}
            style={{ transformOrigin: 'top center' }}
          >
            <nav
              aria-label="Navigation mobile"
              className="glass-dark flex min-h-full flex-col rounded-[28px] bg-bark/80 p-6 text-cream"
            >
              <motion.ul
                className="divide-y divide-cream/10"
                initial="hidden"
                animate="show"
                variants={{ show: { transition: { staggerChildren: 0.045, delayChildren: 0.06 } } }}
              >
                {NAV.map((item) => (
                  <motion.li
                    key={item.to}
                    variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } }}
                    transition={{ duration: 0.5, ease: EASE }}
                  >
                    <NavLink
                      to={item.to}
                      end={item.to === '/'}
                      className={({ isActive: active }) =>
                        cn(
                          'flex items-center justify-between gap-4 py-4 font-display text-[2rem] leading-tight tracking-[-0.015em]',
                          active ? 'text-cream' : 'text-cream/60',
                        )
                      }
                    >
                      {({ isActive: active }) => (
                        <>
                          {item.label}
                          {active && <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-gold-light" />}
                        </>
                      )}
                    </NavLink>
                  </motion.li>
                ))}
              </motion.ul>

              <motion.div
                className="mt-auto flex flex-col gap-3 pt-10"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: EASE, delay: 0.25 }}
              >
                <Button to="/devis" size="lg" arrow onClick={() => track(EVENTS.QUOTE_CTA, { source: 'menu' })}>
                  Demander un devis gratuit
                </Button>
                <Button variant="outlineLight" size="lg" onClick={() => openDialog('menu')}>
                  Nous joindre
                </Button>
                <a
                  href={`tel:${BRAND.phones[0].tel}`}
                  onClick={() => track(EVENTS.PHONE_CLICK, { source: 'menu' })}
                  className="t-small mt-3 text-center tabular-nums text-cream/70"
                >
                  {BRAND.phones[0].name} · {BRAND.phones[0].number}
                </a>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
