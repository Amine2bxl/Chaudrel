import PageHero from '@/components/sections/PageHero';
import { Button, Container, Section } from '@/components/ui';

export default function NotFound() {
  return (
    <>
      <PageHero
        title="Cette page n’existe pas"
        intro="Le lien est peut-être ancien, ou recopié en partie."
      />
      <Section tone="cream">
        {/* Deux issues, pas trois. La troisième - « Devis gratuit » - est déjà
            dans la barre de navigation et dans la barre d'action mobile : la
            répéter ici mettait trois portes de même taille devant quelqu'un qui
            cherchait autre chose. */}
        <Container className="flex flex-wrap gap-3">
          <Button to="/" variant="solid">
            Retour à l’accueil
          </Button>
          <Button to="/realisations" variant="outline">
            Voir les réalisations
          </Button>
        </Container>
      </Section>
    </>
  );
}
