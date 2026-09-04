import { Bouton } from "@/components/ui/Bouton";
import { Filet } from "@/components/ui/Filet";
import { Marque } from "@/components/ui/Marque";

export default function NotFound() {
  return (
    <main className="relative z-10 min-h-svh flex flex-col justify-between px-[var(--gouttiere)] py-[var(--gouttiere)] max-w-[80rem] mx-auto">
      <Marque variante="horizontal" />
      <div className="py-16">
        <p className="t-cartel text-fg-38 m-0">Pièce 404</p>
        <h1 className="t-display-l mt-4">Pièce introuvable.</h1>
        <Filet className="mt-8 mb-6 max-w-[36rem]" />
        <p className="text-fg-70 mesure m-0">
          Quelqu&apos;un l&apos;a peut-être mangée. La carte, elle, est toujours
          là.
        </p>
      </div>
      <div>
        <Bouton variante="primaire" href="/#carte">
          Voir la carte
        </Bouton>
      </div>
    </main>
  );
}
