"use client";

import dynamic from "next/dynamic";
import { useTier } from "@/lib/perf/useTier";

// `ssr: false` n'est autorisé que dans un composant client, et la scène ne doit
// de toute façon pas peser sur le premier rendu : le LCP du site est le
// wordmark en HTML, pas le canvas.
const Scene = dynamic(() => import("./Scene"), { ssr: false });

/**
 * Monte la scène derrière la page. Le canvas est décoratif : tout le contenu
 * existe en HTML au-dessus, et le site reste complet sans WebGL.
 */
export function SceneHost() {
  const tier = useTier();

  // Tier non encore décidé (premier rendu client) : on ne monte rien plutôt
  // que de monter une scène qu'il faudrait remplacer aussitôt.
  if (tier === null) return null;

  return (
    <div
      className="fixed inset-0 z-0 pointer-events-none"
      aria-hidden="true"
      data-tier={tier}
    >
      <Scene />
    </div>
  );
}
