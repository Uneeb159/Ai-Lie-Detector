"use client";

import { CheckCircle2, CircleDashed } from "lucide-react";
import { motion } from "framer-motion";

const layers = ["Identity pressure", "Payment request", "Urgency language", "Credential risk", "Known scam patterns"];

export function ScanProgress() {
  return (
    <div className="relative overflow-hidden rounded-md border border-signal/30 bg-[#101414] p-5 shadow-signal">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-signal/35 to-transparent blur-md animate-scan" />
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.1em] text-signal">Active analysis</p>
          <h2 className="font-display text-2xl font-semibold text-ink">Reading signal layers</h2>
        </div>
        <CircleDashed className="size-7 animate-spin text-signal" />
      </div>
      <div className="grid gap-3">
        {layers.map((layer, index) => (
          <motion.div
            key={layer}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.18 }}
            className="flex items-center justify-between rounded border border-white/10 bg-white/[0.03] px-4 py-3"
          >
            <span className="font-mono text-sm text-muted">{layer}</span>
            <CheckCircle2 className="size-4 text-signal" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
