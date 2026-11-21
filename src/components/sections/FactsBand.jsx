import { Container } from '@/components/ui';
import Reveal from '@/lib/reveal';
import { HouseIcon, PersonIcon, QuoteDocIcon } from '@/components/ui/Icons';
import { PhoneIcon } from '@/components/ui/BrandIcons';
import { BRAND } from '@/data/site';

/**
 * Les quatre faits, en titres seuls : chaque ligne porte déjà sa valeur.
 * Faits vérifiables uniquement (docs/VERIFICATION.md) ; le délai vient de
 * BRAND, jamais écrit en dur.
 */
export default function FactsBand() {
  const facts = [
    { icon: HouseIcon, title: `Depuis ${BRAND.founded}` },
    { icon: PersonIcon, title: 'Un seul interlocuteur' },
    { icon: QuoteDocIcon, title: 'Devis gratuit' },
    { icon: PhoneIcon, title: BRAND.promises.responseTime },
  ];

  return (
    <section aria-label="Chaudrel en quatre faits" className="border-b border-ink/[0.08]">
      <Container>
        <Reveal as="ul" className="grid grid-cols-2 lg:grid-cols-4">
          {facts.map(({ icon: Icon, title }, i) => (
            <li
              key={title}
              className={[
                'flex items-center gap-3 py-6 lg:justify-center lg:py-8',
                i % 2 ? 'pl-4 lg:pl-0' : '',
                i > 0 ? 'lg:border-l lg:border-ink/[0.08]' : '',
              ].join(' ')}
            >
              <Icon width={20} height={20} aria-hidden="true" className="flex-none text-gold-light" />
              <span className="text-[15px] font-medium leading-snug text-ink sm:text-base">{title}</span>
            </li>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
