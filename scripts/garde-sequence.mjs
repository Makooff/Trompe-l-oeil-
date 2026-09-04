/**
 * Séquence de garde du citron : 72 images fabriquées depuis les images de
 * garde, les deux moitiés qui s'écartent et la coupe qui apparaît entre.
 * Sert à tester le scrub avant la vraie vidéo. `node scripts/sequence.mjs
 * citron` l'écrase dès que rendus/citron/coupe.mp4 existe.
 */
import { mkdir, writeFile, rm } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";

const IMAGES = 72;
const ECART = 0.2; // fraction de la largeur, écart maximal de chaque moitié
const cible = "public/sequences/citron";

const ferme = await sharp("rendus/citron/ferme.png").png().toBuffer();
const coupe = await sharp("rendus/citron/coupe.png").png().toBuffer();
const { width: L, height: H } = await sharp(ferme).metadata();

const doux = (t) => t * t * (3 - 2 * t);
// sharp refuse un calque qui déborde : on recadre chaque moitié de ce qui
// sort du cadre au lieu de la décaler hors champ.
const moitie = (cote, d) =>
  sharp(ferme)
    .extract({ left: cote === "g" ? d : L / 2, top: 0, width: L / 2 - d, height: H })
    .png()
    .toBuffer();

await rm(cible, { recursive: true, force: true });
await mkdir(cible, { recursive: true });

for (let i = 0; i < IMAGES; i++) {
  const t = doux(i / (IMAGES - 1));
  const d = Math.round(t * ECART * L);
  const alpha = Math.min(1, Math.max(0, (t - 0.08) / 0.3));
  const coupeVisible = await sharp(coupe)
    .ensureAlpha()
    .composite([{ input: Buffer.from([0, 0, 0, Math.round(alpha * 255)]), raw: { width: 1, height: 1, channels: 4 }, tile: true, blend: "dest-in" }])
    .png()
    .toBuffer();
  const calques = [{ input: coupeVisible, left: 0, top: 0 }];
  if (L / 2 - d > 0) {
    calques.push({ input: await moitie("g", d), left: 0, top: 0 });
    calques.push({ input: await moitie("d", d), left: L / 2 + d, top: 0 });
  }
  // Deux passes : sharp redimensionne avant de composer, quel que soit
  // l'ordre d'écriture, et refuserait des calques plus grands que le fond.
  const composee = await sharp({ create: { width: L, height: H, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite(calques)
    .png()
    .toBuffer();
  const image = await sharp(composee).resize({ height: 1080 }).webp({ quality: 80 }).toBuffer();
  await writeFile(join(cible, `coupe-${String(i).padStart(3, "0")}.webp`), image);
}

const meta = await sharp(join(cible, "coupe-000.webp")).metadata();
await writeFile(
  join(cible, "manifeste.json"),
  JSON.stringify({ images: IMAGES, largeur: meta.width, hauteur: meta.height, fps: 20, motif: "coupe-%03d.webp" }, null, 2),
);
console.log(`garde : ${IMAGES} images, ${meta.width} × ${meta.height}`);
