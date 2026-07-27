"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Archive, Trash2 } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { SignalCard } from "@/components/signal-card";
import { clearHistory, deleteResult, loadHistory } from "@/lib/storage";
import type { AnalysisResult } from "@/types/analysis";

export default function HistoryPage() {
  const [items, setItems] = useState<AnalysisResult[]>([]);

  function refresh() {
    setItems(loadHistory());
  }

  useEffect(refresh, []);

  return (
    <AppShell>
      <div className="mx-auto max-w-[1100px] px-4 py-8 md:px-8 lg:px-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.1em] text-signal">Local archive</p>
            <h1 className="mt-2 font-display text-3xl font-semibold md:text-4xl">History</h1>
            <p className="mt-2 max-w-2xl text-sm text-muted">Saved scans remain local to this browser. Open any item to revisit evidence, actions, and safe replies.</p>
          </div>
          <button
            onClick={() => {
              clearHistory();
              refresh();
            }}
            className="inline-flex items-center gap-2 rounded border border-danger/35 px-3 py-2 text-sm text-danger hover:bg-danger/10"
          >
            <Trash2 className="size-4" />
            Delete all
          </button>
        </div>
        <div className="mt-6 grid gap-4">
          {items.length === 0 ? (
            <SignalCard className="p-6 text-muted">
              <div className="flex items-center gap-3">
                <Archive className="size-5 text-signal" />
                <div>
                  <p className="font-medium text-ink">No saved local scans yet.</p>
                  <p className="mt-1 text-sm text-muted">Turn on history in settings and complete a scan to populate this archive.</p>
                </div>
              </div>
            </SignalCard>
          ) : (
            items.map((item) => (
              <SignalCard key={item.id} className="p-4 transition hover:-translate-y-0.5 hover:border-signal/25">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <Link href={`/results/${item.id}`} className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-mono text-3xl font-bold text-signal">{item.riskScore}%</span>
                      <span className="rounded border border-white/10 px-2 py-1 font-mono text-xs uppercase text-muted">{item.verdict.replaceAll("_", " ")}</span>
                      <span className="text-xs text-muted">{new Date(item.createdAt).toLocaleString()}</span>
                    </div>
                    <p className="mt-3 line-clamp-2 font-mono text-sm leading-6 text-muted">{item.redactedText}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {item.detectedTactics.slice(0, 4).map((tactic) => (
                        <span key={tactic} className="rounded border border-signal/20 bg-signal/10 px-2 py-1 font-mono text-[11px] uppercase tracking-[0.08em] text-signal">
                          {tactic.replaceAll("_", " ")}
                        </span>
                      ))}
                    </div>
                  </Link>
                  <button
                    onClick={() => {
                      deleteResult(item.id);
                      refresh();
                    }}
                    className="rounded border border-white/10 p-2 text-muted hover:border-danger/40 hover:text-danger"
                    aria-label="Delete result"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </SignalCard>
            ))
          )}
        </div>
      </div>
    </AppShell>
  );
}
