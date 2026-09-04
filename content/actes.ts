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
      "Vous regardez une affiche collée au mur. Descendez, elle se décollera.",
    debut: 0,
    fin: 0.12,
  },
  {
    id: "vitrine",
    numero: "01",
    titre: "La Vitrine",
    kicker: "Vous vous trompez de taille",
    chapo:
      "De face, la vitrine forme un rectangle. Faites deux pas de côté et le trapèze apparaît. Nous avons construit la pièce pour ce point de vue et pour aucun autre.",
    debut: 0.12,
    fin: 0.3,
  },
  {
    id: "mensonge",
    numero: "02",
    titre: "Le Mensonge",
    kicker: "Ouvrez-les",
    chapo:
      "Trois pièces s'ouvrent au passage. Vous verrez la coupe, les couches et l'insert que la coque cachait.",
    debut: 0.3,
    fin: 0.52,
  },
  {
    id: "anamorphose",
    numero: "03",
    titre: "L'Anamorphose",
    kicker: "Un seul angle",
    chapo:
      "Mille huit cents éclats de sucre flottent sans ordre visible. Continuez à descendre : à une position de caméra, ils composent un mot.",
    debut: 0.52,
    fin: 0.66,
  },
  {
    id: "matieres",
    numero: "04",
    titre: "Les Matières",
    kicker: "Quatre surfaces",
    chapo:
      "Glaçage miroir, chocolat tempéré, sucre glace et marbre. Le marbre vient d'une carrière, le reste sort du laboratoire.",
    debut: 0.66,
    fin: 0.78,
  },
  {
    id: "carte",
    numero: "05",
    titre: "La Carte",
    kicker: "Ce que c'est vraiment",
    chapo:
      "Nous donnons deux noms à chaque pièce. Le premier vient de l'objet qu'elle copie, le second de ce que vous mangez.",
    debut: 0.78,
    fin: 0.93,
  },
  {
    id: "maison",
    numero: "06",
    titre: "La Maison",
    kicker: "Venir",
    chapo: "L'atelier ouvre du mercredi au dimanche. Passez sans rendez-vous, ou réservez une table pour la dégustation.",
    debut: 0.93,
    fin: 1,
  },
];

export const acteParId = Object.fromEntries(
  actes.map((a) => [a.id, a]),
) as Record<ActeId, Acte>;
