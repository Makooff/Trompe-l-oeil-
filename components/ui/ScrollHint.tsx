/** Invite à descendre, posée discrètement en bas du premier écran. */
export function ScrollHint({ children }: { children: React.ReactNode }) {
  return (
    <p className="t-cartel text-fg-38 flex items-center gap-3 m-0">
      <span
        aria-hidden="true"
        className="inline-block w-10 border-t border-trait-fort"
      />
      {children}
    </p>
  );
}
