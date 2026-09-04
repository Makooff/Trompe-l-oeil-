"use client";

import Link from "next/link";
import { useState } from "react";
import { Bouton } from "./ui/Bouton";
import { creationParId } from "@/content/creations";
import { maison } from "@/content/maison";
import { nombreArticles, panier, usePanier, useRetrait } from "@/lib/panier";

const champ =
  "w-full h-12 px-0 bg-transparent border-0 border-b border-filet text-fg placeholder:text-gris-clair " +
  "focus:outline-none focus:border-noir transition-colors duration-[var(--d-2)]";

/** Dans 48 h, à 10 h, au format attendu par input[type=datetime-local]. */
function retraitMinimum() {
  const d = new Date();
  d.setDate(d.getDate() + 2);
  d.setHours(10, 0, 0, 0);
  const z = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}T${z(d.getHours())}:${z(d.getMinutes())}`;
}

export function PanierClient() {
  const lignes = usePanier();
  const jour = useRetrait();
  const [etat, setEtat] = useState<"repos" | "envoi" | "ok" | "erreur">("repos");
  const [recap, setRecap] = useState("");

  const total = lignes.reduce((t, l) => t + (creationParId[l.id]?.prixEuros ?? 0) * l.quantite, 0);

  if (etat === "ok") {
    return (
      <div className="max-w-[34rem]">
        <h1 className="t-grand">Commande reçue.</h1>
        <p className="text-gris mt-6">
          Nous vous confirmons l&apos;heure de retrait par courriel. Les pièces vous attendent au {maison.adresse}, {maison.ville}.
        </p>
        <pre className="mt-8 p-6 bg-fond-doux whitespace-pre-wrap text-sm leading-relaxed">{recap}</pre>
        <p className="mt-8 mb-0">
          <Link href="/patisseries" className="lien">
            Retour aux pâtisseries
          </Link>
        </p>
      </div>
    );
  }

  if (lignes.length === 0) {
    return (
      <div className="max-w-[34rem]">
        <h1 className="t-grand">Votre panier est vide.</h1>
        <p className="text-gris mt-6 mb-8">Les pièces se commandent en ligne et se retirent en boutique, 48 heures plus tard.</p>
        <Bouton href="/patisseries" variante="contour">Voir les pâtisseries</Bouton>
      </div>
    );
  }

  return (
    <div className="grid gap-14 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
      <div>
        <h1 className="t-grand">Panier</h1>
        <ul className="list-none p-0 m-0 mt-8 border-t border-filet">
          {lignes.map((l) => {
            const c = creationParId[l.id];
            if (!c) return null;
            return (
              <li key={l.id} className="grid grid-cols-[5rem_1fr_auto] gap-5 items-center py-5 border-b border-filet">
                <Link href={`/patisseries/${c.id}`} className="block aspect-4/5 bg-fond-doux">
                  <img src={`/pieces/${c.id}/ferme-512.webp`} alt="" className="h-full w-full object-cover" />
                </Link>
                <div>
                  <Link href={`/patisseries/${c.id}`} className="t-etiquette-l lien">
                    {c.nom}
                  </Link>
                  <p className="text-gris mt-1 mb-2">{c.prixEuros} € l&apos;unité</p>
                  <div className="inline-flex items-center border border-filet h-9">
                    <button type="button" className="w-9 h-full" onClick={() => panier.fixer(l.id, l.quantite - 1)} aria-label={`Moins de ${c.nom}`}>
                      −
                    </button>
                    <span className="w-8 text-center tabular-nums">{l.quantite}</span>
                    <button type="button" className="w-9 h-full" onClick={() => panier.fixer(l.id, Math.min(20, l.quantite + 1))} aria-label={`Plus de ${c.nom}`}>
                      +
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="m-0 tabular-nums">{c.prixEuros * l.quantite} €</p>
                  <button type="button" className="t-etiquette text-gris lien mt-2" onClick={() => panier.retirer(l.id)}>
                    Retirer
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
        <div className="flex justify-between pt-5 t-petit-titre">
          <span>Total, {nombreArticles(lignes)} {nombreArticles(lignes) > 1 ? "pièces" : "pièce"}</span>
          <span className="tabular-nums">{total} €</span>
        </div>
        <p className="text-gris mt-3 mb-0">Règlement en boutique au moment du retrait.</p>
      </div>

      <form
        className="grid gap-6 content-start"
        onSubmit={async (e) => {
          e.preventDefault();
          setEtat("envoi");
          const f = new FormData(e.currentTarget);
          const r = await fetch("/api/commande", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              type: "commande",
              nom: f.get("nom"),
              email: f.get("email"),
              telephone: f.get("telephone"),
              retrait: f.get("retrait"),
              note: f.get("note"),
              lignes,
            }),
          }).catch(() => null);
          const corps = r ? await r.json().catch(() => ({})) : {};
          if (r?.ok) {
            setRecap(corps.recap ?? "");
            panier.vider();
            setEtat("ok");
          } else {
            setEtat("erreur");
          }
        }}
      >
        <h2 className="t-moyen">Retrait en boutique</h2>
        <p className="text-gris m-0">{maison.retrait}</p>

        <div className="grid gap-2">
          <label htmlFor="nom" className="t-etiquette text-gris">Nom</label>
          <input id="nom" name="nom" required autoComplete="name" className={champ} />
        </div>
        <div className="grid gap-2 sm:grid-cols-2 sm:gap-6">
          <div className="grid gap-2">
            <label htmlFor="email" className="t-etiquette text-gris">Courriel</label>
            <input id="email" name="email" type="email" required autoComplete="email" className={champ} />
          </div>
          <div className="grid gap-2">
            <label htmlFor="telephone" className="t-etiquette text-gris">Téléphone</label>
            <input id="telephone" name="telephone" type="tel" required autoComplete="tel" className={champ} />
          </div>
        </div>
        <div className="grid gap-2">
          <label htmlFor="retrait" className="t-etiquette text-gris">Jour et heure de retrait</label>
          <input id="retrait" name="retrait" type="datetime-local" required min={retraitMinimum()} defaultValue={jour ? `${jour}T10:00` : retraitMinimum()} className={champ} />
        </div>
        <div className="grid gap-2">
          <label htmlFor="note" className="t-etiquette text-gris">Un mot pour l&apos;atelier (facultatif)</label>
          <textarea id="note" name="note" rows={3} className={`${champ} h-auto py-3 resize-none`} />
        </div>

        <Bouton type="submit" disabled={etat === "envoi"}>
          {etat === "envoi" ? "Envoi…" : "Commander"}
        </Bouton>
        {etat === "erreur" && (
          <p className="m-0 text-gris" role="alert">
            L&apos;envoi a échoué. Appelez-nous au {maison.telephone}, nous prenons la commande par téléphone.
          </p>
        )}
      </form>
    </div>
  );
}
