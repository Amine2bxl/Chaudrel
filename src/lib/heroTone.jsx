import { createContext, useContext, useEffect, useMemo, useState } from 'react';

/**
 * Quelle page pose un en-tête sombre sous la barre de navigation.
 *
 * Aplatir la barre lui a coûté le fond crème qui garantissait son contraste :
 * sur un hero sombre elle doit écrire en clair, ailleurs en foncé. Reste à le
 * savoir au bon moment.
 *
 * Une première version interrogeait le DOM à chaque changement de route. Elle
 * lisait l'ancienne page : la barre restait claire sur les pages crème, donc
 * illisible. Ici c'est l'en-tête lui-même qui se déclare au montage et se
 * retire au démontage — React exécute les deux dans la même passe, avant
 * l'affichage, et l'ordre des composants n'entre plus en jeu.
 */

const HeroToneContext = createContext({ dark: false, setDark: () => {} });

export function HeroToneProvider({ children }) {
  const [count, setCount] = useState(0);

  // Un compteur plutôt qu'un booléen : pendant une transition de route, deux
  // en-têtes peuvent coexister un instant. Le démontage de l'ancien ne doit
  // pas effacer la déclaration du nouveau.
  const value = useMemo(
    () => ({ dark: count > 0, setDark: (on) => setCount((n) => Math.max(0, n + (on ? 1 : -1))) }),
    [count]
  );

  return <HeroToneContext.Provider value={value}>{children}</HeroToneContext.Provider>;
}

/** Lu par la barre de navigation. */
export function useHeroTone() {
  return useContext(HeroToneContext).dark;
}

/** Posé par un en-tête sombre — hero d'accueil, en-tête de page avec image. */
export function useDeclareDarkHero(active = true) {
  const { setDark } = useContext(HeroToneContext);

  useEffect(() => {
    if (!active) return undefined;
    setDark(true);
    return () => setDark(false);
  }, [active, setDark]);
}
