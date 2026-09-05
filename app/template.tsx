/** Chaque page entre par un fondu court (globals.css, .page-entree). */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-entree">{children}</div>;
}
