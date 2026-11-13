import VisitExperience from '@/components/visit/VisitExperience';
import CTASection from '@/components/sections/CTASection';

/**
 * /visite - la maison d'étude, à parcourir de l'intérieur.
 */
export default function Visit() {
  return (
    <>
      <VisitExperience />
      <CTASection
        title={
          <>
            Votre maison, <em>pièce par pièce.</em>
          </>
        }
        text="Racontez-nous votre projet : nous venons voir le lieu et vous remettons un devis détaillé, poste par poste."
        source="visit"
      />
    </>
  );
}
