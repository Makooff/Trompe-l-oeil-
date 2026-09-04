export type Categorie = "fruit" | "coque";

export type Creation = {
  /** Identifiant stable : dossier d'images, URL de la fiche. */
  id: string;
  nom: string;
  categorie: Categorie;
  /** Une phrase d'appétit, sur la fiche et dans la grille. */
  description: string;
  /** La composition, telle qu'on la lit sur l'étiquette. */
  composition: string;
  /** Les couches, du dehors vers le dedans. Sert à la fiche et au prompt de coupe. */
  couches: string[];
  prixEuros: number;
  /** Pour combien de personnes. */
  parts: number;
  allergenes: string[];
  /** Seed ComfyUI retenu pour la pièce. Le même pour la fermée et la coupe. */
  seed: number;
};

export const collections: Record<Categorie, { nom: string; sousTitre: string }> = {
  fruit: {
    nom: "Les fruits",
    sousTitre: "Mangue, citron, framboise, pêche. Vrais à l'œil, desserts à la fourchette.",
  },
  coque: {
    nom: "Les fruits à coque",
    sousTitre: "Cacahuète et noix de pécan, coque comprise. Tout se mange.",
  },
};

/*
 * Les identifiants restent ceux des dossiers d'images. Les noms suivent les
 * photos provisoires déposées dans rendus/ ; ils changeront avec les vraies
 * pièces du client.
 */
export const creations: Creation[] = [
  {
    id: "citron",
    nom: "Mangue",
    categorie: "fruit",
    description: "Une mangue mûre, du vert au rouge. Dedans, une compotée de mangue et fruit de la passion aux graines de vanille.",
    composition: "Compotée mangue-passion, crémeux vanille, coque de chocolat blanc velours",
    couches: ["coque chocolat blanc velours", "crémeux vanille", "compotée mangue-passion"],
    prixEuros: 14,
    parts: 2,
    allergenes: ["lait", "œuf"],
    seed: 190001,
  },
  {
    id: "noisette",
    nom: "Pêche blanche",
    categorie: "fruit",
    description: "Une pêche blanche poudrée de sucre. Compotée de pêche et mousse à la fleur d'oranger.",
    composition: "Compotée de pêche blanche, mousse fleur d'oranger, coque de chocolat blanc",
    couches: ["coque chocolat blanc sucrée", "mousse fleur d'oranger", "compotée de pêche"],
    prixEuros: 12,
    parts: 1,
    allergenes: ["lait", "œuf"],
    seed: 190002,
  },
  {
    id: "cerise",
    nom: "Potiron",
    categorie: "fruit",
    description: "Un petit potiron doré. Mousse chocolat au lait et cœur de caramel à la courge rôtie.",
    composition: "Mousse chocolat au lait, caramel de courge rôtie, biscuit noisette",
    couches: ["coque chocolat au lait velours", "mousse chocolat au lait", "caramel de courge"],
    prixEuros: 11,
    parts: 1,
    allergenes: ["lait", "œuf", "fruits à coque"],
    seed: 190003,
  },
  {
    id: "poire",
    nom: "Framboise",
    categorie: "fruit",
    description: "Une framboise grain à grain. Confit de framboise sous une mousse vanille.",
    composition: "Confit de framboise, mousse vanille, coque de chocolat blanc velours rouge",
    couches: ["coque velours rouge", "mousse vanille", "confit de framboise"],
    prixEuros: 13,
    parts: 1,
    allergenes: ["lait", "œuf"],
    seed: 190004,
  },
  {
    id: "caillou",
    nom: "Citron",
    categorie: "fruit",
    description: "Un citron côtelé, queue comprise. Crémeux citron et biscuit amande.",
    composition: "Crémeux citron, biscuit amande, coque de chocolat blanc velours jaune",
    couches: ["coque velours jaune", "crémeux citron", "biscuit amande"],
    prixEuros: 12,
    parts: 1,
    allergenes: ["lait", "œuf", "fruits à coque"],
    seed: 190005,
  },
  {
    id: "savon",
    nom: "Pêche de vigne",
    categorie: "fruit",
    description: "Une pêche de vigne, rouge et duveteuse. Compotée de pêche et mousse verveine.",
    composition: "Compotée de pêche de vigne, mousse verveine, coque de chocolat blanc velours",
    couches: ["coque velours rosé", "mousse verveine", "compotée de pêche de vigne"],
    prixEuros: 12,
    parts: 1,
    allergenes: ["lait", "œuf"],
    seed: 190006,
  },
  {
    id: "oeuf",
    nom: "Cacahuète",
    categorie: "coque",
    description: "Une cacahuète dans sa coque, à l'échelle deux. Praliné cacahuète et caramel.",
    composition: "Praliné cacahuète, caramel tendre, coque de chocolat blanc peinte",
    couches: ["coque chocolat blanc peinte", "praliné cacahuète", "caramel tendre"],
    prixEuros: 16,
    parts: 2,
    allergenes: ["lait", "arachide"],
    seed: 190007,
  },
  {
    id: "marbre",
    nom: "Noix de pécan",
    categorie: "coque",
    description: "Une noix de pécan à l'échelle deux. Ganache chocolat au lait et praliné pécan.",
    composition: "Ganache chocolat au lait, praliné pécan, coque de chocolat au lait",
    couches: ["coque chocolat au lait", "ganache chocolat au lait", "praliné pécan"],
    prixEuros: 16,
    parts: 2,
    allergenes: ["lait", "fruits à coque"],
    seed: 190008,
  },
];

export const creationParId = Object.fromEntries(
  creations.map((c) => [c.id, c]),
) as Record<string, Creation>;
