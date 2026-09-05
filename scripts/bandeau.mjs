/**
 * Bandeaux pleine largeur (accueil, événements). Entrée : rendus/bandeau/<nom>.jpg,
 * sortie : public/bandeau/<nom>-{960,1600,2400}.{avif,webp}, en largeur.
 *
 *   node scripts/bandeau.mjs             traite tout rendus/bandeau/
 *   node scripts/bandeau.mjs creations   un seul bandeau
 */
import { mkdir, readdir } from "node:fs/promises";
import { basename, extname, join } from "node:path";
import sharp from "sharp";

const SOURCE = join("rendus", "bandeau");
const CIBLE = join("public", "bandeau");
const LARGEURS = [960, 1600, 2400];
const seul = process.argv[2];

await mkdir(CIBLE, { recursive: true });
const fichiers = (await readdir(SOURCE)).filter((f) => /\.(jpe?g|png|webp)$/i.test(f));
for (const fichier of fichiers) {
  const nom = basename(fichier, extname(fichier));
  if (seul && nom !== seul) continue;
  for (const l of LARGEURS) {
    const base = sharp(join(SOURCE, fichier)).rotate().resize({ width: l, withoutEnlargement: true, kernel: "lanczos3" });
    await base.clone().avif({ quality: 60, effort: 6 }).toFile(join(CIBLE, `${nom}-${l}.avif`));
    await base.clone().webp({ quality: 82, effort: 5 }).toFile(join(CIBLE, `${nom}-${l}.webp`));
  }
  console.log(`${nom} : ${LARGEURS.join(", ")}`);
}
if (fichiers.length === 0) console.log("rien dans rendus/bandeau/");
