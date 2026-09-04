# Slot GLTF

Par défaut, le code génère chaque pièce (`lib/three/geometry/`). Le dépôt ne
versionne aucun fichier lourd et le site tourne sans asset.

Pour brancher un modèle sculpté ou scanné, déposez le `.glb` ici et renseignez
`modelUrl` dans `content/creations.ts` :

```ts
{ id: "citron", /* … */ modelUrl: "/models/citron.glb" }
```

Rien d'autre à changer : `CreationMesh` charge le `.glb` quand `modelUrl`
existe et retombe sur la fabrique procédurale sinon.

## Contrat du modèle

| Point | Attendu |
|---|---|
| Format | `.glb` binaire, glTF 2.0, Draco accepté |
| Échelle | 1 unité = 1 cm. Une pièce mesure 6 à 9 unités de haut |
| Origine | Au centre de la base, posée sur le plan `y = 0` |
| Orientation | `+Y` vers le haut, face présentée vers `+Z` |
| Matériaux | Ignorés, le site applique les siens |
| Poids | Moins de 1,5 Mo par pièce après Draco |

## Pièces ouvrables

Les pièces de l'acte « Le Mensonge » s'ouvrent en deux et montrent leur coupe.
Le modèle doit alors contenir trois nœuds nommés :

- `coque_a`, la demi-coque gauche
- `coque_b`, la demi-coque droite
- `coupe`, le mesh de section, couches séparées en sous-nœuds

Sans ces nœuds, le site traite la pièce comme fermée et ne l'ouvrira pas.
