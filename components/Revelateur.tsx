"use client";

import { useEffect } from "react";

/**
 * Révèle les blocs marqués data-reveal quand ils entrent dans l'écran :
 * l'attribut data-vu déclenche la transition CSS (globals.css). Un seul
 * observateur pour toute la page, qui suit aussi les blocs ajoutés après
 * coup (navigation, fenêtre produit).
 */
export function Revelateur() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.documentElement.classList.remove("js");
      return;
    }
    const io = new IntersectionObserver(
      (entrees) => {
        for (const e of entrees) {
          if (!e.isIntersecting) continue;
          e.target.setAttribute("data-vu", "");
          io.unobserve(e.target);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );
    const suivre = (racine: ParentNode) => {
      for (const el of racine.querySelectorAll("[data-reveal]:not([data-vu])")) io.observe(el);
    };
    suivre(document);
    const mo = new MutationObserver((mutations) => {
      for (const m of mutations) {
        for (const n of m.addedNodes) if (n instanceof Element) suivre(n);
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);
  return null;
}
