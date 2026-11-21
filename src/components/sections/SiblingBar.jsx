import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

/**
 * Barre de frères - le précédent et le suivant, nommés.
 *
 * Une flèche seule oblige à cliquer pour savoir où elle mène. Nommer les deux
 * voisins transforme la navigation en choix : on voit ce qu'on quitte et ce
 * qu'on gagne. Les points au centre disent combien il en reste, ce que deux
 * flèches ne disent jamais - c'est le seul endroit du site où l'on comprend
 * qu'un chantier fait partie d'une série.
 *
 * Elle se colle en bas de la fenêtre : c'est une commande, pas du contenu, et
 * elle doit rester atteignable quelle que soit la longueur de la page. La
 * version précédente vivait dans le corps du document, où on la dépassait en
 * défilant pour ne jamais y revenir.
 */
export default function SiblingBar({ prev, next, items = [], current, label = 'Élément' }) {
  if (!prev && !next) return null;

  return (
    <nav
      aria-label={`${label} précédent et suivant`}
      className="sticky bottom-0 z-30 border-t border-ink/10 bg-cream/90 px-5 backdrop-blur-lg sm:px-8 lg:px-12"
    >
      <div className="mx-auto flex w-full max-w-page items-center gap-4 pb-[calc(66px+0.25rem)] lg:pb-0">
        <Side item={prev} dir="prev" />

        {/* Points de position : la série entière d'un coup d'œil. Décoratifs -
            les deux liens nommés portent déjà toute la navigation. */}
        {items.length > 1 && (
          <ul aria-hidden="true" className="hidden flex-none items-center gap-2 sm:flex">
            {items.map((it) => (
              <li
                key={it.slug}
                className={cn(
                  'h-1.5 w-1.5 rounded-full transition-colors duration-fast',
                  it.slug === current ? 'bg-gold' : 'bg-ink/20'
                )}
              />
            ))}
          </ul>
        )}

        <Side item={next} dir="next" />
      </div>
    </nav>
  );
}

function Side({ item, dir }) {
  const before = dir === 'prev';
  if (!item) return <span aria-hidden="true" className="min-w-0 flex-1" />;

  return (
    <Link
      to={item.to}
      aria-label={`${before ? 'Précédent' : 'Suivant'} : ${item.title}`}
      className={cn(
        'group flex min-w-0 flex-1 items-center gap-3 py-4 text-ink/55 transition-colors duration-fast hover:text-ink',
        before ? 'justify-start' : 'justify-end'
      )}
    >
      <Chevron dir={dir} className={before ? 'group-hover:-translate-x-1' : 'order-last group-hover:translate-x-1'} />
      <span className="t-label min-w-0 truncate">{item.title}</span>
    </Link>
  );
}

function Chevron({ dir, className }) {
  return (
    <svg
      width="9"
      height="16"
      viewBox="0 0 9 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      aria-hidden="true"
      className={cn('flex-none transition-transform duration-fast ease-soft', className)}
    >
      <path d={dir === 'prev' ? 'M7.5 1 1.5 8l6 7' : 'm1.5 1 6 7-6 7'} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
