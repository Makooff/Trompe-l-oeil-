# Maison Leurre

Site d'une pâtisserie trompe-l'œil à Mons. Des fruits et des objets qui n'en
sont pas : coupez-les, dedans c'est un dessert.

Blanc, une seule sans-serif, des photos de produits sur fond clair, une
navigation classique et une commande en click & collect. Sur l'accueil, le
citron s'ouvre en deux quand on descend ; sur chaque fiche, une lame coupe la
pièce sous le doigt.

Le client n'a pas encore de photos : `docs/comfyui.md` explique comment les
produire sur une RTX 4070 Ti, et le site les accepte au fur et à mesure.

## Stack

Next.js 16 (App Router, TypeScript), Tailwind CSS v4, Hanken Grotesk via
`next/font`. Aucun WebGL, aucune bibliothèque d'animation.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
```

## Pages

| Route | Contenu |
|---|---|
| `/` | Le citron qui s'ouvre au scroll, les deux collections, la grille des huit pièces, la lame sur la cerise, la boutique. |
| `/patisseries` | La grille, filtrable par collection (`?collection=fruit` ou `objet`). |
| `/patisseries/[id]` | La fiche : lame, prix, composition, allergènes, ajout au panier. |
| `/panier` | Le panier et le formulaire de retrait en boutique. |
| `/la-maison` | L'atelier, l'adresse, les horaires. |

## Structure

| Chemin | Rôle |
|---|---|
| `app/styles/tokens.css` | Le design system entier : couleurs, échelle typographique, rythme. |
| `content/` | La maison et les huit créations. Tout le texte du site vit là. |
| `components/` | Barre, pied de page, grille, carte produit, panier, lame, séquence. |
| `lib/panier.ts` | Le panier, un store de module persisté dans localStorage. |
| `app/api/commande/` | Reçoit commandes et inscriptions, les transmet à `COMMANDE_WEBHOOK_URL`. |
| `public/pieces/<id>/` | Photo fermée et coupe de chaque pièce, en trois tailles. |
| `public/sequences/citron/` | La vidéo de coupe découpée en images pour le scroll. |
| `scripts/` | Export des rendus, découpe de la vidéo, images de garde. |
| `docs/comfyui.md` | Guide de production des images et de la vidéo, prompts. |

## La coupe au scroll

`SequenceCoupe` dessine sur un canvas 2D l'image de la séquence qui correspond
au défilement. Pas de `<video>` : chercher une position dans un fichier
compressé saccade, surtout sur Safari iOS. Les images se chargent par ordre
d'importance, la première et la dernière d'abord.

## Les commandes

Le panier vit dans le navigateur. À la validation, `/api/commande` reçoit la
commande et la transmet en JSON au webhook défini dans `COMMANDE_WEBHOOK_URL`
(Make, Zapier, n8n, Formspree, ou un service d'e-mail). Sans webhook, la
commande est journalisée côté serveur et le site reste utilisable en
démonstration. Le paiement se fait en boutique au retrait.

## Variables d'environnement

| Variable | Rôle |
|---|---|
| `NEXT_PUBLIC_ORIGINE` | L'URL publique, pour le sitemap, robots et les métadonnées. |
| `COMMANDE_WEBHOOK_URL` | Où envoyer les commandes et les inscriptions. |

## Images de garde

`node scripts/garde-pieces.mjs` puis `node scripts/pieces.mjs` fabriquent une
forme simple par pièce ; `node scripts/garde-sequence.mjs` fabrique la
séquence du citron. Vos rendus dans `rendus/` les écrasent.
