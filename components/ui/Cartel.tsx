import { Filet } from "./Filet";
import type { Creation } from "@/content/creations";

/**
 * Le cartel de musée. Le geste DA central du site : le faux titre est annoncé
 * comme une œuvre, la vérité est reléguée en petites capitales dessous.
 */
export function Cartel({
  creation,
  avecPrix = true,
  className = "",
}: {
  creation: Creation;
  avecPrix?: boolean;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="t-cartel text-fg-38 m-0">
        <span>Maison Leurre</span>
        <span className="mx-2 text-trait-fort" aria-hidden="true">
          ·
        </span>
        <span>{creation.annee}</span>
      </p>

      <h3 className="t-display-m mt-2">{creation.faux}</h3>

      <p className="text-fg-70 mt-2 mb-0 mesure">{creation.apparence}</p>

      <Filet className="mt-5 mb-4" />

      <p className="t-cartel text-fg-70 m-0">{creation.verite}</p>

      <p className="t-cartel text-fg-38 mt-3 mb-0">
        {avecPrix && (
          <>
            <span className="text-or">{creation.prixEuros} €</span>
            <span className="mx-2 text-trait-fort" aria-hidden="true">
              ·
            </span>
          </>
        )}
        <span>Allergènes : {creation.allergenes.join(", ")}</span>
      </p>
    </div>
  );
}
