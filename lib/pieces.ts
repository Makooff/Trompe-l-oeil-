export type VariantePiece = "ferme" | "coupe";
export type Taille = 512 | 1024 | 2048;

/** Chemins publics d'une image de pièce, telle que produite par scripts/pieces.mjs. */
export function imagePiece(id: string, variante: VariantePiece, taille: Taille, format: "avif" | "webp") {
  return `/pieces/${id}/${variante}-${taille}.${format}`;
}

/** `srcSet` pour un format, sur les trois tailles. */
export function srcSetPiece(id: string, variante: VariantePiece, format: "avif" | "webp") {
  return ([512, 1024, 2048] as const)
    .map((t) => `${imagePiece(id, variante, t, format)} ${t}w`)
    .join(", ");
}

/** Pièces qui ont déjà leurs images. Les autres montrent un socle vide. */
export const PIECES_RENDUES = new Set(["citron"]);
