import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AjouterAuPanier } from "@/components/AjouterAuPanier";
import { GrilleProduits } from "@/components/GrilleProduits";
import { Lame } from "@/components/ui/Lame";
import { collections, creationParId, creations } from "@/content/creations";
import { maison } from "@/content/maison";
import { PIECES_AVEC_COUPE, srcSetPiece } from "@/lib/pieces";

type Props = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return creations.map((c) => ({ id: c.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const c = creationParId[id];
  if (!c) return {};
  return {
    title: c.nom,
    description: c.description,
    openGraph: { images: [`/pieces/${c.id}/ferme-1024.webp`] },
  };
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  const c = creationParId[id];
  if (!c) notFound();

  const autres = creations.filter((x) => x.categorie === c.categorie && x.id !== c.id).slice(0, 4);

  return (
    <div className="pt-[calc(var(--barre)+2rem)]">
      <div className="px-[var(--gouttiere)] grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
        <div>
          {PIECES_AVEC_COUPE.has(c.id) ? (
            <>
              <Lame id={c.id} faux={c.nom} className="aspect-4/5" />
              <p className="t-etiquette text-gris-clair mt-3 mb-0">Glissez la lame pour ouvrir la pièce.</p>
            </>
          ) : (
            <div className="aspect-[482/666] bg-fond-doux overflow-hidden">
              <img
                src={`/pieces/${c.id}/ferme-1024.webp`}
                srcSet={srcSetPiece(c.id, "ferme", "webp")}
                sizes="(min-width: 64rem) 55vw, 100vw"
                alt={c.nom}
                fetchPriority="high"
                decoding="async"
                className="h-full w-full object-cover"
              />
            </div>
          )}
        </div>

        <div className="lg:pt-6 lg:max-w-[28rem]">
          <p className="t-etiquette text-gris m-0">
            <Link href={`/patisseries?collection=${c.categorie}`} className="lien">
              {collections[c.categorie].nom}
            </Link>
          </p>
          <h1 className="t-grand mt-3">{c.nom}</h1>
          <p className="t-petit-titre mt-3">
            {c.prixEuros} € <span className="text-gris">· {c.parts} {c.parts > 1 ? "parts" : "part"}</span>
          </p>
          <p className="text-gris mt-6 mb-8">{c.description}</p>

          <AjouterAuPanier id={c.id} nom={c.nom} />

          <dl className="mt-10 grid gap-5 border-t border-filet pt-6">
            <div>
              <dt className="t-etiquette text-gris">Composition</dt>
              <dd className="m-0 mt-1">{c.composition}</dd>
            </div>
            <div>
              <dt className="t-etiquette text-gris">De l&apos;extérieur vers le cœur</dt>
              <dd className="m-0 mt-1">{c.couches.join(", ")}</dd>
            </div>
            <div>
              <dt className="t-etiquette text-gris">Allergènes</dt>
              <dd className="m-0 mt-1">{c.allergenes.join(", ")}</dd>
            </div>
            <div>
              <dt className="t-etiquette text-gris">Retrait</dt>
              <dd className="m-0 mt-1 text-gris">{maison.retrait}</dd>
            </div>
          </dl>
        </div>
      </div>

      {autres.length > 0 && (
        <section className="px-[var(--gouttiere)] mt-[var(--section)]" aria-labelledby="autres">
          <h2 id="autres" className="t-moyen mb-8">
            Dans {collections[c.categorie].nom.toLowerCase()}
          </h2>
          <GrilleProduits creations={autres} />
        </section>
      )}
    </div>
  );
}
