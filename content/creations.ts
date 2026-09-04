export type Creation = {
  /** Identifiant stable, sert d'ancre et de clé de géométrie procédurale. */
  id: string;
  /** Le faux titre du cartel : le nom de l'objet que la pièce copie. */
  faux: string;
  annee: number;
  /** Ce que vous voyez avant de goûter. Une phrase, ton muséal. */
  apparence: string;
  /** La composition réelle, listée comme sur un cartel de musée. */
  verite: string;
  prixEuros: number;
  allergenes: string[];
  /**
   * Slot GLTF. `null` = géométrie procédurale (défaut).
   * Déposer un .glb dans /public/models et pointer ici pour le remplacer,
   * sans aucune autre modification. Contrat : voir public/models/README.md.
   */
  modelUrl: string | null;
};

export const creations: Creation[] = [
  {
    id: "citron",
    faux: "Citron",
    annee: 2019,
    apparence: "Un citron de Menton sur son socle, pore pour pore.",
    verite:
      "Crémeux citron de Menton, biscuit amande, coque de chocolat blanc colorée au velours",
    prixEuros: 14,
    allergenes: ["lait", "fruits à coque", "œuf"],
    modelUrl: null,
  },
  {
    id: "caillou",
    faux: "Caillou",
    annee: 2020,
    apparence: "Un galet de rivière gris, encore humide.",
    verite: "Chou craquelin, praliné noisette, sarrasin torréfié",
    prixEuros: 9,
    allergenes: ["gluten", "lait", "fruits à coque", "œuf"],
    modelUrl: null,
  },
  {
    id: "savon",
    faux: "Savon",
    annee: 2021,
    apparence: "Un cube de savon de Marseille, l'estampille à moitié effacée.",
    verite: "Entremets olive-verveine, glaçage opaque",
    prixEuros: 16,
    allergenes: ["lait", "œuf"],
    modelUrl: null,
  },
  {
    id: "oeuf",
    faux: "Œuf",
    annee: 2021,
    apparence: "Un œuf cru dans sa coquille, fêlé sur le dessus.",
    verite: "Sphère mangue-passion, coque de chocolat blanc soufflé",
    prixEuros: 12,
    allergenes: ["lait"],
    modelUrl: null,
  },
  {
    id: "truffe",
    faux: "Truffe",
    annee: 2022,
    apparence: "Une truffe noire du Périgord, verrues comprises.",
    verite: "Ganache chocolat 72 %, terre de cacao",
    prixEuros: 8,
    allergenes: ["lait"],
    modelUrl: null,
  },
  {
    id: "marbre",
    faux: "Marbre",
    annee: 2022,
    apparence: "Une chute de marbre de Carrare, cassée net.",
    verite: "Tablette praliné, veines de vanille de Tahiti",
    prixEuros: 22,
    allergenes: ["lait", "fruits à coque"],
    modelUrl: null,
  },
  {
    id: "bougie",
    faux: "Bougie",
    annee: 2023,
    apparence: "Une bougie allumée, la cire déjà coulée.",
    verite: "Vacherin vanille, flamme en sucre tiré",
    prixEuros: 18,
    allergenes: ["lait", "œuf"],
    modelUrl: null,
  },
  {
    id: "papier-froisse",
    faux: "Papier froissé",
    annee: 2024,
    apparence: "Une feuille de papier chiffonnée puis jetée.",
    verite: "Feuilletage inversé, crème mousseline",
    prixEuros: 11,
    allergenes: ["gluten", "lait", "œuf"],
    modelUrl: null,
  },
];
