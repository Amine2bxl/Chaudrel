import { Container, Panel } from '@/components/ui';
import Reveal from '@/lib/reveal';
import { Chip } from '@/components/layout/ContactList';
import { HouseIcon, PersonIcon, QuoteDocIcon } from '@/components/ui/Icons';
import { PhoneIcon } from '@/components/ui/BrandIcons';
import { BRAND } from '@/data/site';

/**
 * Les quatre faits, en titres seuls, sur la carte de verre du site (comme
 * les autres blocs). Faits vérifiables uniquement (docs/VERIFICATION.md) ;
 * le délai vient de BRAND, jamais écrit en dur.
 */
export default function FactsBand() {
  const facts = [
    { icon: HouseIcon, title: `Depuis ${BRAND.founded}` },
    { icon: PersonIcon, title: 'Un seul interlocuteur' },
    { icon: QuoteDocIcon, title: 'Devis gratuit' },
    { icon: PhoneIcon, title: BRAND.promises.responseTime },
  ];

  return (
    <section aria-label="Chaudrel en quatre faits" className="pt-section">
      <Container>
        <Reveal>
          <Panel as="ul" pad="p-3 sm:p-4" className="grid grid-cols-2 gap-2.5 lg:grid-cols-4">
            {facts.map(({ icon, title }) => (
              <li key={title} className="flex items-center gap-3.5 rounded-lg border border-ink/[0.09] bg-shell px-4 py-3.5">
                <Chip icon={icon} accent compact />
                <span className="text-[15px] font-medium leading-snug text-ink">{title}</span>
              </li>
            ))}
          </Panel>
        </Reveal>
      </Container>
    </section>
  );
}
