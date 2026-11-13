import { Link } from 'react-router-dom';
import { Button, Container } from '@/components/ui';
import { NAV } from '@/data/site';

export default function NotFound() {
  return (
    <section className="flex min-h-[80svh] items-center pb-section pt-[calc(var(--header-h)+3rem)]">
      <Container className="grid gap-12 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-7">
          <p
            aria-hidden="true"
            className="t-num text-[clamp(6rem,18vw,12rem)] leading-[0.8] text-transparent [-webkit-text-stroke:1px_rgb(var(--c-gold-deep-rgb))]"
          >
            404
          </p>
          <h1 className="t-h1 enter mt-8 max-w-[18ch]">
            Cette page <em>n’existe pas</em> ou a été déplacée.
          </h1>
          <p className="t-lead enter d1 mt-5 max-w-[44ch] text-ink/70">
            Le lien est peut-être ancien. Repartez de l’accueil ou d’une des rubriques.
          </p>
          <div className="enter d2 mt-9 flex flex-wrap gap-3">
            <Button to="/" arrow>
              Retour à l’accueil
            </Button>
            <Button to="/devis" variant="outline">
              Demander un devis
            </Button>
          </div>
        </div>
        <nav aria-label="Rubriques" className="lg:col-span-4 lg:col-start-9">
          <ul className="divide-y divide-ink/10 border-y border-ink/10">
            {NAV.map((n) => (
              <li key={n.to}>
                <Link to={n.to} className="group flex items-center justify-between py-4 text-[15px]">
                  {n.label}
                  <span aria-hidden="true" className="text-gold-deep transition-transform duration-fast group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </section>
  );
}
