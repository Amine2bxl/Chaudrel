import PageHero from '@/components/sections/PageHero';
import ProcessCurve from '@/components/sections/ProcessCurve';
import CTASection from '@/components/sections/CTASection';
import { Container, Section, SectionHeading } from '@/components/ui';
import Reveal from '@/lib/reveal';

const PRINCIPES = [
  {
    title: 'Ce qui est prévu est écrit',
    text: 'Le devis détaille les postes. S’il faut sortir du cadre, on vous le dit avant, pas à la facture.',
  },
  {
    title: 'Un seul interlocuteur',
    text: 'Vous ne coordonnez pas cinq corps de métier. C’est notre travail, pas le vôtre.',
  },
  {
    title: 'Le chantier se déroule chez vous',
    text: 'Protection des surfaces, propreté quotidienne, remise en état. Cela fait partie du travail.',
  },
  {
    title: 'Terminé veut dire terminé',
    text: 'La livraison se fait ensemble. Tant qu’il reste une reprise, le chantier n’est pas fini.',
  },
];

export default function Method() {
  return (
    <>
      <PageHero
        title="Quatre étapes, zéro surprise."
        intro="Une rénovation réussie tient autant à l’organisation qu’au travail sur le chantier. Voici exactement comment nous procédons."
        breadcrumb={[{ label: 'Accueil', to: '/' }, { label: 'Notre méthode' }]}
      />

      <Section tone="cream" className="pt-0 md:pt-0 lg:pt-0">
        <Container>
          <ProcessCurve />
        </Container>
      </Section>

      <Section tone="white">
        <Container>
          <SectionHeading title="Quatre règles qui ne bougent pas." />
          <div className="mt-block grid gap-x-16 gap-y-12 lg:grid-cols-2">
            {PRINCIPES.map((p, i) => (
              <Reveal key={p.title} delay={i * 90} className="border-t border-ink/12 pt-6">
                <h3 className="t-h2 text-[1.5rem] lg:text-[1.75rem]">{p.title}</h3>
                <p className="t-body measure mt-4 text-ink/65">{p.text}</p>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <CTASection
        title="Commençons par la première étape."
        text="Un message, un appel, deux photos. C’est tout ce qu’il faut pour démarrer."
        source="method"
      />
    </>
  );
}
