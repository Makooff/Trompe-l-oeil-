"use client";

import { useEffect, useRef } from "react";
import { SequenceCoupe } from "./ui/SequenceCoupe";
import { sAbonner } from "@/lib/scroll/scrollStore";

const HAUTEUR = "h-[260svh]";

/**
 * Le hero : la pièce plein écran, épinglée le temps de deux écrans de
 * défilement. Descendre l'ouvre en deux ; le texte s'efface pendant la
 * coupe et la page reprend dessous.
 */
export function HeroCoupe({ id, nom, signature }: { id: string; nom: string; signature: string }) {
  const section = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = section.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const mesurer = () => {
      const r = el.getBoundingClientRect();
      const t = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - window.innerHeight)));
      el.style.setProperty("--t", t.toFixed(3));
    };
    const stop = sAbonner(mesurer);
    mesurer();
    return stop;
  }, []);

  return (
    <section ref={section} data-epingle className={`relative ${HAUTEUR} bg-noir text-blanc`} style={{ "--t": 0 } as React.CSSProperties} aria-label="Accueil">
      <div className="sticky top-0 h-svh overflow-hidden">
        <SequenceCoupe
          id={id}
          faux={nom}
          pilotage="epingle"
          ajustement="couvrir"
          affiche={`/sequences/${id}/coupe-000.webp`}
          className="absolute inset-0 h-full"
        />
        <div
          className="absolute inset-x-0 bottom-0 h-[45%] bg-linear-to-t from-noir/75 to-transparent pointer-events-none"
          style={{ opacity: "calc(1 - var(--t) * 3)" }}
          aria-hidden="true"
        />
        <div
          className="hero-entree absolute left-[var(--gouttiere)] right-[var(--gouttiere)] bottom-[max(2rem,env(safe-area-inset-bottom))] lg:bottom-12"
          style={{ opacity: "calc(1 - var(--t) * 3)" }}
        >
          <h1 className="t-signature m-0">{signature}</h1>
          <p className="m-0 mt-5 t-etiquette text-gris-clair">Descendez, le {nom.toLowerCase()} s&apos;ouvre.</p>
        </div>
      </div>
    </section>
  );
}
