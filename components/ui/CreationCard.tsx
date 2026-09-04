import { Cartel } from "./Cartel";
import type { Creation } from "@/content/creations";

/**
 * Pièce exposée : socle, cartel, et une ombre portée dont l'angle ne
 * correspond pas à la géométrie. Au survol, elle se corrige.
 *
 * Le socle est un aplat, sans libellé : le vide assumé vaut mieux qu'une
 * étiquette de maquette. La phase 3D vient l'occuper.
 */
export function CreationCard({
  creation,
  numero,
}: {
  creation: Creation;
  numero: string;
}) {
  return (
    <article
      id={creation.id}
      className="fausse-ombre bg-bg-eleve border border-trait p-6 md:p-8 scroll-mt-24"
    >
      <div className="aspect-4/3 w-full bg-bg mb-8" aria-hidden="true" />
      <Cartel creation={creation} numero={numero} />
    </article>
  );
}
