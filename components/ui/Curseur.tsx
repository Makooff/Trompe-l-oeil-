"use client";

import { useEffect, useRef } from "react";

/**
 * Le curseur lame. Sur pointeur fin, au-dessus des zones marquées
 * `data-curseur="lame"`, le curseur système disparaît et un trait vertical
 * de 1 px le remplace, avec un léger retard de suivi. Ailleurs, rien.
 */
export function Curseur() {
  const trait = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const el = trait.current;
    if (!el) return;

    let x = -100;
    let y = -100;
    let cx = x;
    let cy = y;
    let actif = false;
    let raf = 0;

    const boucle = () => {
      cx += (x - cx) * 0.28;
      cy += (y - cy) * 0.28;
      el.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      raf = requestAnimationFrame(boucle);
    };

    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      const cible = (e.target as Element | null)?.closest("[data-curseur='lame']");
      const dessus = !!cible;
      if (dessus !== actif) {
        actif = dessus;
        el.dataset.actif = dessus ? "" : undefined;
        if (dessus) delete el.dataset.inactif;
        else el.dataset.inactif = "";
        document.documentElement.classList.toggle("curseur-lame", dessus);
      }
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(boucle);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("curseur-lame");
    };
  }, []);

  return <div ref={trait} className="curseur" aria-hidden="true" />;
}
