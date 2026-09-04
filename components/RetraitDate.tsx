"use client";

import { useSyncExternalStore } from "react";
import { retrait, useRetrait } from "@/lib/panier";

/** Dans 48 h, au format attendu par input[type=date]. */
function minimum() {
  const d = new Date();
  d.setDate(d.getDate() + 2);
  const z = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}`;
}

function formater(iso: string) {
  const [a, m, j] = iso.split("-");
  return `${j}/${m}/${a}`;
}

/**
 * Le choix du jour de retrait, posé sur l'accueil comme sur la page de
 * click & collect de la référence. La date se garde avec le panier et
 * préremplit le formulaire de commande.
 */
export function RetraitDate() {
  const date = useRetrait();
  const min = useSyncExternalStore(() => () => {}, minimum, () => "");
  const valeur = date || min;

  return (
    <label className="inline-flex items-center gap-3 h-14 px-6 bg-blanc text-noir rounded-full cursor-pointer">
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
        <rect x="2" y="3.5" width="14" height="12" rx="1.5" />
        <path d="M2 7.5h14M6 2v3M12 2v3" />
      </svg>
      <span className="font-medium tabular-nums">{valeur ? formater(valeur) : "Choisir"}</span>
      <span className="sr-only">Jour de retrait</span>
      <input
        type="date"
        min={min || undefined}
        value={valeur}
        onChange={(e) => retrait.fixer(e.target.value)}
        className="absolute opacity-0 w-0 h-0"
      />
    </label>
  );
}
