import type { Metadata } from "next";
import { Bouton } from "@/components/ui/Bouton";
import { maison } from "@/content/maison";
import { srcSetPiece } from "@/lib/pieces";

export const metadata: Metadata = { title: "La maison" };

export default function Page() {
  return (
    <div className="pt-[calc(var(--barre)+3rem)] px-[var(--gouttiere)]">
      <div className="grid gap-12 lg:grid-cols-2 lg:gap-20 items-start">
        <div className="max-w-[32rem]">
          <p className="t-etiquette text-gris m-0">La maison</p>
          <h1 className="t-grand mt-4">Rue de la Coupe, depuis {maison.fondation}.</h1>
          <p className="text-gris mt-6">{maison.presentation}</p>
          <p className="text-gris">
            Tout est fait à Mons, dans l&apos;atelier derrière la boutique : les coques sont moulées le matin, les
            crémeux montés la veille, les glaçages posés au dernier moment. Nous ne livrons pas, nous ne
            congelons pas. Vous commandez, nous préparons, vous passez.
          </p>
          <div className="mt-10 grid gap-8 sm:grid-cols-2">
            <div>
              <p className="t-etiquette text-gris m-0 mb-3">Adresse</p>
              <address className="not-italic">
                {maison.adresse}
                <br />
                {maison.ville}, {maison.pays}
              </address>
            </div>
            <div>
              <p className="t-etiquette text-gris m-0 mb-3">Horaires</p>
              <ul className="list-none p-0 m-0 grid gap-1">
                {maison.horaires.map((h) => (
                  <li key={h.jours} className="flex justify-between gap-4">
                    <span>{h.jours}</span>
                    <span className="text-gris">{h.heures}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-10 flex flex-wrap gap-4">
            <Bouton href={`tel:${maison.telephone.replace(/\s/g, "")}`} variante="contour">
              {maison.telephone}
            </Bouton>
            <Bouton href={`mailto:${maison.email}`} variante="contour">
              Nous écrire
            </Bouton>
          </div>
        </div>

        <div className="grid gap-4 grid-cols-2">
          {["poire", "caillou", "oeuf", "noisette"].map((id) => (
            <div key={id} className="aspect-4/5 bg-fond-doux overflow-hidden rounded-image">
              <img
                src={`/pieces/${id}/ferme-1024.webp`}
                srcSet={srcSetPiece(id, "ferme", "webp")}
                sizes="(min-width: 64rem) 25vw, 50vw"
                alt=""
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
