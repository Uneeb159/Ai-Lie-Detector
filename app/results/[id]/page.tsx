"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, CalendarDays, ShieldAlert, Sparkles } from "lucide-react";
import { AnnotatedMessage } from "@/components/annotated-message";
import { AppShell } from "@/components/app-shell";
import { RiskGauge } from "@/components/risk-gauge";
import { SafeReplyCard } from "@/components/safe-reply-card";
import { SignalCard } from "@/components/signal-card";
import { getResult } from "@/lib/storage";
import type { AnalysisResult } from "@/types/analysis";

export default function ResultPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const cached = window.sessionStorage.getItem(`scan-result:${id}`);
    setResult(cached ? JSON.parse(cached) : getResult(id) ?? null);
    setIsLoaded(true);
  }, [id]);

  if (!isLoaded) {
    return (
      <AppShell>
        <div className="mx-auto max-w-3xl px-4 py-12">
          <SignalCard className="p-6">
            <p className="text-muted">Loading result...</p>
          </SignalCard>
        </div>
      </AppShell>
    );
  }

  if (!result) {
    return (
      <AppShell>
        <div className="mx-auto max-w-3xl px-4 py-12">
          <SignalCard className="p-6">
            <p className="text-muted">Result not found in this browser.</p>
            <Link href="/scan" className="mt-4 inline-block text-signal">Return to scan</Link>
          </SignalCard>
        </div>
      </AppShell>
    );
  }

  const risk = result.riskScore >= 85 ? "text-danger" : result.riskScore >= 30 ? "text-amber" : "text-safe";

  return (
    <AppShell>
      <div className="mx-auto max-w-[1320px] px-4 py-6 md:px-8 lg:px-12">
        <Link href="/scan" className="mb-5 inline-flex items-center gap-2 text-sm text-muted hover:text-signal">
          <ArrowLeft className="size-4" />
          New scan
        </Link>
        <div className="grid gap-5 lg:grid-cols-[420px_1fr]">
          <SignalCard className="relative overflow-hidden p-5">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-signal/70 shadow-signal" />
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <ShieldAlert className={`size-7 ${risk}`} />
                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.1em] text-muted">Verdict</p>
                  <h1 className="font-display text-2xl font-semibold capitalize">{result.verdict.replaceAll("_", " ")}</h1>
                </div>
              </div>
              <div className="rounded border border-white/10 bg-white/[0.03] px-3 py-2 text-left sm:text-right">
                <p className="font-mono text-xs uppercase tracking-[0.1em] text-muted">Confidence</p>
                <p className="font-mono text-sm capitalize text-ink">{result.confidence}</p>
              </div>
            </div>
            <RiskGauge score={result.riskScore} />
            <div className="mt-4 rounded border border-white/10 bg-white/[0.03] p-4">
              <p className="font-mono text-xs uppercase tracking-[0.1em] text-signal">Summary</p>
              <p className="mt-2 text-sm leading-6 text-muted">{result.summaryReason}</p>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {result.detectedTactics.map((tactic) => (
                <span key={tactic} className="rounded border border-signal/25 bg-signal/10 px-2 py-1 font-mono text-xs uppercase tracking-[0.08em] text-signal">
                  {tactic.replaceAll("_", " ")}
                </span>
              ))}
            </div>
            <div className="mt-4 grid gap-3 rounded border border-white/10 bg-black/20 p-4 text-sm text-muted">
              <div className="flex items-center gap-2 text-signal">
                <Sparkles className="size-4" />
                Why this matters
              </div>
              <p>This screen is a guidance aid, not a certainty engine. Verify anything sensitive through official channels before responding.</p>
              <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.1em] text-muted">
                <CalendarDays className="size-4" />
                {new Date(result.createdAt).toLocaleString()}
              </div>
            </div>
          </SignalCard>

          <div className="grid gap-5">
            <SignalCard className="p-5">
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.1em] text-signal">Message Forensics</p>
                  <h2 className="font-display text-2xl font-semibold">Evidence breakdown</h2>
                </div>
                <p className="max-w-sm text-sm text-muted sm:text-right">Highlighted phrases are redacted-safe excerpts mapped to the score, so you can inspect what triggered the result.</p>
              </div>
              <AnnotatedMessage result={result} />
            </SignalCard>
            <div className="grid gap-5 lg:grid-cols-2">
              <SignalCard className="p-5">
                <h2 className="mb-4 font-display text-xl font-semibold">Safe action plan</h2>
                <div className="grid gap-3">
                  {result.safeActions.map((action, index) => (
                    <div key={action} className="rounded border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-muted">
                      <span className="mr-3 font-mono text-signal">0{index + 1}</span>
                      {action}
                    </div>
                  ))}
                </div>
              </SignalCard>
              <SignalCard className="p-5">
                <h2 className="mb-4 font-display text-xl font-semibold">Safe reply</h2>
                <SafeReplyCard replies={result.safeReplyOptions} />
              </SignalCard>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
