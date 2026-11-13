import PageHero from '@/components/sections/PageHero';
import ServiceIndex from '@/components/sections/ServiceIndex';
import Commitments from '@/components/sections/Commitments';
import CTASection from '@/components/sections/CTASection';
import { Container, Section, SectionHeading } from '@/components/ui';
import { BRAND } from '@/data/site';
import { SERVICES } from '@/data/services';

/**
 * Services - les six métiers annoncés par Chaudrel (data/services.js), et
 * rien d'autre. Une ligne par métier avec le détail des postes, puis les
 * engagements communs à tous les chantiers.
 */
export default function Services() {
  return (
    <>
      <PageHero
        title={
          <>
            Nos métiers, <em>du gros œuvre aux finitions.</em>
          </>
        }
        intro="Nous prenons un chantier entier ou un seul poste. Dans les deux cas, nous coordonnons les intervenants et vous gardez un interlocuteur."
        breadcrumb={[{ label: 'Accueil', to: '/' }, { label: 'Services' }]}
        aside={
          <dl className="grid grid-cols-2 gap-6 border-t border-ink/12 pt-6">
            <div>
              <dt className="t-h3">{SERVICES.length} métiers</dt>
              <dd className="mt-1 text-[13px] text-ink/65">Dedans comme dehors</dd>
            </div>
            <div>
              <dt className="t-h3">{BRAND.zone}</dt>
              <dd className="mt-1 text-[13px] text-ink/65">Depuis {BRAND.address.city}</dd>
            </div>
          </dl>
        }
      />

      <Section className="pt-0">
        <Container>
          <ServiceIndex headingLevel="h2" detailed />
        </Container>
      </Section>

      <Section tone="paper">
        <Container>
          <SectionHeading
            label="Sur chaque chantier"
            title={
              <>
                Quel que soit le métier, <em>la même méthode.</em>
              </>
            }
          />
          <div className="mt-block">
            <Commitments />
          </div>
        </Container>
      </Section>

      <CTASection source="services" />
    </>
  );
}
