"use client";

import Link from "next/link";
import { useRef, type ReactNode } from "react";
import { noterOrigine } from "@/lib/fiche";

/** Le lien d'une carte : note la position de la photo avant d'ouvrir la fiche. */
export function LienCarte({ id, className, children }: { id: string; className?: string; children: ReactNode }) {
  const ref = useRef<HTMLAnchorElement>(null);
  return (
    <Link
      ref={ref}
      href={`/patisseries/${id}`}
      className={className}
      onClick={() => noterOrigine(id, ref.current?.querySelector("[data-image]") ?? null)}
    >
      {children}
    </Link>
  );
}
