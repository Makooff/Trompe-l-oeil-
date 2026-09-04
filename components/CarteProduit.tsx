import Link from "next/link";
import type { Creation } from "@/content/creations";
import { srcSetPiece } from "@/lib/pieces";

/**
 * Une pièce dans la grille : la photo fermée, la coupe qui apparaît au
 * survol, le nom et le prix. Rien d'autre.
 */
export function CarteProduit({
  creation,
  priorite = false,
  sizes = "(min-width: 64rem) 25vw, (min-width: 40rem) 50vw, 100vw",
}: {
  creation: Creation;
  priorite?: boolean;
  sizes?: string;
}) {
  return (
    <Link href={`/patisseries/${creation.id}`} className="group block">
      <div className="relative aspect-square bg-fond-doux overflow-hidden">
        <picture>
          <source type="image/avif" srcSet={srcSetPiece(creation.id, "ferme", "avif")} sizes={sizes} />
          <img
            src={`/pieces/${creation.id}/ferme-1024.webp`}
            srcSet={srcSetPiece(creation.id, "ferme", "webp")}
            sizes={sizes}
            alt={creation.nom}
            loading={priorite ? "eager" : "lazy"}
            fetchPriority={priorite ? "high" : "auto"}
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover transition-opacity duration-[var(--d-3)] ease-[var(--ease)] group-hover:opacity-0 group-focus-visible:opacity-0"
          />
        </picture>
        <picture>
          <source type="image/avif" srcSet={srcSetPiece(creation.id, "coupe", "avif")} sizes={sizes} />
          <img
            src={`/pieces/${creation.id}/coupe-1024.webp`}
            srcSet={srcSetPiece(creation.id, "coupe", "webp")}
            sizes={sizes}
            alt=""
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-[var(--d-3)] ease-[var(--ease)] group-hover:opacity-100 group-focus-visible:opacity-100"
          />
        </picture>
      </div>
      <div className="flex justify-between gap-4 pt-3">
        <span className="t-etiquette-l">{creation.nom}</span>
        <span className="t-etiquette-l text-gris">{creation.prixEuros} €</span>
      </div>
    </Link>
  );
}
