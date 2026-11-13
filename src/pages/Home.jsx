import { BRAND, PROOF } from '@/data/site';
import { SIZES } from '@/lib/image';
import Reveal from '@/lib/reveal';
import HomeHero from '@/components/home/HomeHero';
import ServiceMarquee from '@/components/sections/ServiceMarquee';
import ProjectCarousel from '@/components/sections/ProjectCarousel';
import ServiceIndex from '@/components/sections/ServiceIndex';
import DetailStrip from '@/components/sections/DetailStrip';
import Commitments from '@/components/sections/Commitments';
import MethodSteps from '@/components/sections/MethodSteps';
import CTASection from '@/components/sections/CTASection';
import { Button, Container, Eyebrow, Media, Section, SectionHeading, TextLink } from '@/components/ui';

/**
 * Accueil - neuf temps, dans l'ordre où un client se pose les questions :
 *   01 ouverture         qui, quoi, où - et une vraie façade
 *   02 signature         les métiers qui défilent, la promesse en une phrase
 *   03 réalisations      les chantiers, en photographies réelles
 *   04 expertise         les six métiers
 *   05 savoir-faire      la matière, en gros plan
 *   06 histoire          depuis 2009, deux associés
 *   07 expérience        ce à quoi Chaudrel s'engage
 *   08 méthode           quatre étapes
 *   09 appel final       devis, téléphone, WhatsApp
 */
export default function Home() {
  return (
    <>
      <HomeHero />

      <ServiceMarquee />

      {/* 02 · Signature */}
      <Section>
        <Container className="grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <Eyebrow>Chaudrel Rénovation</Eyebrow>
            <h2 className="t-h2 mt-6 max-w-[26ch] text-balance">
              Un chantier entier ou un seul poste - et, dans les deux cas, <em>une seule personne à appeler.</em>
            </h2>
          </Reveal>
          <Reveal delay={120} className="lg:col-span-4 lg:col-start-9 lg:self-end">
            <dl className="grid grid-cols-2 gap-6 border-t border-ink/12 pt-6">
              {PROOF.map((p) => (
                <div key={p.value}>
                  <dt className="t-h3">{p.value}</dt>
                  <dd className="mt-1 text-[13px] text-ink/65">{p.label}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </Container>
      </Section>

      {/* 03 · Réalisations */}
      <ProjectCarousel />

      {/* 04 · Expertise */}
      <Section>
        <Container>
          <SectionHeading
            label="Nos métiers"
            title={
              <>
                Six métiers, <em>un seul chantier.</em>
              </>
            }
            text="Du gros œuvre aux finitions, dedans comme dehors. Nous coordonnons les corps de métier ; vous gardez un interlocuteur."
            align="split"
          />
          <div className="mt-block">
            <ServiceIndex />
          </div>
        </Container>
      </Section>

      {/* 05 · Savoir-faire */}
      <Section tone="paper">
        <Container>
          <SectionHeading
            label="Savoir-faire"
            title={
              <>
                Le soin se voit <em>de près.</em>
              </>
            }
            text="Gros plans recadrés dans nos photos de chantier : là où la menuiserie rencontre la brique, où l’enduit rejoint la pierre."
            align="split"
          />
          <div className="mt-block">
            <DetailStrip />
          </div>
        </Container>
      </Section>

      {/* 06 · Histoire */}
      <Section>
        <Container className="grid items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Media
              src="/photos/abords-allee.webp"
              alt="Grande maison en brique, allée neuve en asphalte et garages"
              width={1000}
              height={1333}
              ratio="aspect-[4/5]"
              sizes={SIZES.half}
              drift
            />
          </div>
          <Reveal className="lg:col-span-6 lg:col-start-7">
            <Eyebrow>Depuis {BRAND.founded}</Eyebrow>
            <h2 className="t-h2 mt-6 max-w-[22ch] text-balance">
              Deux associés, <em>chaque décision vue deux fois.</em>
            </h2>
            <p className="t-body measure mt-6 text-ink/70">
              {BRAND.founders[0].name} est sur les chantiers : technique, coordination, exécution.{' '}
              {BRAND.founders[1].name} s’occupe du dessin, des matériaux et de la relation avec vous. À deux, ils voient
              passer chaque décision - c’est ce qui permet de tenir la qualité sans multiplier les intermédiaires.
            </p>
            <dl className="mt-8 grid max-w-md grid-cols-2 gap-6 border-t border-ink/12 pt-6">
              {BRAND.founders.map((f) => (
                <div key={f.name}>
                  <dt className="t-h3">{f.name}</dt>
                  <dd className="mt-1 text-[13px] text-ink/65">{f.role}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-10">
              <TextLink to="/a-propos">Notre histoire</TextLink>
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* 07 · Expérience client */}
      <Section tone="paper">
        <Container>
          <SectionHeading
            label="Avec vous"
            title={
              <>
                Ce à quoi nous <em>nous engageons.</em>
              </>
            }
            align="split"
          >
            <Button to="/methode" variant="outline" arrow>
              Notre méthode
            </Button>
          </SectionHeading>
          <div className="mt-block">
            <Commitments />
          </div>
        </Container>
      </Section>

      {/* 08 · Méthode */}
      <Section>
        <Container>
          <SectionHeading
            label="Méthode"
            title={
              <>
                Quatre étapes, <em>dans cet ordre.</em>
              </>
            }
            text="Rien ne commence sans visite, rien ne se chiffre sans détail, rien ne se termine sans vous."
          />
          <div className="mt-block">
            <MethodSteps />
          </div>
        </Container>
      </Section>

      {/* 09 · Appel final */}
      <CTASection source="home_cta" />
    </>
  );
}
