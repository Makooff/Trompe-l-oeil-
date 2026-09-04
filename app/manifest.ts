import type { MetadataRoute } from "next";
import { maison } from "@/content/maison";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: maison.nom,
    short_name: "Leurre",
    description: maison.accroche,
    lang: "fr-BE",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
    ],
  };
}
