import { maison } from "@/content/maison";
import { SIGNE_CHEMINS, SIGNE_VIEWBOX } from "@/content/marque";

type Variante = "signe" | "wordmark" | "horizontal";

/**
 * Le signe : un cercle coupé par un trait. À gauche la silhouette d'un
 * citron, à droite sa coupe en trois couches. Lu de loin, une pastille ; lu de
 * près, le procédé de la maison. Le même dessin sert de favicon.
 */
export function Signe({
  taille = 40,
  className = "",
}: {
  taille?: number;
  className?: string;
}) {
  return (
    <svg
      viewBox={SIGNE_VIEWBOX}
      width={taille}
      height={taille}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.25}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {SIGNE_CHEMINS.map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}

/**
 * La marque. Trois déclinaisons : le signe seul, le wordmark seul, et le
 * bloc horizontal signe + nom pour la navigation et le pied de page.
 */
export function Marque({
  variante = "wordmark",
  as: Tag = "span",
  className = "",
}: {
  variante?: Variante;
  as?: "span" | "h1" | "div";
  className?: string;
}) {
  const [maisonMot, nomMot] = maison.nom.split(" ");

  if (variante === "signe") {
    return (
      <Tag className={className}>
        <Signe />
        <span className="sr-only">{maison.nom}</span>
      </Tag>
    );
  }

  if (variante === "horizontal") {
    return (
      <Tag className={`inline-flex items-center gap-3 ${className}`}>
        <Signe taille={28} />
        <span className="t-cartel">{maison.nom}</span>
      </Tag>
    );
  }

  return (
    <Tag className={`t-display-xl block ${className}`}>
      {maisonMot}
      <span className="sr-only"> </span>
      <span className="block">{nomMot}</span>
    </Tag>
  );
}
