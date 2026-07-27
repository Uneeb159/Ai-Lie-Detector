import { AppShell } from "@/components/app-shell";
import { SignalCard } from "@/components/signal-card";
import { scamPatterns } from "@/lib/scam-patterns";

export default function PatternsPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-[1320px] px-4 py-8 md:px-8 lg:px-12">
        <p className="font-mono text-xs uppercase tracking-[0.1em] text-signal">Forensic database</p>
        <h1 className="mt-2 font-display text-3xl font-semibold md:text-4xl">Pattern library</h1>
        <p className="mt-2 max-w-3xl text-sm text-muted">Seed patterns are a reference set for common scams and manipulation styles. Use them to sanity-check suspicious wording, then verify through official channels.</p>
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {scamPatterns.map((pattern) => (
            <SignalCard key={pattern.id} className="group p-5 transition hover:-translate-y-1 hover:border-signal/35 hover:shadow-signal">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="font-display text-xl font-semibold">{pattern.title}</h2>
                <span className="rounded border border-amber/35 bg-amber/10 px-2 py-1 font-mono text-xs uppercase text-amber">{pattern.risk}</span>
              </div>
              <p className="rounded border border-white/10 bg-black/25 p-3 font-mono text-sm leading-6 text-muted">"{pattern.example}"</p>
              <div className="mt-4 flex items-center justify-between gap-3">
                <span className="rounded border border-white/10 px-2 py-1 font-mono text-[11px] uppercase tracking-[0.08em] text-muted">
                  {pattern.category.replaceAll("_", " ")}
                </span>
                <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-signal/80">Common cues</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {pattern.warningSigns.map((sign) => (
                  <span key={sign} className="rounded border border-white/10 px-2 py-1 font-mono text-xs text-muted group-hover:border-signal/25">
                    {sign}
                  </span>
                ))}
              </div>
              <div className="mt-4 grid gap-2 rounded border border-white/10 bg-white/[0.03] p-3">
                <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-signal">Safe actions</p>
                {pattern.safeActions.map((action) => (
                  <p key={action} className="text-sm text-muted">- {action}</p>
                ))}
              </div>
            </SignalCard>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
