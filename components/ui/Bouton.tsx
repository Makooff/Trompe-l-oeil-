import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variante = "primaire" | "fantome";

const base =
  "inline-flex items-center justify-center h-11 px-6 t-cartel select-none " +
  "transition-[background-color,color,border-color,transform] duration-[var(--d-2)] " +
  "ease-[var(--ease)] active:scale-[0.97]";

const variantes: Record<Variante, string> = {
  // L'or est réservé aux points de décision : un seul bouton primaire par écran.
  // Le survol fonce l'or, il ne change pas de teinte.
  primaire: "bg-or text-bg rounded-[var(--r-pill)] hover:bg-or-fort",
  fantome:
    "border border-trait-fort text-fg rounded-[var(--r-0)] hover:border-fg hover:bg-bg-eleve",
};

export function Bouton({
  variante = "fantome",
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
