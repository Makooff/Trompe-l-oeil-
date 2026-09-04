import type { Metadata } from "next";
import { Hanken_Grotesk } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { Scroll } from "@/components/Scroll";
import { maison } from "@/content/maison";
import "./globals.css";

const hanken = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});

const ORIGINE = process.env.NEXT_PUBLIC_ORIGINE ?? "https://maisonleurre.be";

export const metadata: Metadata = {
  metadataBase: new URL(ORIGINE),
  title: {
    default: `${maison.nom}, ${maison.accroche}`,
    template: `%s · ${maison.nom}`,
  },
  description: maison.presentation,
  openGraph: {
    title: maison.nom,
    description: maison.accroche,
    locale: "fr_BE",
    type: "website",
    siteName: maison.nom,
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr-BE">
      <body className={`${hanken.variable} antialiased`}>
        <a
          href="#contenu"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-60 focus:bg-noir focus:text-blanc focus:px-4 focus:h-11 focus:inline-flex focus:items-center t-etiquette"
        >
          Aller au contenu
        </a>
        <Scroll />
        <Nav />
        <main id="contenu">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
