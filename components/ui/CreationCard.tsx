import { Cartel } from "./Cartel";
import type { Creation } from "@/content/creations";

/**
 * Pièce exposée : un socle, un cartel, et une ombre portée dont l'angle
 * contredit la géométrie. Elle se corrige au survol.
 *
 * Le socle reste un aplat sans libellé. La scène 3D viendra l'occuper.
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
