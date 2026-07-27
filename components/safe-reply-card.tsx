"use client";

import { Copy } from "lucide-react";
import { useState } from "react";

export function SafeReplyCard({ replies }: { replies: string[] }) {
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(replies[active]);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {["Neutral", "Firm", "Verify first"].map((tone, index) => (
          <button
            key={tone}
            onClick={() => setActive(Math.min(index, replies.length - 1))}
            className={`rounded border px-3 py-2 font-mono text-xs uppercase tracking-[0.1em] transition ${
              active === Math.min(index, replies.length - 1) ? "border-signal bg-signal/15 text-signal" : "border-white/10 text-muted hover:border-signal/40"
            }`}
          >
            {tone}
          </button>
        ))}
      </div>
      <div className="rounded border border-signal/25 bg-black/30 p-4">
        <p className="min-h-16 font-mono text-sm leading-6 text-ink">{replies[active]}</p>
        <button onClick={copy} className="mt-4 inline-flex items-center gap-2 rounded bg-signal px-3 py-2 text-sm font-semibold text-black shadow-signal transition hover:brightness-110">
          <Copy className="size-4" />
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
    </div>
  );
}
