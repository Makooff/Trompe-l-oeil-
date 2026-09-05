"use client";

/**
 * D'où vient la fiche ouverte en fenêtre : la carte cliquée note sa
 * position juste avant la navigation, la fenêtre part de là et y revient
 * en se fermant. Un objet de module, il survit à la navigation douce.
 */
export const origineFiche: { id: string | null; rect: DOMRect | null } = { id: null, rect: null };

export function noterOrigine(id: string, el: Element | null) {
  origineFiche.id = id;
  origineFiche.rect = el ? el.getBoundingClientRect() : null;
}

/** La carte de la pièce encore à l'écran, pour y renvoyer la fenêtre. */
export function rectCarte(id: string): DOMRect | null {
  const el = document.querySelector(`[data-carte="${id}"] [data-image]`);
  return el ? el.getBoundingClientRect() : null;
}
