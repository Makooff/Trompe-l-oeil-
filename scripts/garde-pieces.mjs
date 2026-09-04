/**
 * Images de garde des huit pièces, pour remplir le site avant les rendus
 * ComfyUI : une forme simple par pièce, fermée et coupée, fond transparent.
 * Écrit dans rendus/<id>/, puis `node scripts/pieces.mjs` les exporte.
 * Vos rendus écrasent ces fichiers.
 */
import { mkdir } from "node:fs/promises";
import sharp from "sharp";

const W = 1024;
const H = 1280;
const CX = 512;
const CY = 720;

const grain = `<filter id="g"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="linear" slope="0.14"/></feComponentTransfer></filter>`;

const pieces = {
  citron: { forme: "ellipse", rx: 330, ry: 270, teinte: ["#fbe98a", "#e8c93c", "#7a6212"], interieur: ["#f7edc2", "#f4d861", "#e5c53a"] },
  noisette: { forme: "cercle", rx: 250, ry: 270, teinte: ["#b98a5a", "#7a4a25", "#3b2211"], interieur: ["#e9d7b0", "#c9a06a", "#7a4a25"] },
  cerise: { forme: "cercle", rx: 240, ry: 240, teinte: ["#e0344b", "#8e0f24", "#3d0410"], interieur: ["#f2c9cf", "#c9243b", "#5a0a18"] },
  poire: { forme: "poire", rx: 260, ry: 320, teinte: ["#cfe08a", "#8faf3a", "#3f5716"], interieur: ["#f5f0d8", "#e6d9a8", "#8faf3a"] },
  caillou: { forme: "galet", rx: 340, ry: 230, teinte: ["#b9b6ae", "#7e7b74", "#3e3c38"], interieur: ["#f1e6c8", "#d9c39a", "#8b6a3f"] },
  savon: { forme: "boite", rx: 300, ry: 200, teinte: ["#dfe6c9", "#aebb85", "#6a7a4a"], interieur: ["#f4f1e1", "#cdd6b0", "#8b9a5f"] },
  oeuf: { forme: "oeuf", rx: 230, ry: 300, teinte: ["#fbf6ea", "#e6d9c3", "#a8967a"], interieur: ["#fff7d6", "#ffd45a", "#e19b1c"] },
  marbre: { forme: "boite", rx: 330, ry: 190, teinte: ["#ffffff", "#e7e7e7", "#9d9d9d"], interieur: ["#e9d2b3", "#b07a45", "#5a3a1f"] },
};

function contour(p) {
  const { rx, ry } = p;
  switch (p.forme) {
    case "cercle":
    case "ellipse":
      return `<ellipse cx="${CX}" cy="${CY}" rx="${rx}" ry="${ry}"/>`;
    case "poire":
      return `<path d="M${CX} ${CY - ry} C${CX + rx * 0.55} ${CY - ry} ${CX + rx} ${CY - ry * 0.2} ${CX + rx} ${CY + ry * 0.3} C${CX + rx} ${CY + ry * 0.75} ${CX + rx * 0.55} ${CY + ry} ${CX} ${CY + ry} C${CX - rx * 0.55} ${CY + ry} ${CX - rx} ${CY + ry * 0.75} ${CX - rx} ${CY + ry * 0.3} C${CX - rx} ${CY - ry * 0.2} ${CX - rx * 0.55} ${CY - ry} ${CX} ${CY - ry}Z"/>`;
    case "galet":
      return `<path d="M${CX - rx} ${CY} C${CX - rx} ${CY - ry * 1.1} ${CX - rx * 0.3} ${CY - ry} ${CX + rx * 0.2} ${CY - ry * 0.9} C${CX + rx * 0.8} ${CY - ry * 0.8} ${CX + rx} ${CY - ry * 0.3} ${CX + rx} ${CY + ry * 0.1} C${CX + rx} ${CY + ry * 0.8} ${CX + rx * 0.4} ${CY + ry} ${CX - rx * 0.2} ${CY + ry} C${CX - rx * 0.8} ${CY + ry} ${CX - rx} ${CY + ry * 0.5} ${CX - rx} ${CY}Z"/>`;
    case "oeuf":
      return `<path d="M${CX} ${CY - ry} C${CX + rx * 0.75} ${CY - ry} ${CX + rx} ${CY - ry * 0.1} ${CX + rx} ${CY + ry * 0.25} C${CX + rx} ${CY + ry * 0.7} ${CX + rx * 0.6} ${CY + ry} ${CX} ${CY + ry} C${CX - rx * 0.6} ${CY + ry} ${CX - rx} ${CY + ry * 0.7} ${CX - rx} ${CY + ry * 0.25} C${CX - rx} ${CY - ry * 0.1} ${CX - rx * 0.75} ${CY - ry} ${CX} ${CY - ry}Z"/>`;
    case "boite":
      return `<rect x="${CX - rx}" y="${CY - ry}" width="${rx * 2}" height="${ry * 2}" rx="18"/>`;
  }
}

function svgFerme(p) {
  const [a, b, c] = p.teinte;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><defs>
<radialGradient id="l" cx="0.32" cy="0.28" r="0.85"><stop offset="0" stop-color="${a}"/><stop offset="0.55" stop-color="${b}"/><stop offset="1" stop-color="${c}"/></radialGradient>
${grain}<clipPath id="k">${contour(p)}</clipPath></defs>
<g fill="url(#l)">${contour(p)}</g>
<g clip-path="url(#k)"><rect width="100%" height="100%" filter="url(#g)"/></g>
</svg>`;
}

function svgCoupe(p) {
  const [a, b, c] = p.interieur;
  const { rx, ry } = p;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><defs>
<radialGradient id="c" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="${a}"/><stop offset="0.6" stop-color="${b}"/><stop offset="0.9" stop-color="${b}"/><stop offset="0.93" stop-color="#ffffff"/><stop offset="1" stop-color="${c}"/></radialGradient>
${grain}<clipPath id="k">${contour(p)}</clipPath></defs>
<g fill="url(#c)">${contour(p)}</g>
<ellipse cx="${CX}" cy="${CY}" rx="${rx * 0.5}" ry="${ry * 0.5}" fill="none" stroke="${c}" stroke-opacity="0.35" stroke-width="16"/>
<g clip-path="url(#k)" opacity="0.6"><rect width="100%" height="100%" filter="url(#g)"/></g>
</svg>`;
}

for (const [id, p] of Object.entries(pieces)) {
  const out = `rendus/${id}`;
  await mkdir(out, { recursive: true });
  await sharp(Buffer.from(svgFerme(p))).png().toFile(`${out}/ferme.png`);
  await sharp(Buffer.from(svgCoupe(p))).png().toFile(`${out}/coupe.png`);
  console.log(`garde : ${id}`);
}
