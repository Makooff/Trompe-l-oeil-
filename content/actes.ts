export type ActeId =
  | "seuil"
  | "vitrine"
  | "mensonge"
  | "anamorphose"
  | "matieres"
  | "carte"
  | "maison";

export type Acte = {
  id: ActeId;
  /** Numéro affiché sur le cartel de section. */
  numero: string;
  titre: string;
  kicker: string;
  chapo: string;
  /** Bornes sur la progression globale du scroll, 0 → 1. */
  debut: number;
  fin: number;
};

/**
 * Source de vérité unique : le 2D et la scène 3D lisent les mêmes bornes.
 * Les plages sont contiguës et couvrent exactement [0, 1].
 */
export const actes: Acte[] = [
  {
    id: "seuil",
    numero: "00",
    titre: "Seuil",
    kicker: "Ceci est une affiche",
    chapo:
      "Une surface plate, un mot, rien derrière. Vous n'avez pas encore commencé à descendre.",
    debut: 0,
    fin: 0.12,
  },
  {
    id: "vitrine",
    numero: "01",
    titre: "La Vitrine",
    kicker: "L'échelle ment",
    chapo:
      "De face, la vitrine est un rectangle. Elle ne l'a jamais été. La pièce est un trapèze, et vous avez cru ce qu'on vous montrait.",
    debut: 0.12,
    fin: 0.3,
  },
  {
    id: "mensonge",
    numero: "02",
    titre: "Le Mensonge",
    kicker: "Ouvrez-les",
    chapo:
      "Trois pièces s'ouvrent. Ce qu'il y a dedans n'a rien à voir avec ce qu'il y a dessus.",
    debut: 0.3,
    fin: 0.52,
  },
  {
    id: "anamorphose",
    numero: "03",
    titre: "L'Anamorphose",
    kicker: "Un seul angle",
    chapo:
      "Mille huit cents éclats de sucre, dispersés sans ordre apparent. Il existe exactement un point de vue depuis lequel ils écrivent un mot.",
    debut: 0.52,
    fin: 0.66,
  },
  {
    id: "matieres",
    numero: "04",
    titre: "Les Matières",
    kicker: "Quatre surfaces",
    chapo:
      "Glaçage miroir, chocolat tempéré, sucre glace, marbre. Trois se mangent. Devinez lequel non.",
    debut: 0.66,
    fin: 0.78,
  },
  {
    id: "carte",
    numero: "05",
    titre: "La Carte",
    kicker: "Ce que c'est vraiment",
    chapo:
      "Chaque pièce porte deux noms : celui qu'elle affiche, et celui qu'elle a.",
    debut: 0.78,
    fin: 0.93,
  },
  {
    id: "maison",
    numero: "06",
    titre: "La Maison",
    kicker: "Venir",
    chapo: "L'atelier est ouvert. L'adresse, elle, ne triche pas.",
    debut: 0.93,
    fin: 1,
  },
];

export const acteParId = Object.fromEntries(
  actes.map((a) => [a.id, a]),
) as Record<ActeId, Acte>;
