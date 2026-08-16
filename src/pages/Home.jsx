import Hero, { ProofBand } from '@/components/sections/Hero';
import ProjectGrid from '@/components/sections/ProjectGrid';
import ServiceList from '@/components/sections/ServiceList';
import ProcessTimeline from '@/components/sections/ProcessTimeline';
import BelgiumCoverage from '@/components/sections/BelgiumCoverage';
import BeforeAfter from '@/components/sections/BeforeAfter';
import Testimonials from '@/components/sections/Testimonials';
import FaqAccordion from '@/components/sections/FaqAccordion';
import QuickQuote from '@/components/sections/QuickQuote';
import { Button, Container, Media, Section, SectionHeading, TextLink } from '@/components/ui';
import Reveal from '@/lib/reveal';
import { PROJECTS } from '@/data/projects';
import { FAQS } from '@/data/faqs';
import { BRAND } from '@/data/site';

const featured = PROJECTS.filter((p) => p.featured).slice(0, 4);
const withBeforeAfter = PROJECTS.filter((p) => p.beforeAfter).slice(0, 3);

export default function Home() {
  return (
    <>
      <Hero />
      <ProofBand />

      {/* Réalisations — la preuve avant le discours */}
      <Section tone="cream">
        <Container>
          <SectionHeading
            title="Des chantiers finis, habités, utilisés."
            text="Chaque projet est mené du premier coup de marteau au nettoyage final."
          />

          <div className="mt-16 lg:mt-24">
            <ProjectGrid projects={featured} variant="editorial" />
          </div>

          <div className="mt-16">
            <TextLink to="/realisations">Toutes les réalisations</TextLink>
          </div>
        </Container>
      </Section>

      {/* Avant / après */}
      {withBeforeAfter.length > 0 && (
        <Section tone="white">
          <Container>
            <SectionHeading
              label="Avant / après"
              title="Les mêmes pièces, deux fois."
              text="L’état dans lequel nous avons trouvé la pièce, et le jour de la livraison. Basculez avec les deux boutons."
            />
            {/* Un cas en grand, les autres en appui : la comparaison mérite
                d'être vue, pas alignée en trois vignettes égales. */}
            <div className="mt-14 lg:mt-20 lg:grid lg:grid-cols-12 lg:gap-8">
              {withBeforeAfter[0] && (
                <Reveal from="fade" className="lg:col-span-7">
                  <BeforeAfter
                    before={withBeforeAfter[0].beforeAfter.before}
                    after={withBeforeAfter[0].beforeAfter.after}
                    label={`${withBeforeAfter[0].title} — ${withBeforeAfter[0].location}`}
                    ratio="aspect-[4/3]"
                  />
                </Reveal>
              )}
              <div className="mt-8 space-y-8 lg:col-span-5 lg:mt-0">
                {withBeforeAfter.slice(1).map((p, i) => (
                  <Reveal key={p.slug} from="fade" delay={120 + i * 100}>
                    <BeforeAfter
                      before={p.beforeAfter.before}
                      after={p.beforeAfter.after}
                      label={`${p.title} — ${p.location}`}
                      ratio="aspect-[16/10]"
                    />
                  </Reveal>
                ))}
              </div>
            </div>
          </Container>
        </Section>
      )}

      {/* Services */}
      <Section tone="cream">
        <Container>
          <SectionHeading
            title="Une rénovation complète, ou un seul poste."
            text="Dans les deux cas, c’est nous qui coordonnons les corps de métier."
          />
          <ServiceList className="mt-14 lg:mt-20" />
          <div className="mt-12">
            <Button to="/services" variant="outline">
              Voir tous les services
            </Button>
          </div>
        </Container>
      </Section>

      {/* Méthode */}
      <Section tone="bark">
        <Container>
          <SectionHeading
            tone="light"
            title="Sept étapes, zéro surprise."
            text="Vous savez à tout moment où en est votre chantier, ce qui a été fait et ce qui vient ensuite."
          />
          <ProcessTimeline tone="light" className="mt-16 lg:mt-24" />
        </Container>
      </Section>

      {/* Couverture nationale */}
      <BelgiumCoverage tone="cream" />

      {/* À propos, court */}
      <Section tone="white">
        <Container className="grid items-center gap-12 lg:grid-cols-12 lg:gap-20">
          <Media
            src="/story-before-after.webp"
            alt="Intérieur rénové par Chaudrel"
            ratio="aspect-[4/5]"
            className="lg:col-span-5"
          />

          <Reveal from="right" className="lg:col-span-7">
            <h2 className="t-h2 text-balance">Deux artisans, une même exigence depuis {BRAND.founded}.</h2>
            <p className="t-body measure mt-7 text-ink/65">
              {BRAND.founders[0].name} suit les chantiers et la technique. {BRAND.founders[1].name} s’occupe du design et
              de la relation client. Cette répartition n’a pas bougé depuis le premier jour, et c’est aussi pour cela que
              vous n’avez jamais qu’un seul interlocuteur.
            </p>
            <div className="mt-10">
              <TextLink to="/a-propos">Découvrir Chaudrel</TextLink>
            </div>
          </Reveal>
        </Container>
      </Section>

      <Testimonials limit={3} tone="cream" />

      {/* FAQ */}
      <Section tone="white">
        <Container>
          <SectionHeading title="Ce que l’on nous demande le plus." />
          <div className="mt-12 lg:mt-16">
            <FaqAccordion items={FAQS.slice(0, 5)} />
          </div>
          <div className="mt-10">
            <TextLink to="/faq">Toutes les questions</TextLink>
          </div>
        </Container>
      </Section>

      <QuickQuote source="home" />
    </>
  );
}
