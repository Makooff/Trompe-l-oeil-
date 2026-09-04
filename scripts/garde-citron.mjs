/**
 * Image de garde du citron, pour valider la mécanique de coupe avant les rendus
 * ComfyUI. Une ellipse jaune velours, sa coupe en anneaux, et deux cartes de
 * profondeur. Écrit dans rendus/citron/, puis `node scripts/pieces.mjs citron`.
 * Vos vrais rendus écrasent ces fichiers.
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const W = 1024, H = 1280;
const out = "rendus/citron";
await mkdir(out, { recursive: true });

const grain = `<filter id="g"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="linear" slope="0.18"/></feComponentTransfer></filter>`;
const lum = `<radialGradient id="l" cx="0.32" cy="0.28" r="0.85"><stop offset="0" stop-color="#fbe98a"/><stop offset="0.55" stop-color="#e8c93c"/><stop offset="1" stop-color="#7a6212"/></radialGradient>`;

const ferme = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><defs>${lum}${grain}<clipPath id="k"><ellipse cx="512" cy="700" rx="330" ry="270"/></clipPath></defs>
<ellipse cx="512" cy="700" rx="330" ry="270" fill="url(#l)"/>
<g clip-path="url(#k)"><ellipse cx="512" cy="700" rx="330" ry="270" filter="url(#g)"/></g>
<ellipse cx="820" cy="700" rx="40" ry="26" fill="#d9b53a"/>
<ellipse cx="205" cy="700" rx="36" ry="24" fill="#c9a52f"/>
</svg>`;

const coupeDefs = `<radialGradient id="c" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#f7edc2"/><stop offset="0.62" stop-color="#f4d861"/><stop offset="0.9" stop-color="#f4d861"/><stop offset="0.92" stop-color="#ffffff"/><stop offset="1" stop-color="#e5c53a"/></radialGradient>`;
const coupe = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><defs>${coupeDefs}${grain}<clipPath id="k"><ellipse cx="512" cy="700" rx="330" ry="270"/></clipPath></defs>
<ellipse cx="512" cy="700" rx="330" ry="270" fill="url(#c)"/>
<ellipse cx="512" cy="700" rx="170" ry="140" fill="none" stroke="#e9d288" stroke-width="18"/>
<ellipse cx="512" cy="700" rx="60" ry="50" fill="#efe0a8"/>
<g clip-path="url(#k)"><ellipse cx="512" cy="700" rx="330" ry="270" filter="url(#g)" opacity="0.6"/></g>
</svg>`;

const prof = (r) => `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><defs><radialGradient id="p" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#000000"/></radialGradient></defs><rect width="100%" height="100%" fill="#000"/><ellipse cx="512" cy="700" rx="330" ry="270" fill="url(#p)" opacity="${r}"/></svg>`;

await sharp(Buffer.from(ferme)).png().toFile(`${out}/ferme.png`);
await sharp(Buffer.from(coupe)).png().toFile(`${out}/coupe.png`);
await sharp(Buffer.from(prof(1))).png().toFile(`${out}/profondeur-ferme.png`);
await sharp(Buffer.from(prof(0.35))).png().toFile(`${out}/profondeur-coupe.png`);
console.log("garde ok");
