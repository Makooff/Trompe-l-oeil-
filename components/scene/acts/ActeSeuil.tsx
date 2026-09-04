"use client";

import { Suspense, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MathUtils, type Group, type Mesh, type ShaderMaterial } from "three";
import { acteParId } from "@/content/actes";
import { rampe, tLocal } from "@/lib/scroll/acts";
import { scroll } from "@/lib/scroll/scrollStore";
import { PieceRelief } from "../PieceRelief";
import { OmbreContact } from "../OmbreContact";

/** Angle final du décollement, en radians. Au-delà, l'affiche sort du champ. */
const ANGLE = 1.42;
/** Marge de visibilité au-delà de l'acte, qui évite un pop en bord de plage. */
const MARGE = 0.06;
/** L'affiche reste collée sur le premier quart de l'acte. */
const ADHERENCE = 0.25;

const doux = (t: number) => t * t * (3 - 2 * t);

/** Position de la pièce dans la salle et écartement des moitiés, en unités monde. */
const PIECE = { x: 0.55, y: 1.02, z: -1.6, taille: 1.5 } as const;
const ECART = 0.62;
/**
 * Raideur d'amorti par moitié. La droite suit avec un léger retard : c'est ce
 * retard qui donne à la coupe une sensation de poids au lieu d'un rideau.
 */
const RAIDEUR = { gauche: 9, droite: 6.5 } as const;

/**
 * Acte 00 puis 01.
 *
 * Au repos, un panneau de plâtre couvre le champ et le texte HTML posé
 * par-dessus paraît imprimé dessus. Au scroll, le panneau pivote sur son arête
 * haute et découvre la salle, où attend le citron. Sur l'acte Vitrine, la
 * progression du scroll écarte les deux moitiés et montre la coupe entre
 * elles. Rien n'est animé dans le temps : remonter referme la pièce.
 */
export function ActeSeuil() {
  const charniere = useRef<Group>(null);
  const gauche = useRef<Group>(null);
  const droite = useRef<Group>(null);
  const coupe = useRef<Mesh>(null);
  const piece = useRef<Group>(null);
  const moities = useRef<(Mesh | null)[]>([null, null]);

  useFrame((_, delta) => {
    const p = scroll.progression;

    const panneau = charniere.current;
    if (panneau) {
      panneau.visible = p < acteParId.seuil.fin + MARGE;
      if (panneau.visible) {
        const brut = tLocal(p, "seuil");
        const t = doux(Math.max(0, brut - ADHERENCE) / (1 - ADHERENCE));
        panneau.rotation.x = t * ANGLE;
        // L'affiche recule en basculant, sinon son arête basse traverse la caméra.
        panneau.position.z = MathUtils.lerp(0, -1.1, t);
      }
    }

    // La pièce s'efface à la fin de la Vitrine : l'acte suivant a les siennes.
    const ensemble = piece.current;
    const presence = 1 - rampe(p, acteParId.vitrine.fin - 0.02, acteParId.vitrine.fin + 0.03);
    if (ensemble) ensemble.visible = presence > 0;
    for (const m of moities.current) {
      if (m) (m.material as ShaderMaterial).uniforms.opacite.value = presence;
    }

    // La coupe suit l'acte Vitrine. Le début de plage garde la pièce fermée
    // le temps que la caméra finisse d'arriver.
    const t = doux(rampe(tLocal(p, "vitrine"), 0.18, 0.92));
    const voulu = t * ECART;

    if (gauche.current) {
      gauche.current.position.x = MathUtils.damp(gauche.current.position.x, -voulu, RAIDEUR.gauche, delta);
    }
    if (droite.current) {
      droite.current.position.x = MathUtils.damp(droite.current.position.x, voulu, RAIDEUR.droite, delta);
    }
    if (coupe.current) {
      const m = coupe.current.material as ShaderMaterial;
      // La coupe n'apparaît qu'une fois les moitiés parties, sinon elle
      // transparaît derrière la coque fermée.
      m.uniforms.opacite.value = rampe(t, 0.08, 0.35) * presence;
    }
  });

  return (
    <>
      {/* Charnière posée sur l'arête haute : le bas bascule vers le fond. */}
      <group ref={charniere} position={[0, 4.6, 0]}>
        {/* Une boîte plutôt qu'un plan : la tranche éclairée fait lire le
            décollement. Un plan sans épaisseur ne donne qu'une bande grise. */}
        <mesh position={[0, -3, 0]} castShadow>
          <boxGeometry args={[12, 6, 0.05]} />
          <meshStandardMaterial color="#f2ede4" roughness={0.94} metalness={0} />
        </mesh>
      </group>

      <group ref={piece} position={[PIECE.x, PIECE.y, PIECE.z]}>
        <Suspense fallback={null}>
          {/* La coupe, au centre, un cheveu derrière les moitiés. */}
          <PieceRelief
            ref={coupe}
            id="citron"
            variante="coupe"
            taille={PIECE.taille}
            position={[0, 0, -0.02]}
            amplitude={0.18}
            renderOrder={1}
          />
          <group ref={gauche}>
            <PieceRelief
              ref={(m) => {
                moities.current[0] = m;
              }}
              id="citron"
              variante="ferme"
              taille={PIECE.taille}
              masque={[0, 0.5]}
              renderOrder={2}
            />
          </group>
          <group ref={droite}>
            <PieceRelief
              ref={(m) => {
                moities.current[1] = m;
              }}
              id="citron"
              variante="ferme"
              taille={PIECE.taille}
              masque={[0.5, 1]}
              renderOrder={2}
            />
          </group>
        </Suspense>
        <OmbreContact largeur={1.6} position={[0, -PIECE.taille / 2 + 0.36, 0.1]} />
      </group>
    </>
  );
}
