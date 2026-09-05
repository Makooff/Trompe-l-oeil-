import { existsSync } from "node:fs";
import { join } from "node:path";
import { Bouton } from "./ui/Bouton";
import { srcSetPiece } from "@/lib/pieces";

const LARGEURS = [960, 1600, 2400];

/**
 * Un bandeau pleine largeur, texte centré sur la photo, comme le bloc
 * « Créations » de la référence. La photo vient de public/bandeau/<nom>
 * (voir scripts/bandeau.mjs) ; tant qu'elle n'existe pas, une pièce de
 * la collection tient la place.
 */
export function Bandeau({
  nom,
  etiquette,
  titre,
  action,
  repli = "poire",
}: {
  nom: string;
  etiquette: string;
  titre: string;
  action: { href: string; label: string };
  repli?: string;
}) {
  const disponible = existsSync(join(process.cwd(), "public", "bandeau", `${nom}-1600.webp`));
  const srcSet = (format: "avif" | "webp") =>
    disponible
      ? LARGEURS.map((l) => `/bandeau/${nom}-${l}.${format} ${l}w`).join(", ")
      : srcSetPiece(repli, "ferme", format);
  const src = disponible ? `/bandeau/${nom}-1600.webp` : `/pieces/${repli}/ferme-2048.webp`;

  return (
    <section className="px-[var(--gouttiere)] mt-[var(--section)]" aria-labelledby={`bandeau-${nom}`}>
      <div className="relative overflow-hidden rounded-image bg-fond-doux aspect-4/5 md:aspect-video lg:aspect-[16/6]">
        <picture>
          <source type="image/avif" srcSet={srcSet("avif")} sizes="100vw" />
          <img
            src={src}
            srcSet={srcSet("webp")}
            sizes="100vw"
            alt=""
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </picture>
        <div className="absolute inset-0 bg-noir/15" aria-hidden="true" />
        <div className="relative h-full flex flex-col items-center justify-center text-center text-blanc px-6">
          <p className="t-etiquette-l m-0">{etiquette}</p>
          <h2
            id={`bandeau-${nom}`}
            className="m-0 mt-2 font-light leading-none tracking-[var(--ls-grand)] text-[clamp(3.5rem,9vw,7.5rem)]"
          >
            {titre}
          </h2>
          <Bouton href={action.href} variante="clair" className="mt-8">
            {action.label}
          </Bouton>
        </div>
      </div>
    </section>
  );
}
