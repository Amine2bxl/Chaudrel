import { BadgeCheck, Home, NotebookPen, UserCheck } from 'lucide-react';
import PageHero from '@/components/sections/PageHero';
import CTASection from '@/components/sections/CTASection';
import { Container, Section } from '@/components/ui';
import Reveal from '@/lib/reveal';

const PRINCIPES = [
  {
    icon: NotebookPen,
    title: 'Ce qui est prévu est écrit',
    text: 'Le devis détaille les postes. Si un imprévu sort du cadre, on vous le dit avant, pas à la facture.',
  },
  {
    icon: UserCheck,
    title: 'Un seul interlocuteur',
    text: 'Vous ne coordonnez pas cinq corps de métier. C’est notre travail, pas le vôtre.',
  },
  {
    icon: Home,
    title: 'Le chantier se déroule chez vous',
    text: 'Protection des surfaces, propreté quotidienne, remise en état. Cela fait partie du travail.',
  },
  {
    icon: BadgeCheck,
    title: 'Terminé veut dire terminé',
    text: 'La livraison se fait ensemble. Tant qu’il reste une reprise, le chantier n’est pas fini.',
  },
];

export default function Method() {
  return (
    <>
      <PageHero
        title="Notre méthode."
        intro="Une rénovation réussie tient autant à l’organisation qu’au travail sur le chantier. Quatre règles, inchangeables."
        breadcrumb={[{ label: 'Accueil', to: '/' }, { label: 'Notre méthode' }]}
      />

      <Section tone="cream" className="pt-0 md:pt-0 lg:pt-0">
        <Container>
          {/* Les quatre règles, en tableau : un geste, une promesse. Chaque
              carte porte son symbole, son rang en filigrane et le texte. */}
          <div className="grid gap-6 sm:grid-cols-2 lg:gap-8">
            {PRINCIPES.map((p, i) => (
              <Reveal key={p.title} delay={(i % 2) * 80}>
                <div className="group relative h-full overflow-hidden rounded-lg border border-ink/[0.08] bg-shell p-7 shadow-soft transition-all duration-300 ease-soft hover:-translate-y-1 hover:border-gold/30 hover:shadow-lift sm:p-8">
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute right-5 top-3 select-none font-display text-[3.75rem] leading-none text-ink/[0.06] transition-colors duration-300 group-hover:text-gold/[0.12]"
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>

                  <span
                    className="grid h-12 w-12 place-items-center rounded-lg border border-gold/25 bg-gold/[0.07] text-gold"
                    aria-hidden="true"
                  >
                    <p.icon size={22} strokeWidth={1.6} />
                  </span>

                  <h3 className="t-h2 mt-6 text-[1.5rem] lg:text-[1.6rem]">{p.title}</h3>
                  <p className="t-body mt-3 text-ink/65">{p.text}</p>
                </div>
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