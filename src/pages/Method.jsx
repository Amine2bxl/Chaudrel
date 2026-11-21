import { HouseIcon, KeyIcon, PersonIcon, QuoteDocIcon } from '@/components/ui/Icons';
import PageHero from '@/components/sections/PageHero';
import CTASection from '@/components/sections/CTASection';
import { Container, Panel, Section } from '@/components/ui';
import { Row } from '@/components/layout/ContactList';
import Reveal from '@/lib/reveal';

const PRINCIPES = [
  {
    icon: QuoteDocIcon,
    title: 'Ce qui est prévu est écrit',
    text: 'Le devis détaille les postes. Si un imprévu sort du cadre, on vous le dit avant, pas à la facture.',
  },
  {
    icon: PersonIcon,
    title: 'Un seul interlocuteur',
    text: 'Vous ne coordonnez pas cinq corps de métier. C’est notre travail, pas le vôtre.',
  },
  {
    icon: HouseIcon,
    title: 'Le chantier se déroule chez vous',
    text: 'Protection des surfaces, propreté quotidienne, remise en état. Cela fait partie du travail.',
  },
  {
    icon: KeyIcon,
    title: 'Terminé veut dire terminé',
    text: 'La livraison se fait ensemble. Tant qu’il reste une reprise, le chantier n’est pas fini.',
  },
];

export default function Method() {
  return (
    <>
      <PageHero title="Notre méthode." />

      <Section tone="cream" className="pt-block">
        <Container>
          {/* Les quatre règles : une rangée chacune, sur la carte de verre. */}
          <Reveal>
            <Panel as="ul" className="grid gap-2.5 sm:grid-cols-2">
              {PRINCIPES.map((p) => (
                <li key={p.title}>
                  <Row icon={p.icon} label={p.title} hint={p.text} className="h-full" />
                </li>
              ))}
            </Panel>
          </Reveal>
        </Container>
      </Section>

      <CTASection source="method" />
    </>
  );
}