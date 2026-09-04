import Link from "next/link";
import { maison } from "@/content/maison";
import { Newsletter } from "./Newsletter";

export function Footer() {
  return (
    <footer className="border-t border-filet mt-[var(--section)]">
      <div className="px-[var(--gouttiere)] py-14 grid gap-12 md:grid-cols-[1.2fr_1fr_1fr_1fr]">
        <div>
          <p className="t-etiquette-l tracking-[0.22em] font-medium m-0">{maison.nom}</p>
          <p className="text-gris mt-3 mb-0 max-w-[26rem]">{maison.accroche}. {maison.retrait}</p>
        </div>

        <div>
          <p className="t-etiquette text-gris m-0 mb-4">Boutique</p>
          <address className="not-italic">
            <p className="m-0">{maison.adresse}</p>
            <p className="m-0">{maison.ville}</p>
            <p className="m-0 mt-3">
              <a href={`tel:${maison.telephone.replace(/\s/g, "")}`} className="lien">
                {maison.telephone}
              </a>
            </p>
            <p className="m-0">
              <a href={`mailto:${maison.email}`} className="lien">
                {maison.email}
              </a>
            </p>
          </address>
        </div>

        <div>
          <p className="t-etiquette text-gris m-0 mb-4">Horaires</p>
          <ul className="list-none p-0 m-0 grid gap-1">
            {maison.horaires.map((h) => (
              <li key={h.jours} className="flex justify-between gap-4">
                <span>{h.jours}</span>
                <span className="text-gris">{h.heures}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="t-etiquette text-gris m-0 mb-4">Nouveautés</p>
          <Newsletter />
          <p className="mt-6 mb-0">
            <a href={`https://instagram.com/${maison.instagram}`} className="lien" rel="noreferrer">
              Instagram
            </a>
          </p>
        </div>
      </div>

      <div className="px-[var(--gouttiere)] py-5 border-t border-filet flex flex-wrap justify-between gap-4 t-etiquette text-gris">
        <span>© {new Date().getFullYear()} {maison.nom}</span>
        <span className="flex gap-6">
          <Link href="/la-maison" className="lien">La maison</Link>
          <Link href="/patisseries" className="lien">Pâtisseries</Link>
        </span>
      </div>
    </footer>
  );
}
