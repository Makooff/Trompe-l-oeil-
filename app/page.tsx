import Link from "next/link";
import { GrilleProduits } from "@/components/GrilleProduits";
import { Bandeau } from "@/components/Bandeau";
import { Hero } from "@/components/Hero";
import { Bouton } from "@/components/ui/Bouton";
import { Lame } from "@/components/ui/Lame";
import { creations } from "@/content/creations";
import { maison } from "@/content/maison";
import { PIECES_AVEC_COUPE, srcSetPiece } from "@/lib/pieces";

const section = "px-[var(--gouttiere)] mt-[var(--section)]";

export default function Page() {
  return (
    <>
      <Hero />

      <section className="px-[var(--gouttiere)] mt-16 lg:mt-20" aria-labelledby="pieces">
        <h2 id="pieces" className="sr-only">Les pièces</h2>
        <GrilleProduits creations={creations} prioriser={4} />
        <p className="mt-8 mb-0">
          <Link href="/patisseries" className="t-etiquette lien">Toutes les pièces</Link>
        </p>
      </section>

      <section className={section} aria-labelledby="trompe">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-center">
          <div className="lg:order-2">
            {PIECES_AVEC_COUPE.has("poire") ? (
              <Lame id="poire" faux="Framboise" className="aspect-4/5" />
            ) : (
              <div className="aspect-[482/666] bg-fond-doux overflow-hidden rounded-image">
                <img
                  src="/pieces/poire/ferme-1024.webp"
                  srcSet={srcSetPiece("poire", "ferme", "webp")}
                  sizes="(min-width: 64rem) 50vw, 100vw"
                  alt="Framboise, une pièce ouverte"
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover"
                />
              </div>
            )}
          </div>
          <div className="lg:order-1 max-w-[30rem]">
            <p className="t-etiquette text-gris m-0">Le trompe-l&apos;œil</p>
            <h2 id="trompe" className="t-grand mt-4">Coupez, c&apos;est un dessert.</h2>
            <p className="text-gris mt-6 mb-8">{maison.presentation}</p>
            <p className="t-etiquette text-gris-clair m-0">Chaque pièce se coupe à la fourchette.</p>
          </div>
        </div>
      </section>

      <Bandeau
        nom="creations"
        etiquette="Événements sur demande"
        titre="Créations"
        action={{ href: `mailto:${maison.email}`, label: "Contactez-nous" }}
      />

      <section className={section} aria-labelledby="boutique">
        <div className="border-t border-filet pt-10 grid gap-8 md:grid-cols-3">
          <div>
            <p className="t-etiquette text-gris m-0">La boutique</p>
            <h2 id="boutique" className="t-moyen mt-3">{maison.adresse}, Mons</h2>
          </div>
          <div>
            <p className="t-etiquette text-gris m-0 mb-3">Horaires</p>
            <ul className="list-none p-0 m-0 grid gap-1">
              {maison.horaires.map((h) => (
                <li key={h.jours} className="flex justify-between gap-4 max-w-[20rem]">
                  <span>{h.jours}</span>
                  <span className="text-gris">{h.heures}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="md:justify-self-end">
            <p className="text-gris mt-0 mb-5 max-w-[18rem]">{maison.retrait}</p>
            <Bouton href="/patisseries" variante="contour">Commander</Bouton>
          </div>
        </div>
      </section>
    </>
  );
}
