import { LienCarte } from "./LienCarte";
import { PanierRapide } from "./PanierRapide";
import type { Creation } from "@/content/creations";
import { PIECES_AVEC_COUPE, srcSetPiece } from "@/lib/pieces";

const ZOOM =
  "absolute inset-0 h-full w-full object-cover transition-transform duration-[var(--d-4)] ease-[var(--ease)] " +
  "group-hover:scale-[1.06] group-focus-within:scale-[1.06] motion-reduce:transition-none motion-reduce:group-hover:scale-100";

const VOILE =
  "transition-opacity duration-[var(--d-3)] ease-[var(--ease)] opacity-0 group-hover:opacity-100 group-focus-within:opacity-100";

function Parts() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
      <circle cx="7" cy="4" r="2.5" />
      <path d="M2 12.5c0-2.8 2.2-4.5 5-4.5s5 1.7 5 4.5" />
    </svg>
  );
}

/**
 * Une pièce dans la grille : la photo fermée, un zoom lent au survol et,
 * par-dessus, le nom, les parts, le prix et un bouton panier. Quand une
 * vraie photo de coupe existe, elle vient en fondu sous le voile.
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
    <div className="group relative" data-carte={creation.id}>
      <LienCarte id={creation.id} className="block outline-none">
        <div className="relative aspect-square bg-fond-doux overflow-hidden rounded-image" data-image>
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
                className={`${ZOOM} ${VOILE} transition-[transform,opacity]`}
              />
            </picture>
          )}
          <div className={`absolute inset-0 bg-noir/40 ${VOILE}`} aria-hidden="true" />
          <div
            className={`absolute inset-0 flex flex-col items-center justify-center gap-3 text-blanc text-center px-4 ${VOILE}`}
            aria-hidden="true"
          >
            <p className="m-0 uppercase tracking-[var(--ls-etiquette)] text-[1.125rem] font-medium">{creation.nom}</p>
            <p className="m-0 t-etiquette-l inline-flex items-center gap-2 font-medium">
              <span className="inline-flex items-center gap-1.5">
                {creation.parts} <Parts />
              </span>
              <span className="w-4" />
              {creation.prixEuros} €
            </p>
          </div>
        </div>
        <div className="flex justify-between gap-4 pt-3">
          <span className="t-etiquette-l">{creation.nom}</span>
          <span className="t-etiquette-l text-gris">{creation.prixEuros} €</span>
        </div>
      </LienCarte>
      <PanierRapide
        id={creation.id}
        nom={creation.nom}
        className={`absolute left-1/2 top-1/2 -translate-x-1/2 translate-y-[2.75rem] ${VOILE} focus-visible:opacity-100`}
      />
    </div>
  );
}
