"use client";

import { useSyncExternalStore } from "react";

export type Ligne = { id: string; quantite: number };

const CLE = "leurre.panier";
const abonnes = new Set<() => void>();
let lignes: Ligne[] = [];
let charge = false;

function lire(): Ligne[] {
  if (!charge && typeof window !== "undefined") {
    charge = true;
    try {
      const brut = window.localStorage.getItem(CLE);
      if (brut) lignes = JSON.parse(brut) as Ligne[];
    } catch {
      lignes = [];
    }
  }
  return lignes;
}

function ecrire(suivantes: Ligne[]) {
  lignes = suivantes;
  try {
    window.localStorage.setItem(CLE, JSON.stringify(lignes));
  } catch {
    // Stockage indisponible : le panier vit le temps de la page.
  }
  for (const fn of abonnes) fn();
}

const VIDE: Ligne[] = [];

/**
 * Le panier. Un store de module persisté dans localStorage, lu par
 * useSyncExternalStore : le badge de la barre, la fiche et la page panier
 * voient la même liste sans contexte React.
 */
export function usePanier() {
  const courant = useSyncExternalStore(
    (fn) => {
      abonnes.add(fn);
      return () => abonnes.delete(fn);
    },
    lire,
    () => VIDE,
  );
  return courant;
}

export const panier = {
  ajouter(id: string, quantite = 1) {
    const actuelles = lire();
    const existante = actuelles.find((l) => l.id === id);
    ecrire(
      existante
        ? actuelles.map((l) => (l.id === id ? { ...l, quantite: Math.min(20, l.quantite + quantite) } : l))
        : [...actuelles, { id, quantite }],
    );
  },
  fixer(id: string, quantite: number) {
    const actuelles = lire();
    ecrire(quantite <= 0 ? actuelles.filter((l) => l.id !== id) : actuelles.map((l) => (l.id === id ? { ...l, quantite } : l)));
  },
  retirer(id: string) {
    ecrire(lire().filter((l) => l.id !== id));
  },
  vider() {
    ecrire([]);
  },
};

export const nombreArticles = (l: Ligne[]) => l.reduce((n, x) => n + x.quantite, 0);
