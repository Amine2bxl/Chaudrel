import { METHOD } from '@/data/method';
import Reveal from '@/lib/reveal';
import { cn } from '@/lib/utils';
import { Panel } from '@/components/ui';
import { Chip } from '@/components/layout/ContactList';
import { KeyIcon, QuoteDocIcon, TapeIcon, TrowelIcon } from '@/components/ui/Icons';

/* Une icône Chaudrel par marche : on mesure, on chiffre, on bâtit, on rend la clé. */
const ICONS = [TapeIcon, QuoteDocIcon, TrowelIcon, KeyIcon];
/* Hauteur de chaque marche (grand écran) : l'escalier monte vers la livraison. */
const RISE = ['lg:min-h-[14rem]', 'lg:min-h-[17rem]', 'lg:min-h-[20rem]', 'lg:min-h-[23rem]'];

/**
 * Les quatre étapes en escalier, chaque marche taillée dans la carte de verre
 * du site : nez de marche bronze, pastille, numéro discret. La dernière,
 * teintée bronze, porte la clé. Les marches montent l'une après l'autre à
 * l'apparition ; sur téléphone elles s'empilent en se décalant.
 */
export default function ProcessStairs({ steps = METHOD, className }) {
  return (
    <ol className={cn('grid gap-3 lg:grid-cols-4 lg:items-end', className)}>
      {steps.map((s, i) => (
        <Reveal as="li" key={s.n} delay={i * 110} className={cn('lg:!ml-0', ['ml-0', 'ml-4', 'ml-8', 'ml-12'][i])}>
          <Panel
            pad="p-6"
            radius="rounded-t-[22px] rounded-b-[10px]"
            className={cn(
              'flex h-full flex-col justify-between gap-8 border-t-2 border-t-gold',
              i === steps.length - 1 && 'bg-gold/[0.12]',
              RISE[i]
            )}
          >
            <div className="flex items-start justify-between">
              <Chip icon={ICONS[i] ?? TapeIcon} accent />
              <span className="font-display text-[3.25rem] leading-none text-ink/20 tabular-nums">{s.n}</span>
            </div>
            <div>
              <h3 className="font-display text-[1.75rem] leading-tight text-ink">{s.title}</h3>
              <p className="t-small mt-3 text-ink/70">{s.text}</p>
            </div>
          </Panel>
        </Reveal>
      ))}
    </ol>
  );
}
