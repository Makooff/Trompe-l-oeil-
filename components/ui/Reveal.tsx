"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { sAbonner } from "@/lib/scroll/scrollStore";

/**
 * Révélation par masque de ligne. Le bloc entre une fois, quand il touche
 * le tiers bas de l'écran, par un `clip-path` qui remonte et un décalage de
 * 12 px. Une seule animation d'entrée pour tout le site ; `retard` échelonne
 * un kicker, un titre et un chapô de 40 ms en 40 ms.
 *
 * Sous `prefers-reduced-motion`, le bloc est visible dès le montage : aucune
 * entrée. Sans JavaScript, la feuille de style ne masque rien.
 *
 * L'observateur d'intersection fait le travail ; une lecture de la position
 * à chaque publication du scroll le double, parce qu'un observateur créé
 * pendant l'hydratation peut rester muet sur certains navigateurs.
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

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.dataset.visible = "";
      return;
    }

    let fini = false;
    const montrer = () => {
      if (fini) return;
      fini = true;
      el.dataset.visible = "";
      io.disconnect();
      stop();
    };

    const io = new IntersectionObserver(
      ([entree]) => {
        if (entree.isIntersecting) montrer();
      },
      { rootMargin: "0px 0px -18% 0px" },
    );
    io.observe(el);

    const verifier = () => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.82 && r.bottom > 0) montrer();
    };
    const stop = sAbonner(verifier);
    verifier();

    return () => {
      io.disconnect();
      stop();
    };
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
