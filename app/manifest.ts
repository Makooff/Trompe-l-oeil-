import type { MetadataRoute } from "next";
import { maison } from "@/content/maison";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: maison.nom,
    short_name: "Leurre",
    description: maison.signature,
    lang: "fr-BE",
    start_url: "/",
    display: "standalone",
    background_color: "#0b0a09",
    theme_color: "#f2ede4",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/marque/signe-192.png", sizes: "192x192", type: "image/png" },
      { src: "/marque/signe-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
