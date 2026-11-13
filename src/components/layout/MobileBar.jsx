import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useContactDialog } from '@/lib/contactDialog';
import { EVENTS, track } from '@/lib/analytics';
import { cn } from '@/lib/utils';

/** Routes où la barre ferait doublon avec le contenu de la page. */
const HIDDEN_ON = new Set(['/devis', '/liens']);

/**
 * Barre d'action mobile - deux gestes, à portée de pouce, et jamais en double.
 *
 * Elle s'efface dès qu'un appel à l'action de la page entre dans l'écran :
 * proposer « Devis gratuit » en bas alors que le même bouton est visible au
 * milieu de la page, c'est demander deux fois la même chose et manger de la
 * hauteur pour rien. Les blocs à surveiller se déclarent avec `data-page-cta` -
 * aucune liste à tenir à jour ici.
 *
 * Elle reste basse et n'apparaît qu'après un début de défilement : sur le
 * premier écran, le hero porte déjà ses propres boutons.
 */
export default function MobileBar() {
  // Sans la barre oblique finale : `/devis/` et `/devis` sont la même page.
  const { pathname: raw } = useLocation();
  const pathname = raw.length > 1 ? raw.replace(/\/+$/, '') : raw;
  const { openDialog } = useContactDialog();
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    // Le questionnaire est lui-même l'action, et la page de liens porte déjà
    // devis, appel et WhatsApp en pleine largeur : pas de barre par-dessus.
    if (HIDDEN_ON.has(pathname)) return undefined;

    const visible = new Set();
    /* Un appel à l'action présent dans l'écran mais rendu invisible (le hero
       masqué) ne compte pas. */
    const shown = (el) => (el.checkVisibility ? el.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true }) : true);
    const sync = () => setHidden([...visible].some(shown) || window.scrollY < 240);

    const observer =
      typeof IntersectionObserver === 'undefined'
        ? null
        : new IntersectionObserver(
            (entries) => {
              for (const entry of entries) {
                if (entry.isIntersecting) visible.add(entry.target);
                else visible.delete(entry.target);
              }
              sync();
            },
            // Marge basse : un CTA compte comme « à l'écran » un peu avant
            // d'atteindre la barre, sinon les deux se croisent une seconde.
            { rootMargin: '0px 0px -96px 0px', threshold: 0.35 }
          );

    // Le DOM de la route vient d'être remplacé : on attend la peinture.
    const raf = requestAnimationFrame(() => {
      document.querySelectorAll('[data-page-cta]').forEach((t) => observer?.observe(t));
      sync();
    });

    window.addEventListener('scroll', sync, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      observer?.disconnect();
      window.removeEventListener('scroll', sync);
    };
  }, [pathname]);

  if (HIDDEN_ON.has(pathname)) return null;

  return (
    <div
      aria-hidden={hidden}
      className={cn(
        'fixed inset-x-0 bottom-0 z-40 flex gap-2 px-3 lg:hidden',
        'transition-[transform,opacity] duration-slow ease-soft motion-reduce:transition-none',
        hidden ? 'pointer-events-none translate-y-6 opacity-0' : 'translate-y-0 opacity-100'
      )}
      style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 0.75rem)' }}
    >
      <Link
        to="/devis"
        tabIndex={hidden ? -1 : undefined}
        onClick={() => track(EVENTS.QUOTE_CTA, { source: 'mobile_bar' })}
        className="flex min-h-[52px] flex-[1.4] items-center justify-center rounded-full bg-graphite text-[14px] font-semibold text-ivory shadow-lift active:scale-[0.98]"
      >
        Demander un devis
      </Link>
      <button
        type="button"
        tabIndex={hidden ? -1 : undefined}
        onClick={() => openDialog('mobile_bar')}
        className="flex min-h-[52px] flex-1 items-center justify-center rounded-full border border-ink/12 bg-paper/95 text-[14px] font-semibold text-ink shadow-soft backdrop-blur active:scale-[0.98]"
      >
        Contact
      </button>
    </div>
  );
}
