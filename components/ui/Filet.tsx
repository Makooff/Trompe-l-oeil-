/** Filet gravé de 1px. L'élévation passe par lui plutôt que par une ombre. */
export function Filet({ className = "" }: { className?: string }) {
  return (
    <hr
      className={`border-0 border-t border-trait m-0 ${className}`}
      aria-hidden="true"
    />
  );
}
