"use client";

import { useSyncExternalStore } from "react";

export type Tier = "complet" | "reduit";

/**
 * Mesuré une seule fois puis mémorisé. Une scène qui change de tier en plein
 * scroll recompilerait ses shaders au pire moment, et `getSnapshot` doit de
 * toute façon renvoyer une valeur stable.
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

// Le tier ne change jamais en cours de session : rien à quoi s'abonner.
const sAbonner = () => () => {};
const lireServeur = (): null => null;

/**
 * Décide de la richesse de la scène. Le tier réduit n'est pas un site cassé :
 * c'est une version courte assumée — moins d'actes, pas de portail, pas de
 * matières coûteuses. `null` pendant le rendu serveur.
 */
export function useTier(): Tier | null {
  return useSyncExternalStore(sAbonner, lire, lireServeur);
}
