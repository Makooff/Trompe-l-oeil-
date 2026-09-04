"use client";

import { useMemo } from "react";
import { CanvasTexture, SRGBColorSpace } from "three";

/**
 * Ombre de contact peinte : une ellipse dégradée sur un plan posé au sol.
 * Le relief 2,5D n'a pas de volume à projeter, donc on peint l'ombre que la
 * photo aurait eue. Coût nul.
 */
export function OmbreContact({
  largeur = 1.6,
  opacite = 0.55,
  position = [0, 0, 0] as [number, number, number],
}) {
  const texture = useMemo(() => {
    const taille = 256;
    const canvas = document.createElement("canvas");
    canvas.width = taille;
    canvas.height = taille;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const g = ctx.createRadialGradient(taille / 2, taille / 2, 0, taille / 2, taille / 2, taille / 2);
      g.addColorStop(0, "rgba(0,0,0,1)");
      g.addColorStop(0.55, "rgba(0,0,0,0.35)");
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, taille, taille);
    }
    const t = new CanvasTexture(canvas);
    t.colorSpace = SRGBColorSpace;
    return t;
  }, []);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={position} renderOrder={0}>
      <planeGeometry args={[largeur, largeur * 0.45]} />
      <meshBasicMaterial map={texture} transparent opacity={opacite} depthWrite={false} />
    </mesh>
  );
}
