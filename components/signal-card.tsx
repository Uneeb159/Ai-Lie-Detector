export function SignalCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={`rounded-md border border-white/10 bg-panel/82 backdrop-blur-xl ${className}`}>{children}</section>;
}
