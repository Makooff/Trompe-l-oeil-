#!/usr/bin/env node
/**
 * Transforme la vidéo de coupe d'une pièce en séquence d'images pour le
 * scroll. Le site ne lit jamais la vidéo : piloter `currentTime` au scroll
 * saccade, surtout sur Safari iOS. Il dessine une image par position.
 *
 * Entrée : rendus/<id>/coupe.mp4 (caméra fixe, 5 à 6 s, 1080p)
 * Sortie : public/sequences/<id>/coupe-000.webp … et manifeste.json
 *
 *   node scripts/sequence.mjs citron
 *   node scripts/sequence.mjs citron --fps 20 --hauteur 1080
 *   node scripts/sequence.mjs citron --nom orbite      # lit rendus/citron/orbite.mp4
 *
 * Demande ffmpeg sur la machine. Une centaine d'images WebP à 1080 px pèse
 * autour de 4 Mo ; le composant les charge par ordre d'importance, la
 * première et la dernière d'abord, puis les milieux.
 */
import { execFileSync } from "node:child_process";
import { mkdir, readdir, stat, writeFile, rm } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";

const [id, ...options] = process.argv.slice(2);
if (!id) {
  console.error("usage : node scripts/sequence.mjs <id> [--fps 20] [--hauteur 1080]");
  process.exit(1);
}
const lire = (nom, defaut) => {
  const i = options.indexOf(`--${nom}`);
  return i >= 0 ? Number(options[i + 1]) : defaut;
};
const fps = lire("fps", 20);
const hauteur = lire("hauteur", 1080);
const iNom = options.indexOf("--nom");
const nom = iNom >= 0 ? options[iNom + 1] : "coupe";

const source = join("rendus", id, `${nom}.mp4`);
const cible = join("public", "sequences", id, nom === "coupe" ? "" : nom);

try {
  await stat(source);
} catch {
  console.error(`introuvable : ${source}`);
  process.exit(1);
}

await rm(cible, { recursive: true, force: true });
await mkdir(cible, { recursive: true });

// PNG intermédiaires : ffmpeg encode le WebP moins bien que sharp.
const tampon = join(cible, "tmp");
await mkdir(tampon);
execFileSync("ffmpeg", [
  "-loglevel", "error",
  "-i", source,
  "-vf", `fps=${fps},scale=-2:${hauteur}`,
  join(tampon, "%03d.png"),
]);

const pngs = (await readdir(tampon)).filter((f) => f.endsWith(".png")).sort();
let largeur = 0;
let haut = 0;
for (const [i, fichier] of pngs.entries()) {
  const meta = await sharp(join(tampon, fichier)).metadata();
  largeur = meta.width ?? largeur;
  haut = meta.height ?? haut;
  await sharp(join(tampon, fichier))
    .webp({ quality: 80, effort: 5 })
    .toFile(join(cible, `${nom}-${String(i).padStart(3, "0")}.webp`));
}
await rm(tampon, { recursive: true, force: true });

await writeFile(
  join(cible, "manifeste.json"),
  JSON.stringify({ images: pngs.length, largeur, hauteur: haut, fps, motif: `${nom}-%03d.webp` }, null, 2),
);
console.log(`${id} : ${pngs.length} images, ${largeur} × ${haut}, ${fps} i/s`);
