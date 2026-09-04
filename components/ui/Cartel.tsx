import { Filet } from "./Filet";
import type { Creation } from "@/content/creations";

/**
 * Le cartel de musée, geste central de la direction artistique. Le faux titre
 * s'annonce comme une œuvre et la composition réelle passe en petites
 * capitales dessous.
 */
export function Cartel({
  creation,
  numero,
  avecAllergenes = true,
  className = "",
}: {
  creation: Creation;
  /** Numéro d'inventaire, deux chiffres. */
  numero: string;
  avecAllergenes?: boolean;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="t-cartel text-fg-38 m-0">
        <span>Pièce {numero}</span>
        <span className="mx-2 text-trait-fort" aria-hidden="true">
          ·
        </span>
        <span>{creation.annee}</span>
        <span className="mx-2 text-trait-fort" aria-hidden="true">
          ·
        </span>
        <span className="text-or">{creation.prixEuros} €</span>
      </p>

      <h3 className="t-display-m mt-3">{creation.faux}</h3>

      <p className="text-fg-70 mt-3 mb-0 mesure">{creation.apparence}</p>

      <Filet className="mt-6 mb-4" />

      <p className="t-cartel text-fg-70 m-0">{creation.verite}</p>

      {avecAllergenes && (
        <p className="t-cartel text-fg-38 mt-3 mb-0">
          Allergènes : {creation.allergenes.join(", ")}
        </p>
      )}
    </div>
  );
}
