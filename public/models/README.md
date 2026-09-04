# Slot GLTF — remplacer une géométrie procédurale par un vrai modèle

Par défaut, chaque pièce est générée en code (`lib/three/geometry/`). Aucun
fichier lourd n'est versionné, et le site fonctionne sans aucun asset.

Pour brancher un modèle sculpté ou scanné à la place, déposer le `.glb` ici et
renseigner `modelUrl` dans `content/creations.ts` :

```ts
{ id: "citron", /* … */ modelUrl: "/models/citron.glb" }
```

Aucune autre modification n'est nécessaire : `CreationMesh` charge le `.glb`
quand `modelUrl` est renseigné, et retombe sur la fabrique procédurale sinon.

## Contrat du modèle

| Point | Attendu |
|---|---|
| Format | `.glb` binaire, glTF 2.0, Draco accepté |
| Échelle | 1 unité = 1 cm. Une pièce fait typiquement 6 à 9 unités de haut |
| Origine | Au centre de la base, posée sur le plan `y = 0` |
| Orientation | `+Y` vers le haut, la face présentée vers `+Z` |
| Matériaux | Ignorés — les matériaux du site sont appliqués par-dessus |
| Poids | Viser moins de 1,5 Mo par pièce après Draco |

## Pièces ouvrables

Les pièces de l'acte « Le Mensonge » s'ouvrent en deux et montrent leur coupe.
Le modèle doit alors contenir trois nœuds nommés exactement :

- `coque_a` — demi-coque gauche
- `coque_b` — demi-coque droite
- `coupe` — le mesh de section, couches déjà séparées en sous-nœuds

Sans ces nœuds, la pièce est traitée comme fermée et ne s'ouvrira pas.
