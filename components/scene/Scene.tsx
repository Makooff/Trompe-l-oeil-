"use client";

import { Canvas } from "@react-three/fiber";
import { AdaptiveDpr, AdaptiveEvents } from "@react-three/drei";
import { CameraRig } from "./CameraRig";
import { Lighting } from "./Lighting";
import { Salle } from "./Salle";
import { ActeSeuil } from "./acts/ActeSeuil";

/**
 * Le canvas unique et persistant du site. Aucun acte ne le démonte : chacun se
 * rend invisible hors de sa plage, ce qui évite de recompiler les shaders en
 * plein scroll.
 *
 * Le fond reste transparent. Le CSS garde la main sur la couleur du site via
 * `--jour`, et la scène compose par-dessus.
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
