import { BRAND } from '@/data/site';
import { EVENTS, track } from '@/lib/analytics';
import { FacebookIcon, InstagramIcon, TiktokIcon, YoutubeIcon } from '@/components/ui/BrandIcons';

/**
 * Rail latéral — l'axe vertical du site.
 *
 * Il ne porte aucune navigation : celle-ci est en haut, et la dupliquer à
 * gauche obligerait à choisir entre deux menus qui disent la même chose. Il
 * porte les réseaux, c'est-à-dire la seule chose qu'on veut pouvoir atteindre
 * à tout moment sans qu'elle occupe la barre principale.
 *
 * Il n'existe qu'à partir de 1024 px. En dessous, la marge qu'il réclame vaut
 * plus au contenu, et les mêmes liens sont réunis sur la page « Tous nos
 * liens ».
 */

const RAIL = [
  { key: 'instagram', label: 'Instagram', icon: InstagramIcon },
  { key: 'tiktok', label: 'TikTok', icon: TiktokIcon },
  { key: 'facebook', label: 'Facebook', icon: FacebookIcon },
  { key: 'youtube', label: 'YouTube', icon: YoutubeIcon },
];

export default function SideRail() {
  return (
    <div className="app-rail fixed left-4 top-4 z-30 h-[calc(100%-2rem)] w-[4.5rem] flex-col items-center pt-[7.5rem]">
      {/* Le filet descend du haut jusqu'aux icônes : il donne au rail sa raison
          d'occuper toute la hauteur, au lieu d'un groupe d'icônes posé dans le
          vide. */}
      <span aria-hidden="true" className="mb-7 h-16 w-px bg-ink/12" />

      <ul className="flex flex-col items-center gap-1">
        {RAIL.map(({ key, label, icon: Icon }) =>
          BRAND.socials[key] ? (
            <li key={key}>
              <a
                href={BRAND.socials[key]}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                onClick={() => track(EVENTS.SOCIAL_CLICK, { network: key, source: 'rail' })}
                className="grid h-11 w-11 place-items-center rounded-full text-ink/45 transition-colors duration-fast hover:text-gold focus-visible:text-gold"
              >
                <Icon width="17" height="17" />
              </a>
            </li>
          ) : null
        )}
      </ul>

      <span aria-hidden="true" className="mt-7 w-px flex-1 bg-gradient-to-b from-ink/12 to-transparent" />
    </div>
  );
}
