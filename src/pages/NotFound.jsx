import PageHero from '@/components/sections/PageHero';
import { Button, Container, Section } from '@/components/ui';

export default function NotFound() {
  return (
    <>
      <PageHero
        eyebrow="Erreur 404"
        title="Cette page n'existe pas"
        intro="Le lien est peut-être ancien ou mal recopié. Voici par où continuer."
      />
      <Section tone="cream">
        <Container className="flex flex-wrap gap-3">
          <Button to="/" variant="primary">
            Retour à l'accueil
          </Button>
          <Button to="/realisations" variant="outline">
            Voir les réalisations
          </Button>
          <Button to="/devis" variant="outline">
            Demander un devis
          </Button>
        </Container>
      </Section>
    </>
  );
}
