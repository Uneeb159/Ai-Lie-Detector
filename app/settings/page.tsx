"use client";

import { useEffect, useState } from "react";
import { BellRing, Lock, SlidersHorizontal } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { SignalCard } from "@/components/signal-card";
import { AppSettings, defaultSettings, loadSettings, saveSettings } from "@/lib/storage";

export default function SettingsPage() {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);

  useEffect(() => setSettings(loadSettings()), []);

  function update(next: AppSettings) {
    setSettings(next);
    saveSettings(next);
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-[900px] px-4 py-8 md:px-8 lg:px-12">
        <p className="font-mono text-xs uppercase tracking-[0.1em] text-signal">System configuration</p>
        <h1 className="mt-2 font-display text-3xl font-semibold md:text-4xl">Settings</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted">Tune how much the app stores, masks, and flags. The default setup favors privacy and cautious analysis.</p>
        <div className="mt-6 grid gap-4">
          <SignalCard className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex gap-3">
                <div className="rounded border border-signal/20 bg-signal/10 p-2 text-signal">
                  <Lock className="size-5" />
                </div>
                <div>
                  <h2 className="font-display text-xl font-semibold">Local history</h2>
                  <p className="mt-1 text-sm text-muted">Save scan results in this browser only.</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.saveHistory}
                onChange={(event) => update({ ...settings, saveHistory: event.target.checked })}
                className="size-5 accent-signal"
              />
            </div>
          </SignalCard>
          <SignalCard className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex gap-3">
                <div className="rounded border border-signal/20 bg-signal/10 p-2 text-signal">
                  <BellRing className="size-5" />
                </div>
                <div>
                  <h2 className="font-display text-xl font-semibold">Redact before analysis</h2>
                  <p className="mt-1 text-sm text-muted">Mask emails, phone numbers, card-like numbers, and codes before server analysis.</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.redactBeforeAnalysis}
                onChange={(event) => update({ ...settings, redactBeforeAnalysis: event.target.checked })}
                className="size-5 accent-signal"
              />
            </div>
          </SignalCard>
          <SignalCard className="p-5">
            <div className="flex items-center gap-3">
              <div className="rounded border border-signal/20 bg-signal/10 p-2 text-signal">
                <SlidersHorizontal className="size-5" />
              </div>
              <div>
                <h2 className="font-display text-xl font-semibold">Sensitivity</h2>
                <p className="mt-1 text-sm text-muted">Lower values stay conservative, higher values flag more borderline manipulation.</p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {(["low", "balanced", "high"] as const).map((value) => (
                <button
                  key={value}
                  onClick={() => update({ ...settings, sensitivity: value })}
                  className={`rounded border px-4 py-2 font-mono text-xs uppercase tracking-[0.1em] transition ${
                    settings.sensitivity === value ? "border-signal bg-signal/15 text-signal" : "border-white/10 text-muted hover:border-signal/35"
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
          </SignalCard>
        </div>
      </div>
    </AppShell>
  );
}
