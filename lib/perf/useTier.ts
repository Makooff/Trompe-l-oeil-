"use client";

import { useSyncExternalStore } from "react";

export type Tier = "complet" | "reduit";

/**
 * On mesure une fois et on garde le résultat. Une scène qui change de tier en
 * plein scroll recompile ses shaders au pire moment, et `getSnapshot` doit
 * renvoyer une valeur stable.
 */
let mesure: Tier | null = null;

function lire(): Tier {
  if (mesure) return mesure;
  const petitEcran = window.matchMedia("(max-width: 47.999rem)").matches;
  const peuDeCoeurs = (navigator.hardwareConcurrency ?? 8) <= 4;
  const pointeurGrossier = window.matchMedia("(pointer: coarse)").matches;
  mesure =
    petitEcran || (peuDeCoeurs && pointeurGrossier) ? "reduit" : "complet";
  return mesure;
}

// Le tier reste fixe pour la session, donc il n'y a rien à écouter.
const sAbonner = () => () => {};
const lireServeur = (): null => null;

/**
 * Décide de la richesse de la scène. Le tier réduit donne une version courte
 * du parcours : moins d'actes, pas de portail, pas de matières coûteuses.
 * Renvoie `null` pendant le rendu serveur.
 */
export function useTier(): Tier | null {
  return useSyncExternalStore(sAbonner, lire, lireServeur);
}
