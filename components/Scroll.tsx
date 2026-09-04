"use client";

import { useEffect } from "react";
import { clamp01 } from "@/lib/scroll/acts";
import { publier } from "@/lib/scroll/scrollStore";

/**
 * Publie la progression du défilement natif dans le store de module, une
 * fois par image au plus. La coupe au scroll et la barre de navigation s'y
 * abonnent. Aucun lissage : le défilement du navigateur suffit.
 */
export function Scroll() {
  useEffect(() => {
    const root = document.documentElement;
    let raf = 0;
    let precedente = -1;
    let dernierTemps = performance.now();

    const mesurer = (maintenant: number) => {
      raf = 0;
      const hauteur = root.scrollHeight - window.innerHeight;
      const p = hauteur > 0 ? clamp01(window.scrollY / hauteur) : 0;
      const dt = Math.max((maintenant - dernierTemps) / 1000, 1 / 240);
      const vitesse = precedente < 0 ? 0 : (p - precedente) / dt;
      dernierTemps = maintenant;
      precedente = p;
      publier(p, vitesse);
    };
    const demander = () => {
      if (!raf) raf = requestAnimationFrame(mesurer);
    };

    mesurer(performance.now());
    window.addEventListener("scroll", demander, { passive: true });
    window.addEventListener("resize", demander, { passive: true });
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", demander);
      window.removeEventListener("resize", demander);
    };
  }, []);

  return null;
}
