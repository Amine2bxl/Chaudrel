import PageHero from '@/components/sections/PageHero';
import CTASection from '@/components/sections/CTASection';
import Commitments from '@/components/sections/Commitments';
import DetailStrip, { DETAILS } from '@/components/sections/DetailStrip';
import { Container, Eyebrow, Media, Section, SectionHeading } from '@/components/ui';
import Reveal from '@/lib/reveal';
import { SIZES } from '@/lib/image';
import { BRAND } from '@/data/site';
import { SERVICES } from '@/data/services';

/**
 * À propos - qui est Chaudrel, en faits vérifiés : fondation en 2009,
 * siège à Schaerbeek, deux associés et leurs rôles, six métiers, zone
 * d'intervention. Aucun chiffre de chantiers ni de clients (non communiqué).
 */
export default function About() {
  return (
    <>
      <PageHero
        title={
          <>
            Une entreprise de rénovation, <em>fondée en {BRAND.founded}.</em>
          </>
        }
        intro={`Chaudrel est née à Bruxelles et travaille aujourd’hui dans toute la Belgique, depuis son siège de ${BRAND.address.city}.`}
        breadcrumb={[{ label: 'Accueil', to: '/' }, { label: 'À propos' }]}
        image={{
          src: '/photos/facade-garages.webp',
          alt: 'Façade en brique sombre, volume enduit gris clair et deux portes de garage sectionnelles',
          w: 1920,
          h: 1080,
          position: '62% 50%',
          caption: 'Façade enduite et portes de garage - photo de chantier',
        }}
      />

      <Section>
        <Container className="grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-6">
            <Eyebrow>Notre approche</Eyebrow>
            <h2 className="t-h2 mt-6 max-w-[22ch] text-balance">
              Nous ne vendons pas des travaux. <em>Nous livrons des lieux qui fonctionnent.</em>
            </h2>
          </Reveal>
          <Reveal delay={100} className="space-y-5 lg:col-span-5 lg:col-start-8">
            <p className="t-body measure text-ink/75">
              {BRAND.founders[0].name} est sur les chantiers : technique, coordination, exécution.{' '}
              {BRAND.founders[1].name} s’occupe du dessin, des matériaux et de la relation avec vous. À deux, ils voient
              passer chaque décision - c’est ce qui permet de tenir la qualité sans multiplier les intermédiaires.
            </p>
            <p className="t-body measure text-ink/75">
              Nous travaillons pour des particuliers et des commerces. Une façade à reprendre ou une maison entière : la
              méthode ne change pas, seule la durée du chantier bouge.
            </p>
          </Reveal>
        </Container>
      </Section>

      <Section tone="paper">
        <Container>
          <SectionHeading label="Les associés" title="Deux rôles, une seule équipe." />
          <ul className="mt-block grid gap-px overflow-hidden rounded-lg border border-ink/[0.08] bg-ink/[0.08] sm:grid-cols-2">
            {BRAND.founders.map((f, i) => (
              <Reveal as="li" key={f.name} delay={i * 80} className="bg-paper p-8 sm:p-10">
                <p className="t-num text-[15px] text-gold-ink">{String(i + 1).padStart(2, '0')}</p>
                <h3 className="mt-10 font-display text-[clamp(2rem,1.6rem+1.2vw,2.75rem)] leading-none">{f.name}</h3>
                <p className="mt-3 text-[14px] text-ink/70">{f.role}</p>
                <a href={`tel:${BRAND.phones[i]?.tel}`} className="link-gold mt-8 inline-block text-[14px]">
                  {BRAND.phones[i]?.number}
                </a>
              </Reveal>
            ))}
          </ul>
          {/* TODO_PHOTO : portrait des deux associés à demander à Chaudrel. */}
        </Container>
      </Section>

      <Section>
        <Container className="grid items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Media
              src="/photos/pf-2.webp"
              alt="Maison en brique rouge, châssis et porte anthracite, volets roulants"
              width={900}
              height={1125}
              ratio="aspect-[4/5]"
              sizes={SIZES.half}
              drift
            />
          </div>
          <Reveal className="lg:col-span-6 lg:col-start-7">
            <Eyebrow>En chiffres vérifiables</Eyebrow>
            <dl className="mt-8 divide-y divide-ink/10 border-y border-ink/10">
              {[
                ['Fondée en', String(BRAND.founded)],
                ['Siège', `${BRAND.address.street}, ${BRAND.address.postalCode} ${BRAND.address.city}`],
                ['Zone d’intervention', BRAND.zone],
                ['Métiers', `${SERVICES.length} - ${SERVICES.map((s) => s.title.toLowerCase()).join(', ')}`],
                ['TVA', BRAND.vat],
              ].map(([k, v]) => (
                <div key={k} className="grid gap-1 py-4 sm:grid-cols-[11rem_1fr] sm:gap-6">
                  <dt className="text-[13px] text-ink/65">{k}</dt>
                  <dd className="text-[14.5px]">{v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </Container>
      </Section>

      <Section tone="paper">
        <Container>
          <SectionHeading
            label="Savoir-faire"
            title={
              <>
                Ce que l’on voit <em>de près.</em>
              </>
            }
            align="split"
          />
          <div className="mt-block">
            <DetailStrip details={DETAILS.slice(2, 6)} />
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeading label="Nos engagements" title="Ce à quoi nous nous engageons." />
          <div className="mt-block">
            <Commitments />
          </div>
        </Container>
      </Section>

      <CTASection source="a_propos" />
    </>
  );
}
