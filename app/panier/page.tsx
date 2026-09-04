import type { Metadata } from "next";
import { PanierClient } from "@/components/PanierClient";

export const metadata: Metadata = { title: "Panier" };

export default function Page() {
  return (
    <div className="pt-[calc(var(--barre)+3rem)] px-[var(--gouttiere)]">
      <PanierClient />
    </div>
  );
}
