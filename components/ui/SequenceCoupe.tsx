"use client";

import { useEffect, useRef, useState } from "react";
import { clamp01 } from "@/lib/scroll/acts";
import { sAbonner } from "@/lib/scroll/scrollStore";

type Manifeste = {
  images: number;
  largeur: number;
  hauteur: number;
  fps: number;
  motif: string;
};

/**
 * La pièce vit dans le tiers bas de son image (un tiers de marge au-dessus,
 * comme le prompt le demande) : la progression se cale sur son centre, pas
 * sur le haut du bloc. Le scrub commence quand ce centre passe ici, en
 * fraction de l'écran, et finit quand il atteint là.
 */
const CENTRE_PIECE = 0.55;
const ENTREE = 0.9;
const SORTIE = 0.38;

const doux = (t: number) => t * t * (3 - 2 * t);

/**
 * Ordre de chargement des images : la première, la dernière, le milieu, puis
 * les quarts, les huitièmes… Dès trois images, le scrub montre déjà le
 * début, la fin et l'entre-deux ; chaque image suivante affine.
 */
function ordreDeChargement(n: number): number[] {
  const vus = new Set<number>();
  const ordre: number[] = [];
  const pousser = (i: number) => {
    if (!vus.has(i)) {
      vus.add(i);
      ordre.push(i);
    }
  };
  pousser(0);
  pousser(n - 1);
  for (let pas = n - 1; pas >= 1; pas = Math.floor(pas / 2)) {
    for (let i = 0; i < n; i += pas) pousser(i);
    if (pas === 1) break;
  }
  return ordre;
}

/**
 * La coupe pilotée par le scroll, en séquence d'images sur un canvas.
 *
 * Le site ne lit pas la vidéo : chercher une position dans un fichier
 * compressé saccade, surtout sur Safari iOS. Il dessine l'image qui
 * correspond à la progression, dans les deux sens, à la vitesse du doigt.
 * Même composant sur grand écran et sur iPhone.
 *
 * Sans manifeste (pièce pas encore rendue), une image fixe de la pièce
 * fermée prend la place.
 */
export function SequenceCoupe({
  id,
  faux,
  pilotage = "bloc",
  ajustement = "contenir",
  affiche,
  className = "",
}: {
  id: string;
  faux: string;
  /**
   * `bloc` : la progression suit la position du bloc dans l'écran.
   * `page` : elle suit le défilement depuis le haut de la page, pour un
   * hero déjà à l'écran au chargement, qui doit s'ouvrir quand on descend.
   */
  pilotage?: "bloc" | "page" | "epingle";
  /**
   * `contenir` : l'image entière, le cadre prend l'aspect de la séquence.
   * `couvrir` : l'image remplit le cadre, recadrée au centre ; le cadre
   * garde l'aspect donné par `className`.
   */
  ajustement?: "contenir" | "couvrir";
  /** Image affichée avant la première image dessinée, et sans JavaScript. */
  affiche?: string;
  className?: string;
}) {
  const cadre = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [manifeste, setManifeste] = useState<Manifeste | null | undefined>(undefined);

  useEffect(() => {
    let annule = false;
    fetch(`/sequences/${id}/manifeste.json`)
      .then((r) => (r.ok ? r.json() : null))
      .then((m: Manifeste | null) => {
        if (!annule) setManifeste(m);
      })
      .catch(() => {
        if (!annule) setManifeste(null);
      });
    return () => {
      annule = true;
    };
  }, [id]);

  useEffect(() => {
    if (!manifeste) return;
    const el = cadre.current;
    const c = canvas.current;
    const ctx = c?.getContext("2d");
    if (!el || !c || !ctx) return;

    const images: (HTMLImageElement | null)[] = new Array(manifeste.images).fill(null);
    const reduit = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let cible = reduit ? Math.round((manifeste.images - 1) * 0.5) : 0;
    // L'image courante rattrape la cible avec un amorti : un cran de molette
    // saute dix images, l'œil les voit toutes défiler.
    let courant = cible;
    let dessinee = -1;
    let raf = 0;
    let vivant = true;

    const chemin = (i: number) =>
      `/sequences/${id}/${manifeste.motif.replace("%03d", String(i).padStart(3, "0"))}`;

    // L'image la plus proche déjà chargée, pour ne jamais laisser le canvas vide.
    const plusProche = (i: number) => {
      if (images[i]) return images[i];
      for (let d = 1; d < manifeste.images; d++) {
        if (images[i - d]) return images[i - d];
        if (images[i + d]) return images[i + d];
      }
      return null;
    };

    const dimensionner = () => {
      const r = el.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      c.width = Math.round(r.width * dpr);
      c.height = Math.round(r.height * dpr);
      dessinee = -1;
    };

    const dessiner = () => {
      raf = 0;
      const ecart = cible - courant;
      if (Math.abs(ecart) < 0.05) courant = cible;
      else {
        courant += ecart * (reduit ? 1 : 0.16);
        raf = requestAnimationFrame(dessiner);
      }
      const img = plusProche(Math.round(courant));
      if (!img) return;
      const index = images.indexOf(img);
      if (index === dessinee) return;
      dessinee = index;
      ctx.clearRect(0, 0, c.width, c.height);
      // Contenir : l'image entière tient dans le canvas. Couvrir : elle le remplit.
      const k = (ajustement === "couvrir" ? Math.max : Math.min)(c.width / img.naturalWidth, c.height / img.naturalHeight);
      const w = img.naturalWidth * k;
      const h = img.naturalHeight * k;
      ctx.drawImage(img, (c.width - w) / 2, (c.height - h) / 2, w, h);
    };
    const demander = () => {
      if (!raf) raf = requestAnimationFrame(dessiner);
    };

    const mesurer = () => {
      if (reduit) return;
      const h = window.innerHeight;
      let t: number;
      if (pilotage === "page") {
        // La pièce est à l'écran dès le chargement : elle s'ouvre sur les
        // deux premiers tiers d'écran de défilement.
        t = doux(clamp01(window.scrollY / (h * 0.66)));
      } else if (pilotage === "epingle") {
        // Le bloc est collé dans une section plus haute que l'écran
        // ([data-epingle]) : la coupe suit la traversée de cette section.
        const r = (el.closest("[data-epingle]") ?? el).getBoundingClientRect();
        t = doux(clamp01(-r.top / Math.max(1, r.height - h)));
      } else {
        const r = el.getBoundingClientRect();
        const centre = r.top + r.height * CENTRE_PIECE;
        t = doux(clamp01((h * ENTREE - centre) / (h * (ENTREE - SORTIE))));
      }
      cible = Math.round(t * (manifeste.images - 1));
      demander();
    };

    // Chargement progressif, deux images à la fois.
    const ordre = ordreDeChargement(manifeste.images);
    let curseur = 0;
    const charger = () => {
      if (!vivant || curseur >= ordre.length) return;
      const i = ordre[curseur++];
      const img = new Image();
      img.decoding = "async";
      img.onload = () => {
        images[i] = img;
        demander();
        charger();
      };
      img.onerror = charger;
      img.src = chemin(i);
    };
    charger();
    charger();

    const ro = new ResizeObserver(() => {
      dimensionner();
      demander();
    });
    ro.observe(el);
    dimensionner();
    const stop = sAbonner(mesurer);
    mesurer();
    demander();

    return () => {
      vivant = false;
      ro.disconnect();
      stop();
      cancelAnimationFrame(raf);
    };
  }, [manifeste, id, pilotage, ajustement]);

  const ratio = ajustement === "couvrir" ? undefined : manifeste ? `${manifeste.largeur} / ${manifeste.hauteur}` : "4 / 5";

  return (
    <div
      ref={cadre}
      className={`relative w-full overflow-hidden ${className}`}
      style={{ aspectRatio: ratio }}
      role="img"
      aria-label={`${faux}, la pièce s'ouvre en deux au défilement`}
    >
      {(affiche || manifeste === null) && (
        // Avant la première image dessinée, ou sans séquence : une image fixe.
        <img
          src={affiche ?? `/pieces/${id}/ferme-1024.webp`}
          alt=""
          decoding="async"
          className={`absolute inset-0 h-full w-full ${ajustement === "couvrir" ? "object-cover" : "object-contain"}`}
        />
      )}
      <canvas ref={canvas} className="absolute inset-0 h-full w-full" aria-hidden="true" />
    </div>
  );
}
