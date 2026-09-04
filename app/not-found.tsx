import { Bouton } from "@/components/ui/Bouton";

export default function NotFound() {
  return (
    <div className="pt-[calc(var(--barre)+3rem)] px-[var(--gouttiere)] min-h-[60svh]">
      <div className="max-w-[34rem]">
        <p className="t-etiquette text-gris m-0">Erreur 404</p>
        <h1 className="t-grand mt-4">Cette page n&apos;existe pas.</h1>
        <p className="text-gris mt-6 mb-8">Quelqu&apos;un l&apos;a peut-être mangée. Les pâtisseries, elles, sont toujours là.</p>
        <Bouton href="/patisseries" variante="contour">Voir les pâtisseries</Bouton>
      </div>
    </div>
  );
}
