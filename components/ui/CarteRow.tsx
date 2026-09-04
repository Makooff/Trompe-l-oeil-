import type { Creation } from "@/content/creations";

/**
 * Ligne de carte imprimée : le faux titre, la vérité, le prix.
 * Volontairement non cliquable — une carte ne se navigue pas, elle se lit.
 *
 * Le nom tient un cran sous le display des titres d'acte : huit noms au même
 * poids que le titre de section feraient huit dominantes et aucune.
 */
export function CarteRow({ creation }: { creation: Creation }) {
  return (
    <li className="grid grid-cols-1 md:grid-cols-[12rem_1fr_auto] gap-1 md:gap-8 items-baseline py-5 md:py-6 border-t border-trait">
      <span className="t-display-s">{creation.faux}</span>
      <span className="t-cartel text-fg-70">{creation.verite}</span>
      <span className="t-cartel text-or md:text-right">
        {creation.prixEuros} €
      </span>
    </li>
  );
}
