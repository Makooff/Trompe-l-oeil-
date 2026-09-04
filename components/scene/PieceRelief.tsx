"use client";

import { forwardRef, useEffect, useMemo } from "react";
import { useTexture } from "@react-three/drei";
import {
  LinearFilter,
  Mesh,
  NoColorSpace,
  PlaneGeometry,
  SRGBColorSpace,
  type ShaderMaterial,
} from "three";
import { creerRelief } from "@/lib/three/materials/relief";

export type VariantePiece = "ferme" | "coupe";

type Props = {
  /** Identifiant de la pièce, dossier dans public/pieces/. */
  id: string;
  variante: VariantePiece;
  /** Hauteur en unités monde. La largeur suit le ratio de l'image. */
  taille?: number;
  /** Bande horizontale gardée, en UV. [0, 0.5] = moitié gauche. */
  masque?: [number, number];
  amplitude?: number;
  ombrage?: number;
  /** 1024 pour la scène, 2048 réservé au hero desktop. */
  resolution?: 1024 | 2048;
  position?: [number, number, number];
  renderOrder?: number;
};

/** Résolution des subdivisions : assez pour un relief lisse, pas plus. */
const SEGMENTS = [96, 120] as const;

export function cheminsPiece(id: string, variante: VariantePiece, resolution: 1024 | 2048) {
  return {
    carte: `/pieces/${id}/${variante}-${resolution}.webp`,
    profondeur: `/pieces/${id}/profondeur-${variante}.png`,
  };
}

/**
 * Une photo mise en volume. Le plan se déplace selon sa carte de profondeur,
 * le shader découpe selon `masque`. Les moitiés d'une même pièce sont deux
 * instances avec la même texture et deux masques complémentaires.
 */
export const PieceRelief = forwardRef<Mesh, Props>(function PieceRelief(
  {
    id,
    variante,
    taille = 1.4,
    masque = [0, 1],
    amplitude = 0.35,
    ombrage = 0.6,
    resolution = 1024,
    position = [0, 0, 0],
    renderOrder,
  },
  ref,
) {
  const chemins = cheminsPiece(id, variante, resolution);
  const [carte, profondeur] = useTexture([chemins.carte, chemins.profondeur]);

  useEffect(() => {
    carte.colorSpace = SRGBColorSpace;
    carte.anisotropy = 4;
    profondeur.colorSpace = NoColorSpace;
    profondeur.minFilter = LinearFilter;
    profondeur.magFilter = LinearFilter;
    carte.needsUpdate = true;
    profondeur.needsUpdate = true;
  }, [carte, profondeur]);

  const materiau = useMemo(
    () => creerRelief({ carte, profondeur, amplitude, masque, ombrage }),
    // Le masque, l'amplitude et l'ombrage se règlent ensuite par uniform.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [carte, profondeur],
  );

  useEffect(() => {
    const u = (materiau as ShaderMaterial).uniforms;
    u.masque.value.set(masque[0], masque[1]);
    u.amplitude.value = amplitude;
    u.ombrage.value = ombrage;
  }, [materiau, masque, amplitude, ombrage]);

  useEffect(() => () => materiau.dispose(), [materiau]);

  const geometrie = useMemo(() => {
    const image = carte.image as { width: number; height: number };
    const ratio = image.width / image.height;
    return new PlaneGeometry(taille * ratio, taille, SEGMENTS[0], SEGMENTS[1]);
  }, [carte, taille]);

  useEffect(() => () => geometrie.dispose(), [geometrie]);

  return (
    <mesh
      ref={ref}
      geometry={geometrie}
      material={materiau}
      position={position}
      renderOrder={renderOrder}
      frustumCulled={false}
    />
  );
});
