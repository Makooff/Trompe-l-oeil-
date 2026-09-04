#!/usr/bin/env node
/**
 * Convertit les sorties ComfyUI en images prêtes pour le site.
 *
 * Entrée : un dossier par pièce dans `rendus/`, avec au moins
 *   ferme.png              la pièce fermée, détourée (alpha)
 *   coupe.png              la coupe, détourée (alpha)
 *   profondeur-ferme.png   carte de profondeur 16 bits de la fermée
 *   profondeur-coupe.png   carte de profondeur 16 bits de la coupe
 *
 * Sortie : public/pieces/<id>/ avec AVIF et WebP en 512, 1024 et 2048 de haut,
 * plus les cartes de profondeur réduites à 1024 en PNG 8 bits (le relief 2,5D
 * n'a pas besoin de plus, et un PNG 16 bits pèse quatre fois le prix).
 *
 *   node scripts/pieces.mjs            traite tout `rendus/`
 *   node scripts/pieces.mjs citron     une seule pièce
 */
import { readdir, mkdir, stat } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";

const SOURCE = "rendus";
const CIBLE = "public/pieces";
const HAUTEURS = [512, 1024, 2048];
const IMAGES = ["ferme", "coupe", "trois-quarts"];
const PROFONDEURS = ["profondeur-ferme", "profondeur-coupe"];

async function existe(chemin) {
  try {
    await stat(chemin);
    return true;
  } catch {
    return false;
  }
}

async function traiterImage(source, cible, nom) {
  const entree = join(source, `${nom}.png`);
  if (!(await existe(entree))) return;

  for (const h of HAUTEURS) {
    const base = sharp(entree).resize({ height: h, withoutEnlargement: true });
    await base.clone().avif({ quality: 60, effort: 6 }).toFile(join(cible, `${nom}-${h}.avif`));
    await base.clone().webp({ quality: 82, effort: 5 }).toFile(join(cible, `${nom}-${h}.webp`));
  }
  console.log(`  ${nom} : ${HAUTEURS.join(" / ")}`);
}

async function traiterProfondeur(source, cible, nom) {
  const entree = join(source, `${nom}.png`);
  if (!(await existe(entree))) return;

  // Un flou léger lisse les marches de la carte : sans lui, le relief déchire
  // sur les bords de la pièce.
  await sharp(entree)
    .resize({ height: 1024, withoutEnlargement: true })
    .blur(1.2)
    .toColourspace("b-w")
    .png({ compressionLevel: 9 })
    .toFile(join(cible, `${nom}.png`));
  console.log(`  ${nom} : 1024, flou 1.2`);
}

const seulement = process.argv[2];
const dossiers = (await readdir(SOURCE, { withFileTypes: true }))
  .filter((d) => d.isDirectory() && (!seulement || d.name === seulement))
  .map((d) => d.name);

if (dossiers.length === 0) {
  console.error(`Aucune pièce trouvée dans ${SOURCE}/`);
  process.exit(1);
}

for (const id of dossiers) {
  const source = join(SOURCE, id);
  const cible = join(CIBLE, id);
  await mkdir(cible, { recursive: true });
  console.log(id);
  for (const nom of IMAGES) await traiterImage(source, cible, nom);
  for (const nom of PROFONDEURS) await traiterProfondeur(source, cible, nom);
}
