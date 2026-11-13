import PageHero from '@/components/sections/PageHero';
import ProcessTimeline from '@/components/sections/ProcessTimeline';
import CTASection from '@/components/sections/CTASection';
import { Container, Eyebrow, Section, SectionHeading } from '@/components/ui';
import Reveal from '@/lib/reveal';

const PRINCIPES = [
  {
    title: 'Ce qui est prévu est écrit',
    text: 'Le devis détaille les postes. Si un imprévu sort du cadre, on vous le dit avant, pas à la facture.',
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

/**
 * /methode - comment un chantier se prépare et se tient.
 *
 * Deux temps : les quatre règles (une liste de revue - numéro, titre, phrase,
 * filet - pas des cartes à icônes), puis les quatre étapes, sur la même
 * courbe que l'accueil.
 */
export default function Method() {
  return (
    <>
      <PageHero
        title={
          <>
            Quatre règles, <em>inchangeables.</em>
          </>
        }
        intro="Une rénovation réussie tient autant à l’organisation qu’au travail sur le chantier."
        breadcrumb={[{ label: 'Accueil', to: '/' }, { label: 'Notre méthode' }]}
      />

      <Section tone="cream" className="pt-0 md:pt-0 lg:pt-0">
        <Container className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-4">
            <div className="lg:sticky lg:top-32">
              <Eyebrow className="mb-6">Nos règles</Eyebrow>
              <p className="t-lead max-w-[30ch] text-ink/65">
                Elles valent pour un studio à rafraîchir comme pour une maison à reprendre entièrement.
              </p>
            </div>
          </Reveal>

          <ol className="border-t border-ink/15 lg:col-span-8">
            {PRINCIPES.map((p, i) => (
              <Reveal as="li" key={p.title} delay={i * 70} className="grid gap-x-8 gap-y-3 border-b border-ink/15 py-8 sm:grid-cols-[4.5rem_1fr] lg:py-10">
                <span className="t-num font-display text-[2.25rem] leading-none text-gold-deep">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h2 className="t-h2">{p.title}</h2>
                  <p className="t-lead mt-3 max-w-[52ch] text-ink/65">{p.text}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </Container>
      </Section>

      <Section tone="bark" sheet>
        <Container>
          <SectionHeading
            tone="light"
            label="Les étapes"
            title={
              <>
                Du premier appel à <em>la remise des clés.</em>
              </>
            }
            text="Vous savez à tout moment où en est votre chantier, ce qui a été fait et ce qui vient ensuite."
          />
          <ProcessTimeline tone="light" className="mt-block" />
        </Container>
      </Section>

      <CTASection
        title={
          <>
            Commençons par <em>la première étape.</em>
          </>
        }
        text="Un message, un appel, deux photos. C’est tout ce qu’il faut pour démarrer."
        source="method"
        sheet={false}
      />
    </>
  );
}
