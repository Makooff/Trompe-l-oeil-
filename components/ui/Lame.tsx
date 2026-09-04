"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { srcSetPiece } from "@/lib/pieces";

const PAS = 2;
const DEPART = 58;

/**
 * La lame. Un curseur posé sur la pièce : glissez-le et la pièce se coupe sous
 * le doigt, la coupe apparaît à gauche du trait, la coque reste à droite.
 *
 * Souris, doigt et clavier. La position s'écrit dans le DOM pendant le geste,
 * l'état React ne se met à jour qu'au relâchement, pour l'accessibilité.
 */
export function Lame({
  id,
  faux,
  sizes = "(min-width: 64rem) 40vw, 100vw",
  className = "",
}: {
  id: string;
  faux: string;
  sizes?: string;
  className?: string;
}) {
  const cadre = useRef<HTMLDivElement>(null);
  const coque = useRef<HTMLDivElement>(null);
  const trait = useRef<HTMLDivElement>(null);
  const position = useRef(DEPART);
  const [valeur, setValeur] = useState(DEPART);
  const etiquette = useId();

  const appliquer = useCallback((pct: number) => {
    const v = Math.min(100, Math.max(0, pct));
    position.current = v;
    if (coque.current) coque.current.style.clipPath = `inset(0 0 0 ${v}%)`;
    if (trait.current) trait.current.style.left = `${v}%`;
  }, []);

  useEffect(() => appliquer(DEPART), [appliquer]);

  const depuisPointeur = (clientX: number) => {
    const r = cadre.current?.getBoundingClientRect();
    if (!r) return;
    appliquer(((clientX - r.left) / r.width) * 100);
  };

  return (
    <div
      ref={cadre}
      className={`relative select-none overflow-hidden bg-bg-eleve ${className}`}
      style={{ aspectRatio: "4 / 5", touchAction: "pan-y", cursor: "col-resize" }}
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        depuisPointeur(e.clientX);
      }}
      onPointerMove={(e) => {
        if (e.buttons === 0) return;
        depuisPointeur(e.clientX);
      }}
      onPointerUp={() => setValeur(Math.round(position.current))}
      onPointerCancel={() => setValeur(Math.round(position.current))}
    >
      {/* La coupe, en dessous, sur toute la largeur. */}
      <picture>
        <source type="image/avif" srcSet={srcSetPiece(id, "coupe", "avif")} sizes={sizes} />
        <img
          src={`/pieces/${id}/coupe-1024.webp`}
          srcSet={srcSetPiece(id, "coupe", "webp")}
          sizes={sizes}
          alt=""
          loading="lazy"
          decoding="async"
          draggable={false}
          className="absolute inset-0 h-full w-full object-contain"
        />
      </picture>

      {/* La coque, au-dessus, rognée à gauche du trait. */}
      <div ref={coque} className="absolute inset-0" style={{ clipPath: `inset(0 0 0 ${DEPART}%)` }}>
        <picture>
          <source type="image/avif" srcSet={srcSetPiece(id, "ferme", "avif")} sizes={sizes} />
          <img
            src={`/pieces/${id}/ferme-1024.webp`}
            srcSet={srcSetPiece(id, "ferme", "webp")}
            sizes={sizes}
            alt={faux}
            loading="lazy"
            decoding="async"
            draggable={false}
            className="absolute inset-0 h-full w-full object-contain"
          />
        </picture>
      </div>

      {/* Le trait : 1 px de plâtre, une pastille d'or au milieu. */}
      <div
        ref={trait}
        className="absolute inset-y-0 w-px bg-fg pointer-events-none"
        style={{ left: `${DEPART}%` }}
        aria-hidden="true"
      >
        <span className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-[var(--r-pill)] bg-or" />
      </div>

      {/* Le curseur accessible, invisible mais focusable, 44 px de large. */}
      <button
        type="button"
        role="slider"
        aria-label={`Lame, ${faux}`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={valeur}
        aria-valuetext={`${valeur} % coupé`}
        aria-describedby={etiquette}
        className="absolute inset-y-0 w-11 -translate-x-1/2 bg-transparent border-0 p-0 cursor-col-resize focus-visible:outline-2 focus-visible:outline-or"
        style={{ left: `${valeur}%` }}
        onKeyDown={(e) => {
          let v = position.current;
          if (e.key === "ArrowLeft" || e.key === "ArrowDown") v -= PAS;
          else if (e.key === "ArrowRight" || e.key === "ArrowUp") v += PAS;
          else if (e.key === "Home") v = 0;
          else if (e.key === "End") v = 100;
          else return;
          e.preventDefault();
          appliquer(v);
          setValeur(Math.round(position.current));
        }}
      />
      <span id={etiquette} className="sr-only">
        Flèches pour déplacer la lame, Début et Fin pour ouvrir ou fermer.
      </span>
    </div>
  );
}
