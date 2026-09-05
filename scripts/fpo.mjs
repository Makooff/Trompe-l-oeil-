/**
 * Images provisoires depuis les planches déposées dans rendus/<id>/photo.jpg,
 * en attendant les vraies photos du client, une fermée et une coupée par
 * pièce. Ici une seule photo par pièce, vue de dessus, plusieurs pièces dont
 * une coupée :
 *
 * - `ferme` : la photo entière, en trois tailles.
 * - `coupe` : la même photo, recadrée d'un cinquième vers le centre, ce qui
 *   donne un léger zoom au survol de la carte.

 * Pas de séquence de coupe ici : le hero ne l'affiche que quand une vraie
 * vidéo est passée par scripts/sequence.mjs.
 *
 * `node scripts/pieces.mjs` et `node scripts/sequence.mjs` reprennent la
 * main dès que de vraies images fermée / coupe / vidéo existent.
 */
import { mkdir, stat } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";

const IDS = ["citron", "noisette", "cerise", "poire", "caillou", "savon", "oeuf", "marbre"];
const HAUTEURS = [512, 1024, 2048];

async function existe(p) {
  try {
    await stat(p);
    return true;
  } catch {
    return false;
  }
}

async function exporter(buffer, dossier, nom) {
  for (const h of HAUTEURS) {
    const base = sharp(buffer).resize({ height: h, kernel: "lanczos3" });
    await base.clone().avif({ quality: 62, effort: 6 }).toFile(join(dossier, `${nom}-${h}.avif`));
    await base.clone().webp({ quality: 84, effort: 5 }).toFile(join(dossier, `${nom}-${h}.webp`));
  }
}

for (const id of IDS) {
  const source = join("rendus", id, "photo.jpg");
  if (!(await existe(source))) continue;
  const dossier = join("public", "pieces", id);
  await mkdir(dossier, { recursive: true });

  const meta = await sharp(source).metadata();
  const W = meta.width;
  const H = meta.height;

  const ferme = await sharp(source).rotate().png().toBuffer();
  const marge = 0.1;
  const coupe = await sharp(source)
    .rotate()
    .extract({
      left: Math.round(W * marge),
      top: Math.round(H * marge),
      width: Math.round(W * (1 - 2 * marge)),
      height: Math.round(H * (1 - 2 * marge)),
    })
    .png()
    .toBuffer();

  await exporter(ferme, dossier, "ferme");
  await exporter(coupe, dossier, "coupe");
  console.log(`${id} : ferme, coupe (zoom)`);
}
