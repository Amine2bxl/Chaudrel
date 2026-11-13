import PageHero from '@/components/sections/PageHero';
import ServicesEditorial from '@/components/sections/ServicesEditorial';
import CTASection from '@/components/sections/CTASection';

export default function Services() {
  return (
    <>
      <PageHero
        title={
          <>
            Six métiers, <em>un seul interlocuteur.</em>
          </>
        }
        intro="La rénovation complète comme le poste isolé. Chaque métier a sa page : ce qu’il couvre, comment nous intervenons, et les chantiers qui le montrent."
        breadcrumb={[{ label: 'Accueil', to: '/' }, { label: 'Services' }]}
      />

      <ServicesEditorial />

      <CTASection source="services" sheet />
    </>
  );
}
