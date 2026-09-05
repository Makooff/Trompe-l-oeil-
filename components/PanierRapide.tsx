"use client";

import { useEffect, useState } from "react";
import { panier } from "@/lib/panier";

/**
 * Le bouton rond posé sur la carte au survol : une pièce dans le panier,
 * sans ouvrir la fiche. Confirme deux secondes par une coche.
 */
export function PanierRapide({ id, nom, className = "" }: { id: string; nom: string; className?: string }) {
  const [ajoute, setAjoute] = useState(false);

  useEffect(() => {
    if (!ajoute) return;
    const t = window.setTimeout(() => setAjoute(false), 2000);
    return () => window.clearTimeout(t);
  }, [ajoute]);

  return (
    <button
      type="button"
      onClick={() => {
        panier.ajouter(id, 1);
        setAjoute(true);
      }}
      aria-label={ajoute ? `${nom} ajouté au panier` : `Ajouter ${nom} au panier`}
      className={`grid place-items-center w-11 h-11 rounded-full bg-blanc text-noir transition-[background-color,color] duration-[var(--d-2)] ease-[var(--ease)] hover:bg-noir hover:text-blanc active:scale-[0.97] ${className}`}
    >
      {ajoute ? (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
          <path d="M2.5 8.5 6 12l7.5-8" />
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
          <path d="M2.5 7h13l-1.2 7.5H3.7L2.5 7Z" />
          <path d="M6 7V5.5a3 3 0 0 1 6 0V7" />
        </svg>
      )}
    </button>
  );
}
