import { Container } from '@/components/ui';
import { TRUST } from '@/data/site';
import Reveal from '@/lib/reveal';

/**
 * Éléments de confiance affichés juste après le Hero.
 * Uniquement des données vérifiables — aucun compteur inventé.
 */
export default function TrustBar() {
  return (
    <section className="border-b border-brand-ink/10 bg-brand-cream py-8 lg:py-10">
      <Container>
        <dl className="grid grid-cols-2 gap-6 lg:grid-cols-4">
          {TRUST.map((t, i) => (
            <Reveal key={t.label} delay={i * 60} from="fade" className="text-center lg:text-left">
              <dt className="sr-only">{t.label}</dt>
              <dd>
                <p className="font-display text-xl font-light text-brand-ink lg:text-2xl">{t.value}</p>
                <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-brand-ink/40">{t.label}</p>
              </dd>
            </Reveal>
          ))}
        </dl>
      </Container>
    </section>
  );
}
