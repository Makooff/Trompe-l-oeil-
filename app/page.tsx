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
const numeroDe = (id: string) =>
  String(creations.findIndex((c) => c.id === id) + 1).padStart(2, "0");

const MATIERES = ["Glaçage miroir", "Chocolat tempéré", "Sucre glace", "Marbre"];

/** Gouttière et rythme d'acte, tirés des tokens. Rien en dur. */
const acte =
  "px-[var(--gouttiere)] py-[var(--rythme-acte)] max-w-[80rem] mx-auto";

/**
 * Emplacement d'un acte 3D.
 *
 * Par défaut il ne peint rien et laisse passer le canvas persistant. `plein`
 * garde un aplat là où la scène n'arrive pas encore, pour éviter un trou dans
 * la page.
 */
function Socle({ ratio, plein = false }: { ratio: string; plein?: boolean }) {
  return (
    <div
      className={`${ratio} w-full ${plein ? "bg-bg-eleve" : ""}`}
      aria-hidden="true"
    />
  );
}

export default function Page() {
  return (
    <main className="relative z-10">
      {/* 00. Seuil, en plein jour, plat comme une affiche. Une seule
          dominante, le nom. Le blanc le porte, aucun cadre n'est nécessaire. */}
      <section
        id="seuil"
        aria-labelledby="seuil-titre"
        className="min-h-svh flex flex-col justify-between px-[var(--gouttiere)] py-[var(--gouttiere)] max-w-[80rem] mx-auto"
      >
        <div className="flex items-center justify-between gap-6">
          <Marque variante="horizontal" />
          <p className="t-cartel text-fg-38 m-0">
            {maison.ville}
            <span className="mx-2 text-trait-fort" aria-hidden="true">
              ·
            </span>
            depuis {maison.fondation}
          </p>
        </div>

        <div className="py-16">
          <h1 id="seuil-titre" className="sr-only">
            {maison.nom}, pâtisserie trompe-l&apos;œil
          </h1>
          <Marque as="div" />
          <Filet className="mt-12 mb-8 max-w-[36rem]" />
          <p className="t-display-m mesure m-0">{maison.signature}</p>
        </div>

        <div className="flex flex-wrap items-center gap-6 justify-between">
          <ScrollHint>Descendez, l&apos;affiche va se décoller</ScrollHint>
          <Bouton variante="primaire" href="#maison">
            Réserver
          </Bouton>
        </div>
      </section>

      {/* 01. La Vitrine, où la lumière tombe et la taille trompe. */}
      <section id="vitrine" aria-labelledby="vitrine-titre" className={acte}>
        <ActeHeading acte={acteParId.vitrine} />
        <Socle ratio="aspect-16/9" />
      </section>

      {/* 02. Le Mensonge, trois pièces ouvertes sur leur coupe. */}
      <section id="mensonge" aria-labelledby="mensonge-titre" className={acte}>
        <ActeHeading acte={acteParId.mensonge} />
        <div className="grid gap-6 md:grid-cols-3">
          {creations
            .filter((c) => AVANT_SCENE.includes(c.id))
            .map((c) => (
              <CreationCard key={c.id} creation={c} numero={numeroDe(c.id)} />
            ))}
        </div>
      </section>

      {/* 03. L'Anamorphose, lisible depuis un seul angle. */}
      <section
        id="anamorphose"
        aria-labelledby="anamorphose-titre"
        className={acte}
      >
        <ActeHeading acte={acteParId.anamorphose} />
        <Socle ratio="aspect-16/9" />
      </section>

      {/* 04. Les Matières. */}
      <section id="matieres" aria-labelledby="matieres-titre" className={acte}>
        <ActeHeading acte={acteParId.matieres} />
        <ul className="grid gap-6 grid-cols-2 lg:grid-cols-4 list-none p-0 m-0">
          {MATIERES.map((m) => (
            <li key={m}>
              <Socle ratio="aspect-square" plein />
              <p className="t-cartel text-fg-70 mt-4 mb-0">{m}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* 05. La Carte, le contenu réel, en HTML. */}
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

      {/* 06. La Maison. */}
      <section id="maison" aria-labelledby="maison-titre" className={acte}>
        <ActeHeading acte={acteParId.maison} />
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
          <div>
            <p className="text-fg-70 mesure mt-0 mb-12">{maison.chapo}</p>
            <address className="not-italic">
              <p className="t-display-m m-0">{maison.adresse}</p>
              <p className="t-display-m mt-1 mb-8">{maison.ville}</p>
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
          </div>
          <ReserverForm />
        </div>
      </section>

      <footer className="px-[var(--gouttiere)] pb-16 max-w-[80rem] mx-auto">
        <Filet className="mb-6" />
        <div className="flex flex-wrap items-center justify-between gap-6">
          <Marque variante="horizontal" />
          <p className="t-cartel text-fg-38 m-0">{maison.devise}</p>
        </div>
      </footer>
    </main>
  );
}
