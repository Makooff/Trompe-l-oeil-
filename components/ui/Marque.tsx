import { maison } from "@/content/maison";

/** Le wordmark. Bodoni, tracking serré, jamais en gras appuyé. */
export function Marque({
  as: Tag = "span",
  className = "",
}: {
  as?: "span" | "h1" | "div";
  className?: string;
}) {
  return (
    <Tag className={`t-display-xl block ${className}`}>
      {maison.nom.split(" ")[0]}
      <span className="sr-only"> </span>
      <span className="block">{maison.nom.split(" ")[1]}</span>
    </Tag>
  );
}
