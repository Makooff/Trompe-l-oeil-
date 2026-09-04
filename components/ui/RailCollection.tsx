"use client";

import { useEffect, useRef } from "react";
import { Cartel } from "./Cartel";
import { Lame } from "./Lame";
import type { Creation } from "@/content/creations";
import { PIECES_RENDUES } from "@/lib/pieces";
import { clamp01 } from "@/lib/scroll/acts";
import { sAbonner } from "@/lib/scroll/scrollStore";

const GRAND_ECRAN = "(min-width: 64rem)";
/** Part de chaque segment pendant laquelle le rail glisse ; le reste, il tient la pièce. */
const GLISSEMENT = 0.38;

const doux = (u: number) => u * u * (3 - 2 * u);

/**
 * Progression par paliers : chaque pièce tient l'écran sur 62 % de son
 * segment et glisse vers la suivante sur les 38 % restants. Un défilement
 * continu laisserait la plupart du temps deux moitiés de pièces à l'écran,
 * et un cartel ne se lit pas coupé en deux.
 */
function paliers(t: number, n: number) {
  const segments = n - 1;
  const brut = t * segments;
  const index = Math.min(segments - 1, Math.floor(brut));
  const u = brut - index;
  const glisse = doux(Math.max(0, u - (1 - GLISSEMENT)) / GLISSEMENT);
  return (index + glisse) / segments;
}

/**
 * La collection. Sur grand écran, un rail horizontal que le scroll vertical
 * fait défiler : la section mesure une hauteur d'écran par pièce, le cadre
 * reste collé, et le rail glisse d'une pièce à la suivante. Sur petit écran,
 * une pile verticale, une pièce après l'autre.
 *
 * Le rail lit la progression dans le store de module et écrit la transform
 * dans le DOM. Aucun rendu React pendant le scroll.
 */
export function RailCollection({ creations }: { creations: Creation[] }) {
  const cadre = useRef<HTMLDivElement>(null);
  const rail = useRef<HTMLDivElement>(null);
  const compteur = useRef<HTMLSpanElement>(null);
  const n = creations.length;

  useEffect(() => {
    const mq = window.matchMedia(GRAND_ECRAN);
    let dernier = -1;

    const appliquer = (t: number) => {
      if (!mq.matches || !rail.current) return;
      const tp = paliers(t, n);
      const x = -tp * (n - 1) * 100;
      rail.current.style.transform = `translate3d(${x}vw, 0, 0)`;
      const index = Math.min(n - 1, Math.round(tp * (n - 1)));
      if (index !== dernier && compteur.current) {
        dernier = index;
        compteur.current.textContent = String(index + 1).padStart(2, "0");
      }
    };

    // La progression se mesure sur le cadre lui-même, pas sur les bornes de
    // l'acte : l'en-tête au-dessus décalerait le rail d'une demi-pièce.
    const mesurer = () => {
      const el = cadre.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const course = r.height - window.innerHeight;
      appliquer(course > 0 ? clamp01(-r.top / course) : 0);
    };
    const stop = sAbonner(mesurer);
    mesurer();
    return stop;
  }, [n]);

  return (
    <div
      ref={cadre}
      className="lg:h-[calc(var(--pieces)*100svh)]"
      style={{ "--pieces": n } as React.CSSProperties}
    >
      <div className="lg:sticky lg:top-0 lg:h-svh lg:overflow-hidden">
        {/* Compteur d'inventaire, grand écran seulement. */}
        <p className="hidden lg:flex t-cartel text-fg-38 absolute top-[var(--gouttiere)] right-[var(--gouttiere)] z-10 m-0 gap-2">
          <span ref={compteur}>01</span>
          <span className="text-trait-fort" aria-hidden="true">/</span>
          <span>{String(n).padStart(2, "0")}</span>
        </p>

        <div
          ref={rail}
          className="flex flex-col gap-24 lg:flex-row lg:gap-0 lg:h-full lg:will-change-transform"
        >
          {creations.map((c, i) => (
            <article
              key={c.id}
              id={c.id}
              className="lg:w-screen lg:h-full lg:shrink-0 grid gap-10 lg:grid-cols-2 lg:items-center px-[var(--gouttiere)] lg:py-[var(--gouttiere)] scroll-mt-24"
            >
              <div className="lg:max-w-[34rem] order-2 lg:order-1">
                <Cartel creation={c} numero={String(i + 1).padStart(2, "0")} />
              </div>
              <div className="order-1 lg:order-2 flex justify-center">
                <div className="w-full aspect-4/5 lg:w-[min(42vw,calc((100svh-2*var(--gouttiere))*0.8))]">
                  {PIECES_RENDUES.has(c.id) ? (
                    <Lame id={c.id} faux={c.faux} className="h-full w-full" />
                  ) : (
                    <div className="h-full w-full bg-bg-eleve grid place-items-end p-6" aria-hidden="true">
                      <span className="t-cartel text-fg-38">Pièce {String(i + 1).padStart(2, "0")}</span>
                    </div>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
