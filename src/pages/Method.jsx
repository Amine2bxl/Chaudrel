import PageHero from '@/components/sections/PageHero';
import MethodSteps from '@/components/sections/MethodSteps';
import CtaBand from '@/components/sections/CtaBand';
import { Container, Section, SectionHeading } from '@/components/ui';
import Reveal from '@/lib/reveal';
import { METHOD } from '@/data/method';

const DETAILS = [
  "Un premier échange par téléphone, WhatsApp ou via le formulaire suffit pour cadrer votre demande.",
  "La visite est gratuite et sans engagement : nous mesurons, nous regardons l'existant et nous écoutons vos attentes.",
  "Le devis détaille les postes de travaux. Vous savez ce qui est inclus, et ce qui ne l'est pas.",
  "Pendant le chantier, un interlocuteur unique suit l'avancement et vous tient informé.",
  "À la livraison, nous passons le chantier en revue avec vous avant de le considérer terminé.",
];

export default function Method() {
  return (
    <>
      <PageHero
        eyebrow="Notre méthode"
        title="Cinq étapes, aucune surprise"
        intro="Une rénovation réussie tient autant à l'organisation qu'au travail sur le chantier. Voici exactement comment nous procédons."
        breadcrumb={[{ label: 'Accueil', to: '/' }, { label: 'Notre méthode' }]}
      />

      <Section tone="cream">
        <Container>
          <MethodSteps />
        </Container>
      </Section>

      <Section tone="white">
        <Container className="max-w-3xl">
          <SectionHeading eyebrow="En détail" title="Ce qui se passe" accent="à chaque étape" />
          <ol className="mt-12 divide-y divide-brand-ink/10 border-y border-brand-ink/10">
            {METHOD.map((s, i) => (
              <Reveal as="li" key={s.n} delay={i * 60} className="flex gap-6 py-7">
                <span className="font-display text-2xl font-light text-brand-gold">{s.n}</span>
                <div>
                  <h3 className="font-display text-xl font-light text-brand-ink">{s.title}</h3>
                  <p className="mt-2 text-[15px] font-light leading-[1.85] text-brand-ink/60">{DETAILS[i]}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </Container>
      </Section>

      <CtaBand
        title="Commençons par la première étape"
        text="Décrivez votre projet en quelques minutes. Nous vous recontactons pour organiser la visite."
        source="method"
      />
    </>
  );
}
