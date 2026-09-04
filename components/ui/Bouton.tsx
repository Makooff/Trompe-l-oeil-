import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variante = "plein" | "contour" | "texte";

const base =
  "inline-flex items-center justify-center h-12 px-7 t-etiquette-l select-none " +
  "transition-[background-color,color,border-color,opacity] duration-[var(--d-2)] ease-[var(--ease)] " +
  "disabled:opacity-40 disabled:pointer-events-none";

const variantes: Record<Variante, string> = {
  plein: "bg-noir text-blanc hover:bg-gris",
  contour: "border border-noir text-noir hover:bg-noir hover:text-blanc",
  texte: "px-0 h-auto lien",
};

export function Bouton({
  variante = "plein",
  href,
  children,
  className = "",
  ...props
}: {
  variante?: Variante;
  href?: string;
  children: ReactNode;
  className?: string;
} & Omit<ComponentProps<"button">, "children" | "className">) {
  const cls = `${base} ${variantes[variante]} ${className}`;
  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <button type="button" className={cls} {...props}>
      {children}
    </button>
  );
}
