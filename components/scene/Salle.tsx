"use client";

/**
 * La salle derrière l'affiche. Plâtre mat, aucune arête brillante : elle sert
 * de fond. L'acte Vitrine déformera ses murs pour la chambre d'Ames, mais à
 * ce stade la géométrie reste honnête.
 */
export function Salle() {
  return (
    <group>
      {/* Sol */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -2]} receiveShadow>
        <planeGeometry args={[24, 24]} />
        <meshStandardMaterial color="#c7bda8" roughness={0.96} metalness={0} />
      </mesh>

      {/* Mur du fond */}
      <mesh position={[0, 3, -4.6]} receiveShadow>
        <planeGeometry args={[24, 12]} />
        <meshStandardMaterial color="#e2dacb" roughness={0.98} metalness={0} />
      </mesh>

      {/* Murs latéraux, écartés : ils cadrent sans se faire remarquer. */}
      <mesh position={[-6, 3, -1.6]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[16, 12]} />
        <meshStandardMaterial color="#cec5b4" roughness={0.98} metalness={0} />
      </mesh>
      <mesh position={[6, 3, -1.6]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[16, 12]} />
        <meshStandardMaterial color="#cec5b4" roughness={0.98} metalness={0} />
      </mesh>
    </group>
  );
}
