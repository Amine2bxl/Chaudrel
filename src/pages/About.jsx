import PageHero from '@/components/sections/PageHero';
import CTASection from '@/components/sections/CTASection';
import { Container, Media, Section, SectionHeading } from '@/components/ui';
import Reveal from '@/lib/reveal';
import { BRAND } from '@/data/site';

export default function About() {
  return (
    <>
      <PageHero
        title={
          <>
            Une entreprise de rénovation
            <br />
            fondée à Bruxelles en {BRAND.founded}.
          </>
        }
        intro={`${BRAND.founders[0].name} et ${BRAND.founders[1].name} l’ont créée à deux. Elle fonctionne toujours de la même manière.`}
        breadcrumb={[{ label: 'Accueil', to: '/' }, { label: 'À propos' }]}
      />

      <Section tone="cream" className="pt-0 md:pt-0 lg:pt-0">
        <Container className="grid items-start gap-12 lg:grid-cols-12 lg:gap-16">
          {/* TODO_VALIDATION : remplacer par une vraie photo de l'équipe Chaudrel. */}
          <Media
            src="/story-before-after.webp"
            alt="Chantier de rénovation mené par l’équipe Chaudrel"
            ratio="aspect-[4/5]"
            className="lg:col-span-5"
          />

          <div className="lg:col-span-6 lg:col-start-7">
            <Reveal>
              <p className="t-h2 text-[1.5rem] leading-[1.35] lg:text-[1.75rem]">
                Nous ne vendons pas des travaux. Nous livrons des lieux qui fonctionnent.
              </p>
            </Reveal>

            <Reveal delay={120} className="mt-10 space-y-6">
              <p className="t-body measure text-cream/65">
                {BRAND.founders[0].name} est sur les chantiers : technique, coordination, exécution.{' '}
                {BRAND.founders[1].name} s’occupe du dessin, des matériaux et de la relation avec vous. À deux, ils
                voient passer chaque décision — c’est ce qui permet de tenir la qualité sans multiplier les
                intermédiaires.
              </p>
              <p className="t-body measure text-cream/65">
                Nous travaillons pour des particuliers et des commerces, partout en Belgique. Un studio à rafraîchir ou
                une maison à reprendre entièrement : la méthode ne change pas, seule la durée du chantier bouge.
              </p>
              <p className="t-body measure text-cream/65">
                L’entreprise est enregistrée sous le numéro de TVA {BRAND.vat}, à {BRAND.address.city}, et couverte par
                une assurance responsabilité civile professionnelle.
              </p>
            </Reveal>

            <Reveal delay={200} className="mt-12 grid gap-px sm:grid-cols-2">
              {BRAND.founders.map((f) => (
                <div key={f.name} className="border-t border-cream/12 pt-5">
                  <p className="t-h3">{f.name}</p>
                  <p className="t-small mt-1 text-cream/65">{f.role}</p>
                </div>
              ))}
            </Reveal>
          </div>
        </Container>
      </Section>

      <CTASection source="about" />
    </>
  );
}
