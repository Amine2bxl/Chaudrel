import Hero from '@/components/sections/Hero';
import FactsBand from '@/components/sections/FactsBand';
import ProjectCarousel from '@/components/sections/ProjectCarousel';
import ServicesBoard from '@/components/sections/ServicesBoard';
import ProcessTimeline from '@/components/sections/ProcessTimeline';
import BelgiumCoverage from '@/components/sections/BelgiumCoverage';
import BeforeAfter from '@/components/sections/BeforeAfter';
import CTASection from '@/components/sections/CTASection';
import { Button, Container, Section, SectionHeading, TextLink } from '@/components/ui';
import Reveal from '@/lib/reveal';
import { imageAttrs, SIZES } from '@/lib/image';
import { PROJECTS } from '@/data/projects';
import { BRAND } from '@/data/site';

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
 * Visuel et texte alternent de côté d'un bloc au suivant : métiers (photo à
 * gauche), zone (carte à droite), fondateurs (photo à gauche), appel final
 * (contacts à droite).
 */
export default function Home() {
  return (
    <>
      <Hero />
      <FactsBand />

      <ProjectCarousel
        projects={featured}
        title="Des chantiers, pas des promesses."
        text="Portes, châssis, façades, toitures : nos chantiers, en photos."
        link={{ label: 'Toutes les réalisations', to: '/realisations' }}
      />

      {compared && (
        <Section tone="bark">
          <Container>
            <SectionHeading
              tone="light"
              title="Glissez la porte : avant, après."
              text={`${compared.title} - le même point de vue, avant et après le chantier.`}
            />
            <BeforeAfter
              className="mt-block"
              before={compared.beforeAfter.before}
              after={compared.beforeAfter.after}
              label={compared.title}
            />
          </Container>
        </Section>
      )}

      <Section tone="shell">
        <Container>
          <SectionHeading
            title="Une rénovation complète, ou un seul poste."
            text="Dans les deux cas, nous coordonnons tous les corps de métier : vous n’avez qu’un numéro à retenir."
          />
          <ServicesBoard visual className="mt-block" />
        </Container>
      </Section>

      <Section tone="bark">
        <Container>
          <SectionHeading
            tone="light"
            title="Quatre étapes, zéro surprise."
            text="Vous savez à tout moment où en est votre chantier, ce qui a été fait et ce qui vient ensuite."
          />
          <ProcessTimeline tone="light" className="mt-block" />
          <div className="mt-12 text-center">
            <Button to="/methode" variant="outlineLight" arrow>
              Découvrir notre méthode
            </Button>
          </div>
        </Container>
      </Section>

      <Section tone="cream">
        <Container>
          <SectionHeading title="De Schaerbeek à toute la Belgique." />
          <BelgiumCoverage flip className="mt-block" />
        </Container>
      </Section>

      <Founders />

      <CTASection source="home" />
    </>
  );
}

/** Les deux fondateurs - photo d'un chantier livré à gauche, le texte à droite. */
function Founders() {
  const [alberto, matteo] = BRAND.founders;

  return (
    <Section tone="shell">
      <Container className="grid items-center gap-12 lg:grid-cols-12 lg:gap-20">
        <Reveal from="veil" className="aspect-[4/5] overflow-hidden rounded-[28px] bg-sand lg:col-span-6">
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

        <Reveal from="right" className="lg:col-span-6">
          <h2 className="t-h2 max-w-[16ch] text-balance">Deux fondateurs. Un seul interlocuteur.</h2>
          <p className="t-lead measure mt-6 text-ink/80">
            {alberto.name} suit les chantiers et la technique. {matteo.name} s’occupe du design et de la relation client.
            Depuis {BRAND.founded}, cette répartition n’a pas bougé : vous savez toujours qui appeler.
          </p>
          <dl className="mt-10 grid max-w-md grid-cols-2 gap-6">
            {BRAND.founders.map((f) => (
              <div key={f.name} className="border-t border-gold/40 pt-5">
                <dt className="font-display text-[1.75rem] leading-none">{f.name}</dt>
                <dd className="t-small mt-2.5 text-ink/70">{f.role}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-10">
            <TextLink to="/a-propos">Qui sommes-nous</TextLink>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
