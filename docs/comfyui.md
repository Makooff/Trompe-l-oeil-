# Produire les images des pièces avec ComfyUI

Guide pour une RTX 4070 Ti (12 Go). Il couvre l'installation, le workflow, les
prompts des huit pièces, le contrôle qualité et l'export vers le site.

Comptez une demi-journée pour la première pièce, puis vingt minutes par pièce
suivante. Le site accepte les images au fur et à mesure : une pièce livrée
remplace son image de garde, les autres attendent.

## 1. Ce que le site attend

Pour chaque pièce, deux fichiers PNG dans `rendus/<id>/` à la racine du
dépôt (dossier ignoré par git) :

| Fichier | Contenu | Format |
|---|---|---|
| `ferme.png` | La pièce fermée, détourée, fond transparent | 2048 px de haut, RGBA |
| `coupe.png` | La même pièce coupée en deux, moitié avant retirée, détourée | 2048 px de haut, RGBA |

Et pour le citron, qui porte le hero, une vidéo : `coupe.mp4`, la pièce qui
s'ouvre en deux, caméra fixe (section 9).

Ensuite `node scripts/pieces.mjs <id>` produit les AVIF et WebP dans
`public/pieces/<id>/`, et `node scripts/sequence.mjs citron` découpe la vidéo
en images pour le scroll. Le site lit ces fichiers, rien d'autre.

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

### 4.5 Agrandissement

`UpscaleModelLoader` avec `4x-UltraSharp`, `ImageUpscaleWithModel`, puis
`ImageScale` vers 2048 px de haut. Aucun second passage diffusif : SeedVR2 et
Ultimate SD Upscale inventent du détail, et une pâtisserie ne supporte pas
qu'on lui invente des pores.

## 5. Le bloc style

Le même préfixe pour les huit pièces, en anglais. Copiez-le tel quel, insérez la
description de la pièce à la place de `{description}`.

```
overhead food photograph, top-down, several trompe-l'oeil pastries shaped like
{description}, arranged loosely on a white crackle-glazed ceramic surface,
soft natural daylight from a window, gentle shadows, ultra realistic, velvet
and sugar textures, 50mm lens, sharp focus, no hands, no text, no props
```

C'est le style de la référence : vue de dessus, plusieurs pièces, une lumière
de fenêtre, de la céramique blanche craquelée. Pour la fiche et la lame, une
seconde image de la même scène avec une pièce coupée au premier plan :

```
same scene, same ceramic surface and daylight, one of the pastries cut in half
in the foreground showing its cross-section: {couches}, the others intact
```

Pour le détourage du hero (le citron qui s'ouvre) et de la lame, gardez aussi
une version d'une pièce seule sur fond blanc uni, générée avec le prompt
précédent et « single pastry, centered, pure white seamless background ».

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

Le hero charge `ferme-2048` sur desktop et `ferme-1024` sur mobile. La
collection charge `1024` partout, en `loading="lazy"`.

En attendant vos rendus, `node scripts/garde-citron.mjs` fabrique une image de
garde du citron. Vos fichiers dans `rendus/citron/` l'écrasent au prochain
export.

## 9. La vidéo de coupe du hero

Le hero ne découpe pas la photo en deux moitiés : il joue une vidéo générée
de la pièce qui s'ouvre, image par image, au rythme du scroll. Le site ne lit
jamais le fichier vidéo lui-même : chercher une position dans un MP4 saccade,
surtout sur Safari iOS. `scripts/sequence.mjs` en extrait une centaine
d'images WebP et le composant dessine celle qui correspond à la position.

### Générer la vidéo

Image-to-video, jamais text-to-video : la première image est votre rendu
fermé du citron, donc le hero reste cohérent avec la collection. Si le modèle
accepte aussi une dernière image, donnez-lui le rendu de la coupe ; la
cohérence de l'intérieur en dépend.

| Outil | Première image | Dernière image | Remarque |
|---|---|---|---|
| Kling 2.x | oui | oui | Le plus sûr pour la coupe, grâce à la dernière image |
| MiniMax Hailuo 02 | oui | selon la version | Bon rendu matière, vérifiez l'option de fin |
| Wan 2.2 (ComfyUI, local) | oui | avec le workflow FLF2V | Gratuit sur la 4070 Ti, plus lent |

Réglages : 5 à 6 secondes, 1080p, caméra fixe. Prompt :

```
Static camera, locked off, studio product shot, no camera movement.
A thin knife enters from the top and cuts the lemon-shaped pastry cleanly
in half. The two halves slide apart slowly, revealing the cross-section:
thin white chocolate shell, bright yellow lemon cream, pale almond sponge.
Lighting, plinth and background stay exactly the same. No hands, no text.
```

La caméra doit rester immobile. Un travelling, même léger, fait sauter le
scrub d'une image à l'autre. Refusez toute version où le socle bouge, où une
main apparaît, ou où l'intérieur ne correspond pas au rendu de la coupe.

### Découper la vidéo

```bash
# demande ffmpeg (ou son chemin dans FFMPEG=/chemin/vers/ffmpeg)
node scripts/sequence.mjs caillou --fps 20 --hauteur 720   # le citron du hero
node scripts/sequence.mjs caillou --fps 24                 # plus fin, plus lourd
```

Le script écrit `public/sequences/<id>/coupe-000.webp` et suivants, plus
`manifeste.json`. La vidéo MiniMax du citron (1472 × 832, 5 s) donne 103
images à 720 px pour 2,7 Mo ; le composant charge la première et la dernière
d'abord, puis les milieux, et dessine dès trois images. Le hero l'affiche
plein écran dès que le manifeste existe. En attendant votre vidéo, `node
scripts/garde-sequence.mjs` fabrique une séquence de garde depuis les images
de garde.

## 10. Depuis vos propres photos

Une photo réelle vaut mieux que n'importe quel prompt. Le pipeline par pièce :

1. **Détourage** de la photo avec BiRefNet, fond transparent. Si la photo est
   prise sous un angle bas, gardez-la ; si elle est prise de dessus, tout le
   reste suit aussi.
2. **Uniformiser la lumière** : Klein en mode édition, votre photo détourée
   en référence, prompt `this exact pastry, unchanged shape, colour and
   surface, placed on a white crackle-glazed ceramic surface, soft natural
   daylight from a window, gentle shadow`. Une passe par pièce, même seed
   pour toutes, et les huit pièces se ressemblent enfin comme une série.
3. **La coupe** : même montage, l'image de l'étape 2 en référence, le prompt
   de coupe de la section 6 avec vos vraies couches.
4. **Export** avec `scripts/pieces.mjs`.

Si vous avez une photo de la pièce déjà coupée, servez-vous-en comme
référence à l'étape 3 au lieu d'un prompt : `the same pastry, cut exactly like
this reference`.

## 11. Un modèle 3D depuis une photo

Pour la boutique en vrai relief, rotation libre et aperçu en réalité
augmentée sur iPhone.

| Outil | Où | Sur la 4070 Ti | Résultat |
|---|---|---|---|
| Hunyuan3D 2.1 | ComfyUI, nœuds `ComfyUI-Hunyuan3DWrapper` | oui, forme en 1 à 2 min, texture en 3 à 5 min | `.glb` texturé PBR, le meilleur rapport qualité/effort |
| TRELLIS | ComfyUI, nœuds `ComfyUI-IF_Trellis` | oui, plus lent | `.glb`, formes très propres, textures parfois plates |
| Tripo, Meshy | en ligne | rien à installer | rapide, payant après quelques essais |

Entrée : la photo détourée de l'étape 10.1, une seule pièce, bien centrée,
fond transparent. Une vue de trois-quarts donne une meilleure forme qu'une
vue de face. Sortie : `rendus/<id>/piece.glb`, à déposer dans
`public/modeles/<id>.glb` ; le site l'affiche avec `<model-viewer>`.

Limites à connaître : les glaçages miroir ressortent cireux, le velours perd
son grain, et la coupe n'existe pas dans le modèle. Le modèle sert à tourner
autour de la pièce ; la coupe reste la vidéo.

## 12. La vidéo depuis vos photos

Même chose que la section 9, avec la photo détourée et relightée de l'étape
10.2 comme première image. Deux vidéos par pièce vedette :

- **La coupe** (section 9), pour le hero.
- **L'orbite**, pour faire tourner la pièce sur sa fiche :

```
Static product on a white ceramic surface, camera orbits 360 degrees around
the pastry at constant height, slow and steady, seamless loop back to the
starting frame, lighting unchanged, no hands, no text
```

6 s, 1080p, puis `node scripts/sequence.mjs <id> --nom orbite`.

## 13. La coupe en haute qualité, en local, sur fond crème

Le détail d'une vidéo image-vers-vidéo vient à 80 % de sa première image.
Investir d'abord dans deux images fixes très nettes, puis dans la vidéo,
puis dans l'agrandissement. Le fond crème `#f4f0e7` vient du prompt, jamais
d'un détourage : l'éclairage reste cohérent et le hero se fond dans le site.

### 13.1 Deux images fixes 2K

Pièce fermée, FLUX.2 Klein ou FLUX.1 dev fp8, 1344 × 768, seed fixé, huit
variantes, garder la plus nette.

```
ultra detailed studio product photograph of a trompe-l'oeil lemon pastry,
hyper realistic lemon-shaped entremets with a pale yellow velvet cocoa
butter coating, fine dimpled peel texture, small green stem nub, standing
on a low round matte white ceramic plinth, seamless pale cream background,
soft diffused studio light from the top left, gentle soft shadow under the
pastry, 85mm macro lens, f/8, razor sharp focus, centered, one third
headroom, no text, no props
```

Négatif :

```
blurry, soft focus, plastic, cartoon, illustration, oversaturated,
watermark, text, hands, extra objects, black background, dark background,
vignette
```

Pièce coupée, Klein en mode édition, image fermée en référence, même seed :

```
cut this lemon pastry cleanly in half vertically and slide the two halves
a few centimeters apart, both cross-sections facing the camera: thin white
chocolate shell, smooth pale yellow lemon cream, light almond sponge base
with a thin golden crust, keep exactly the same plinth, cream background,
lighting, camera angle and scale
```

Netteté : `UpscaleModelLoader` 4x-UltraSharp sur les deux images, puis
`ImageScale` lanczos vers 2688 × 1536. Si le fond sort gris ou jaune, un
nœud Color Match vers un aplat `#f4f0e7`.

### 13.2 La vidéo, MiniMax H3

| Champ | Valeur |
|---|---|
| first_frame | image fermée, 1344 × 768 |
| last_frame | image coupée, 1344 × 768 |
| width × height | 1344 × 768, la résolution officielle (0,98 MP) |
| duration | 5.0 |
| turbo_mode | false |
| turbo_model_strength | 0, ou LoRA débranché |
| steps | 30 |
| noise_seed | fixé, noté dans `content/creations.ts` |

```
static locked camera, no camera movement, a sharp chef's knife enters from
above and slices the lemon-shaped pastry cleanly in half from top to bottom,
then the two halves slowly slide apart sideways revealing pale yellow lemon
cream and almond sponge inside, seamless cream background, soft studio
light, ultra detailed, photorealistic, smooth natural motion, no hands
```

Négatif :

```
camera pan, zoom, shaky, blurry, morphing, flicker, warping, extra knives,
hands, text, dark background, color shift
```

Quatre à six seeds, garder celle où le fond ne bouge pas et où la coupe
tombe au milieu. Cinq à dix minutes par essai sans turbo sur une 4070 Ti.

### 13.3 Agrandir et fluidifier

1. SeedVR2 ×2 : Menu → Templates → « SeedVR2 », le graphe complet est
   fourni. Sortie 2688 × 1536, tient en 12 Go avec le tiling. Repli :
   « Video Upscale (GAN x4) » RealESRGAN puis réduction à 2688.
2. RIFE ×2, nœud RIFE VFI de `ComfyUI-Frame-Interpolation` : 24 → 48 i/s.
3. Enregistrer en h264, `crf 14`, 48 i/s, sans audio.

Puis, dans le dépôt :

```bash
FFMPEG=/chemin/vers/ffmpeg node scripts/sequence.mjs caillou --fps 30 --hauteur 1080
```

### 13.4 Si MiniMax H3 déçoit

Wan 2.2 I2V 14B en GGUF Q4 ou Q5 avec le nœud `WanFirstLastFrameToVideo`
(template Comfy « first-last frame »). Sur 12 Go : 720p, 81 images,
encodeur texte sur CPU, 20 à 30 étapes sans LoRA lightx2v. Quinze à
vingt-cinq minutes par essai, textures et mouvement plus fins. Mêmes
prompts, mêmes images fermée et coupée.
