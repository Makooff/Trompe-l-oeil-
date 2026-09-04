import { ActeHeading } from "@/components/ui/ActeHeading";
import { Bouton } from "@/components/ui/Bouton";
import { CarteRow } from "@/components/ui/CarteRow";
import { CreationCard } from "@/components/ui/CreationCard";
import { Filet } from "@/components/ui/Filet";
import { Marque } from "@/components/ui/Marque";
import { ReserverForm } from "@/components/ui/ReserverForm";
import { ScrollHint } from "@/components/ui/ScrollHint";
import { acteParId } from "@/content/actes";
import { creations } from "@/content/creations";
import { maison } from "@/content/maison";

const AVANT_SCENE = ["citron", "caillou", "savon"];
const pieces = creations.filter((c) => AVANT_SCENE.includes(c.id));

/** Gouttière et rythme d'acte : tout vient des tokens, rien en dur. */
const acte =
  "px-[var(--gouttiere)] py-[var(--rythme-acte)] max-w-[80rem] mx-auto";

export default function Page() {
  return (
    <main>
      {/* 00 — Seuil. Plein jour, plat comme une affiche. */}
      <section
        id="seuil"
        aria-labelledby="seuil-titre"
        className="min-h-svh flex flex-col justify-between px-[var(--gouttiere)] py-[var(--gouttiere)] max-w-[80rem] mx-auto"
      >
        <p className="t-cartel text-fg-38 m-0">
          {maison.ville}
          <span className="mx-2 text-trait-fort" aria-hidden="true">
            ·
          </span>
          depuis {maison.fondation}
        </p>

        <div className="border border-trait p-6 md:p-12 my-12">
          <h1 id="seuil-titre" className="sr-only">
            {maison.nom} — pâtisserie trompe-l&apos;œil
          </h1>
          <Marque as="div" />
          <Filet className="my-8" />
          <p className="t-display-m mesure m-0">{maison.signature}</p>
          <p className="text-fg-70 mesure mt-6 mb-0">{maison.chapo}</p>
        </div>

        <div className="flex flex-wrap items-center gap-6 justify-between">
          <ScrollHint>Descendez, l&apos;affiche va se décoller</ScrollHint>
          <Bouton variante="primaire" href="#maison">
            Réserver
          </Bouton>
        </div>
      </section>

      {/* 01 — La Vitrine. La lumière tombe, l'échelle ment. */}
      <section id="vitrine" aria-labelledby="vitrine-titre" className={acte}>
        <ActeHeading acte={acteParId.vitrine} />
        <div
          className="aspect-16/9 w-full border border-trait grid place-items-center"
          aria-hidden="true"
        >
          <span className="t-cartel text-fg-38">Vitrine</span>
        </div>
      </section>

      {/* 02 — Le Mensonge. Trois pièces, trois coupes. */}
      <section id="mensonge" aria-labelledby="mensonge-titre" className={acte}>
        <ActeHeading acte={acteParId.mensonge} />
        <div className="grid gap-6 md:grid-cols-3">
          {pieces.map((c) => (
            <CreationCard key={c.id} creation={c} />
          ))}
        </div>
      </section>

      {/* 03 — L'Anamorphose. Un seul angle. */}
      <section
        id="anamorphose"
        aria-labelledby="anamorphose-titre"
        className={acte}
      >
        <ActeHeading acte={acteParId.anamorphose} />
        <div
          className="aspect-16/9 w-full border border-trait grid place-items-center"
          aria-hidden="true"
        >
          <span className="t-cartel text-fg-38">Leurre</span>
        </div>
      </section>

      {/* 04 — Les Matières. */}
      <section id="matieres" aria-labelledby="matieres-titre" className={acte}>
        <ActeHeading acte={acteParId.matieres} />
        <ul className="grid gap-6 grid-cols-2 lg:grid-cols-4 list-none p-0 m-0">
          {["Glaçage miroir", "Chocolat tempéré", "Sucre glace", "Marbre"].map(
            (m) => (
              <li key={m}>
                <div
                  className="aspect-square w-full border border-trait mb-4"
                  aria-hidden="true"
                />
                <p className="t-cartel text-fg-70 m-0">{m}</p>
              </li>
            ),
          )}
        </ul>
      </section>

      {/* 05 — La Carte. Le vrai contenu, en HTML pur. */}
      <section id="carte" aria-labelledby="carte-titre" className={acte}>
        <ActeHeading acte={acteParId.carte} />
        <ul className="list-none p-0 m-0">
          {creations.map((c) => (
            <CarteRow key={c.id} creation={c} />
          ))}
        </ul>
        <p className="t-cartel text-fg-38 mt-8 mb-0">
          Allergènes détaillés sur demande à l&apos;atelier.
        </p>
      </section>

      {/* 06 — La Maison. */}
      <section id="maison" aria-labelledby="maison-titre" className={acte}>
        <ActeHeading acte={acteParId.maison} />
        <div className="grid gap-12 lg:grid-cols-2">
          <address className="not-italic">
            <p className="t-display-m m-0">{maison.adresse}</p>
            <p className="t-display-m mt-1 mb-6">{maison.ville}</p>
            <Filet className="mb-6" />
            <p className="t-cartel text-fg-70 m-0">{maison.horaires}</p>
            <p className="t-cartel text-fg-70 mt-3 mb-0">
              <a
                href={`tel:${maison.telephone.replace(/\s/g, "")}`}
                className="hover:text-or transition-colors duration-[var(--d-2)] ease-[var(--ease)]"
              >
                {maison.telephone}
              </a>
              <span className="mx-2 text-trait-fort" aria-hidden="true">
                ·
              </span>
              <a
                href={`mailto:${maison.email}`}
                className="hover:text-or transition-colors duration-[var(--d-2)] ease-[var(--ease)]"
              >
                {maison.email}
              </a>
            </p>
          </address>
          <ReserverForm />
        </div>
      </section>

      <footer className="px-[var(--gouttiere)] pb-16 max-w-[80rem] mx-auto">
        <Filet className="mb-6" />
        <p className="t-cartel text-fg-38 m-0">
          {maison.nom}
          <span className="mx-2 text-trait-fort" aria-hidden="true">
            ·
          </span>
          {maison.signature}
        </p>
      </footer>
    </main>
  );
}
