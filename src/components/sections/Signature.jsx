import { Container, TextLink } from '@/components/ui';
import Reveal from '@/lib/reveal';
import { BRAND, PROOF } from '@/data/site';

/* Quatre faits, tous tirés de `src/data/site.js` : aucun chiffre de chantiers,
   de clients ou de satisfaction tant que Chaudrel n'en a pas communiqué. */
const FACTS = [
  { k: PROOF[0].label, v: PROOF[0].value },
  { k: PROOF[1].label, v: PROOF[1].value },
  { k: 'Avant de décider', v: BRAND.promises.quote },
  { k: 'Après votre demande', v: BRAND.promises.responseTime },
];

/**
 * Signature - la page de garde éditoriale, juste après les chantiers.
 * Une phrase (celle de la marque), un paragraphe, quatre faits alignés comme
 * le cartouche d'un plan.
 */
export default function Signature() {
  return (
    <section className="bg-cream py-section text-ink">
      <Container>
        <div className="flex items-center justify-between gap-6 border-b border-ink/15 pb-4">
          <p className="t-label text-ink/60">{BRAND.legalName}</p>
          <p className="t-label text-right text-ink/60">
            {BRAND.address.city} · depuis {BRAND.founded}
          </p>
        </div>

        <div className="mt-block grid gap-10 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-8">
            <h2 className="t-display max-w-[13ch] text-balance">
              Transformer un espace. <span className="text-ink/35">Créer un lieu.</span>
            </h2>
          </Reveal>

          <Reveal delay={120} className="lg:col-span-4 lg:self-end">
            <p className="t-lead text-ink/65">
              Chaudrel est une entreprise de rénovation et de construction. Nous prenons un chantier entier, ou un seul
              poste - et dans les deux cas, vous n’avez qu’une personne à appeler.
            </p>
            <div className="mt-7">
              <TextLink to="/a-propos">Découvrir Chaudrel</TextLink>
            </div>
          </Reveal>
        </div>

        <dl className="mt-block grid border-t border-ink/15 sm:grid-cols-2 lg:grid-cols-4">
          {FACTS.map((f, i) => (
            <Reveal key={f.k} delay={i * 70} className="border-b border-ink/15 py-6 sm:pr-8 lg:border-b-0 lg:border-l lg:pl-6 lg:first:border-l-0 lg:first:pl-0">
              <dt className="flex items-center gap-3 t-label text-ink/55">
                <span className="t-num tracking-normal text-gold">{String(i + 1).padStart(2, '0')}</span>
                {f.k}
              </dt>
              <dd className="mt-4 font-display text-[1.5rem] leading-[1.15] text-ink">{f.v}</dd>
            </Reveal>
          ))}
        </dl>
      </Container>
    </section>
  );
}
