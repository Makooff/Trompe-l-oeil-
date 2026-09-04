import { CatmullRomCurve3, Vector3 } from "three";

/**
 * Le rail de caméra : une courbe pour la position, une pour la cible. La
 * caméra suit deux trajectoires au lieu de viser un objet, ce qui laisse
 * chaque acte cadrer comme il veut.
 *
 * Les points s'échantillonnent uniformément sur la progression du document,
 * de 0 à 1. Pour ajouter un acte, ajoutez un point à chaque courbe.
 */
const positions = [
  new Vector3(0, 1.6, 5.4), // 00 Seuil, face à l'affiche
  new Vector3(0, 1.6, 4.9), // 01 Vitrine, on avance à peine
  new Vector3(1.9, 1.45, 3.1), // dérive latérale : le trapèze se trahit
  new Vector3(0.4, 1.5, 1.2), // 02 Le Mensonge, au ras des pièces
  new Vector3(0, 1.7, 3.6), // 03 Anamorphose, recul au point d'ancrage
  new Vector3(0, 1.55, 2.4), // 04 Matières
  new Vector3(0, 1.55, 4.2), // 05-06 Carte et Maison, la scène s'éloigne
];

const cibles = [
  new Vector3(0, 1.6, 0),
  new Vector3(0, 1.55, -0.4),
  new Vector3(0, 1.35, -1.6),
  new Vector3(0, 1.1, -1.2),
  new Vector3(0, 1.6, -2.2),
  new Vector3(0, 1.4, -1.4),
  new Vector3(0, 1.5, -2),
];

export const railPosition = new CatmullRomCurve3(positions, false, "catmullrom", 0.4);
export const railCible = new CatmullRomCurve3(cibles, false, "catmullrom", 0.4);
