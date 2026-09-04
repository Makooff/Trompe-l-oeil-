"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MathUtils, type Group } from "three";
import { tLocal } from "@/lib/scroll/acts";
import { scroll } from "@/lib/scroll/scrollStore";

/** Angle final du décollement, en radians. Au-delà, l'affiche sort du champ. */
const ANGLE = 1.42;
/** Marge de visibilité au-delà de l'acte : évite un pop en bord de plage. */
const MARGE = 0.06;

const doux = (t: number) => t * t * (3 - 2 * t);

/**
 * L'affiche reste parfaitement collée sur le premier quart de l'acte : le
 * premier écran doit être plat sans la moindre trahison, sinon le mensonge
 * ne prend pas.
 */
const ADHERENCE = 0.25;

/**
 * Acte 00 — l'affiche se décolle.
 *
 * Un plan de plâtre couvre exactement le champ au repos : la page paraît
 * plate, et le texte HTML posé par-dessus semble imprimé dessus. Au scroll,
 * le plan pivote sur son arête haute et découvre la salle. Le mensonge de
 * surface, c'est celui-là : il n'y avait jamais eu de page plate.
 */
export function ActeSeuil() {
  const charniere = useRef<Group>(null);

  useFrame(() => {
    const groupe = charniere.current;
    if (!groupe) return;

    const p = scroll.progression;
    groupe.visible = p < 0.12 + MARGE;
    if (!groupe.visible) return;

    const brut = tLocal(p, "seuil");
    const t = doux(Math.max(0, brut - ADHERENCE) / (1 - ADHERENCE));
    groupe.rotation.x = t * ANGLE;
    // L'affiche recule en même temps qu'elle bascule, sinon son arête basse
    // traverse la caméra.
    groupe.position.z = MathUtils.lerp(0, -1.1, t);
  });

  return (
    // Charnière posée sur l'arête haute : le bas bascule vers le fond.
    <group ref={charniere} position={[0, 4.6, 0]}>
      {/* Une vraie épaisseur, pas un plan : c'est la tranche éclairée qui fait
          lire le décollement. Un plan sans épaisseur ne donne qu'une bande. */}
      <mesh position={[0, -3, 0]} castShadow>
        <boxGeometry args={[12, 6, 0.05]} />
        <meshStandardMaterial color="#f2ede4" roughness={0.94} metalness={0} />
      </mesh>
    </group>
  );
}
