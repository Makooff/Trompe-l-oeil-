"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import { Marque } from "./Marque";
import { maison } from "@/content/maison";
import { nombreArticles, usePanier } from "@/lib/panier";
import { sAbonner } from "@/lib/scroll/scrollStore";

const LIENS = [
  { href: "/patisseries", label: "Pâtisseries" },
  { href: "/patisseries?collection=fruit", label: "Les fruits" },
  { href: "/patisseries?collection=coque", label: "Les fruits à coque" },
  { href: "/la-maison", label: "La maison" },
];

/** Vrai tant que le hero noir de l'accueil passe encore sous la barre. */
function useSurHero(accueil: boolean) {
  return useSyncExternalStore(
    (cb) => {
      const stop = sAbonner(cb);
      window.addEventListener("resize", cb);
      return () => {
        stop();
        window.removeEventListener("resize", cb);
      };
    },
    () => {
      if (!accueil) return false;
      const hero = document.querySelector("[data-epingle]");
      if (!hero) return false;
      const barre = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--barre")) * 16 || 64;
      return hero.getBoundingClientRect().bottom > barre;
    },
    () => accueil,
  );
}

/**
 * La barre. Fixe, crème, un filet en bas, transparente sur le hero noir. Le nom au centre, les liens à
 * gauche, le panier à droite. Sur petit écran, un bouton ouvre le menu en
 * plein écran.
 */
export function Nav() {
  const chemin = usePathname();
  const lignes = usePanier();
  const n = nombreArticles(lignes);
  const [ouvert, setOuvert] = useState(false);
  const surHero = useSurHero(chemin === "/");

  const actif = (href: string) => chemin === href.split("?")[0] && !href.includes("?");

  return (
    <header
      data-sur-hero={surHero && !ouvert ? "" : undefined}
      className="fixed inset-x-0 top-0 z-50 bg-creme text-noir border-b border-filet transition-[background-color,color,border-color] duration-[var(--d-3)] ease-[var(--ease)] data-[sur-hero]:bg-transparent data-[sur-hero]:text-blanc data-[sur-hero]:border-transparent"
    >
      <div className="h-[var(--barre)] px-[var(--gouttiere)] grid grid-cols-[1fr_auto_1fr] items-center">
        <nav aria-label="Principale" className="hidden lg:flex gap-7">
          {LIENS.slice(0, 3).map((l) => (
            <Link key={l.href} href={l.href} className="t-etiquette lien" aria-current={actif(l.href) ? "page" : undefined}>
              {l.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          className="lg:hidden justify-self-start t-etiquette h-11 -ml-2 px-2"
          aria-expanded={ouvert}
          aria-controls="menu"
          onClick={() => setOuvert((o) => !o)}
        >
          {ouvert ? "Fermer" : "Menu"}
        </button>

        <Link href="/" aria-label={`${maison.nom}, accueil`}>
          <Marque />
        </Link>

        <div className="justify-self-end flex items-center gap-7">
          <Link href="/la-maison" className="hidden lg:inline t-etiquette lien" aria-current={actif("/la-maison") ? "page" : undefined}>
            La maison
          </Link>
          <Link href="/panier" className="t-etiquette lien" aria-current={actif("/panier") ? "page" : undefined}>
            Panier
            {n > 0 && (
              <span key={n} className="pop ml-1">
                ({n})
              </span>
            )}
          </Link>
        </div>
      </div>

      <div
        id="menu"
        hidden={!ouvert}
        className="menu-entree lg:hidden fixed inset-x-0 top-[var(--barre)] bottom-0 bg-creme px-[var(--gouttiere)] py-10 overflow-y-auto"
      >
        <nav aria-label="Menu" className="grid gap-6">
          {LIENS.map((l, i) => (
            <Link key={l.href} href={l.href} className="t-moyen" style={{ "--i": i } as React.CSSProperties} data-reveal onClick={() => setOuvert(false)}>
              {l.label}
            </Link>
          ))}
          <Link href="/panier" className="t-moyen" onClick={() => setOuvert(false)}>
            Panier{n > 0 ? ` (${n})` : ""}
          </Link>
        </nav>
        <p className="t-etiquette text-gris mt-14 mb-0">
          {maison.adresse}, {maison.ville}
        </p>
      </div>
    </header>
  );
}
