import { METHOD } from '@/data/method';
import Reveal from '@/lib/reveal';
import { cn } from '@/lib/utils';
import { KeyIcon, QuoteDocIcon, TapeIcon, TrowelIcon } from '@/components/ui/Icons';

/* Une icône Chaudrel par marche : on mesure, on chiffre, on bâtit, on rend la clé. */
const ICONS = [TapeIcon, QuoteDocIcon, TrowelIcon, KeyIcon];
/* Hauteur de chaque marche (grand écran) : l'escalier monte vers la livraison. */
const RISE = ['lg:min-h-[15rem]', 'lg:min-h-[18.5rem]', 'lg:min-h-[22rem]', 'lg:min-h-[25.5rem]'];

/**
 * Les quatre étapes d'un chantier, en escalier : chaque marche plus haute que
 * la précédente, le nez de marche en bronze, la dernière porte la clé.
 *
 * Les marches montent l'une après l'autre à l'apparition (transform et
 * opacity, en CSS). Sur téléphone, elles s'empilent en se décalant vers la
 * droite, comme une volée vue de profil.
 */
export default function ProcessStairs({ steps = METHOD, className }) {
  return (
    <ol className={cn('grid gap-3 lg:grid-cols-4 lg:items-end', className)}>
      {steps.map((s, i) => {
        const Icon = ICONS[i] ?? TapeIcon;
        const last = i === steps.length - 1;
        return (
          <Reveal as="li" key={s.n} delay={i * 110} className={cn('lg:!ml-0', ['ml-0', 'ml-4', 'ml-8', 'ml-12'][i])}>
            <div
              className={cn(
                'relative flex h-full flex-col justify-between gap-10 overflow-hidden rounded-t-[16px] border border-b-0 border-cream/10 px-6 pb-7 pt-6',
                'border-t-2 border-t-gold bg-gradient-to-b from-cream/[0.07] to-cream/[0.015]',
                last && 'from-gold/[0.18] to-gold/[0.03]',
                RISE[i]
              )}
            >
              <div className="flex items-start justify-between">
                <Icon size={30} className="text-gold-light" />
                <span className="font-display text-[3.25rem] leading-none text-cream/20 tabular-nums">{s.n}</span>
              </div>
              <div>
                <h3 className="font-display text-[1.75rem] leading-tight text-cream">{s.title}</h3>
                <p className="t-small mt-3 text-cream/75">{s.text}</p>
              </div>
            </div>
          </Reveal>
        );
      })}
      {/* Le sol : une ligne qui tient les quatre marches. */}
      <li aria-hidden="true" className="hidden h-px bg-gold/40 lg:col-span-4 lg:block" />
    </ol>
  );
}
