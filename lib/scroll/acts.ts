export const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

/** Interpolation linéaire. */
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Rampe douce entre deux bornes. */
export function rampe(v: number, debut: number, fin: number) {
  return clamp01((v - debut) / (fin - debut));
}
