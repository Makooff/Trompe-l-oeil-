/**
 * Images provisoires depuis les planches déposées dans rendus/<id>/photo.jpg,
 * en attendant les vraies photos du client, une fermée et une coupée par
 * pièce. Ici une seule photo par pièce, vue de dessus, plusieurs pièces dont
 * une coupée :
 *
 * - `ferme` : la photo entière, en trois tailles.
 * - `coupe` : la même photo, recadrée d'un cinquième vers le centre, ce qui
 *   donne un léger zoom au survol de la carte.
 * - Pour la pièce du hero, deux recadrages (une pièce fermée, une coupée) et
 *   une séquence en fondu de l'une vers l'autre pour la coupe au scroll.
 *
 * `node scripts/pieces.mjs` et `node scripts/sequence.mjs` reprennent la
 * main dès que de vraies images fermée / coupe / vidéo existent.
 */
import { mkdir, rm, stat, writeFile } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";

const IDS = ["citron", "noisette", "cerise", "poire", "caillou", "savon", "oeuf", "marbre"];
const HAUTEURS = [512, 1024, 2048];

/** Recadrages du hero, en pixels de la photo d'origine (482 × 666). */
const HERO = {
  id: "citron",
  ferme: { left: 178, top: 66, width: 246, height: 246 },
  coupe: { left: 152, top: 332, width: 246, height: 246 },
  images: 72,
};

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

// La séquence du hero : fondu de la pièce fermée vers la pièce coupée, avec
// un très léger grossissement pour que l'image vive pendant le scroll.
{
  const source = join("rendus", HERO.id, "photo.jpg");
  if (await existe(source)) {
    const cible = join("public", "sequences", HERO.id);
    await rm(cible, { recursive: true, force: true });
    await mkdir(cible, { recursive: true });

    const TAILLE = 1080;
    const a = await sharp(source).extract(HERO.ferme).resize(TAILLE, TAILLE, { kernel: "lanczos3" }).png().toBuffer();
    const b = await sharp(source).extract(HERO.coupe).resize(TAILLE, TAILLE, { kernel: "lanczos3" }).png().toBuffer();

    const doux = (t) => t * t * (3 - 2 * t);
    for (let i = 0; i < HERO.images; i++) {
      const t = doux(i / (HERO.images - 1));
      const zoom = 1 + 0.05 * t;
      const cote = Math.round(TAILLE / zoom);
      const decal = Math.round((TAILLE - cote) / 2);
      const fond = await sharp(a).extract({ left: decal, top: decal, width: cote, height: cote }).resize(TAILLE, TAILLE).png().toBuffer();
      const dessus = await sharp(b)
        .extract({ left: decal, top: decal, width: cote, height: cote })
        .resize(TAILLE, TAILLE)
        .ensureAlpha()
        .composite([{ input: Buffer.from([0, 0, 0, Math.round(t * 255)]), raw: { width: 1, height: 1, channels: 4 }, tile: true, blend: "dest-in" }])
        .png()
        .toBuffer();
      const image = await sharp(fond).composite([{ input: dessus, left: 0, top: 0 }]).webp({ quality: 82 }).toBuffer();
      await writeFile(join(cible, `coupe-${String(i).padStart(3, "0")}.webp`), image);
    }
    await writeFile(
      join(cible, "manifeste.json"),
      JSON.stringify({ images: HERO.images, largeur: TAILLE, hauteur: TAILLE, fps: 20, motif: "coupe-%03d.webp" }, null, 2),
    );
    console.log(`${HERO.id} : séquence de ${HERO.images} images`);
  }
}
