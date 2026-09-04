"use client";

import { useEffect, useState } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

/** Vrai si l'utilisateur a demandé moins de mouvement. Réactif au changement. */
export function useReducedMotion(): boolean {
  const [reduit, setReduit] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(QUERY);
    setReduit(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduit(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return reduit;
}
