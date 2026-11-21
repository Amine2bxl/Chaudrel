import { Link } from 'react-router-dom';
import { BRAND, EMAIL_DISPLAY, LOGO, whatsappUrl } from '@/data/site';
import { EVENTS, track } from '@/lib/analytics';
import Reveal from '@/lib/reveal';
import { cn } from '@/lib/utils';
import { GroupLabel, Row } from '@/components/layout/ContactList';
import {
  FacebookIcon,
  GalleryIcon,
  InstagramIcon,
  MailIcon,
  PhoneIcon,
  PinIcon,
  QuoteIcon,
  TiktokIcon,
  WhatsappIcon,
  YoutubeIcon,
} from '@/components/ui/BrandIcons';

/**
 * Page de liens - la destination des bios Instagram, TikTok et Facebook.
 *
 * Une carte, pensée pour un pouce : l'ordre suit l'intention, d'abord ce qui
 * rapporte un chantier (devis, appel, WhatsApp), ensuite ce qui rassure
 * (réalisations, métiers), enfin les réseaux.
 */

/* Les réseaux, dans l'ordre où Chaudrel les alimente. Une clé absente de
   BRAND.socials disparaît de la barre au lieu d'y laisser un trou. */
const SOCIALS = [
  { key: 'instagram', label: 'Instagram', icon: InstagramIcon },
  { key: 'tiktok', label: 'TikTok', icon: TiktokIcon },
  { key: 'facebook', label: 'Facebook', icon: FacebookIcon },
  { key: 'youtube', label: 'YouTube', icon: YoutubeIcon },
];

export default function Links() {
  const t = (event, extra) => () => track(event, { source: 'links', ...extra });

  return (
    <div className="relative isolate overflow-hidden bg-cream">
      {/* Halo derrière l'en-tête : sans lui, une colonne de cartes blanches sur
          un aplat crème n'a aucun point de départ - le regard entre par le
          milieu. Un seul dégradé, très bas en opacité ; il ne se voit pas, il
          se sent. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[26rem]"
        style={{
          background:
            'radial-gradient(60% 100% at 50% 0%, rgb(var(--c-gold-rgb) / 0.10) 0%, rgb(var(--c-gold-rgb) / 0) 70%)',
        }}
      />
      {/* pt = hauteur de la barre flottante ; pb = barre d'action mobile. */}
      <div className="mx-auto w-full max-w-lg px-5 pb-[calc(66px+3rem)] pt-28 sm:px-6 lg:pb-24 lg:pt-36">
        <Reveal className="text-center">
          <span className="mx-auto grid h-16 w-16 place-items-center overflow-hidden rounded-logo bg-shell shadow-lift ring-1 ring-ink/[0.06]">
            <img src={LOGO} alt="" aria-hidden="true" width="64" height="64" className="h-full w-full object-cover" />
          </span>
          <h1 className="mt-5 font-wordmark text-[22px] uppercase leading-none tracking-[0.2em] text-ink">
            {BRAND.name}
          </h1>
          <p className="t-small mt-3 text-ink/60">
            Entreprise de rénovation · {BRAND.zoneLong}
          </p>
        </Reveal>

        <Reveal delay={100} className="mt-10">
          {/* La colonne de liens vit dans une carte : c'est la lecture « link
              tree » attendue d'une bio - une seule carte, un geste par ligne,
              pas de page derrière. */}
          <div className="rounded-2xl bg-shell p-5 shadow-lift ring-1 ring-ink/[0.05] sm:p-8">
            <GroupLabel>Votre projet</GroupLabel>
          <div className="space-y-2.5">
            <Row
              to="/devis"
              icon={QuoteIcon}
              label="Devis gratuit"
              hint={`Sans engagement · ${BRAND.promises.responseTime}`}
              onClick={t(EVENTS.QUOTE_CTA)}
              primary
            />
            <Row
              href={whatsappUrl()}
              icon={WhatsappIcon}
              label="WhatsApp"
              hint="Écrivez-nous, photos bienvenues"
              onClick={t(EVENTS.WHATSAPP_CLICK)}
            />
            <Row
              href={`tel:${BRAND.phones[0].tel}`}
              icon={PhoneIcon}
              label={`Appeler ${BRAND.phones[0].name}`}
              hint={BRAND.phones[0].number}
              onClick={t(EVENTS.PHONE_CLICK)}
            />
            <Row
              href={`mailto:${BRAND.email}`}
              icon={MailIcon}
              label="Nous écrire"
              hint={EMAIL_DISPLAY}
              onClick={t(EVENTS.EMAIL_CLICK)}
            />
          </div>

          <GroupLabel>Le travail</GroupLabel>
          <div className="space-y-2.5">
            <Row to="/realisations" icon={GalleryIcon} label="Nos réalisations" hint="Chantiers livrés, photos réelles" />
            <Row to="/services" icon={PinIcon} label="Nos métiers" hint="Intérieur, extérieur, toiture, façade, piscine" />
          </div>

          <GroupLabel>Nous suivre</GroupLabel>
          {/* Une barre d'icônes, pas quatre rangées. Une rangée pleine largeur
              promet une phrase ; « Instagram » n'en est pas une, et quatre
              d'affilée diluaient les six lignes qui, elles, amènent un
              chantier. Le nom reste dans le libellé accessible. */}
          <ul className="flex flex-wrap justify-center gap-2.5">
            {SOCIALS.map(({ key, label, icon: Icon }) =>
              BRAND.socials[key] ? (
                <li key={key}>
                  <a
                    href={BRAND.socials[key]}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    onClick={t(EVENTS.SOCIAL_CLICK, { network: key })}
                    className="grid h-[3.25rem] w-[3.25rem] place-items-center rounded-md border border-ink/[0.09] bg-shell text-ink/70 transition-all duration-fast ease-soft hover:border-ink/20 hover:text-ink hover:shadow-soft active:translate-y-px"
                  >
                    <Icon width="19" height="19" />
                  </a>
                </li>
              ) : null
            )}
          </ul>
          </div>
        </Reveal>

        <Reveal delay={200} className="mt-10 text-center">
          <address className="t-small not-italic text-ink/65">
            {BRAND.address.street}, {BRAND.address.postalCode} {BRAND.address.city}
            <br />
            TVA {BRAND.vat}
          </address>
          {/* Cible de 44 px : sur une page qui ne sert qu'à toucher des liens,
              un lien texte de 15 px de haut est le seul endroit où le pouce
              rate. Le trait reste collé au mot, la zone déborde autour. */}
          <Link
            to="/"
            className="link-line t-label mt-3 inline-flex min-h-[44px] items-center px-2 text-ink"
          >
            Voir le site
          </Link>
        </Reveal>
      </div>
    </div>
  );
}
