import { notFound } from "next/navigation";
import { FicheModale } from "@/components/FicheModale";
import { creationParId, creations } from "@/content/creations";

type Props = { params: Promise<{ id: string }> };

/**
 * La fiche ouverte par-dessus la grille, quand on clique une pièce depuis
 * le site. Le rechargement ou un lien partagé tombent sur la page complète
 * /patisseries/[id].
 */
export default async function Page({ params }: Props) {
  const { id } = await params;
  const c = creationParId[id];
  if (!c) notFound();

  const i = creations.findIndex((x) => x.id === c.id);
  const precedente = creations[(i - 1 + creations.length) % creations.length];
  const suivante = creations[(i + 1) % creations.length];

  return <FicheModale key={c.id} creation={c} precedente={precedente.id} suivante={suivante.id} />;
}
