# Maison Leurre

Site vitrine d'une maison de pâtisserie trompe-l'œil fictive. Huit pièces qui
imitent des objets banals — un citron, un caillou, un savon — et se révèlent
desserts quand on les ouvre.

Le trompe-l'œil n'est pas un thème décoratif : c'est le mécanisme du site. La
page ment sur sa propre nature — plate puis profonde, image puis volume, jour
puis nuit.

## Stack

Next.js 16 (App Router, TypeScript) · Tailwind CSS v4 · React Three Fiber +
drei · GSAP ScrollTrigger · Lenis · zustand.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
```

## Structure

| Chemin | Rôle |
|---|---|
| `app/styles/tokens.css` | Le design system entier. Aucune valeur visuelle ailleurs. |
| `content/` | Contenu éditorial : la maison, les 8 créations, les 7 actes. |
| `components/ui/` | Composants 2D. |
| `components/scene/` | Scène 3D — un seul canvas persistant. |
| `lib/scroll/` | Bornes des actes et progression, source de vérité partagée 2D/3D. |
| `public/models/` | Slot GLTF pour remplacer les géométries procédurales. |

## La bascule jour → nuit

Une seule variable, `--jour` (1 → 0), écrite au scroll sur `<html>`. Toutes les
couleurs en dérivent par `color-mix`, et les intensités de lumière 3D sont
interpolées sur la même valeur. Un curseur, jamais deux thèmes.

## Les actes

`content/actes.ts` déclare les sept actes et leurs bornes de scroll. Le 2D et la
scène 3D lisent les mêmes bornes — modifier une plage les déplace des deux côtés.

## Accessibilité

Le canvas est décoratif (`aria-hidden`). La carte, les cartels et l'adresse
existent en HTML rendu côté serveur : sans JavaScript et sans WebGL, tout le
contenu reste lisible. `prefers-reduced-motion` désactive le scroll piloté sans
retirer une seule ligne de contenu.
