import { SequenceCoupe } from "./ui/SequenceCoupe";
import { maison } from "@/content/maison";

/**
 * L'accueil s'ouvre sur la pièce, seule sur blanc. Le scroll la coupe en
 * deux. Une ligne de texte dessous, et rien d'autre à l'écran.
 */
export function Hero() {
  return (
    <section className="min-h-svh pt-[var(--barre)] flex flex-col items-center justify-center px-[var(--gouttiere)]" aria-label="Accueil">
      <div className="w-full max-w-[min(72svh,42rem)]">
        <SequenceCoupe id="citron" faux="Citron" pilotage="page" />
      </div>
      <div className="text-center mt-2 mb-10">
        <h1 className="t-moyen">Un citron qui n&apos;en est pas un.</h1>
        <p className="t-etiquette text-gris mt-4 mb-0">{maison.accroche}</p>
      </div>
    </section>
  );
}
