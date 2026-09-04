"use client";

import { Canvas } from "@react-three/fiber";
import { AdaptiveDpr, AdaptiveEvents } from "@react-three/drei";
import { CameraRig } from "./CameraRig";
import { Lighting } from "./Lighting";
import { Salle } from "./Salle";
import { ActeSeuil } from "./acts/ActeSeuil";

/**
 * Le canvas unique et persistant du site. Il n'est jamais démonté entre les
 * actes : chaque acte se contente de se rendre invisible hors de sa plage, ce
 * qui évite une recompilation de shader en plein scroll.
 *
 * Fond transparent : la couleur du site reste celle du CSS, pilotée par
 * `--jour`. La scène compose par-dessus au lieu de la doubler.
 */
export default function Scene() {
  return (
    <Canvas
      shadows
      gl={{ alpha: true, antialias: true }}
      dpr={[1, 1.75]}
      performance={{ min: 0.5 }}
      camera={{ fov: 38, near: 0.1, far: 60, position: [0, 1.6, 5.4] }}
    >
      <CameraRig />
      <Lighting />
      <Salle />
      <ActeSeuil />
      <AdaptiveDpr />
      <AdaptiveEvents />
    </Canvas>
  );
}
