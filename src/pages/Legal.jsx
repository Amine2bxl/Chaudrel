import PageHero from '@/components/sections/PageHero';
import { Container, Section } from '@/components/ui';
import { BRAND } from '@/data/site';

function Block({ title, children }) {
  return (
    <section className="border-t border-brand-ink/10 py-10 first:border-t-0 first:pt-0">
      <h2 className="font-display text-2xl font-light text-brand-ink">{title}</h2>
      <div className="mt-4 space-y-4 text-[15px] font-light leading-[1.85] text-brand-ink/70">{children}</div>
    </section>
  );
}

function List({ items }) {
  return (
    <ul className="space-y-2">
      {items.map((it, i) => (
        <li key={i} className="flex gap-3">
          <span className="text-brand-gold" aria-hidden="true">
            —
          </span>
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}

/**
 * Mentions légales & politique de confidentialité.
 * Données officielles reprises de la V1 (BCE / BNB / assurance).
 * ⚠️ À revalider annuellement avec Chaudrel.
 */
export default function Legal() {
  return (
    <>
      <PageHero
        eyebrow="Informations légales"
        title="Mentions légales & confidentialité"
        intro="Identité de l'éditeur, hébergement, propriété intellectuelle et traitement des données personnelles."
        breadcrumb={[{ label: 'Accueil', to: '/' }, { label: 'Mentions légales' }]}
      />

      <Section tone="cream">
        <Container className="max-w-3xl">
          <Block title="1. Éditeur du site">
            <List
              items={[
                <>
                  <strong>Raison sociale :</strong> Chaudrel Rénovation SRL
                </>,
                <>
                  <strong>Siège social :</strong> {BRAND.address.street}, {BRAND.address.postalCode}{' '}
                  {BRAND.address.city} (Belgique)
                </>,
                <>
                  <strong>Numéro d'entreprise / TVA :</strong> BE 0812.283.245
                </>,
                <>
                  <strong>Date de constitution :</strong> 15 juin 2009
                </>,
                <>
                  <strong>Activité principale (NACE) :</strong> 43.910 — Travaux de couverture
                </>,
                <>
                  <strong>E-mail :</strong>{' '}
                  <a href={`mailto:${BRAND.email}`} className="link-underline text-brand-gold">
                    {BRAND.email}
                  </a>
                </>,
                <>
                  <strong>Téléphone :</strong> {BRAND.phones[1].number}
                </>,
                <>
                  <strong>Directeur de la publication :</strong> {BRAND.founders[1].name}, en qualité de fondateur
                </>,
              ]}
            />
          </Block>

          <Block title="2. Hébergeur">
            <p>
              Le site est hébergé par <strong>Vercel Inc.</strong>, 340 S Lemon Ave #4133, Walnut, CA 91789, USA —{' '}
              <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="link-underline text-brand-gold">
                vercel.com
              </a>
              .
            </p>
          </Block>

          <Block title="3. Activité & assurances">
            <List
              items={[
                <>
                  <strong>Activité :</strong> entreprise générale de rénovation et construction
                </>,
                <>
                  <strong>Zone d'intervention :</strong> Bruxelles et périphérie
                </>,
                <>
                  <strong>Assureur responsabilité civile professionnelle :</strong> AXA Belgium — police
                  010.330.000.014, couverture Belgique
                </>,
              ]}
            />
          </Block>

          <Block title="4. Propriété intellectuelle">
            <p>
              L'ensemble du contenu de ce site (textes, images, logos, photographies, vidéos, icônes) est la propriété
              exclusive de Chaudrel Rénovation SRL ou de ses partenaires. Toute reproduction, représentation ou
              diffusion, totale ou partielle, est interdite sans autorisation écrite préalable.
            </p>
          </Block>

          <Block title="5. Données officielles (BCE / BNB)">
            <List
              items={[
                'Banque-Carrefour des Entreprises (BCE) — n° 0812.283.245',
                'Banque Nationale de Belgique (BNB) — comptes annuels déposés',
                'Moniteur Belge — publications légales',
              ]}
            />
          </Block>

          <Block title="6. Droit applicable">
            <p>
              Les présentes mentions légales sont régies par le <strong>droit belge</strong>. En cas de litige et après
              tentative de recherche d'une solution amiable, les tribunaux de l'arrondissement judiciaire de Bruxelles
              seront seuls compétents.
            </p>
          </Block>

          <Block title="7. Responsable du traitement des données">
            <p>
              Chaudrel Rénovation SRL, {BRAND.address.street}, {BRAND.address.postalCode} {BRAND.address.city} —{' '}
              <a href={`mailto:${BRAND.email}`} className="link-underline text-brand-gold">
                {BRAND.email}
              </a>
              .
            </p>
          </Block>

          <Block title="8. Données collectées">
            <p>Nous collectons uniquement ce que vous nous transmettez via le formulaire, par téléphone ou par e-mail :</p>
            <List
              items={[
                'Nom',
                'Adresse e-mail',
                'Numéro de téléphone',
                'Commune et code postal du chantier',
                'Type de projet et budget indicatif',
                'Description de votre projet (message libre)',
              ]}
            />
          </Block>

          <Block title="9. Finalités et base légale">
            <p>Vos données servent exclusivement à :</p>
            <List
              items={[
                "Répondre à votre demande de devis ou d'information",
                'Vous recontacter dans le cadre de votre projet',
                'Établir une proposition adaptée',
                'Assurer le suivi du chantier',
                'Tenir notre comptabilité (obligations légales)',
              ]}
            />
            <p>
              Les traitements reposent sur votre <strong>consentement</strong> (formulaire de contact) ou sur
              l'<strong>exécution d'un contrat</strong> (devis, chantier, facturation). La conservation comptable est
              fondée sur une <strong>obligation légale</strong>.
            </p>
          </Block>

          <Block title="10. Durée de conservation">
            <List
              items={[
                'Prospects (sans devis signé) : 3 ans après le dernier contact',
                'Clients (devis, factures, plans) : 10 ans après la dernière prestation (obligation comptable)',
              ]}
            />
          </Block>

          <Block title="11. Vos droits (RGPD)">
            <p>
              Vous disposez d'un droit d'accès, de rectification, d'effacement, de portabilité, de limitation et
              d'opposition au traitement de vos données. Pour les exercer, écrivez-nous à{' '}
              <a href={`mailto:${BRAND.email}`} className="link-underline text-brand-gold">
                {BRAND.email}
              </a>{' '}
              — nous répondons dans un délai d'un mois.
            </p>
            <p>
              En cas de réclamation, vous pouvez saisir l'<strong>Autorité de protection des données</strong> — Rue de la
              Presse 35, 1000 Bruxelles —{' '}
              <a
                href="https://www.autoriteprotectiondonnees.be"
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline text-brand-gold"
              >
                autoriteprotectiondonnees.be
              </a>
              .
            </p>
          </Block>

          <Block title="12. Cookies">
            <p>
              Ce site n'utilise <strong>aucun cookie publicitaire</strong> ni tracker tiers. Aucune donnée n'est
              transmise à des fins marketing. Si un outil de mesure d'audience est ajouté ultérieurement, un bandeau de
              consentement sera mis en place.
            </p>
          </Block>

          <Block title="13. Sécurité">
            <p>
              Les données transitent chiffrées via HTTPS/TLS. Aucune donnée n'est transférée vers un pays tiers sans
              garanties conformes au RGPD.
            </p>
          </Block>

          <Block title="14. Crédits">
            <List
              items={[
                'Typographies : Playfair Display · Inter (Google Fonts)',
                'Photographies : Chaudrel Rénovation',
                'Icônes : Lucide',
              ]}
            />
          </Block>
        </Container>
      </Section>
    </>
  );
}
