import { CarteProduit } from "./CarteProduit";
import type { Creation } from "@/content/creations";

export function GrilleProduits({ creations, prioriser = 0 }: { creations: Creation[]; prioriser?: number }) {
  return (
    <ul className="list-none p-0 m-0 grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-6">
      {creations.map((c, i) => (
        <li key={c.id}>
          <CarteProduit creation={c} priorite={i < prioriser} />
        </li>
      ))}
    </ul>
  );
}
