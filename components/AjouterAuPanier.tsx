"use client";

import Link from "next/link";
import { useState } from "react";
import { Bouton } from "./ui/Bouton";
import { panier } from "@/lib/panier";

export function AjouterAuPanier({ id, nom }: { id: string; nom: string }) {
  const [quantite, setQuantite] = useState(1);
  const [ajoute, setAjoute] = useState(false);

  return (
    <div className="grid gap-4">
      <div className="flex items-center gap-6">
        <div className="inline-flex items-center border border-noir h-12" role="group" aria-label="Quantité">
          <button
            type="button"
            className="w-12 h-full t-etiquette-l"
            onClick={() => setQuantite((q) => Math.max(1, q - 1))}
            aria-label="Moins"
          >
            −
          </button>
          <span className="w-10 text-center tabular-nums" aria-live="polite">
            {quantite}
          </span>
          <button
            type="button"
            className="w-12 h-full t-etiquette-l"
            onClick={() => setQuantite((q) => Math.min(20, q + 1))}
            aria-label="Plus"
          >
            +
          </button>
        </div>
        <Bouton
          className="flex-1"
          onClick={() => {
            panier.ajouter(id, quantite);
            setAjoute(true);
          }}
        >
          Ajouter au panier
        </Bouton>
      </div>
      {ajoute && (
        <p className="m-0 text-gris" role="status">
          {nom} ajouté.{" "}
          <Link href="/panier" className="text-noir lien">
            Voir le panier
          </Link>
        </p>
      )}
    </div>
  );
}
