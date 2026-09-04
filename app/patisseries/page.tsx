import type { Metadata } from "next";
import Link from "next/link";
import { GrilleProduits } from "@/components/GrilleProduits";
import { collections, creations, type Categorie } from "@/content/creations";

export const metadata: Metadata = { title: "Pâtisseries" };

const FILTRES: { valeur: Categorie | "toutes"; label: string }[] = [
  { valeur: "toutes", label: "Toutes" },
  { valeur: "fruit", label: "Les fruits" },
  { valeur: "objet", label: "Les objets" },
];

export default async function Page({ searchParams }: { searchParams: Promise<{ collection?: string }> }) {
  const { collection } = await searchParams;
  const filtre: Categorie | "toutes" = collection === "fruit" || collection === "objet" ? collection : "toutes";
  const liste = filtre === "toutes" ? creations : creations.filter((c) => c.categorie === filtre);
  const titre = filtre === "toutes" ? "Toutes les pièces" : collections[filtre].nom;
  const sousTitre = filtre === "toutes" ? "Huit pièces, quatre fruits et quatre objets. Toutes se coupent, toutes se mangent." : collections[filtre].sousTitre;

  return (
    <div className="pt-[calc(var(--barre)+3rem)] px-[var(--gouttiere)]">
      <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
        <div className="max-w-[34rem]">
          <h1 className="t-grand">{titre}</h1>
          <p className="text-gris mt-4 mb-0">{sousTitre}</p>
        </div>
        <nav aria-label="Collections" className="flex gap-6">
          {FILTRES.map((f) => (
            <Link
              key={f.valeur}
              href={f.valeur === "toutes" ? "/patisseries" : `/patisseries?collection=${f.valeur}`}
              className="t-etiquette lien"
              aria-current={filtre === f.valeur ? "page" : undefined}
            >
              {f.label}
            </Link>
          ))}
        </nav>
      </div>
      <GrilleProduits creations={liste} prioriser={4} />
    </div>
  );
}
