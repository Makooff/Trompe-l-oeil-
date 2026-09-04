"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Révélation par masque de ligne. Le bloc entre une fois, quand il touche
 * le tiers bas de l'écran, par un `clip-path` qui remonte et un décalage de
 * 12 px. Une seule animation d'entrée pour tout le site ; `retard` échelonne
 * un kicker, un titre et un chapô de 40 ms en 40 ms.
 *
 * Sous `prefers-reduced-motion`, la feuille de style annule la transition et
 * le bloc apparaît en place.
 */
export function Reveal({
  children,
  retard = 0,
  as: Tag = "div",
  className = "",
}: {
  children: ReactNode;
  /** En millisecondes, multiple de 40. */
  retard?: number;
  as?: "div" | "p" | "span";
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entree]) => {
        if (!entree.isIntersecting) return;
        el.dataset.visible = "";
        io.disconnect();
      },
      { rootMargin: "0px 0px -18% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as never}
      className={`reveal ${className}`}
      style={{ transitionDelay: `${retard}ms` }}
    >
      {children}
    </Tag>
  );
}
