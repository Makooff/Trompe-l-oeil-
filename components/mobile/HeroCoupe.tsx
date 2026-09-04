"use client";

import { useEffect, useRef } from "react";
import { srcSetPiece } from "@/lib/pieces";
import { clamp01 } from "@/lib/scroll/acts";
import { sAbonner } from "@/lib/scroll/scrollStore";
import { useTier } from "@/lib/perf/useTier";

/** Écart maximal de chaque moitié, en pourcentage de la largeur. */
const ECART = 22;

const doux = (t: number) => t * t * (3 - 2 * t);

/**
 * La coupe du hero, version tactile. Aucun WebGL : deux images rognées en
 * `clip-path` pour les moitiés, la coupe en dessous. Le scroll écarte les
 * moitiés à sa vitesse, comme sur grand écran, et remonter les referme.
 *
 * La progression se mesure sur le bloc lui-même, entre son entrée en bas de
 * l'écran et son passage au tiers haut.
 */
export function HeroCoupe({ id, faux }: { id: string; faux: string }) {
  const tier = useTier();
  const cadre = useRef<HTMLDivElement>(null);
  const gauche = useRef<HTMLDivElement>(null);
  const droite = useRef<HTMLDivElement>(null);
  const coupe = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (tier !== "reduit") return;

    const mesurer = () => {
      const el = cadre.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const h = window.innerHeight;
      // 0 quand le haut du bloc touche le bas de l'écran, 1 quand il atteint
      // le tiers supérieur.
      const t = doux(clamp01((h - r.top) / (h * 0.66 + r.height * 0.5)));
      const d = t * ECART;
      if (gauche.current) gauche.current.style.transform = `translate3d(${-d}%, 0, 0)`;
      if (droite.current) droite.current.style.transform = `translate3d(${d}%, 0, 0)`;
      if (coupe.current) coupe.current.style.opacity = String(clamp01((t - 0.08) / 0.3));
    };

    const stop = sAbonner(mesurer);
    mesurer();
    return () => stop();
  }, [tier]);

  if (tier !== "reduit") return null;

  const sizes = "100vw";

  return (
    <div ref={cadre} className="relative aspect-4/5 w-full overflow-hidden" aria-hidden="true">
      <div ref={coupe} className="absolute inset-0 opacity-0">
        <picture>
          <source type="image/avif" srcSet={srcSetPiece(id, "coupe", "avif")} sizes={sizes} />
          <img
            src={`/pieces/${id}/coupe-1024.webp`}
            srcSet={srcSetPiece(id, "coupe", "webp")}
            sizes={sizes}
            alt=""
            decoding="async"
            className="absolute inset-0 h-full w-full object-contain"
          />
        </picture>
      </div>

      {(["gauche", "droite"] as const).map((cote) => (
        <div
          key={cote}
          ref={cote === "gauche" ? gauche : droite}
          className="absolute inset-0 will-change-transform"
          style={{ clipPath: cote === "gauche" ? "inset(0 50% 0 0)" : "inset(0 0 0 50%)" }}
        >
          <picture>
            <source type="image/avif" srcSet={srcSetPiece(id, "ferme", "avif")} sizes={sizes} />
            <img
              src={`/pieces/${id}/ferme-1024.webp`}
              srcSet={srcSetPiece(id, "ferme", "webp")}
              sizes={sizes}
              alt={cote === "gauche" ? faux : ""}
              fetchPriority={cote === "gauche" ? "high" : "auto"}
              decoding="async"
              className="absolute inset-0 h-full w-full object-contain"
            />
          </picture>
        </div>
      ))}
    </div>
  );
}
