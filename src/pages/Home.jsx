import ArchitecturalExperience from '@/components/experience/ArchitecturalExperience';
import ProjectCarousel from '@/components/sections/ProjectCarousel';
import ServicesShowcase from '@/components/sections/ServicesShowcase';
import Signature from '@/components/sections/Signature';
import ProcessTimeline from '@/components/sections/ProcessTimeline';
import BelgiumCoverage from '@/components/sections/BelgiumCoverage';
import CTASection from '@/components/sections/CTASection';
import { Button, Container, Eyebrow, Media, Section, SectionHeading, TextLink } from '@/components/ui';
import Reveal from '@/lib/reveal';
import { PROJECTS } from '@/data/projects';
import { BRAND } from '@/data/site';

const featured = PROJECTS.filter((p) => p.featured);

/**
 * L'accueil est un récit, dans cet ordre :
 *   1. la maquette 3D      l'histoire entière, en six temps (voir data/story.js)
 *   2. les chantiers       la preuve, juste après l'illustration
 *   3. la signature        qui parle, et quatre faits vérifiables
 *   4. les métiers         est-ce qu'ils font mon poste ?
 *   5. la méthode          comment ça se passe
 *   6. la zone, l'équipe   viennent-ils chez moi, et qui vient ?
 *   → le devis.
 *
 * Les sections alternent clair et sombre, et chaque changement de ton se fait
 * par une « nappe » (coins hauts arrondis qui remontent sur la section
 * précédente) : une seule façon de passer d'un chapitre à l'autre.
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

      {/* La preuve avant le discours - le film se termine dans le sombre, la
          galerie le prolonge sans couture. */}
      <ProjectCarousel
        projects={featured}
        sectionLabel="Nos chantiers"
        title={
          <>
            Le travail parle <em>pour nous.</em>
          </>
        }
        text="Des chantiers livrés, photographiés tels qu’ils ont été rendus."
        link={{ label: 'Toutes les réalisations', to: '/realisations' }}
      />

      <Signature />

      <ServicesShowcase />

      <Section tone="bark" sheet>
        <Container>
          <SectionHeading
            tone="light"
            label="Notre méthode"
            title={
              <>
                Quatre étapes, <em>zéro surprise.</em>
              </>
            }
            text="Vous savez à tout moment où en est votre chantier, ce qui a été fait et ce qui vient ensuite."
          />
          <ProcessTimeline tone="light" className="mt-block" />

          <div className="mt-10 text-center">
            <Button to="/methode" variant="outlineLight">
              Découvrir notre méthode
            </Button>
          </div>
        </Container>
      </Section>

      {/* « Venez-vous chez moi ? » est la question qui suit immédiatement
          « comment ça se passe ? ». */}
      <Section tone="cream" sheet>
        <Container>
          <SectionHeading
            label="Zone d’intervention"
            title={
              <>
                De Schaerbeek à <em>toute la Belgique.</em>
              </>
            }
          />
          <BelgiumCoverage className="mt-block" />
        </Container>
      </Section>

      <Section tone="shell">
        <Container className="grid items-center gap-10 lg:grid-cols-12 lg:gap-20">
          <Media
            src="/story-before-after.webp"
            alt="Maison rénovée par Chaudrel à Overijse"
            ratio="aspect-[4/3] lg:aspect-[4/5]"
            shape="leaf"
            revealFrom="veil"
            className="lg:col-span-5"
          />

          <Reveal from="right" className="lg:col-span-7">
            <Eyebrow className="mb-6">L’équipe</Eyebrow>
            <h2 className="t-h2 max-w-[18ch] text-balance">
              Deux artisans, une même exigence <em>depuis {BRAND.founded}.</em>
            </h2>
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
