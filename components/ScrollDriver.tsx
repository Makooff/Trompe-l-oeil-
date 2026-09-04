"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { acteParId } from "@/content/actes";
import { clamp01, rampe } from "@/lib/scroll/acts";
import { publier } from "@/lib/scroll/scrollStore";
import { useReducedMotion } from "@/lib/a11y/useReducedMotion";

/** En deçà, la variable CSS ne bouge pas assez pour mériter un recalcul de style. */
const EPSILON = 0.001;

/**
 * Pilote unique du scroll.
 *
 * Publie la progression du document dans le store de module — que la scène 3D
 * lit dans `useFrame` — et écrit `--jour` sur <html>, dont dérive toute la
 * palette. Un seul curseur pour le 2D et la 3D.
 *
 * Sous `prefers-reduced-motion`, Lenis n'est pas monté : le scroll natif
 * alimente exactement les mêmes valeurs. Rien du contenu ne dépend du scroll
 * lissé, seulement son confort.
 */
export function ScrollDriver() {
  const mouvementReduit = useReducedMotion();

  useEffect(() => {
    const root = document.documentElement;
    // Le jour tient pendant le Seuil, puis tombe sur toute la Vitrine.
    const debutNuit = acteParId.seuil.fin;
    const finNuit = acteParId.vitrine.fin;

    let precedente = -1;
    let jourEcrit = -1;
    let dernierTemps = performance.now();
    let rafId = 0;

    const mesurer = (maintenant: number) => {
      const hauteur = root.scrollHeight - window.innerHeight;
      const p = hauteur > 0 ? clamp01(window.scrollY / hauteur) : 0;

      const dt = Math.max((maintenant - dernierTemps) / 1000, 1 / 240);
      const vitesse = precedente < 0 ? 0 : (p - precedente) / dt;
      dernierTemps = maintenant;
      precedente = p;

      publier(p, vitesse);

      const jour = 1 - rampe(p, debutNuit, finNuit);
      if (Math.abs(jour - jourEcrit) > EPSILON) {
        jourEcrit = jour;
        root.style.setProperty("--jour", jour.toFixed(4));
      }
    };

    if (mouvementReduit) {
      const onScroll = () => {
        if (rafId) return;
        rafId = requestAnimationFrame((t) => {
          rafId = 0;
          mesurer(t);
        });
      };
      mesurer(performance.now());
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll, { passive: true });
      return () => {
        if (rafId) cancelAnimationFrame(rafId);
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
      };
    }

    const lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 0.9 });
    const boucle = (temps: number) => {
      lenis.raf(temps);
      mesurer(temps);
      rafId = requestAnimationFrame(boucle);
    };
    rafId = requestAnimationFrame(boucle);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, [mouvementReduit]);

  return null;
}
