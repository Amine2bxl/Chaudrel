import { useRef } from 'react';
import { motion, useTransform } from 'motion/react';
import useSectionProgress from '@/lib/useSectionProgress';
import Hero from '@/components/sections/Hero';
import FactsBand from '@/components/sections/FactsBand';
import ProjectCarousel from '@/components/sections/ProjectCarousel';
import ServicesBoard from '@/components/sections/ServicesBoard';
import ProcessTimeline from '@/components/sections/ProcessTimeline';
import BelgiumCoverage from '@/components/sections/BelgiumCoverage';
import CTASection from '@/components/sections/CTASection';
import { Button, Container, Section, SectionHeading, TextLink } from '@/components/ui';
import Reveal from '@/lib/reveal';
import usePointerGlow from '@/lib/usePointerGlow';
import { imageAttrs, SIZES } from '@/lib/image';
import { PROJECTS } from '@/data/projects';
import { BRAND } from '@/data/site';

const featured = PROJECTS.filter((p) => p.featured);

/**
 * L'accueil répond à quatre questions, dans cet ordre, puis demande le devis :
 *   1. qui sont-ils, que font-ils ?   → la porte, la promesse, quatre faits
 *   2. est-ce que c'est bien fait ?   → les chantiers
 *   3. est-ce qu'ils font mon poste ? → les métiers
 *   4. comment ça se passe ?          → les quatre étapes, la zone
 *   → qui sera mon interlocuteur, puis le devis.
 */
export default function Home() {
  return (
    <>
      <Hero />
      <FactsBand />

      <ProjectCarousel
        projects={featured}
        sectionLabel="Nos chantiers"
        title="Des chantiers, pas des promesses."
        text="Portes, châssis, façades, toitures : nos chantiers, en photos."
        link={{ label: 'Toutes les réalisations', to: '/realisations' }}
      />

      <Section tone="cream">
        <Container>
          <SectionHeading
            title="Une rénovation complète, ou un seul poste."
            text="Dans les deux cas, nous coordonnons tous les corps de métier : vous n’avez qu’un numéro à retenir."
          />
          <ServicesBoard className="mt-block" />
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
          <BelgiumCoverage className="mt-block" />
        </Container>
      </Section>

      <Founders />

      <CTASection source="home" />
    </>
  );
}

/**
 * Les deux fondateurs : la raison de choisir Chaudrel, dite sur une carte de
 * verre posée sur un chantier livré. La photo glisse plus lentement que la
 * page - la carte semble flotter devant.
 */
function Founders() {
  const ref = useRef(null);
  const glow = usePointerGlow();
  const scrollYProgress = useSectionProgress(ref);
  const y = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);
  const [alberto, matteo] = BRAND.founders;

  return (
    <Section tone="shell">
      <Container>
        <div ref={ref} className="relative overflow-hidden rounded-[32px] bg-bark">
          <motion.img
            {...imageAttrs('/story-before-after.webp', SIZES.full)}
            alt="Grande maison en brique, allée neuve en asphalte et garages"
            width="1000"
            height="1333"
            loading="lazy"
            decoding="async"
            style={{ y, scale: 1.18 }}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-r from-bark/70 via-bark/20 to-transparent"
          />

          <div className="relative flex min-h-[640px] items-end p-4 sm:p-8 lg:min-h-[720px] lg:items-center lg:p-14">
            <Reveal {...glow} className="glass-dark w-full max-w-[34rem] rounded-[28px] p-7 text-cream sm:p-10">
              <h2 className="t-h2 text-balance">Deux fondateurs. Un seul interlocuteur.</h2>
              <p className="t-lead mt-6 text-cream/80">
                {alberto.name} suit les chantiers et la technique. {matteo.name} s’occupe du design et de la relation
                client. Depuis {BRAND.founded}, cette répartition n’a pas bougé : vous savez toujours qui appeler.
              </p>
              <dl className="mt-8 grid grid-cols-2 gap-6 border-t border-cream/15 pt-6">
                {BRAND.founders.map((f) => (
                  <div key={f.name}>
                    <dt className="font-display text-[1.5rem] leading-none">{f.name}</dt>
                    <dd className="t-small mt-2 text-cream/70">{f.role}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-8">
                <TextLink to="/a-propos" tone="light">
                  Qui sommes-nous
                </TextLink>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </Section>
  );
}
