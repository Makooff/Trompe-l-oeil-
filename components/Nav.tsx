"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { maison } from "@/content/maison";
import { nombreArticles, usePanier } from "@/lib/panier";

const LIENS = [
  { href: "/patisseries", label: "Pâtisseries" },
  { href: "/patisseries?collection=fruit", label: "Les fruits" },
  { href: "/patisseries?collection=objet", label: "Les objets" },
  { href: "/la-maison", label: "La maison" },
];

/**
 * La barre. Fixe, blanche, un filet en bas. Le nom au centre, les liens à
 * gauche, le panier à droite. Sur petit écran, un bouton ouvre le menu en
 * plein écran.
 */
export function Nav() {
  const chemin = usePathname();
  const lignes = usePanier();
  const n = nombreArticles(lignes);
  const [ouvert, setOuvert] = useState(false);

  useEffect(() => {
    document.documentElement.style.overflow = ouvert ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [ouvert]);

  const actif = (href: string) => chemin === href.split("?")[0] && !href.includes("?");

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-blanc border-b border-filet">
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

        <Link href="/" className="t-etiquette-l tracking-[0.22em] font-medium" aria-label={`${maison.nom}, accueil`}>
          {maison.nom}
        </Link>

        <div className="justify-self-end flex items-center gap-7">
          <Link href="/la-maison" className="hidden lg:inline t-etiquette lien" aria-current={actif("/la-maison") ? "page" : undefined}>
            La maison
          </Link>
          <Link href="/panier" className="t-etiquette lien" aria-current={actif("/panier") ? "page" : undefined}>
            Panier{n > 0 ? ` (${n})` : ""}
          </Link>
        </div>
      </div>

      <div
        id="menu"
        hidden={!ouvert}
        className="lg:hidden fixed inset-x-0 top-[var(--barre)] bottom-0 bg-blanc px-[var(--gouttiere)] py-10 overflow-y-auto"
      >
        <nav aria-label="Menu" className="grid gap-6">
          {LIENS.map((l) => (
            <Link key={l.href} href={l.href} className="t-moyen" onClick={() => setOuvert(false)}>
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
