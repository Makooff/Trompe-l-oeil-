/**
 * Génère le favicon SVG et les PNG de la marque à partir des chemins de
 * content/marque.ts. À relancer si le signe change.
 */
import { readFile, writeFile, mkdir } from "node:fs/promises";
import sharp from "sharp";

// Lecture du fichier TypeScript sans le compiler : on extrait les chaînes.
const source = await readFile("content/marque.ts", "utf8");
const chemins = [...source.matchAll(/^\s+"([^"]+)",?$/gm)].map((m) => m[1]);
if (chemins.length < 4) throw new Error("chemins du signe introuvables");

const trace = chemins.map((d) => `<path d="${d}"/>`).join("\n    ");

const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" fill="#0b0a09"/>
  <g fill="none" stroke="#f2ede4" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" transform="translate(8 8) scale(0.75)">
    ${trace}
  </g>
</svg>
`;

const signe = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round">
  <title>Maison Leurre</title>
  ${trace}
</svg>
`;

await mkdir("public/marque", { recursive: true });
await writeFile("app/icon.svg", favicon);
await writeFile("public/marque/signe.svg", signe);

for (const taille of [192, 512]) {
  await sharp(Buffer.from(favicon)).resize(taille, taille).png().toFile(`public/marque/signe-${taille}.png`);
}
// Apple arrondit lui-même les coins : on livre un carré plein.
await sharp(Buffer.from(favicon)).resize(180, 180).png().toFile("app/apple-icon.png");
console.log("marque : icon.svg, signe.svg, 192, 512, apple 180");
