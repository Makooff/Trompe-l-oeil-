/**
 * Source de vérité de la progression du scroll.
 *
 * Un objet mutable de module plutôt qu'un store React : la scène 3D le lit
 * dans `useFrame`, soixante fois par seconde, et un setState par frame
 * rerendrait tout l'arbre. Les saccades viennent presque toujours de là.
 *
 * Les composants React qui veulent une valeur ponctuelle s'abonnent via
 * `sAbonner`, appelé au plus une fois par frame.
 */
export type EtatScroll = {
  /** Progression du document, 0 → 1. */
  progression: number;
  /** Vitesse instantanée, en fraction de document par seconde. Le signe donne le sens. */
  vitesse: number;
};

export const scroll: EtatScroll = { progression: 0, vitesse: 0 };

type Abonne = (etat: EtatScroll) => void;
const abonnes = new Set<Abonne>();

export function sAbonner(fn: Abonne): () => void {
  abonnes.add(fn);
  return () => abonnes.delete(fn);
}

export function publier(progression: number, vitesse: number) {
  scroll.progression = progression;
  scroll.vitesse = vitesse;
  for (const fn of abonnes) fn(scroll);
}
