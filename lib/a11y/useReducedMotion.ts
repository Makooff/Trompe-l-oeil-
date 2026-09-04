"use client";

import { useSyncExternalStore } from "react";

const REQUETE = "(prefers-reduced-motion: reduce)";

function sAbonner(reagir: () => void) {
  const mq = window.matchMedia(REQUETE);
  mq.addEventListener("change", reagir);
  return () => mq.removeEventListener("change", reagir);
}

const lire = () => window.matchMedia(REQUETE).matches;
// Côté serveur, on suppose le mouvement autorisé : l'hydratation corrige.
const lireServeur = () => false;

/** Vrai si l'utilisateur a demandé moins de mouvement. Réactif au changement. */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(sAbonner, lire, lireServeur);
}
