import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { maison } from "@/content/maison";
import { SIGNE_CHEMINS, SIGNE_VIEWBOX } from "@/content/marque";

export const alt = `${maison.nom}, ${maison.signature}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Image de partage. Le wordmark en Bodoni sur la nuit d'atelier, le signe en
 * bas à droite, l'or pour la seule ligne d'accent. Mêmes tokens que le site.
 */
export default async function Image() {
  const bodoni = await readFile(join(process.cwd(), "app/fonts/BodoniModa.ttf"));

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#0b0a09",
          color: "#f2ede4",
          fontFamily: "Bodoni",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 20,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: "rgba(242,237,228,0.38)",
          }}
        >
          <span>{maison.nom}</span>
          <span>{maison.ville}</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 176, lineHeight: 0.92, letterSpacing: -5 }}>
            Leurre
          </div>
          <div
            style={{
              marginTop: 28,
              width: 520,
              height: 1,
              background: "rgba(242,237,228,0.2)",
            }}
          />
          <div style={{ marginTop: 24, fontSize: 46, color: "#c98b3e" }}>
            {maison.signature}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <svg
            viewBox={SIGNE_VIEWBOX}
            width="88"
            height="88"
            fill="none"
            stroke="#f2ede4"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {SIGNE_CHEMINS.map((d) => (
              <path key={d} d={d} />
            ))}
          </svg>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Bodoni", data: bodoni, weight: 500, style: "normal" }],
    },
  );
}
