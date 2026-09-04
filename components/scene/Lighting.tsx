"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { MathUtils, type DirectionalLight, type AmbientLight } from "three";
import { acteParId } from "@/content/actes";
import { rampe } from "@/lib/scroll/acts";
import { scroll } from "@/lib/scroll/scrollStore";

/** Le même curseur que la palette CSS : jour = 1, nuit d'atelier = 0. */
function jourCourant() {
  return 1 - rampe(scroll.progression, acteParId.seuil.fin, acteParId.vitrine.fin);
}

const AMBIANT = { jour: 1.05, nuit: 0.1 };
const DIRECTE = { jour: 2.2, nuit: 3.1 };

/**
 * Éclairage procédural — aucun HDRI téléchargé. Les spéculaires sont dessinés
 * par des Lightformers, donc contrôlés au lieu d'être subis.
 *
 * Les intensités sont interpolées sur le même curseur que les couleurs CSS :
 * un seul réglage à maintenir, jamais deux setups.
 */
export function Lighting() {
  const ambiant = useRef<AmbientLight>(null);
  const directe = useRef<DirectionalLight>(null);

  useFrame(() => {
    const j = jourCourant();
    if (ambiant.current) {
      ambiant.current.intensity = MathUtils.lerp(AMBIANT.nuit, AMBIANT.jour, j);
    }
    if (directe.current) {
      directe.current.intensity = MathUtils.lerp(DIRECTE.nuit, DIRECTE.jour, j);
    }
  });

  return (
    <>
      <ambientLight ref={ambiant} intensity={AMBIANT.jour} color="#f6f1e8" />
      <directionalLight
        ref={directe}
        castShadow
        position={[2.4, 4.2, 3.2]}
        intensity={DIRECTE.jour}
        color="#ffe9c9"
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0006}
        shadow-camera-left={-9}
        shadow-camera-right={9}
        shadow-camera-top={9}
        shadow-camera-bottom={-9}
        shadow-camera-near={0.5}
        shadow-camera-far={26}
      />
      <Environment resolution={128}>
        {/* Bandeau haut : la lumière rasante d'une verrière d'atelier. */}
        <Lightformer
          form="rect"
          intensity={1.6}
          position={[0, 4, 2]}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={[8, 4, 1]}
          color="#fff6e6"
        />
        {/* Rappel froid côté gauche : creuse les arêtes du glaçage. */}
        <Lightformer
          form="rect"
          intensity={0.5}
          position={[-4, 1.6, 1]}
          rotation={[0, Math.PI / 2, 0]}
          scale={[5, 3, 1]}
          color="#cfd8e3"
        />
      </Environment>
    </>
  );
}
