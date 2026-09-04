import type { MetadataRoute } from "next";

const ORIGINE = process.env.NEXT_PUBLIC_ORIGINE ?? "https://maisonleurre.be";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: `${ORIGINE}/`, lastModified: new Date(), priority: 1 }];
}
