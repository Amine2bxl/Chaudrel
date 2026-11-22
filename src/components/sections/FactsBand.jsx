import { Container } from '@/components/ui';
import usePointerGlow from '@/lib/usePointerGlow';
import Reveal from '@/lib/reveal';
import { Chip } from '@/components/layout/ContactList';
import { HouseIcon, PersonIcon, QuoteDocIcon } from '@/components/ui/Icons';
import { PhoneIcon } from '@/components/ui/BrandIcons';
import { BRAND } from '@/data/site';
import { cn } from '@/lib/utils';

/**
 * Les quatre faits, en titres seuls, sur une plaque de vrai verre : deux
 * lueurs bronze derrière, que le verre dépoli adoucit, un filet de lumière
 * sur l'arête haute, des séparations fines plutôt que quatre cartes. Faits
 * vérifiables uniquement (docs/VERIFICATION.md) ; le délai vient de BRAND.
 */
export default function FactsBand() {
  const glow = usePointerGlow();
  const facts = [
    { icon: HouseIcon, title: `Depuis ${BRAND.founded}` },
    { icon: PersonIcon, title: 'Un seul interlocuteur' },
    { icon: QuoteDocIcon, title: 'Devis gratuit' },
    { icon: PhoneIcon, title: BRAND.promises.responseTime },
  ];

  return (
    <section aria-label="Chaudrel en quatre faits" className="facts-band relative isolate z-10 pt-section lg:-mt-28 lg:pt-0">
      <Container className="relative">
        <div aria-hidden="true" className="facts-glow" />
        <Reveal>
          <ul {...glow} className="glass-light facts-glass grid grid-cols-2 rounded-[28px] lg:grid-cols-4">
            {facts.map(({ icon, title }, i) => (
              <li
                key={title}
                className={cn(
                  'flex flex-col items-start gap-3 px-5 py-5 sm:flex-row sm:items-center sm:gap-4 sm:px-7 sm:py-6 lg:gap-3.5 lg:px-5 lg:py-7 xl:px-7',
                  i % 2 === 1 && 'border-l border-ink/10',
                  i > 1 && 'border-t border-ink/10 lg:border-t-0',
                  i === 2 && 'lg:border-l'
                )}
              >
                <Chip icon={icon} accent compact />
                <span className="font-display text-[1.1rem] leading-snug text-ink sm:text-[1.3rem] lg:whitespace-nowrap lg:text-[1.125rem] xl:text-[1.25rem]">{title}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </section>
  );
}
