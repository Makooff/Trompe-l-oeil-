"use client";

import { useState } from "react";

/** Inscription aux nouveautés. Envoie à /api/commande avec le type `newsletter`. */
export function Newsletter() {
  const [etat, setEtat] = useState<"repos" | "envoi" | "ok" | "erreur">("repos");

  if (etat === "ok") {
    return <p className="m-0 text-gris">Merci. Vous recevrez les prochaines pièces avant tout le monde.</p>;
  }

  return (
    <form
      className="flex border-b border-noir"
      onSubmit={async (e) => {
        e.preventDefault();
        setEtat("envoi");
        const email = new FormData(e.currentTarget).get("email");
        const r = await fetch("/api/commande", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ type: "newsletter", email }),
        }).catch(() => null);
        setEtat(r?.ok ? "ok" : "erreur");
      }}
    >
      <label htmlFor="nl-email" className="sr-only">
        Votre courriel
      </label>
      <input
        id="nl-email"
        name="email"
        type="email"
        required
        autoComplete="email"
        placeholder="Votre courriel"
        className="flex-1 h-11 bg-transparent border-0 px-0 text-fg placeholder:text-gris-clair focus:outline-none"
      />
      <button type="submit" className="t-etiquette h-11 px-2 -mr-2" disabled={etat === "envoi"}>
        {etat === "erreur" ? "Réessayer" : "OK"}
      </button>
    </form>
  );
}
