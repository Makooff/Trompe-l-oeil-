/** Filet gravé 1px. L'élévation passe par là, pas par une ombre lourde. */
export function Filet({ className = "" }: { className?: string }) {
  return (
    <hr
      className={`border-0 border-t border-trait m-0 ${className}`}
      aria-hidden="true"
    />
  );
}
