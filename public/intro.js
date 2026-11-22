/* Avant le premier rendu : l'intro de la porte a déjà été vue (ou l'on
   demande moins de mouvement) → l'accueil s'ouvre directement sur le site. */
try {
  if (localStorage.getItem('chaudrel-intro') || matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.dataset.intro = 'seen';
  }
} catch (e) {
  /* stockage bloqué : l'intro se jouera */
}
