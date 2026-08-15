import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Hero from '@/components/sections/Hero';
import TrustBar from '@/components/sections/TrustBar';
import ProjectCard from '@/components/sections/ProjectCard';
import ServiceCard from '@/components/sections/ServiceCard';
import MethodSteps from '@/components/sections/MethodSteps';
import BeforeAfter from '@/components/sections/BeforeAfter';
import Testimonials from '@/components/sections/Testimonials';
import FaqAccordion from '@/components/sections/FaqAccordion';
import CtaBand from '@/components/sections/CtaBand';
import { Button, Container, Section, SectionHeading } from '@/components/ui';
import Reveal from '@/lib/reveal';
import { PROJECTS } from '@/data/projects';
import { SERVICES } from '@/data/services';
import { FAQS } from '@/data/faqs';
import { BRAND } from '@/data/site';

const featured = PROJECTS.filter((p) => p.featured).slice(0, 4);
const beforeAfterProjects = PROJECTS.filter((p) => p.beforeAfter).slice(0, 3);

export default function Home() {
  return (
    <>
      <Hero />
      <TrustBar />

      {/* Réalisations — cœur visuel du site */}
      <Section tone="cream" id="realisations">
        <Container>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading
              eyebrow="Réalisations"
              title="Ce que nous"
              accent="créons pour vous"
              intro="Chaque chantier est un lieu livré, habité, utilisé. Voici quelques-unes de nos réalisations à Bruxelles et en périphérie."
            />
            <Reveal from="fade">
              <Link
                to="/realisations"
                className="inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-brand-ink transition-all duration-300 hover:gap-4 hover:text-brand-gold"
              >
                Toutes les réalisations
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Reveal>
          </div>

          <div className="mt-12 grid gap-4 lg:grid-cols-3">
            {featured.map((p, i) => (
              <Reveal key={p.slug} delay={i * 80} className={p.span}>
                <ProjectCard project={p} priority={i === 0} />
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* Avant / après */}
      {beforeAfterProjects.length > 0 && (
        <Section tone="white">
          <Container>
            <SectionHeading
              eyebrow="Avant / après"
              title="La différence"
              accent="se voit"
              intro="Les mêmes espaces, avant et après notre intervention."
            />
            <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {beforeAfterProjects.map((p, i) => (
                <Reveal key={p.slug} delay={i * 80}>
                  <BeforeAfter
                    before={p.beforeAfter.before}
                    after={p.beforeAfter.after}
                    label={`${p.title} — ${p.location}`}
                  />
                  <div className="mt-4">
                    <h3 className="font-display text-lg font-light text-brand-ink">{p.title}</h3>
                    <p className="mt-1 text-[12px] uppercase tracking-[0.14em] text-brand-ink/40">{p.location}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* Services */}
      <Section tone="sand" id="services">
        <Container>
          <SectionHeading
            eyebrow="Services"
            title="Un savoir-faire"
            accent="complet"
            intro="De la rénovation complète aux finitions, nous prenons en charge l'ensemble du chantier avec un seul interlocuteur."
          />
          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {SERVICES.slice(0, 6).map((s, i) => (
              <Reveal key={s.slug} delay={i * 60}>
                <ServiceCard service={s} className="h-full" />
              </Reveal>
            ))}
          </div>
          <div className="mt-10">
            <Button to="/services" variant="outline">
              Tous nos services
            </Button>
          </div>
        </Container>
      </Section>

      {/* Méthode */}
      <Section tone="dark">
        <Container>
          <SectionHeading
            eyebrow="Notre méthode"
            tone="dark"
            title="Cinq étapes,"
            accent="aucune surprise"
            intro="De votre premier appel à la livraison du chantier, vous savez toujours où en est votre projet."
          />
        </Container>
        <Container className="mt-12">
          <MethodSteps tone="dark" />
        </Container>
      </Section>

      <Testimonials limit={3} />

      {/* À propos, court */}
      <Section tone="cream">
        <Container className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal from="left">
            <div className="aspect-[4/5] overflow-hidden bg-brand-sand">
              <img
                src="/story-before-after.webp"
                alt="Chantier de rénovation Chaudrel à Bruxelles"
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover"
              />
            </div>
          </Reveal>
          <Reveal from="right">
            <p className="eyebrow">À propos</p>
            <h2 className="h-display text-[2rem] text-brand-ink sm:text-4xl lg:text-5xl">
              Une entreprise,
              <br />
              <span className="italic text-brand-gold">un interlocuteur</span>
            </h2>
            <div className="prose-brand mt-6 space-y-5">
              <p>
                Chaudrel a été fondée en {BRAND.founded} à Bruxelles par {BRAND.founders.map((f) => f.name).join(' et ')}.
                Depuis, notre travail suit la même logique : comprendre l'usage d'un espace avant d'y toucher, et le livrer
                fini, propre et prêt à vivre.
              </p>
              <p>
                Nous intervenons à Bruxelles et dans sa périphérie, sur des rénovations complètes comme sur des chantiers
                ciblés. Un seul interlocuteur suit votre projet du premier contact à la livraison.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button to="/a-propos" variant="outline">
                Découvrir Chaudrel
              </Button>
              <Button to="/methode" variant="outline">
                Notre méthode
              </Button>
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* FAQ */}
      <Section tone="white">
        <Container className="max-w-3xl">
          <SectionHeading eyebrow="Questions fréquentes" title="Tout ce que vous" accent="devez savoir" align="center" />
          <div className="mt-12">
            <FaqAccordion items={FAQS.slice(0, 5)} />
          </div>
          <p className="mt-8 text-center text-[14px] font-light text-brand-ink/55">
            <Link to="/faq" className="link-underline text-brand-gold">
              Voir toutes les questions
            </Link>
          </p>
        </Container>
      </Section>

      <CtaBand source="home_footer" />
    </>
  );
}
