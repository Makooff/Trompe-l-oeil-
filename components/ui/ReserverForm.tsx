"use client";

import { useState } from "react";
import { Bouton } from "./Bouton";
import { maison } from "@/content/maison";

const champ =
  "w-full h-11 px-3 bg-bg border border-trait-fort text-fg rounded-[var(--r-0)] " +
  "transition-colors duration-[var(--d-2)] ease-[var(--ease)] " +
  "hover:border-fg-70 focus:border-or";

/**
 * Formulaire de réservation. Aucun backend n'est branché : la soumission
 * confirme localement et renvoie vers le téléphone de l'atelier.
 */
export function ReserverForm() {
  const [envoye, setEnvoye] = useState(false);

  if (envoye) {
    return (
      <div
        className="border border-trait-fort p-6 md:p-8"
        role="status"
        aria-live="polite"
      >
        <p className="t-display-m m-0">Demande notée.</p>
        <p className="text-fg-70 mt-3 mb-0 mesure">
          L&apos;atelier confirme les tables par téléphone, au{" "}
          <a
            href={`tel:${maison.telephone.replace(/\s/g, "")}`}
            className="text-or underline underline-offset-4"
          >
            {maison.telephone}
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form
      className="grid gap-5 sm:grid-cols-2"
      onSubmit={(e) => {
        e.preventDefault();
        setEnvoye(true);
      }}
    >
      <div className="grid gap-2">
        <label htmlFor="nom" className="t-cartel text-fg-38">
          Nom
        </label>
        <input id="nom" name="nom" required autoComplete="name" className={champ} />
      </div>

      <div className="grid gap-2">
        <label htmlFor="email" className="t-cartel text-fg-38">
          Courriel
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className={champ}
        />
      </div>

      <div className="grid gap-2">
        <label htmlFor="date" className="t-cartel text-fg-38">
          Date
        </label>
        <input id="date" name="date" type="date" required className={champ} />
      </div>

      <div className="grid gap-2">
        <label htmlFor="couverts" className="t-cartel text-fg-38">
          Couverts
        </label>
        <input
          id="couverts"
          name="couverts"
          type="number"
          min={1}
          max={8}
          defaultValue={2}
          className={champ}
        />
      </div>

      <div className="sm:col-span-2">
        <Bouton variante="primaire">Demander une table</Bouton>
      </div>
    </form>
  );
}
