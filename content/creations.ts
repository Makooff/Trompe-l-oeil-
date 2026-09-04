export type Categorie = "fruit" | "objet";

export type Creation = {
  /** Identifiant stable : dossier d'images, ancre, clé de seed. */
  id: string;
  /** Le faux titre du cartel : le nom de l'objet que la pièce copie. */
  faux: string;
  categorie: Categorie;
  annee: number;
  /** Ce que vous voyez avant de goûter. Une phrase, ton muséal. */
  apparence: string;
  /** La composition réelle, listée comme sur un cartel de musée. */
  verite: string;
  /** Les couches, du dehors vers le dedans. Sert au cartel et au prompt de coupe. */
  couches: string[];
  prixEuros: number;
  allergenes: string[];
  /** Seed ComfyUI retenu pour la pièce. Le même pour la fermée et la coupe. */
  seed: number;
  /**
   * Slot GLTF. `null` = image en relief (défaut).
   * Déposer un .glb dans /public/models et pointer ici pour le remplacer.
   * Contrat : voir public/models/README.md.
   */
  modelUrl: string | null;
};

export const creations: Creation[] = [
  {
    id: "citron",
    faux: "Citron",
    categorie: "fruit",
    annee: 2019,
    apparence: "Un citron de Menton sur son socle, pore pour pore.",
    verite: "Crémeux citron de Menton, biscuit amande, coque de chocolat blanc velours",
    couches: ["coque chocolat blanc velours", "crémeux citron de Menton", "biscuit amande"],
    prixEuros: 14,
    allergenes: ["lait", "fruits à coque", "œuf"],
    seed: 190001,
    modelUrl: null,
  },
  {
    id: "noisette",
    faux: "Noisette",
    categorie: "fruit",
    annee: 2020,
    apparence: "Une noisette dans sa coque, une feuille d'or posée dessus.",
    verite: "Praliné noisette du Piémont, coque chocolat lait, feuille d'or",
    couches: ["coque chocolat au lait", "praliné noisette du Piémont", "feuilletine"],
    prixEuros: 12,
    allergenes: ["lait", "fruits à coque", "gluten"],
    seed: 190002,
    modelUrl: null,
  },
  {
    id: "cerise",
    faux: "Cerise",
    categorie: "fruit",
    annee: 2021,
    apparence: "Une cerise noire, glaçage miroir, queue tirée au sucre.",
    verite: "Confit de griotte, mousse vanille, queue en sucre tiré",
    couches: ["glaçage miroir rouge", "mousse vanille", "confit de griotte"],
    prixEuros: 11,
    allergenes: ["lait", "œuf"],
    seed: 190003,
    modelUrl: null,
  },
  {
    id: "poire",
    faux: "Poire",
    categorie: "fruit",
    annee: 2022,
    apparence: "Une petite poire verte, velours, une joue rosée.",
    verite: "Compotée poire-tonka, biscuit cuillère, velours vert",
    couches: ["velours vert", "compotée poire-tonka", "biscuit cuillère"],
    prixEuros: 13,
    allergenes: ["lait", "œuf", "gluten"],
    seed: 190004,
    modelUrl: null,
  },
  {
    id: "caillou",
    faux: "Caillou",
    categorie: "objet",
    annee: 2020,
    apparence: "Un galet de rivière gris, encore humide.",
    verite: "Chou craquelin, praliné noisette, sarrasin torréfié",
    couches: ["craquelin gris au sarrasin", "pâte à choux", "praliné noisette"],
    prixEuros: 9,
    allergenes: ["gluten", "lait", "fruits à coque", "œuf"],
    seed: 190005,
    modelUrl: null,
  },
  {
    id: "savon",
    faux: "Savon",
    categorie: "objet",
    annee: 2021,
    apparence: "Un cube de savon de Marseille, l'estampille à moitié effacée.",
    verite: "Entremets olive-verveine, glaçage opaque",
    couches: ["glaçage opaque vert pâle", "mousse olive-verveine", "biscuit"],
    prixEuros: 16,
    allergenes: ["lait", "œuf"],
    seed: 190006,
    modelUrl: null,
  },
  {
    id: "oeuf",
    faux: "Œuf",
    categorie: "objet",
    annee: 2021,
    apparence: "Un œuf cru dans sa coquille, fêlé sur le dessus.",
    verite: "Sphère mangue-passion, coque de chocolat blanc soufflé",
    couches: ["coque chocolat blanc soufflé", "mousse mangue", "cœur coulant passion"],
    prixEuros: 12,
    allergenes: ["lait"],
    seed: 190007,
    modelUrl: null,
  },
  {
    id: "marbre",
    faux: "Marbre",
    categorie: "objet",
    annee: 2022,
    apparence: "Une chute de marbre de Carrare, cassée net.",
    verite: "Tablette praliné, veines de vanille de Tahiti",
    couches: ["coque chocolat au lait", "praliné en couches", "veines de vanille"],
    prixEuros: 22,
    allergenes: ["lait", "fruits à coque"],
    seed: 190008,
    modelUrl: null,
  },
];

export const creationParId = Object.fromEntries(
  creations.map((c) => [c.id, c]),
) as Record<string, Creation>;
