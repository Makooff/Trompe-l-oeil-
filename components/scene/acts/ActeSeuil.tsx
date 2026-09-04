"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MathUtils, type Group } from "three";
import { tLocal } from "@/lib/scroll/acts";
import { scroll } from "@/lib/scroll/scrollStore";

/** Angle final du décollement, en radians. Au-delà, l'affiche sort du champ. */
const ANGLE = 1.42;
/** Marge de visibilité au-delà de l'acte, qui évite un pop en bord de plage. */
const MARGE = 0.06;

const doux = (t: number) => t * t * (3 - 2 * t);

/**
 * L'affiche reste collée sur le premier quart de l'acte. Le premier écran doit
 * rester plat, sans quoi le visiteur devine la scène avant de scroller.
 */
const ADHERENCE = 0.25;

/**
 * Acte 00, le décollement de l'affiche.
 *
 * Au repos, un panneau de plâtre couvre le champ et le texte HTML posé
 * par-dessus paraît imprimé dessus. Au scroll, le panneau pivote sur son arête
 * haute et découvre la salle. Le visiteur croyait lire une page plate.
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
    // L'affiche recule en basculant, sinon son arête basse traverse la caméra.
    groupe.position.z = MathUtils.lerp(0, -1.1, t);
  });

  return (
    // Charnière posée sur l'arête haute : le bas bascule vers le fond.
    <group ref={charniere} position={[0, 4.6, 0]}>
      {/* Une boîte plutôt qu'un plan : la tranche éclairée fait lire le
          décollement. Un plan sans épaisseur ne donne qu'une bande grise. */}
      <mesh position={[0, -3, 0]} castShadow>
        <boxGeometry args={[12, 6, 0.05]} />
        <meshStandardMaterial color="#f2ede4" roughness={0.94} metalness={0} />
      </mesh>
    </group>
  );
}
