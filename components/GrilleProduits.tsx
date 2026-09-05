import { CarteProduit } from "./CarteProduit";
import type { Creation } from "@/content/creations";

export function GrilleProduits({ creations, prioriser = 0 }: { creations: Creation[]; prioriser?: number }) {
  return (
    <ul className="list-none p-0 m-0 grid grid-cols-2 lg:grid-cols-4 gap-x-2 gap-y-8 md:gap-x-3">
      {creations.map((c, i) => (
        <li key={c.id} data-reveal style={{ "--i": i % 4 } as React.CSSProperties}>
          <CarteProduit creation={c} priorite={i < prioriser} />
        </li>
      ))}
    </ul>
  );
}
