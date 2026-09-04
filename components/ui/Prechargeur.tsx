"use client";

import { useEffect, useState } from "react";
import { SIGNE_CHEMINS, SIGNE_VIEWBOX } from "@/content/marque";
import { imagePiece } from "@/lib/pieces";

/** Le voile tient au moins ce temps, pour que le tracé du signe s'achève. */
const MINIMUM = 700;
/** Et au plus ce temps, images chargées ou non. */
const MAXIMUM = 2400;

/**
 * Préchargeur. Le signe se trace pendant que les images du hero arrivent, un
 * compteur d'inventaire tourne dessous, puis le voile s'efface en 420 ms.
 *
 * Rendu côté serveur pour éviter un flash au montage. Une animation CSS le
 * retire de toute façon après le délai maximal : sans JavaScript, il ne
 * bloque jamais la page.
 */
export function Prechargeur() {
  const [pret, setPret] = useState(false);
  const [retire, setRetire] = useState(false);

  useEffect(() => {
    const debut = performance.now();
    const images = [
      imagePiece("citron", "ferme", 1024, "webp"),
      "/sequences/citron/coupe-000.webp",
    ].map(
      (src) =>
        new Promise<void>((resoudre) => {
          const img = new Image();
          img.onload = img.onerror = () => resoudre();
          img.src = src;
        }),
    );

    let t: number;
    Promise.race([Promise.all(images), new Promise((r) => setTimeout(r, MAXIMUM))]).then(() => {
      const reste = Math.max(0, MINIMUM - (performance.now() - debut));
      t = window.setTimeout(() => setPret(true), reste);
    });
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!pret) return;
    const t = window.setTimeout(() => setRetire(true), 480);
    return () => clearTimeout(t);
  }, [pret]);

  if (retire) return null;

  return (
    <div
      className="prechargeur fixed inset-0 z-70 grid place-items-center bg-bg text-fg"
      data-pret={pret ? "" : undefined}
      aria-hidden="true"
    >
      <div className="grid gap-6 place-items-center">
        <svg
          viewBox={SIGNE_VIEWBOX}
          width="72"
          height="72"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.25}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {SIGNE_CHEMINS.map((d, i) => (
            <path key={d} d={d} pathLength={1} className="prechargeur-trait" style={{ animationDelay: `${i * 90}ms` }} />
          ))}
        </svg>
        <p className="t-cartel text-fg-38 m-0">Maison Leurre</p>
      </div>
    </div>
  );
}
