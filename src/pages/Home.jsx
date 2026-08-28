import Hero, { ProofBand } from '@/components/sections/Hero';
import ProjectCarousel from '@/components/sections/ProjectCarousel';
import ServiceList from '@/components/sections/ServiceList';
import ProcessCurve from '@/components/sections/ProcessCurve';
import BelgiumCoverage from '@/components/sections/BelgiumCoverage';
import CTASection from '@/components/sections/CTASection';
import { Button, Container, Media, Section, SectionHeading, TextLink } from '@/components/ui';
import Reveal from '@/lib/reveal';
import { PROJECTS } from '@/data/projects';
import { BRAND } from '@/data/site';

const featured = PROJECTS.filter((p) => p.featured);

/**
 * L'accueil répond à quatre questions, dans cet ordre, puis demande le devis :
 *   1. qu'est-ce qu'ils font ?        → hero + trois faits
 *   2. est-ce que c'est bien fait ?   → trois chantiers
 *   3. est-ce qu'ils font mon poste ? → services
 *   4. comment ça se passe ?          → les quatre étapes
 *   → formulaire.
 *
 * Tout ce qui ne répond pas à l'une de ces questions a quitté la page : le
 * comparateur avant/après, la carte de couverture (partie sur la page Contact,
 * où l'on se demande vraiment « viennent-ils chez moi ? »), les avis non
 * vérifiés et la FAQ, qui gardent leurs pages. Une page d'accueil qui montre
 * tout ne montre rien.
 */
export default function Home() {
  return (
    <>
      <Hero />
      <ProofBand />

      {/* La preuve avant le discours */}
      <ProjectCarousel
        projects={featured}
        sectionLabel="Nos chantiers"
        title="Le travail parle pour nous."
        text="Une seule réalisation à la fois, en grand — comme elle a été livrée. Le reste du portfolio est à suivre."
        link={{ label: 'Toutes les réalisations', to: '/realisations' }}
      />

      <Section tone="shell">
        <Container>
          <SectionHeading
            title="Une rénovation complète, ou un seul poste."
            text="Dans les deux cas, c’est nous qui coordonnons les corps de métier."
          />
          <ServiceList className="mt-block" />
          <div className="mt-12">
            <Button to="/services" variant="outline">
              Voir tous les services
            </Button>
          </div>
        </Container>
      </Section>

      <Section tone="bark">
        <Container>
          <SectionHeading
            tone="light"
            title="Quatre étapes, zéro surprise."
            text="Vous savez à tout moment où en est votre chantier, ce qui a été fait et ce qui vient ensuite."
          />
          <ProcessCurve tone="light" className="mt-block" />

          {/* La page « méthode » n'était liée depuis nulle part : ni la
              navigation, ni une section. Prérendue et dans le sitemap, mais
              inatteignable en cliquant — donc invisible. Sa place est ici,
              juste après le résumé qu'elle développe. */}
          <div className="mt-12">
            <TextLink to="/methode" tone="light">
              Le détail de chaque étape
            </TextLink>
          </div>
        </Container>
      </Section>

      {/* « Venez-vous chez moi ? » est la question qui suit immédiatement
          « comment ça se passe ? ». */}
      <Section tone="cream">
        <Container>
          <SectionHeading title="Où nous intervenons." />
          <BelgiumCoverage className="mt-block" />
        </Container>
      </Section>

      <Section tone="shell">
        <Container className="grid items-center gap-10 lg:grid-cols-12 lg:gap-20">
          <Media
            src="/story-before-after.webp"
            alt="Intérieur rénové par Chaudrel"
            ratio="aspect-[4/3] lg:aspect-[4/5]"
            className="lg:col-span-5"
          />

          <Reveal from="right" className="lg:col-span-7">
            <h2 className="t-h2 max-w-[18ch] text-balance">
              Deux artisans, une même exigence depuis {BRAND.founded}.
            </h2>
            {/* Emphase par la couleur, pas par la graisse : le contexte
                s'écrit en gris, la phrase qui compte revient au noir du texte.
                L'œil trouve la conclusion sans qu'on la mette en gras. */}
            <p className="t-lead measure mt-6 text-ink/45">
              {BRAND.founders[0].name} suit les chantiers et la technique. {BRAND.founders[1].name} s’occupe du design et
              de la relation client. Cette répartition n’a pas bougé depuis le premier jour,{' '}
              <span className="text-ink">et c’est pour cela que vous n’avez jamais qu’un seul interlocuteur.</span>
            </p>
            <div className="mt-9">
              <TextLink to="/a-propos">Découvrir Chaudrel</TextLink>
            </div>
          </Reveal>
        </Container>
      </Section>

      <CTASection source="home" />
    </>
  );
}
