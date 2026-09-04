"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useTier } from "@/lib/perf/useTier";

// `ssr: false` n'est autorisé que dans un composant client. La scène ne doit
// pas peser sur le premier rendu : le LCP du site est le wordmark en HTML.
const Scene = dynamic(() => import("./Scene"), { ssr: false });

/**
 * Monte la scène derrière la page. Le canvas reste décoratif : le contenu vit
 * en HTML au-dessus, et le site fonctionne sans WebGL.
 */
export function SceneHost() {
  const tier = useTier();
  const chemin = usePathname();

  // Tier pas encore décidé au premier rendu : on ne monte rien plutôt qu'une
  // scène à remplacer dans la foulée.
  if (tier === null) return null;
  // La scène appartient à l'accueil. Une 404 reste une page de texte.
  if (chemin !== "/") return null;

  return (
    <div
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ opacity: "var(--scene-opacite, 1)" }}
      aria-hidden="true"
      data-tier={tier}
    >
      <Scene />
    </div>
  );
}
