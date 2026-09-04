"use client";

import { useEffect } from "react";
import { acteParId } from "@/content/actes";
import { clamp01, rampe } from "@/lib/scroll/acts";

/**
 * Pilote la bascule jour → nuit.
 *
 * Écrit la seule variable `--jour` sur <html>. Toutes les couleurs du design
 * system en dérivent par color-mix, et en phase 3D les intensités de lumière
 * seront lerpées sur la même valeur : un seul curseur, jamais deux thèmes.
 *
 * Écriture directe dans le DOM, hors du cycle de rendu React : aucun setState
 * par frame.
 */
export function JourNuit() {
  useEffect(() => {
    const root = document.documentElement;
    // Le jour tient pendant le Seuil, puis tombe sur toute la Vitrine.
    const debut = acteParId.seuil.fin;
    const fin = acteParId.vitrine.fin;

    let frame = 0;

    const appliquer = () => {
      frame = 0;
      const hauteur = document.documentElement.scrollHeight - window.innerHeight;
      const p = hauteur > 0 ? clamp01(window.scrollY / hauteur) : 0;
      root.style.setProperty("--progression", p.toFixed(4));
      root.style.setProperty("--jour", (1 - rampe(p, debut, fin)).toFixed(4));
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(appliquer);
    };

    appliquer();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return null;
}
