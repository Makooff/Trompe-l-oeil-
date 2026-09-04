# Produire les images des pièces avec ComfyUI

Guide pour une RTX 4070 Ti (12 Go). Il couvre l'installation, le workflow, les
prompts des huit pièces, le contrôle qualité et l'export vers le site.

Comptez une demi-journée pour la première pièce, puis vingt minutes par pièce
suivante. Le site accepte les images au fur et à mesure : une pièce livrée
remplace son image de garde, les autres attendent.

## 1. Ce que le site attend

Pour chaque pièce, quatre fichiers PNG dans `rendus/<id>/` à la racine du
dépôt (dossier ignoré par git) :

| Fichier | Contenu | Format |
|---|---|---|
| `ferme.png` | La pièce fermée, détourée, fond transparent | 2048 px de haut, RGBA |
| `coupe.png` | La même pièce coupée en deux, moitié avant retirée, détourée | 2048 px de haut, RGBA |
| `profondeur-ferme.png` | Carte de profondeur de `ferme.png` | niveaux de gris, 16 bits |
| `profondeur-coupe.png` | Carte de profondeur de `coupe.png` | niveaux de gris, 16 bits |

Optionnel : `trois-quarts.png`, la pièce fermée tournée de 30°, pour la
collection.

Ensuite `node scripts/pieces.mjs <id>` produit les AVIF, WebP et cartes réduites
dans `public/pieces/<id>/`. Le site lit ces fichiers, rien d'autre.

Les identifiants : `citron`, `noisette`, `cerise`, `poire`, `caillou`, `savon`,
`oeuf`, `marbre`.

## 2. Installation

1. ComfyUI portable pour Windows, ou le dépôt GitHub sous Linux, avec Python
   3.12 et CUDA 12.x. Vérifiez au premier lancement que la console affiche
   votre 4070 Ti et « 12 GB ».
2. ComfyUI Manager, depuis le menu Manager ou en clonant
   `ltdrdata/ComfyUI-Manager` dans `custom_nodes/`.
3. Via le Manager, installez ces quatre packs de nœuds :
   - `ComfyUI-GGUF` (city96), pour charger les modèles quantifiés.
   - `ComfyUI-BiRefNet` (détourage).
   - `ComfyUI-DepthAnythingV3` (PozzettiAndrea), cartes de profondeur.
   - `ComfyUI-Impact-Pack`, pour le nœud d'agrandissement par tuiles.
4. Redémarrez ComfyUI.

## 3. Modèles

Le choix principal est FLUX.2 Klein. Un seul modèle génère la pièce fermée et
l'ouvre ensuite, en gardant le cadrage. Sur 12 Go, prenez la variante 4B en
GGUF Q8 : elle tient avec plusieurs gigaoctets de marge et sort une image de
1024 × 1280 en quelques secondes. La 9B en GGUF Q5 passe aussi si vous laissez
ComfyUI décharger l'encodeur texte sur le CPU ; testez-la en second, sur la
pièce Citron, et gardez-la si le glaçage gagne en finesse.

Où télécharger : la page HuggingFace de Black Forest Labs pour les poids
officiels, et les dépôts communautaires « FLUX.2-klein GGUF » pour les
quantifications. Les noms de fichiers changent d'une publication à l'autre, donc
vérifiez-les sur la page du dépôt avant de copier. Rangez-les ainsi :

| Fichier | Dossier |
|---|---|
| le modèle Klein (`.gguf` ou `.safetensors` fp8) | `models/unet/` |
| l'encodeur texte de Klein (Qwen3, fp8 ou GGUF) | `models/text_encoders/` |
| le VAE FLUX.2 | `models/vae/` |
| `BiRefNet-general` | téléchargé par le nœud au premier usage |
| `DA3-Large` (Depth Anything V3) | téléchargé par le nœud au premier usage |
| `4x-UltraSharp.pth` | `models/upscale_models/` |

Repli si Klein manque de fidélité sur les surfaces brillantes : FLUX.1 dev en
fp8 avec T5 en fp8, `FluxGuidance` à 3.5, 20 étapes. Plus lent, mais vous
retrouvez un contrôle fin de l'adhérence au prompt. Pour la coupe, restez alors
sur Klein en mode édition ou passez à Qwen-Image-Edit-2511 en GGUF Q4.

## 4. Le workflow

Partez du modèle officiel : dans ComfyUI, menu Workflow, Browse Templates,
puis le template FLUX.2 Klein. Il contient le graphe correct pour la version
que vous avez installée, ce qu'aucun JSON copié ne garantit. Modifiez-le comme
suit.

### 4.1 Pièce fermée

Graphe : chargeur de modèle (`UnetLoaderGGUF` ou `UNETLoader`), chargeur
d'encodeur texte, chargeur VAE, `CLIPTextEncode` pour le prompt positif,
`EmptyLatentImage` en 1024 × 1280, `KSampler`, `VAEDecode`, `SaveImage`.

Réglages :

| Paramètre | Valeur |
|---|---|
| Résolution | 1024 × 1280 (portrait, un tiers de marge au-dessus) |
| Étapes | 4 pour Klein (distillé), 20 pour FLUX.1 dev |
| CFG | 1.0 pour Klein, `FluxGuidance` 3.5 pour dev |
| Sampler / scheduler | `euler` / `simple` |
| Seed | celui de la pièce dans `content/creations.ts`, `fixed` |
| Batch | 8 |

Sortez huit variantes, choisissez la meilleure, notez son index. Si aucune ne
convient, changez le seed par pas de 1 et notez le nouveau seed dans
`content/creations.ts`.

### 4.2 Coupe

Même graphe, avec deux ajouts : `LoadImage` sur la pièce fermée retenue, encodée
par `VAEEncode`, puis un nœud `ReferenceLatent` entre le conditionnement et le
sampler. Le template Klein « edit » l'a déjà câblé. Le prompt devient le prompt
de coupe de la pièce, seed identique à la fermée, batch 8.

Le modèle garde le socle, la lumière et l'angle parce que le prompt le lui
demande en toutes lettres. Ne raccourcissez pas cette partie du prompt.

### 4.3 Trois-quarts (optionnel)

Même montage que la coupe, prompt : `the same pastry rotated 30 degrees to the
right, same plinth, same lighting, same scale, same framing`.

### 4.4 Détourage

`LoadImage` sur la sortie retenue, nœud BiRefNet (`general`), sortie masque
vers `JoinImageWithAlpha`, puis `SaveImage` en PNG. Vérifiez le bord du glaçage
à 200 % : un halo clair d'un pixel se corrige avec un `GrowMask` de -1 avant
la jonction.

### 4.5 Profondeur

`LoadImage` sur l'image détourée, nœud Depth Anything V3 avec le modèle
`DA3-Large`, normalisation `V2-Style`, sortie vers `SaveImage`. Enregistrez en
16 bits si le nœud le propose. Le script d'export ajoute ensuite un flou de
1,2 px : sans lui le relief 2,5D déchire sur les bords.

### 4.6 Agrandissement

`UpscaleModelLoader` avec `4x-UltraSharp`, `ImageUpscaleWithModel`, puis
`ImageScale` vers 2048 px de haut. Aucun second passage diffusif : SeedVR2 et
Ultimate SD Upscale inventent du détail, et une pâtisserie ne supporte pas
qu'on lui invente des pores.

## 5. Le bloc style

Le même préfixe pour les huit pièces, en anglais. Copiez-le tel quel, insérez la
description de la pièce à la place de `{description}`.

```
studio product photograph of a trompe-l'oeil pastry, {description},
ultra realistic, resting on a matte warm-grey plaster plinth,
near-black warm background, warm key light from top-left at 45 degrees,
faint cool fill from the left, no rim light, 85mm lens, f/8, sharp focus,
fine film grain, centered, one third headroom, no text, no props
```

Klein ignore le prompt négatif. Pour FLUX.1 dev, utilisez :

```
cartoon, illustration, 3d render, plastic, oversaturated, watermark, text,
blurry, extra objects, hands, tablecloth
```

Cette lumière est celle de `components/scene/Lighting.tsx`. Les images et la
scène 3D partagent la même clé chaude en haut à gauche, donc une pièce passe
de la photo au relief sans rupture.

## 6. Les prompts par pièce

### Citron, seed 190001

Fermée, `{description}` :

```
a Menton lemon, velvet-textured matte yellow shell with visible pores,
slight dimple where the stem was, no leaf
```

Coupe :

```
cut this lemon-shaped pastry cleanly in half with a knife and remove the
front half, show the cross-section facing the camera: a thin white chocolate
shell, a bright yellow lemon cream layer, a pale almond sponge core, keep the
same plinth, lighting, camera angle and scale
```

### Noisette, seed 190002

```
a single hazelnut in its shell, milk-chocolate brown velvet texture, a tiny
flake of gold leaf resting on top
```

```
cut this hazelnut-shaped pastry cleanly in half and remove the front half,
show the cross-section facing the camera: a thin milk chocolate shell, smooth
hazelnut praline, a crisp feuilletine centre, keep the same plinth, lighting,
camera angle and scale
```

### Cerise, seed 190003

```
a dark red cherry with a glossy mirror glaze and a slender pulled-sugar stem
curving upward, one small highlight
```

```
cut this cherry-shaped pastry cleanly in half and remove the front half, keep
the stem, show the cross-section facing the camera: a glossy red glaze, pale
vanilla mousse, a dark griotte confit centre, keep the same plinth, lighting,
camera angle and scale
```

### Poire, seed 190004

```
a small green pear, velvet-textured matte green shell, a faint pink blush on
one side, short dark stem
```

```
cut this pear-shaped pastry cleanly in half and remove the front half, show the
cross-section facing the camera: a thin green velvet shell, pale pear compote,
a ladyfinger sponge core, keep the same plinth, lighting, camera angle and scale
```

### Caillou, seed 190005

```
a smooth grey river pebble, matte surface, one damp highlight, subtle mineral
speckle
```

```
cut this pebble-shaped pastry cleanly in half and remove the front half, show
the cross-section facing the camera: a thin grey craquelin shell, airy golden
choux, a hazelnut praline centre, keep the same plinth, lighting, camera angle
and scale
```

### Savon, seed 190006

```
a rectangular bar of Marseille soap, pale olive green, worn rounded edges, a
half-erased embossed stamp on top
```

```
cut this soap-shaped pastry cleanly in half and remove the front half, show
the cross-section facing the camera: an opaque pale green glaze, a smooth olive
and verbena mousse, a thin sponge base, keep the same plinth, lighting, camera
angle and scale
```

### Œuf, seed 190007

```
a raw hen's egg standing in a small plaster cup, pale speckled shell, a fine
crack on top
```

```
cut this egg-shaped pastry cleanly in half and remove the front half, show the
cross-section facing the camera: a thin white chocolate shell, mango mousse,
a runny bright yellow passion fruit centre, keep the same plinth, lighting,
camera angle and scale
```

### Marbre, seed 190008

```
an off-cut of white Carrara marble with grey veins, one clean broken edge,
polished top face
```

```
cut this marble-shaped pastry cleanly in half and remove the front half, show
the cross-section facing the camera: a thin milk chocolate shell, layered
praline, thin dark vanilla seed veins running through, keep the same plinth,
lighting, camera angle and scale
```

## 7. Contrôle qualité

Refusez une image dès qu'un point de la liste tombe :

- Le fond montre un dégradé ou une vignette visible.
- Un reflet ou une ombre coupe le socle.
- La coupe a changé de socle, d'angle ou d'échelle par rapport à la fermée.
- Une couche de la coupe est floue ou fondue dans la voisine.
- Un texte, un logo ou un accessoire apparaît.
- Le détourage laisse un halo d'un pixel ou plus.

Comparez toujours la fermée et la coupe côte à côte à la même taille. Si la
coupe est bonne mais que le socle diffère, regénérez la coupe seule avec le même
seed et la mention « exact same plinth » ajoutée au prompt.

## 8. Export

```bash
node scripts/pieces.mjs citron    # une pièce
node scripts/pieces.mjs           # toutes celles présentes dans rendus/
```

Le script écrit dans `public/pieces/<id>/` :

- `ferme-512.avif`, `ferme-1024.avif`, `ferme-2048.avif`, et les WebP
- `coupe-*.avif` et `coupe-*.webp`
- `profondeur-ferme.png`, `profondeur-coupe.png` en 1024, 8 bits, flou 1,2

Le hero charge `ferme-2048` sur desktop et `ferme-1024` sur mobile. La
collection charge `1024` partout, en `loading="lazy"`.

En attendant vos rendus, `node scripts/garde-citron.mjs` fabrique une image de
garde du citron. Vos fichiers dans `rendus/citron/` l'écrasent au prochain
export.
