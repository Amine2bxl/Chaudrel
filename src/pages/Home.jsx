import Hero from '@/components/sections/Hero';
import FactsBand from '@/components/sections/FactsBand';
import ProjectCarousel from '@/components/sections/ProjectCarousel';
import ServicesBoard from '@/components/sections/ServicesBoard';
import ProcessStairs from '@/components/sections/ProcessStairs';
import BelgiumCoverage from '@/components/sections/BelgiumCoverage';
import BeforeAfter from '@/components/sections/BeforeAfter';
import CTASection from '@/components/sections/CTASection';
import { Container, Panel, Section, SectionHeading, TextLink } from '@/components/ui';
import { FounderRows, Row } from '@/components/layout/ContactList';
import { HouseIcon } from '@/components/ui/Icons';
import Reveal from '@/lib/reveal';
import { imageAttrs, SIZES } from '@/lib/image';
import { PROJECTS } from '@/data/projects';

const featured = PROJECTS.filter((p) => p.featured);
/* Une comparaison n'apparaît que pour une vraie paire, prise du même point de vue. */
const compared = PROJECTS.find((p) => p.beforeAfter);

/**
 * L'accueil répond à quatre questions, dans cet ordre, puis demande le devis :
 *   1. qui sont-ils, que font-ils ?   → la porte, la promesse, quatre faits
 *   2. est-ce que c'est bien fait ?   → les chantiers (et l'avant / après)
 *   3. est-ce qu'ils font mon poste ? → les métiers
 *   4. comment ça se passe ?          → les étapes, la zone, les fondateurs
 *   → le devis.
 *
 * Une seule matière pour tout le corps : la carte de verre de la page de
 * liens (faits, métiers, étapes, zone, fondateurs, appel final). Un titre par
 * section, sans phrase dessous ; les photos restent nues, en grand.
 */
export default function Home() {
  return (
    <>
      <Hero />
      <FactsBand />

      <ProjectCarousel
        projects={featured}
        title="Des chantiers, pas des promesses."
        link={{ label: 'Toutes les réalisations', to: '/realisations' }}
      />

      {compared && (
        <Section>
          <Container>
            <SectionHeading title="Glissez la porte : avant, après." />
            <BeforeAfter
              className="mt-block"
              before={compared.beforeAfter.before}
              after={compared.beforeAfter.after}
              label={compared.title}
            />
          </Container>
        </Section>
      )}

      <Section className="relative isolate">
        {/* Une lueur bronze derrière les métiers, comme sur l'appel de fin de page. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[radial-gradient(40%_50%_at_66%_60%,rgb(var(--c-gold-rgb)/0.22),transparent),radial-gradient(26%_40%_at_24%_58%,rgb(var(--c-gold-light-rgb)/0.1),transparent)]"
        />
        <Container>
          <SectionHeading title="Une rénovation complète, ou un seul poste." />
          <ServicesBoard visual className="mt-block" />
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeading title="Quatre étapes, zéro surprise.">
            <TextLink to="/methode" className="flex-none">
              Notre méthode
            </TextLink>
          </SectionHeading>
          <ProcessStairs className="mt-block" />
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeading title="De Schaerbeek à toute la Belgique." />
          <BelgiumCoverage className="mt-block" />
        </Container>
      </Section>

      <Founders />

      <CTASection source="home" />
    </>
  );
}

/** Les deux fondateurs : un chantier livré à gauche, leurs lignes directes à droite. */
function Founders() {
  return (
    <Section>
      <Container className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
        <Reveal from="veil" className="aspect-[4/5] overflow-hidden rounded-[28px] bg-sand lg:col-span-5">
          <div className="h-full w-full overflow-hidden">
            <img
              {...imageAttrs('/photos/maison-brique.webp', SIZES.half)}
              alt="Grande maison en brique, allée neuve en asphalte et garages"
              width="1000"
              height="1333"
              loading="lazy"
              decoding="async"
              className="parallax h-full w-full object-cover"
            />
          </div>
        </Reveal>

        <div className="lg:col-span-7">
          <SectionHeading title="Deux fondateurs. Un seul interlocuteur." />
          <Reveal delay={100} className="mt-block">
            <Panel>
              <FounderRows source="home_founders" />
              <Row to="/a-propos" icon={HouseIcon} label="Qui sommes-nous" className="mt-2.5" />
            </Panel>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
