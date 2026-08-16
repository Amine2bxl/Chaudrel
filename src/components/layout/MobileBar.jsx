import { Link, useLocation } from 'react-router-dom';
import { whatsappUrl } from '@/data/site';
import { EVENTS, track } from '@/lib/analytics';
import { cn } from '@/lib/utils';

/**
 * Barre d'action mobile : le devis et WhatsApp toujours à portée de pouce.
 * Deux actions seulement — la navigation est dans le menu.
 */
export default function MobileBar() {
  const { pathname } = useLocation();
  if (pathname === '/devis') return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 flex gap-2 px-3 lg:hidden"
      style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 0.75rem)' }}
    >
      <Link
        to="/devis"
        onClick={() => track(EVENTS.QUOTE_CTA, { source: 'mobile_bar' })}
        className="t-label flex min-h-[54px] flex-1 items-center justify-center rounded-full bg-umber text-cream shadow-lift active:translate-y-px"
      >
        Demander un devis
      </Link>
      <a
        href={whatsappUrl()}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => track(EVENTS.WHATSAPP_CLICK, { source: 'mobile_bar' })}
        className="t-label flex min-h-[54px] flex-1 items-center justify-center rounded-full border border-ink/12 bg-shell text-ink shadow-soft active:translate-y-px"
      >
        WhatsApp
      </a>
    </div>
  );
}
