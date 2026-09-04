/**
 * Le signe de la maison, en chemins SVG dans une boîte de 64 × 64.
 * Un cercle coupé par un trait. À gauche, le profil d'un citron, pointe vers
 * l'extérieur. À droite, le même profil en miroir, avec les couches de sa
 * coupe. Source unique pour le composant, le favicon et l'image de partage.
 */
export const SIGNE_VIEWBOX = "0 0 64 64";

export const SIGNE_CHEMINS = [
  // Le cercle et le trait de coupe
  "M32 4a28 28 0 1 1 0 56a28 28 0 1 1 0-56",
  "M32 6v52",
  // Moitié gauche : profil du citron, avec son téton
  "M30 21c-6.2 0.4-11 4.6-12.4 9.6L14.6 31.4v1.2l3 0.8C19 38.4 23.8 42.6 30 43",
  // Moitié droite : le même profil en miroir
  "M34 21c6.2 0.4 11 4.6 12.4 9.6l3 0.8v1.2l-3 0.8C45 38.4 40.2 42.6 34 43",
  // Les couches de la coupe
  "M34 25.5c3.9 0 7 2.9 7 6.5s-3.1 6.5-7 6.5",
  "M34 29.6a2.4 2.4 0 0 1 0 4.8",
] as const;
