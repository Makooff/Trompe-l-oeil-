/**
 * Source de vérité de la progression du scroll.
 *
 * Volontairement un objet mutable de module, pas un store React : la scène 3D
 * le lit dans `useFrame`, soixante fois par seconde. Passer par un setState
 * rerendrait l'arbre à chaque frame — c'est la première cause de saccade sur
 * ce type de site.
 *
 * Les composants React qui ont besoin d'une valeur ponctuelle s'abonnent via
 * `sAbonner`, appelé au plus une fois par frame et seulement si la valeur a
 * bougé.
 */
export type EtatScroll = {
  /** Progression du document, 0 → 1. */
  progression: number;
  /** Vitesse instantanée, en fraction de document par seconde. Signe = sens. */
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
