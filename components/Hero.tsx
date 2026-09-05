import { existsSync } from "node:fs";
import { join } from "node:path";
import { RetraitDate } from "./RetraitDate";
import { SequenceCoupe } from "./ui/SequenceCoupe";
import { creationParId } from "@/content/creations";
import { maison } from "@/content/maison";

/**
 * L'accueil en deux blocs, comme une page de click & collect : à gauche le
 * nom, les créations du moment, l'adresse et les horaires ; à droite, sur
 * noir, le jour de retrait. Dessous, la pièce vedette qui s'ouvre au
 * scroll, seulement quand sa séquence vidéo existe (scripts/sequence.mjs).
 */
export function Hero() {
  const vedette = creationParId.citron;
  const sequence = existsSync(join(process.cwd(), "public", "sequences", vedette.id, "manifeste.json"));
  return (
    <>
      <section className="pt-[var(--barre)] grid lg:grid-cols-[1.4fr_1fr]" aria-label="Accueil">
        <div className="bg-fond-doux px-[var(--gouttiere)] py-16 lg:py-24 lg:pl-[max(var(--gouttiere),12vw)]">
          <p className="t-etiquette-l tracking-[0.3em] font-medium m-0">{maison.nom}</p>
          <p className="t-etiquette text-gris mt-12 mb-2">À la commande ou en boutique</p>
          <h1 className="t-grand">Nos créations du moment</h1>
          <address className="not-italic text-gris mt-6">
            {maison.adresse}, {maison.ville}
            <br />
            {maison.horaires[0].jours}, {maison.horaires[0].heures}
            <br />
            {maison.horaires[1].jours}, {maison.horaires[1].heures}
          </address>
        </div>

        <div className="bg-noir text-blanc px-[var(--gouttiere)] py-16 lg:py-24 flex flex-col justify-center">
          <p className="t-etiquette-l m-0 flex items-center gap-3">
            <span className="inline-block h-2 w-2 rounded-full bg-blanc" aria-hidden="true" />
            Planifiez votre retrait en boutique
          </p>
          <h2 className="t-grand mt-6 uppercase font-light leading-[1.02]">
            Je viens chercher
            <br />
            ma commande le
          </h2>
          <div className="mt-8">
            <RetraitDate />
          </div>
        </div>
      </section>

      {sequence && (
        <section className="px-[var(--gouttiere)] pt-16 lg:pt-20 flex flex-col items-center" aria-label="La coupe">
          <div className="w-full max-w-[min(60svh,34rem)]">
            <SequenceCoupe id={vedette.id} faux={vedette.nom} pilotage="bloc" />
          </div>
          <p className="t-etiquette text-gris mt-2 mb-0 text-center">Descendez, la pièce s&apos;ouvre.</p>
        </section>
      )}
    </>
  );
}
