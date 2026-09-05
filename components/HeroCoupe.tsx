"use client";

import { useEffect, useRef } from "react";
import { SequenceCoupe } from "./ui/SequenceCoupe";
import { sAbonner } from "@/lib/scroll/scrollStore";

const HAUTEUR = "h-[220svh]";

/**
 * Le hero : la pièce plein écran, épinglée le temps de deux écrans de
 * défilement. Descendre l'ouvre en deux ; le texte s'efface pendant la
 * coupe et la page reprend dessous.
 */
export function HeroCoupe({ id, nom, accroche, maison }: { id: string; nom: string; accroche: string; maison: string }) {
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
          className="hero-entree absolute inset-x-0 top-[calc(var(--barre)+2.5rem)] px-[var(--gouttiere)] text-center"
          style={{ opacity: "calc(1 - var(--t) * 3)" }}
        >
          <p className="t-etiquette-l tracking-[0.3em] font-medium m-0 text-citron">{maison}</p>
          <div className="mx-auto max-w-[30rem] lg:max-w-[56rem]">
            <h1 className="t-grand mt-4 mb-0">{accroche}</h1>
          </div>
        </div>
        <p
          className="absolute inset-x-0 bottom-[max(1.5rem,env(safe-area-inset-bottom))] m-0 t-etiquette text-gris-clair text-center"
          style={{ opacity: "calc(1 - var(--t) * 3)" }}
        >
          Descendez, le {nom.toLowerCase()} s&apos;ouvre.
        </p>
      </div>
    </section>
  );
}
