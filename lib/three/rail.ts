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
  new Vector3(0.2, 1.45, 3.3), // 01 Vitrine, on s'approche de la pièce
  new Vector3(1.5, 1.3, 1.8), // dérive latérale : le relief se trahit
  new Vector3(0.6, 1.5, 3.0), // 02 Le Mensonge, la salle en fond de collection
  new Vector3(0.6, 1.5, 3.0), // 03-04 Carte et Maison : la scène s'efface sans bouger
];

const cibles = [
  new Vector3(0, 1.6, 0),
  new Vector3(0.45, 1.1, -1.6),
  new Vector3(0.5, 1.0, -1.6),
  new Vector3(0.2, 1.2, -2.2),
  new Vector3(0.2, 1.2, -2.2),
];

export const railPosition = new CatmullRomCurve3(positions, false, "catmullrom", 0.4);
export const railCible = new CatmullRomCurve3(cibles, false, "catmullrom", 0.4);
