"use client";

import { useEffect } from "react";
import { sAbonner } from "@/lib/scroll/scrollStore";

/**
 * Fait suivre la barre du navigateur mobile à la bascule jour vers nuit. La
 * couleur se lit sur <body>, déjà calculée par `color-mix` depuis `--jour`,
 * donc la meta ne porte jamais une valeur en dur.
 */
export function ThemeColor() {
  useEffect(() => {
    let meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "theme-color";
      document.head.appendChild(meta);
    }
    // Chromium renvoie un `oklab()` que Safari refuse dans la meta : on
    // repasse par un canvas pour obtenir un hexa.
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 1;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    const enHexa = (couleur: string) => {
      if (!ctx) return couleur;
      ctx.fillStyle = couleur;
      ctx.fillRect(0, 0, 1, 1);
      const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
      return `#${[r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
    };

    let derniere = "";
    const appliquer = () => {
      const couleur = getComputedStyle(document.body).backgroundColor;
      if (couleur !== derniere && meta) {
        derniere = couleur;
        meta.content = enHexa(couleur);
      }
    };
    appliquer();
    return sAbonner(appliquer);
  }, []);

  return null;
}
