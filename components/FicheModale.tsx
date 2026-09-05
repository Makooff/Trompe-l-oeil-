"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Bouton } from "./ui/Bouton";
import { collections, type Creation } from "@/content/creations";
import { maison } from "@/content/maison";
import { panier } from "@/lib/panier";
import { srcSetPiece, type VariantePiece } from "@/lib/pieces";

const VUES: { variante: VariantePiece; legende: string }[] = [
  { variante: "ferme", legende: "Pièce fermée" },
  { variante: "coupe", legende: "Pièce coupée" },
];

function Chevron({ sens }: { sens: "gauche" | "droite" }) {
  return (
    <svg width="14" height="24" viewBox="0 0 14 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d={sens === "gauche" ? "M12 2 2 12l10 10" : "M2 2l10 10L2 22"} />
    </svg>
  );
}

/**
 * La fiche produit en fenêtre, par-dessus la grille : photos à gauche,
 * texte et ajout au panier à droite, pièce précédente et suivante aux
 * bords de l'écran. Fermer revient à la page d'où l'on vient.
 */
export function FicheModale({ creation: c, precedente, suivante }: { creation: Creation; precedente: string; suivante: string }) {
  const routeur = useRouter();
  const boite = useRef<HTMLDialogElement>(null);
  const bande = useRef<HTMLDivElement>(null);
  const [vue, setVue] = useState(0);
  const [quantite, setQuantite] = useState(1);
  const [ajoute, setAjoute] = useState(false);

  useEffect(() => {
    const d = boite.current;
    if (!d || d.open) return;
    d.showModal();
    const avant = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = avant;
    };
  }, []);

  useEffect(() => {
    const el = bande.current;
    if (!el) return;
    const lire = () => setVue(Math.round(el.scrollLeft / el.clientWidth));
    el.addEventListener("scroll", lire, { passive: true });
    return () => el.removeEventListener("scroll", lire);
  }, []);

  const aller = (i: number) => {
    const el = bande.current;
    if (!el) return;
    const n = (i + VUES.length) % VUES.length;
    el.scrollTo({ left: n * el.clientWidth, behavior: "smooth" });
  };

  const fermer = () => routeur.back();

  return (
    <dialog
      ref={boite}
      data-fiche
      aria-labelledby="fiche-titre"
      onClose={fermer}
      onClick={(e) => {
        if (e.target === e.currentTarget) fermer();
      }}
      className="fixed inset-0 m-0 max-w-none max-h-none w-full h-full p-0 bg-transparent text-noir"
    >
      <div className="min-h-full flex items-stretch lg:items-center justify-center lg:p-[var(--gouttiere)]">
        <article className="relative w-full lg:w-[min(100%,72rem)] lg:h-[min(85svh,50rem)] bg-blanc grid lg:grid-cols-2 lg:grid-rows-[minmax(0,1fr)] overflow-y-auto lg:overflow-hidden lg:rounded-image">
          <div className="relative bg-fond-doux aspect-square lg:aspect-auto lg:min-h-0">
            <div
              ref={bande}
              className="flex h-full overflow-x-auto snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              aria-roledescription="carrousel"
              aria-label={`Photos, ${c.nom}`}
            >
              {VUES.map((v, i) => (
                <figure key={v.variante} className="m-0 shrink-0 w-full h-full snap-start" aria-hidden={vue !== i}>
                  <picture>
                    <source type="image/avif" srcSet={srcSetPiece(c.id, v.variante, "avif")} sizes="(min-width: 64rem) 36rem, 100vw" />
                    <img
                      src={`/pieces/${c.id}/${v.variante}-1024.webp`}
                      srcSet={srcSetPiece(c.id, v.variante, "webp")}
                      sizes="(min-width: 64rem) 36rem, 100vw"
                      alt={`${c.nom}, ${v.legende.toLowerCase()}`}
                      loading={i === 0 ? "eager" : "lazy"}
                      decoding="async"
                      className="h-full w-full object-cover"
                    />
                  </picture>
                </figure>
              ))}
            </div>
            <button
              type="button"
              onClick={() => aller(vue - 1)}
              className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-16 grid place-items-center text-blanc mix-blend-difference"
              aria-label="Photo précédente"
            >
              <Chevron sens="gauche" />
            </button>
            <button
              type="button"
              onClick={() => aller(vue + 1)}
              className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-16 grid place-items-center text-blanc mix-blend-difference"
              aria-label="Photo suivante"
            >
              <Chevron sens="droite" />
            </button>
            <div className="absolute inset-x-0 bottom-4 flex justify-center gap-2" role="tablist" aria-label="Photos">
              {VUES.map((v, i) => (
                <button
                  key={v.variante}
                  type="button"
                  role="tab"
                  aria-selected={vue === i}
                  aria-label={v.legende}
                  onClick={() => aller(i)}
                  className="w-6 h-6 grid place-items-center"
                >
                  <span
                    className={`block w-1.5 h-1.5 rounded-full transition-colors duration-[var(--d-2)] ease-[var(--ease)] ${
                      vue === i ? "bg-noir" : "bg-noir/30"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col lg:min-h-0 lg:overflow-y-auto">
            <div className="p-6 lg:p-10 lg:pr-16">
              <p className="t-etiquette text-gris m-0">{collections[c.categorie].nom}</p>
              <h2 id="fiche-titre" className="t-moyen mt-2 mb-0">
                {c.nom}
              </h2>
              <p className="mt-5 mb-0">{c.composition}</p>
              <p className="text-gris mt-4 mb-0">
                Allergènes : {c.allergenes.join(", ")}.
                <br />
                De l&apos;extérieur au cœur : {c.couches.join(", ")}.
              </p>
            </div>

            <div className="border-t border-filet px-6 lg:px-10 h-16 flex items-center justify-between gap-4 t-etiquette-l">
              <span className="text-gris">
                {c.parts} {c.parts > 1 ? "parts" : "part"}
              </span>
              <span>
                {c.prixEuros} € <span className="text-gris ml-3">48h mini.</span>
              </span>
              <div className="inline-flex items-center gap-1" role="group" aria-label="Quantité">
                <button type="button" className="w-9 h-11" onClick={() => setQuantite((q) => Math.max(1, q - 1))} aria-label="Moins">
                  −
                </button>
                <span className="w-6 text-center tabular-nums" aria-live="polite">
                  {quantite}
                </span>
                <button type="button" className="w-9 h-11" onClick={() => setQuantite((q) => Math.min(20, q + 1))} aria-label="Plus">
                  +
                </button>
              </div>
            </div>

            <div className="border-t border-filet p-6 lg:p-10 grid gap-3 justify-items-center">
              <Bouton
                className="w-full max-w-[18rem]"
                onClick={() => {
                  panier.ajouter(c.id, quantite);
                  setAjoute(true);
                }}
              >
                Ajouter au panier
              </Bouton>
              {ajoute ? (
                <p className="m-0 text-gris t-etiquette" role="status">
                  {c.nom} ajouté.{" "}
                  <Link href="/panier" className="text-noir lien">
                    Voir le panier
                  </Link>
                </p>
              ) : (
                <p className="m-0 text-gris t-etiquette">Retrait {maison.adresse}, {maison.ville}.</p>
              )}
            </div>

            <div className="lg:hidden border-t border-filet px-6 h-14 flex items-center justify-between t-etiquette-l">
              <Link href={`/patisseries/${precedente}`} replace className="lien inline-flex items-center gap-2 h-11">
                <Chevron sens="gauche" /> Précédente
              </Link>
              <Link href={`/patisseries/${suivante}`} replace className="lien inline-flex items-center gap-2 h-11">
                Suivante <Chevron sens="droite" />
              </Link>
            </div>
          </div>

          <button
            type="button"
            onClick={fermer}
            className="absolute top-0 right-0 w-14 h-14 grid place-items-center text-noir"
            aria-label="Fermer"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="M2 2l14 14M16 2 2 16" />
            </svg>
          </button>
        </article>

        <Link
          href={`/patisseries/${precedente}`}
          replace
          className="hidden lg:grid fixed left-0 top-1/2 -translate-y-1/2 w-16 h-32 place-items-center bg-blanc text-noir rounded-r-full transition-colors duration-[var(--d-2)] ease-[var(--ease)] hover:bg-noir hover:text-blanc"
          aria-label="Pièce précédente"
        >
          <Chevron sens="gauche" />
        </Link>
        <Link
          href={`/patisseries/${suivante}`}
          replace
          className="hidden lg:grid fixed right-0 top-1/2 -translate-y-1/2 w-16 h-32 place-items-center bg-blanc text-noir rounded-l-full transition-colors duration-[var(--d-2)] ease-[var(--ease)] hover:bg-noir hover:text-blanc"
          aria-label="Pièce suivante"
        >
          <Chevron sens="droite" />
        </Link>
      </div>
    </dialog>
  );
}
