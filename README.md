# Maison Leurre

Site vitrine d'une maison de pâtisserie trompe-l'œil fictive. Huit pièces
copient des objets qu'on ne mange pas, un citron, un caillou ou un savon, et
montrent leur coupe quand on les ouvre.

Le site applique le même procédé à lui-même. Il s'ouvre plat comme une affiche
en plein jour, se creuse en profondeur, puis bascule dans la nuit d'atelier.

## Stack

Next.js 16 (App Router, TypeScript), Tailwind CSS v4, React Three Fiber avec
drei, Lenis.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
```

## Structure

| Chemin | Rôle |
|---|---|
| `app/styles/tokens.css` | Le design system entier. Aucune valeur visuelle ailleurs. |
| `content/` | La maison, les huit créations, les sept actes. |
| `components/ui/` | Composants 2D. |
| `components/scene/` | La scène 3D, sur un canvas unique et persistant. |
| `lib/scroll/` | Bornes des actes et progression, partagées par le 2D et la 3D. |
| `public/models/` | Slot GLTF pour remplacer les géométries procédurales. |

## La bascule jour vers nuit

Le scroll écrit une seule variable, `--jour`, qui descend de 1 à 0 sur
`<html>`. Les couleurs en dérivent par `color-mix` et les intensités de lumière
3D s'interpolent sur la même valeur. Vous réglez un curseur au lieu de
maintenir deux thèmes.

## Les actes

`content/actes.ts` déclare les sept actes et leurs bornes de scroll. Le 2D et la
scène 3D lisent les mêmes bornes, donc déplacer une plage les déplace des deux
côtés.

## La progression du scroll

`lib/scroll/scrollStore.ts` garde la progression dans un objet mutable de
module. La scène la lit dans `useFrame` soixante fois par seconde, et un
setState par frame rerendrait tout l'arbre React.

## Accessibilité

Le canvas porte `aria-hidden`. La carte, les cartels et l'adresse existent en
HTML rendu côté serveur : sans JavaScript ni WebGL, vous gardez le contenu.
`prefers-reduced-motion` coupe le scroll lissé et le rail caméra sans retirer
une ligne de texte.
