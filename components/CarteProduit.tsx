import Link from "next/link";
import type { Creation } from "@/content/creations";
import { PIECES_AVEC_COUPE, srcSetPiece } from "@/lib/pieces";

const ZOOM =
  "absolute inset-0 h-full w-full object-cover transition-transform duration-[var(--d-4)] ease-[var(--ease)] " +
  "group-hover:scale-[1.06] group-focus-visible:scale-[1.06] motion-reduce:transition-none motion-reduce:group-hover:scale-100";

/**
 * Une pièce dans la grille : la photo fermée, un zoom lent au survol, le
 * nom et le prix. Quand une vraie photo de coupe existe, elle vient en
 * fondu par-dessus.
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
  const coupe = PIECES_AVEC_COUPE.has(creation.id);
  return (
    <Link href={`/patisseries/${creation.id}`} className="group block">
      <div className="relative aspect-square bg-fond-doux overflow-hidden rounded-image">
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
            className={ZOOM}
          />
        </picture>
        {coupe && (
          <picture>
            <source type="image/avif" srcSet={srcSetPiece(creation.id, "coupe", "avif")} sizes={sizes} />
            <img
              src={`/pieces/${creation.id}/coupe-1024.webp`}
              srcSet={srcSetPiece(creation.id, "coupe", "webp")}
              sizes={sizes}
              alt=""
              loading="lazy"
              decoding="async"
              className={`${ZOOM} opacity-0 transition-[transform,opacity] group-hover:opacity-100 group-focus-visible:opacity-100`}
            />
          </picture>
        )}
      </div>
      <div className="flex justify-between gap-4 pt-3">
        <span className="t-etiquette-l">{creation.nom}</span>
        <span className="t-etiquette-l text-gris">{creation.prixEuros} €</span>
      </div>
    </Link>
  );
}
