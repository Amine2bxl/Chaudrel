import PageHero from '@/components/sections/PageHero';
import MethodSteps from '@/components/sections/MethodSteps';
import FaqAccordion from '@/components/sections/FaqAccordion';
import CTASection from '@/components/sections/CTASection';
import Commitments from '@/components/sections/Commitments';
import { Container, Section, SectionHeading } from '@/components/ui';
import { METHOD } from '@/data/method';
import { FAQS } from '@/data/faqs';

/** Questions de la FAQ qui portent sur le déroulement. */
const processFaqs = FAQS.filter((f) => /devis|déroul|durée|durent|temps|habiter|interlocuteur/i.test(f.q)).slice(0, 4);

export default function Method() {
  return (
    <>
      <PageHero
        title={
          <>
            Quatre étapes, <em>zéro surprise.</em>
          </>
        }
        intro="Du premier contact à la livraison, un chantier Chaudrel suit toujours le même ordre. Vous savez à chaque moment où vous en êtes et à qui parler."
        breadcrumb={[{ label: 'Accueil', to: '/' }, { label: 'Méthode' }]}
        aside={
          <ol className="divide-y divide-ink/10 border-y border-ink/10">
            {METHOD.map((s) => (
              <li key={s.n} className="flex items-baseline gap-4 py-3.5 text-[14.5px]">
                <span className="t-num text-gold-ink">{s.n}</span>
                {s.title}
              </li>
            ))}
          </ol>
        }
      />

      <Section className="pt-section">
        <Container>
          <MethodSteps headingLevel="h2" />
        </Container>
      </Section>

      <Section tone="paper">
        <Container>
          <SectionHeading label="Engagements" title="Ce qui ne change jamais." />
          <div className="mt-block">
            <Commitments />
          </div>
        </Container>
      </Section>

      {processFaqs.length > 0 && (
        <Section>
          <Container className="grid gap-10 lg:grid-cols-12">
            <h2 className="t-h2 lg:col-span-4">Sur le déroulement</h2>
            <FaqAccordion items={processFaqs} className="lg:col-span-8" />
          </Container>
        </Section>
      )}

      <CTASection source="methode" />
    </>
  );
}
