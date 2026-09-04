import type { Metadata } from "next";
import { Bodoni_Moda, Geist, Geist_Mono } from "next/font/google";
import { GrainOverlay } from "@/components/ui/GrainOverlay";
import { ScrollDriver } from "@/components/ScrollDriver";
import { SceneHost } from "@/components/scene/SceneHost";
import { maison } from "@/content/maison";
import "./globals.css";

const bodoni = Bodoni_Moda({
  variable: "--font-bodoni",
  subsets: ["latin"],
  display: "swap",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const ORIGINE = process.env.NEXT_PUBLIC_ORIGINE ?? "https://maisonleurre.be";

export const metadata: Metadata = {
  metadataBase: new URL(ORIGINE),
  title: {
    default: `${maison.nom}, pâtisserie trompe-l'œil à Mons`,
    template: `%s · ${maison.nom}`,
  },
  description: maison.chapo,
  openGraph: {
    title: maison.nom,
    description: maison.signature,
    locale: "fr_BE",
    type: "website",
    siteName: maison.nom,
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr-BE">
      <body
        className={`${bodoni.variable} ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <a
          href="#carte"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-70 focus:bg-or focus:text-bg focus:px-4 focus:h-11 focus:inline-flex focus:items-center t-cartel"
        >
          Aller à la carte
        </a>
        <ScrollDriver />
        <SceneHost />
        {children}
        <GrainOverlay />
      </body>
    </html>
  );
}
