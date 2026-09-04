import { Cartel } from "./Cartel";
import type { Creation } from "@/content/creations";

/**
 * Pièce exposée : socle, cartel, et une ombre portée dont l'angle ne
 * correspond pas à la géométrie. Au survol, elle se corrige.
 */
export function CreationCard({ creation }: { creation: Creation }) {
  return (
    <article
      id={creation.id}
      className="fausse-ombre bg-bg-eleve border border-trait p-6 md:p-8 scroll-mt-24"
    >
      {/* Socle. Phase 3 : c'est ici que le canvas WebGL apparaît en masque. */}
      <div
        className="aspect-4/3 w-full border border-trait mb-6 grid place-items-center"
        aria-hidden="true"
      >
        <span className="t-cartel text-fg-38">{creation.faux}</span>
      </div>
      <Cartel creation={creation} />
    </article>
  );
}
