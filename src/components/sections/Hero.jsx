import { Container } from '@/components/ui';
import { Button } from '@/components/ui';
import { BRAND, PROOF, whatsappUrl } from '@/data/site';
import { EVENTS, track } from '@/lib/analytics';
import { imageAttrs, SIZES } from '@/lib/image';

/**
 * Hero - la photo, la promesse, l'action.
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
        {...imageAttrs('/photos/hero.webp', SIZES.full)}
        alt="Maison rénovée par Chaudrel, façade et intérieur éclairé à la tombée du jour"
        width="1920"
        height="1080"
        fetchpriority="high"
        decoding="sync"
        className="slow-zoom absolute inset-0 -z-20 h-full w-full object-cover"
      />
      {/* Deux voiles : un dégradé qui remonte du bas pour asseoir le texte, et
          un lavis brun très léger qui réchauffe la photo et la relie à la
          palette au lieu de la laisser grise et générique. */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-bark via-bark/55 to-bark/45" aria-hidden="true" />
      <div className="absolute inset-0 -z-10 bg-gold/10 mix-blend-multiply" aria-hidden="true" />

      {/* ---------- Ancres de coin ----------
          Deux repères courts, opposés en diagonale, qui cadrent la photo sans
          se poser en étiquette au-dessus d'un titre. */}
      <Container className="pointer-events-none relative z-10 pt-28 lg:pt-32">
        {/* Coupures explicites plutôt qu'une mesure en `ch` : cette unité vaut
            la largeur du zéro et ignore l'interlettrage, largement ouvert sur
            ces capitales - la ligne cassait une fois de trop. */}
        <div className="hero-in hero-d1 flex items-start justify-between gap-8">
          <p className="t-label whitespace-nowrap text-cream/75">
            Entreprise de rénovation
          </p>
          <p className="t-label whitespace-nowrap text-right text-cream/75">
            Bruxelles
            <br />
            Toute la Belgique
          </p>
        </div>
      </Container>

      {/* ---------- Bloc de promesse ---------- */}
      <Container className="relative z-10 mt-auto pb-[calc(66px+2.5rem)] lg:pb-20">
        <div className="relative lg:flex lg:items-end lg:justify-between lg:gap-16">
          <div className="lg:max-w-[46ch]">
            <h1 className="hero-in hero-d2 t-h1 max-w-[15ch] text-cream">Du premier plan à la dernière clé.</h1>

            <p className="hero-in hero-d3 t-lead mt-6 max-w-[44ch] text-cream/75">
              Cuisines, salles de bain et rénovations complètes. Un seul interlocuteur, du devis à la remise des clés,
              partout en Belgique.
            </p>

            {/* Trois issues, dans l'ordre de l'engagement : chiffrer, parler,
                écrire. Le devis porte le laiton, les deux autres restent en
                contour pour ne pas rivaliser. */}
            <div data-page-cta className="hero-in hero-d4 mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <Button
                to="/devis"
                size="lg"
                arrow
                className="w-full justify-center sm:w-auto"
                onClick={() => track(EVENTS.QUOTE_CTA, { source: 'hero' })}
              >
                Devis gratuit
              </Button>

              <Button
                href={`tel:${BRAND.phones[0].tel}`}
                variant="outlineLight"
                size="lg"
                className="w-full justify-center sm:w-auto"
                onClick={() => track(EVENTS.PHONE_CLICK, { source: 'hero' })}
              >
                <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path
                    d="M5.2 2.5 6.6 5.4 5.1 6.9a8 8 0 0 0 4 4l1.5-1.5 2.9 1.4v2.3c0 .6-.5 1-1.1.9A12.6 12.6 0 0 1 2 3.6c-.1-.6.3-1.1.9-1.1h2.3Z"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="tabular-nums">{BRAND.phones[0].number}</span>
              </Button>

              <Button
                href={whatsappUrl()}
                variant="outlineLight"
                size="lg"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full justify-center sm:w-auto"
                onClick={() => track(EVENTS.WHATSAPP_CLICK, { source: 'hero' })}
              >
                <svg width="15" height="15" viewBox="0 0 16 16" aria-hidden="true" fill="currentColor">
                  <path d="M8 0a8 8 0 0 0-6.9 12L0 16l4.1-1.1A8 8 0 1 0 8 0Zm0 14.6a6.6 6.6 0 0 1-3.4-.9l-.2-.2-2.5.7.7-2.4-.2-.3A6.6 6.6 0 1 1 8 14.6Zm3.6-4.9c-.2-.1-1.2-.6-1.3-.6-.2-.1-.3-.1-.4.1l-.6.7c-.1.1-.2.1-.4 0a5.4 5.4 0 0 1-2.6-2.3c-.2-.3.2-.3.5-1 0-.1 0-.2 0-.3l-.6-1.3c-.1-.4-.3-.3-.4-.3h-.4a.7.7 0 0 0-.5.3c-.2.2-.7.7-.7 1.7s.7 2 .8 2.1a7.6 7.6 0 0 0 3 2.6c1.1.4 1.5.5 2 .4.4 0 1.2-.5 1.3-.9.2-.5.2-.9.1-1 0-.1-.1-.1-.3-.2Z" />
                </svg>
                WhatsApp
              </Button>
            </div>

            {/* Sur mobile, la bulle n'existe pas : la preuve d'expérience tient
                en une ligne sous les boutons. */}
            <p className="hero-in hero-d6 mt-6 flex items-center gap-2.5 t-small text-cream/70 lg:hidden">
              <span aria-hidden="true" className="h-1.5 w-1.5 flex-none rounded-full bg-gold-light" />
              {PROOF[0].value} - depuis {BRAND.founded}
            </p>
          </div>

          {/* Carte flottante : deux faits, aucun chiffre inventé. Elle se pose
              sur la photo comme dans les références, mais elle porte de
              l'information vérifiable, pas un compteur décoratif. */}
          <dl className="hero-in hero-d5 mt-10 hidden w-full max-w-xs rounded-lg border border-cream/15 bg-bark/50 p-6 shadow-[0_24px_50px_-30px_rgb(0_0_0/0.7)] ring-1 ring-cream/10 backdrop-blur-md lg:mt-0 lg:block">
            {PROOF.map((p, i) => (
              <div key={p.label} className={i > 0 ? 'mt-6 border-t border-cream/12 pt-6' : ''}>
                <div className="flex items-center gap-2">
                  <span aria-hidden="true" className="h-1.5 w-1.5 flex-none rounded-full bg-gold-light" />
                  <dt className="t-label text-cream/55">{p.label}</dt>
                </div>
                <dd className="mt-2 font-display text-[1.5rem] leading-none text-cream">{p.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Container>

    </section>
  );
}

/**
 * Bandeau de preuves - mobile et tablette uniquement. Sur grand écran, les
 * mêmes trois faits vivent dans la carte du hero ; les répéter ferait doublon.
 */
export function ProofBand() {
  return (
    <section className="border-b border-ink/10 bg-cream py-10 lg:hidden">
      <Container>
        <dl className="grid gap-6 sm:grid-cols-2 sm:gap-10">
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
