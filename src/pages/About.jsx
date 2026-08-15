import PageHero from '@/components/sections/PageHero';
import Testimonials from '@/components/sections/Testimonials';
import CtaBand from '@/components/sections/CtaBand';
import { Container, Section, SectionHeading } from '@/components/ui';
import Reveal from '@/lib/reveal';
import { BRAND } from '@/data/site';

const VALUES = [
  {
    title: 'Un seul interlocuteur',
    text: "Vous n'avez pas à coordonner cinq corps de métier. Nous le faisons, et vous parlez à une seule personne.",
  },
  {
    title: 'Le travail bien fait',
    text: "Les finitions sont ce qui reste une fois le chantier terminé. Nous ne livrons pas un chantier que nous ne signerions pas.",
  },
  {
    title: 'Un devis clair',
    text: "Ce qui est prévu est écrit. Ce qui ne l'est pas vous est dit avant, pas après.",
  },
  {
    title: 'Le respect du lieu',
    text: "Un chantier se déroule chez vous. Protection, propreté et remise en état font partie du travail.",
  },
];

export default function About() {
  return (
    <>
      <PageHero
        eyebrow="À propos"
        title="Chaudrel, entreprise de rénovation bruxelloise"
        intro={`Fondée en ${BRAND.founded} à Bruxelles par ${BRAND.founders.map((f) => f.name).join(' et ')}.`}
        breadcrumb={[{ label: 'Accueil', to: '/' }, { label: 'À propos' }]}
      />

      <Section tone="cream">
        <Container className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal from="left">
            <div className="aspect-[4/5] overflow-hidden bg-brand-sand">
              {/* TODO_VALIDATION : remplacer par une vraie photo de l'équipe Chaudrel. */}
              <img
                src="/story-before-after.webp"
                alt="Chantier de rénovation mené par l'équipe Chaudrel"
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover"
              />
            </div>
          </Reveal>

          <Reveal from="right" className="prose-brand">
            <p className="eyebrow">Notre histoire</p>
            <h2 className="h-display mb-6 text-[2rem] text-brand-ink sm:text-4xl">
              Deux artisans,
              <br />
              <span className="italic text-brand-gold">une exigence</span>
            </h2>
            <p>
              Chaudrel est née en {BRAND.founded} à Bruxelles. {BRAND.founders[0].name} suit les chantiers et la technique,{' '}
              {BRAND.founders[1].name} le design et la relation avec les clients. Cette répartition n'a pas changé depuis :
              elle explique pourquoi vous n'avez jamais qu'un seul interlocuteur.
            </p>
            <p>
              Nous travaillons principalement à Bruxelles et dans sa périphérie, sur des logements privés et des espaces
              commerciaux. Rénovations complètes, cuisines, salles de bain, aménagements : la logique reste la même —
              comprendre l'usage avant de toucher au bâti.
            </p>
            <p>
              L'entreprise est enregistrée sous le numéro de TVA {BRAND.vat}, à {BRAND.address.city}.
            </p>
          </Reveal>
        </Container>
      </Section>

      <Section tone="white">
        <Container>
          <SectionHeading eyebrow="Nos valeurs" title="Ce sur quoi" accent="nous ne transigeons pas" />
          <div className="mt-12 grid gap-px bg-brand-ink/10 md:grid-cols-2">
            {VALUES.map((v, i) => (
              <Reveal key={v.title} delay={i * 70} className="bg-white p-8">
                <h3 className="font-display text-xl font-light text-brand-ink">{v.title}</h3>
                <p className="mt-3 text-[14px] font-light leading-[1.8] text-brand-ink/60">{v.text}</p>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <Testimonials limit={3} />

      <CtaBand source="about" />
    </>
  );
}
