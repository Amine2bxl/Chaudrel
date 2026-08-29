import VARIANTS from '@/data/image-variants.json';

/**
 * Attributs d'une photo, résolution comprise.
 *
 * Le manifeste est écrit par `scripts/responsive-images.mjs` et ne contient
 * que des fichiers présents sur le disque. Tant qu'il est vide, `srcSet` reste
 * absent et la photo se comporte comme avant : jamais de largeur annoncée qui
 * n'existe pas, donc jamais de 404 sur le téléphone de quelqu'un.
 *
 * `sizes` décrit la largeur d'affichage réelle, pas la taille du fichier.
 * C'est lui qui permet au navigateur de choisir : sans lui il suppose la
 * pleine largeur de l'écran et télécharge trop grand à chaque fois.
 */
export function imageAttrs(src, sizes) {
  const widths = VARIANTS[src];
  if (!widths?.length) return { src };

  const base = src.replace(/\.webp$/, '');
  return {
    src,
    srcSet: widths.map((w) => `${base}-${w}.webp ${w}w`).join(', '),
    sizes,
  };
}

/* Largeurs d'affichage des dispositions récurrentes du site. Les garder ici
   plutôt qu'au fil des composants évite qu'une mise en page change sans que
   la ligne `sizes` correspondante suive. */
export const SIZES = {
  /** Pleine largeur de l'écran, sans conteneur : hero. */
  full: '100vw',
  /** Colonne de contenu : pleine largeur, puis moitié de page. */
  half: '(min-width: 1024px) 46vw, 100vw',
  /** Grille de cartes : une, deux, puis trois par rangée. */
  card: '(min-width: 1024px) 30vw, (min-width: 640px) 46vw, 100vw',
  /** Plateau du carrousel de chantiers. */
  stage: '(min-width: 1024px) 64vw, (min-width: 640px) 76vw, 100vw',
};
