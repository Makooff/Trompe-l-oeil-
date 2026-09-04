import { acteParId, type ActeId } from "@/content/actes";

export const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

/**
 * Progression locale d'un acte, normalisée 0 à 1, calculée depuis la
 * progression globale du document. Hors plage, la valeur sature à 0 ou 1, ce
 * qui laisse les actes 3D dans un état stable au lieu de sauter.
 */
export function tLocal(progressGlobal: number, id: ActeId): number {
  const { debut, fin } = acteParId[id];
  if (fin <= debut) return 0;
  return clamp01((progressGlobal - debut) / (fin - debut));
}

/** Interpolation linéaire, sans dépendance à three.js, donc utilisable côté 2D. */
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Rampe douce entre deux bornes de progression globale. */
export function rampe(progressGlobal: number, debut: number, fin: number) {
  return clamp01((progressGlobal - debut) / (fin - debut));
}
