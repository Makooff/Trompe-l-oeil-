export type Categorie = "fruit" | "objet";

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
    sousTitre: "Citron, noisette, cerise, poire. Vrais à l'œil, desserts à la fourchette.",
  },
  objet: {
    nom: "Les objets",
    sousTitre: "Un caillou, un savon, un œuf, un morceau de marbre. Tous se mangent.",
  },
};

export const creations: Creation[] = [
  {
    id: "citron",
    nom: "Citron",
    categorie: "fruit",
    description: "Un citron de Menton, pore pour pore. Dedans, un crémeux acidulé sur un biscuit amande.",
    composition: "Crémeux citron de Menton, biscuit amande, coque de chocolat blanc velours",
    couches: ["coque chocolat blanc velours", "crémeux citron de Menton", "biscuit amande"],
    prixEuros: 14,
    parts: 2,
    allergenes: ["lait", "fruits à coque", "œuf"],
    seed: 190001,
  },
  {
    id: "noisette",
    nom: "Noisette",
    categorie: "fruit",
    description: "Une noisette dans sa coque, une feuille d'or posée dessus. Praliné du Piémont au cœur.",
    composition: "Praliné noisette du Piémont, coque chocolat au lait, feuille d'or",
    couches: ["coque chocolat au lait", "praliné noisette du Piémont", "feuilletine"],
    prixEuros: 12,
    parts: 1,
    allergenes: ["lait", "fruits à coque", "gluten"],
    seed: 190002,
  },
  {
    id: "cerise",
    nom: "Cerise",
    categorie: "fruit",
    description: "Glaçage miroir rouge sombre, queue tirée au sucre. Confit de griotte sous une mousse vanille.",
    composition: "Confit de griotte, mousse vanille, queue en sucre tiré",
    couches: ["glaçage miroir rouge", "mousse vanille", "confit de griotte"],
    prixEuros: 11,
    parts: 1,
    allergenes: ["lait", "œuf"],
    seed: 190003,
  },
  {
    id: "poire",
    nom: "Poire",
    categorie: "fruit",
    description: "Une petite poire verte, une joue rosée. Compotée poire-tonka sur un biscuit cuillère.",
    composition: "Compotée poire-tonka, biscuit cuillère, velours vert",
    couches: ["velours vert", "compotée poire-tonka", "biscuit cuillère"],
    prixEuros: 13,
    parts: 2,
    allergenes: ["lait", "œuf", "gluten"],
    seed: 190004,
  },
  {
    id: "caillou",
    nom: "Caillou",
    categorie: "objet",
    description: "Un galet gris, encore humide. Un chou craquelin au praliné noisette et sarrasin.",
    composition: "Chou craquelin, praliné noisette, sarrasin torréfié",
    couches: ["craquelin gris au sarrasin", "pâte à choux", "praliné noisette"],
    prixEuros: 9,
    parts: 1,
    allergenes: ["gluten", "lait", "fruits à coque", "œuf"],
    seed: 190005,
  },
  {
    id: "savon",
    nom: "Savon",
    categorie: "objet",
    description: "Un cube de savon de Marseille, l'estampille à moitié effacée. Entremets olive et verveine.",
    composition: "Entremets olive-verveine, glaçage opaque",
    couches: ["glaçage opaque vert pâle", "mousse olive-verveine", "biscuit"],
    prixEuros: 16,
    parts: 2,
    allergenes: ["lait", "œuf"],
    seed: 190006,
  },
  {
    id: "oeuf",
    nom: "Œuf",
    categorie: "objet",
    description: "Un œuf cru dans sa coquille, fêlé sur le dessus. Mangue et cœur coulant passion.",
    composition: "Sphère mangue-passion, coque de chocolat blanc soufflé",
    couches: ["coque chocolat blanc soufflé", "mousse mangue", "cœur coulant passion"],
    prixEuros: 12,
    parts: 1,
    allergenes: ["lait"],
    seed: 190007,
  },
  {
    id: "marbre",
    nom: "Marbre",
    categorie: "objet",
    description: "Une chute de marbre de Carrare, cassée net. Tablette praliné aux veines de vanille.",
    composition: "Tablette praliné, veines de vanille de Tahiti",
    couches: ["coque chocolat au lait", "praliné en couches", "veines de vanille"],
    prixEuros: 22,
    parts: 4,
    allergenes: ["lait", "fruits à coque"],
    seed: 190008,
  },
];

export const creationParId = Object.fromEntries(
  creations.map((c) => [c.id, c]),
) as Record<string, Creation>;
