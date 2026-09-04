import { NextResponse } from "next/server";
import { creationParId } from "@/content/creations";

type Ligne = { id: string; quantite: number };

type Charge =
  | { type: "newsletter"; email: string }
  | {
      type: "commande";
      nom: string;
      email: string;
      telephone: string;
      retrait: string;
      note?: string;
      lignes: Ligne[];
    };

/**
 * Reçoit une commande de retrait ou une inscription et la transmet au webhook
 * configuré dans COMMANDE_WEBHOOK_URL (Make, Zapier, n8n, Formspree ou un
 * service d'e-mail). Sans webhook, la requête réussit et la commande est
 * journalisée côté serveur : le site reste utilisable en démonstration.
 */
export async function POST(req: Request) {
  let charge: Charge;
  try {
    charge = (await req.json()) as Charge;
  } catch {
    return NextResponse.json({ erreur: "Corps illisible." }, { status: 400 });
  }

  if (charge.type === "newsletter") {
    if (!/^\S+@\S+\.\S+$/.test(charge.email ?? "")) {
      return NextResponse.json({ erreur: "Courriel invalide." }, { status: 400 });
    }
  } else if (charge.type === "commande") {
    if (!charge.nom || !/^\S+@\S+\.\S+$/.test(charge.email ?? "") || !charge.retrait) {
      return NextResponse.json({ erreur: "Champs manquants." }, { status: 400 });
    }
    const lignes = (charge.lignes ?? []).filter((l) => creationParId[l.id] && l.quantite > 0);
    if (lignes.length === 0) {
      return NextResponse.json({ erreur: "Panier vide." }, { status: 400 });
    }
    charge = { ...charge, lignes };
  } else {
    return NextResponse.json({ erreur: "Type inconnu." }, { status: 400 });
  }

  const webhook = process.env.COMMANDE_WEBHOOK_URL;
  const recap = resumer(charge);

  if (webhook) {
    const r = await fetch(webhook, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...charge, recap, recu: new Date().toISOString() }),
    }).catch(() => null);
    if (!r?.ok) {
      return NextResponse.json({ erreur: "Envoi impossible pour le moment." }, { status: 502 });
    }
  } else {
    console.info("[commande] aucun webhook configuré\n" + recap);
  }

  return NextResponse.json({ ok: true, recap });
}

function resumer(c: Charge) {
  if (c.type === "newsletter") return `Nouvelle inscription : ${c.email}`;
  const total = c.lignes.reduce((t, l) => t + creationParId[l.id].prixEuros * l.quantite, 0);
  const lignes = c.lignes.map((l) => `${l.quantite} × ${creationParId[l.id].nom} (${creationParId[l.id].prixEuros * l.quantite} €)`);
  return [
    `Commande de ${c.nom} (${c.email}, ${c.telephone})`,
    `Retrait : ${c.retrait}`,
    ...lignes,
    `Total : ${total} €`,
    c.note ? `Note : ${c.note}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}
