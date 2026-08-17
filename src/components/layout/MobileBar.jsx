import { Link, useLocation } from 'react-router-dom';
import { useContactDialog } from '@/lib/contactDialog';
import { EVENTS, track } from '@/lib/analytics';

/**
 * Barre d'action mobile : deux gestes, toujours à portée de pouce.
 * Le devis mène au questionnaire ; « Nous joindre » ouvre la fenêtre qui porte
 * téléphones, WhatsApp, e-mail, horaires et adresse — plutôt qu'un seul canal
 * imposé.
 */
export default function MobileBar() {
  const { pathname } = useLocation();
  const { openDialog } = useContactDialog();

  if (pathname === '/devis') return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 flex gap-2 px-3 lg:hidden"
      style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 0.75rem)' }}
    >
      <Link
        to="/devis"
        onClick={() => track(EVENTS.QUOTE_CTA, { source: 'mobile_bar' })}
        className="t-label flex min-h-[54px] flex-1 items-center justify-center rounded-full border border-cream/20 bg-ink text-cream shadow-lift active:translate-y-px"
      >
        Devis gratuit
      </Link>
      <button
        type="button"
        onClick={() => openDialog('mobile_bar')}
        className="t-label flex min-h-[54px] flex-1 items-center justify-center rounded-full border border-ink/12 bg-shell text-ink shadow-soft active:translate-y-px"
      >
        Nous joindre
      </button>
    </div>
  );
}
