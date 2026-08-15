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
      className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 border-t border-ink/10 bg-cream lg:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <Link
        to="/devis"
        onClick={() => track(EVENTS.QUOTE_CTA, { source: 'mobile_bar' })}
        className={cn('t-label flex min-h-[58px] items-center justify-center bg-ink text-cream')}
      >
        Demander un devis
      </Link>
      <a
        href={whatsappUrl()}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => track(EVENTS.WHATSAPP_CLICK, { source: 'mobile_bar' })}
        className="t-label flex min-h-[58px] items-center justify-center text-ink"
      >
        WhatsApp
      </a>
    </div>
  );
}
