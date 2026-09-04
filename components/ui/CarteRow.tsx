import type { Creation } from "@/content/creations";

/**
 * Ligne de carte imprimée : le faux titre, la composition, le prix. Rien n'est
 * cliquable, parce qu'on lit une carte au lieu de la naviguer.
 *
 * Le nom tient un cran sous le display des titres d'acte. Au même poids, huit
 * noms se disputeraient l'attention avec le titre de section.
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
