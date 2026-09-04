import { Filet } from "./Filet";
import type { Acte } from "@/content/actes";

/** En-tête d'acte : numéro d'inventaire, kicker, titre et chapô. */
export function ActeHeading({ acte }: { acte: Acte }) {
  return (
    <header className="mb-12 md:mb-16">
      <p className="t-cartel text-fg-38 m-0">
        <span>{acte.numero}</span>
        <span className="mx-3 text-trait-fort" aria-hidden="true">
          /
        </span>
        <span>{acte.kicker}</span>
      </p>
      <h2 id={`${acte.id}-titre`} className="t-display-l mt-4">
        {acte.titre}
      </h2>
      <Filet className="mt-6 mb-6" />
      <p className="t-corps-l text-fg-70 mesure m-0">{acte.chapo}</p>
    </header>
  );
}
