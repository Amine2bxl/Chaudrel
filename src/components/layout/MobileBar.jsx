import { Link, useLocation } from 'react-router-dom';
import { Home, LayoutGrid, FileText, MessageCircle } from 'lucide-react';
import { BRAND, whatsappUrl } from '@/data/site';
import { EVENTS, track } from '@/lib/analytics';
import { cn } from '@/lib/utils';

const ITEMS = [
  { label: 'Accueil', to: '/', icon: Home },
  { label: 'Réalisations', to: '/realisations', icon: LayoutGrid },
  { label: 'Devis', to: '/devis', icon: FileText, primary: true },
];

/** Barre d'action mobile — accès permanent au devis et à WhatsApp. */
export default function MobileBar() {
  const { pathname } = useLocation();

  return (
    <nav
      aria-label="Actions rapides"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-brand-ink/10 bg-brand-cream/95 backdrop-blur-sm lg:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <ul className="grid grid-cols-4">
        {ITEMS.map(({ label, to, icon: Icon, primary }) => {
          const active = pathname === to;
          return (
            <li key={to}>
              <Link
                to={to}
                onClick={() => primary && track(EVENTS.QUOTE_CTA, { source: 'mobile_bar' })}
                className={cn(
                  'flex min-h-[56px] flex-col items-center justify-center gap-1 text-[10px] font-medium tracking-wide',
                  active || primary ? 'text-brand-gold' : 'text-brand-ink/55'
                )}
              >
                <Icon className="h-5 w-5" strokeWidth={1.6} aria-hidden="true" />
                {label}
              </Link>
            </li>
          );
        })}
        <li>
          <a
            href={whatsappUrl()}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track(EVENTS.WHATSAPP_CLICK, { source: 'mobile_bar' })}
            className="flex min-h-[56px] flex-col items-center justify-center gap-1 text-[10px] font-medium tracking-wide text-brand-ink/55"
          >
            <MessageCircle className="h-5 w-5" strokeWidth={1.6} aria-hidden="true" />
            WhatsApp
            <span className="sr-only">Écrire à {BRAND.name} sur WhatsApp</span>
          </a>
        </li>
      </ul>
    </nav>
  );
}
