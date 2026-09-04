"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { MathUtils, Vector3 } from "three";
import { railCible, railPosition } from "@/lib/three/rail";
import { scroll } from "@/lib/scroll/scrollStore";

/** Plus la valeur monte, plus la caméra colle au scroll. */
const RAIDEUR = 5.5;

export function CameraRig() {
  const camera = useThree((s) => s.camera);
  const cible = useRef(new Vector3(0, 1.6, 0));
  const voulu = useRef(new Vector3());
  const vouluCible = useRef(new Vector3());

  useFrame((_, delta) => {
    const p = scroll.progression;

    railPosition.getPointAt(p, voulu.current);
    railCible.getPointAt(p, vouluCible.current);

    // Amorti par axe. Il absorbe le scroll saccadé sans ajouter de retard
    // visible sur un scroll continu.
    camera.position.set(
      MathUtils.damp(camera.position.x, voulu.current.x, RAIDEUR, delta),
      MathUtils.damp(camera.position.y, voulu.current.y, RAIDEUR, delta),
      MathUtils.damp(camera.position.z, voulu.current.z, RAIDEUR, delta),
    );
    cible.current.set(
      MathUtils.damp(cible.current.x, vouluCible.current.x, RAIDEUR, delta),
      MathUtils.damp(cible.current.y, vouluCible.current.y, RAIDEUR, delta),
      MathUtils.damp(cible.current.z, vouluCible.current.z, RAIDEUR, delta),
    );
    camera.lookAt(cible.current);
  });

  return null;
}
