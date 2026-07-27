import type { AnalysisResult } from "@/types/analysis";

const severityClass = {
  low: "border-safe/40 bg-safe/10 text-safe",
  medium: "border-amber/40 bg-amber/10 text-amber",
  high: "border-danger/50 bg-danger/10 text-danger"
};

export function AnnotatedMessage({ result }: { result: AnalysisResult }) {
  return (
    <div className="space-y-4">
      <div className="rounded border border-white/10 bg-black/25 p-4 font-mono text-sm leading-7 text-ink">
        {result.redactedText || result.inputText}
      </div>
      <div className="grid gap-3">
        {result.evidence.length === 0 ? (
          <p className="rounded border border-white/10 bg-white/[0.03] p-4 text-sm text-muted">No specific high-risk phrase was isolated. Verify any unusual request before acting.</p>
        ) : (
          result.evidence.map((item) => (
            <article key={`${item.quote}-${item.tactic}`} className={`rounded border p-4 transition hover:-translate-y-0.5 ${severityClass[item.severity]}`}>
              <p className="mb-2 font-mono text-xs uppercase tracking-[0.1em]">{item.tactic.replaceAll("_", " ")}</p>
              <p className="mb-2 text-sm text-ink">"{item.quote}"</p>
              <p className="text-sm text-muted">{item.explanation}</p>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
