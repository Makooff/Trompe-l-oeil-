/**
 * La marque. Le signe : un disque coupé en deux, la moitié droite
 * légèrement décalée, comme la pièce sous la lame. Le nom en Fraunces.
 */
export function Signe({ taille = 22, className = "" }: { taille?: number; className?: string }) {
  return (
    <svg width={taille} height={taille} viewBox="0 0 32 32" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M14.5 3.1A13 13 0 0 0 14.5 28.9Z" />
      <path d="M17.5 5.1A13 13 0 0 1 17.5 30.9Z" transform="translate(1.6 0)" />
    </svg>
  );
}

export function Marque({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <Signe />
      <span className="font-display text-[1.25rem] leading-none tracking-[-0.01em] [font-variation-settings:'SOFT'_100]">
        Maison Leurre
      </span>
    </span>
  );
}
