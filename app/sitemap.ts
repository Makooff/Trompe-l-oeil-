import type { MetadataRoute } from "next";
import { creations } from "@/content/creations";

const ORIGINE = process.env.NEXT_PUBLIC_ORIGINE ?? "https://maisonleurre.be";

export default function sitemap(): MetadataRoute.Sitemap {
  const date = new Date();
  return [
    { url: `${ORIGINE}/`, lastModified: date, priority: 1 },
    { url: `${ORIGINE}/patisseries`, lastModified: date, priority: 0.9 },
    { url: `${ORIGINE}/la-maison`, lastModified: date, priority: 0.6 },
    ...creations.map((c) => ({ url: `${ORIGINE}/patisseries/${c.id}`, lastModified: date, priority: 0.8 })),
  ];
}
