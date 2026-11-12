import ArchitecturalExperience from '@/components/experience/ArchitecturalExperience';
import ProjectCarousel from '@/components/sections/ProjectCarousel';
import ServicesShowcase from '@/components/sections/ServicesShowcase';
import Signature from '@/components/sections/Signature';
import ProcessTimeline from '@/components/sections/ProcessTimeline';
import BelgiumCoverage from '@/components/sections/BelgiumCoverage';
import CTASection from '@/components/sections/CTASection';
import { Button, Container, Media, Section, SectionHeading, TextLink } from '@/components/ui';
import Reveal from '@/lib/reveal';
import { PROJECTS } from '@/data/projects';
import { BRAND } from '@/data/site';

const featured = PROJECTS.filter((p) => p.featured);

/**
 * L'accueil est un récit, dans cet ordre :
 *   1. la maquette 3D      ce que fait Chaudrel, raconté par un bâtiment
 *   2. les chantiers       la preuve, juste après l'illustration
 *   3. la signature        qui parle, et quatre faits vérifiables
 *   4. les métiers         est-ce qu'ils font mon poste ?
 *   5. la méthode          comment ça se passe
 *   6. la zone, l'équipe   viennent-ils chez moi, et qui vient ?
 *   → le devis.
 *
 * Aucun avis non vérifié, aucun compteur inventé : voir docs/VERIFICATION.md.
 * Le comparateur avant / après reste sur les fiches de chantier : il ne
 * remontera sur l'accueil que lorsque de vraies paires (même lieu, même
 * cadrage) auront été fournies.
 */
export default function Home() {
  return (
    <>
      <ArchitecturalExperience />

      {/* La preuve avant le discours */}
      <ProjectCarousel
        projects={featured}
        sectionLabel="Nos chantiers"
        title="Le travail parle pour nous."
        text="Une seule réalisation à la fois, en grand - comme elle a été livrée."
        link={{ label: 'Toutes les réalisations', to: '/realisations' }}
      />

      <Signature />

      <ServicesShowcase />

      <Section tone="bark">
        <Container>
          <SectionHeading
            tone="light"
            title="Quatre étapes, zéro surprise."
            text="Vous savez à tout moment où en est votre chantier, ce qui a été fait et ce qui vient ensuite."
          />
          <ProcessTimeline tone="light" className="mt-block" />

          {/* La page « méthode » n'était liée depuis nulle part : ni la
              navigation, ni une section. Le bouton ci-dessous l'ouvre. */}
          <div className="mt-10 text-center">
            <Button to="/methode" variant="outlineLight">
              Découvrir notre méthode
            </Button>
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
            revealFrom="fade"
            className="lg:col-span-5"
          />

          <Reveal from="right" className="lg:col-span-7">
            <h2 className="t-h2 max-w-[18ch] text-balance">
              Deux artisans, une même exigence depuis {BRAND.founded}.
            </h2>
            {/* Emphase par la couleur, pas par la graisse : le contexte
                s'écrit en gris, la phrase qui compte revient au noir du texte.
                L'œil trouve la conclusion sans qu'on la mette en gras. */}
            <p className="t-lead measure mt-6 text-ink/65">
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
