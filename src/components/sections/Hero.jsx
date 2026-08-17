import { Container } from '@/components/ui';
import { Button } from '@/components/ui';
import { BRAND, PROOF } from '@/data/site';
import { EVENTS, track } from '@/lib/analytics';

/**
 * Hero — le mot-symbole tenu à l'échelle du bâtiment.
 *
 * Le geste vient des portfolios d'architecture : le nom posé en très grand sur
 * la photo, assez large pour toucher les deux bords, et la promesse énoncée
 * dessous à taille humaine. Marcellus, l'inscriptionnelle du logotype, est
 * faite pour ce format — c'est une lettre gravée, pas une police d'interface.
 *
 * Le mot géant est `aria-hidden` : il ne dit rien qu'un lecteur d'écran n'ait
 * déjà entendu dans la barre de navigation. Le H1 reste la promesse, c'est lui
 * qui porte le référencement.
 *
 * Aucun chiffre n'est affiché. Les références de ce genre annoncent « 5.9K+
 * projets » ou « +300 clients » ; Chaudrel n'a communiqué aucun chiffre
 * vérifié, et un compteur inventé abîmerait exactement ce que la page cherche
 * à établir. Les trois faits affichés sont vérifiables.
 */
export default function Hero() {
  return (
    <section className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-bark">
      <img
        src="/photos/hero.webp"
        alt="Maison rénovée par Chaudrel, façade et intérieur éclairé à la tombée du jour"
        width="1920"
        height="1280"
        fetchpriority="high"
        decoding="sync"
        className="slow-zoom absolute inset-0 -z-20 h-full w-full object-cover"
      />
      {/* Deux voiles : un dégradé qui remonte du bas pour asseoir le texte, et
          un lavis brun très léger qui réchauffe la photo et la relie à la
          palette au lieu de la laisser grise et générique. */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-bark via-bark/55 to-bark/45" aria-hidden="true" />
      <div className="absolute inset-0 -z-10 bg-umber/10 mix-blend-multiply" aria-hidden="true" />

      {/* ---------- Ancres de coin ----------
          Deux repères courts, opposés en diagonale, qui cadrent la photo sans
          se poser en étiquette au-dessus d'un titre. */}
      <Container className="pointer-events-none relative z-10 pt-28 lg:pt-32">
        {/* Coupures explicites plutôt qu'une mesure en `ch` : cette unité vaut
            la largeur du zéro et ignore l'interlettrage, largement ouvert sur
            ces capitales — la ligne cassait une fois de trop. */}
        <div className="hero-in hero-d1 flex items-start justify-between gap-8">
          <p className="t-label whitespace-nowrap text-cream/75">
            Entreprise
            <br />
            de rénovation
          </p>
          <p className="t-label whitespace-nowrap text-right text-cream/75">
            Bruxelles
            <br />
            Toute la Belgique
          </p>
        </div>
      </Container>

      {/* ---------- Bloc de promesse ---------- */}
      <Container className="relative z-10 mt-auto pb-4 lg:pb-6">
        <div className="lg:flex lg:items-end lg:justify-between lg:gap-16">
          <div className="lg:max-w-[46ch]">
            <h1 className="hero-in hero-d2 t-h1 max-w-[15ch] text-cream">Du premier plan à la dernière clé.</h1>

            <p className="hero-in hero-d3 t-lead mt-6 max-w-[44ch] text-cream/75">
              Cuisines, salles de bain et rénovations complètes. Un seul interlocuteur, du devis à la remise des clés,
              partout en Belgique.
            </p>

            <div className="hero-in hero-d4 mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button
                to="/devis"
                variant="solidLight"
                size="lg"
                arrow
                onClick={() => track(EVENTS.QUOTE_CTA, { source: 'hero' })}
              >
                Demander un devis
              </Button>
              <Button to="/realisations" variant="outlineLight" size="lg">
                Voir les réalisations
              </Button>
            </div>
          </div>

          {/* Carte flottante : trois faits, aucun chiffre inventé. Elle se pose
              sur la photo comme dans les références, mais elle porte de
              l'information vérifiable, pas un compteur décoratif. */}
          <dl className="hero-in hero-d5 mt-10 hidden w-full max-w-xs rounded-lg border border-cream/15 bg-bark/45 p-6 backdrop-blur-md lg:mt-0 lg:block">
            {PROOF.map((p, i) => (
              <div key={p.label} className={i > 0 ? 'mt-5 border-t border-cream/12 pt-5' : ''}>
                <dt className="t-label text-cream/50">{p.label}</dt>
                <dd className="mt-1.5 font-display text-[1.375rem] leading-none text-cream">{p.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Container>

      {/* ---------- Mot-symbole à l'échelle du bâtiment ----------
          Il touche les deux bords : c'est sa raison d'être. `leading-[0.78]`
          plaque les capitales sur la ligne de base et supprime le blanc que
          Marcellus réserve aux jambages, absents en capitales.
          pb mobile = hauteur de la barre d'action fixe. */}
      <div
        aria-hidden="true"
        className="hero-in hero-d6 relative z-10 select-none px-3 pb-[calc(66px+1.5rem)] sm:px-5 lg:pb-10"
      >
        <span className="block whitespace-nowrap text-center font-wordmark uppercase leading-[0.78] text-cream text-[clamp(2.75rem,16.4vw,13.5rem)] tracking-[0.01em]">
          {BRAND.name}
        </span>
      </div>
    </section>
  );
}

/**
 * Bandeau de preuves — mobile et tablette uniquement. Sur grand écran, les
 * mêmes trois faits vivent dans la carte du hero ; les répéter ferait doublon.
 */
export function ProofBand() {
  return (
    <section className="border-b border-ink/10 bg-cream py-10 lg:hidden">
      <Container>
        <dl className="grid gap-6 sm:grid-cols-3 sm:gap-10">
          {PROOF.map((p) => (
            <div key={p.label} className="border-t border-ink/15 pt-4">
              <dt className="t-small text-ink/65">{p.label}</dt>
              <dd className="mt-1.5 font-display text-[1.375rem] leading-none text-ink">{p.value}</dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
