"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Camera, ImageUp, Loader2, Radar, ShieldCheck, Upload } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { ScanProgress } from "@/components/scan-progress";
import { SignalCard } from "@/components/signal-card";
import { normalizeOcrText } from "@/lib/ocr";
import { loadSettings, saveResult } from "@/lib/storage";
import type { AnalysisResult, InputType, RequestedAction, SenderType } from "@/types/analysis";

const sample = "URGENT: Your bank account will be suspended today. Verify your login code at http://bank-secure-check.example and send the OTP now.";

export default function ScanPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [text, setText] = useState("");
  const [inputType, setInputType] = useState<InputType>("text");
  const [senderType, setSenderType] = useState<SenderType>("unknown");
  const [requestedAction, setRequestedAction] = useState<RequestedAction>("none");
  const [error, setError] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [isOcring, setIsOcring] = useState(false);
  const [ocrStatus, setOcrStatus] = useState("");
  const [ocrFileName, setOcrFileName] = useState("");
  const [ocrPreviewUrl, setOcrPreviewUrl] = useState("");

  async function analyze() {
    setError("");
    if (!text.trim()) {
      setError("Paste a message first.");
      return;
    }
    setIsScanning(true);
    const settings = loadSettings();
    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, inputType, senderType, requestedAction, settings })
    });
    const payload = await response.json();
    await new Promise((resolve) => window.setTimeout(resolve, 1700));
    setIsScanning(false);
    if (!response.ok) {
      setError(payload.error ?? "Analysis could not finish. Your draft is still here.");
      return;
    }
    const result = payload as AnalysisResult;
    if (settings.saveHistory) saveResult(result);
    window.sessionStorage.setItem(`scan-result:${result.id}`, JSON.stringify(result));
    router.push(`/results/${result.id}`);
  }

  async function handleOcrUpload(file: File | null) {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("OCR could not read this image. Try a clearer screenshot or paste the text.");
      return;
    }

    setError("");
    setInputType("screenshot");
    setOcrFileName(file.name);
    const previewUrl = window.URL.createObjectURL(file);
    setOcrPreviewUrl((current) => {
      if (current) window.URL.revokeObjectURL(current);
      return previewUrl;
    });
    setIsOcring(true);
    setOcrStatus("Preparing OCR engine...");

    try {
      const { createWorker } = await import("tesseract.js");
      const worker = await createWorker("eng", 1, {
        logger: (message) => {
          if (message.status === "recognizing text") {
            const percent = Math.round((message.progress ?? 0) * 100);
            setOcrStatus(`Reading screenshot... ${percent}%`);
          }
        }
      });

      const result = await worker.recognize(file);
      await worker.terminate();

      const extracted = normalizeOcrText(result.data.text);
      if (!extracted) {
        setError("OCR could not read this image. Try a clearer screenshot or paste the text.");
        setOcrStatus("");
        setOcrFileName("");
        setOcrPreviewUrl((current) => {
          if (current) window.URL.revokeObjectURL(current);
          return "";
        });
        return;
      }

      setText(extracted);
      setOcrStatus("Screenshot text extracted. Review before analyzing.");
    } catch {
      setError("OCR could not read this image. Try a clearer screenshot or paste the text.");
      setOcrStatus("");
      setOcrFileName("");
      setOcrPreviewUrl((current) => {
        if (current) window.URL.revokeObjectURL(current);
        return "";
      });
    } finally {
      setIsOcring(false);
    }
  }

  function clearOcrDraft() {
    setInputType("text");
    setOcrFileName("");
    setOcrStatus("");
    setError("");
    setOcrPreviewUrl((current) => {
      if (current) window.URL.revokeObjectURL(current);
      return "";
    });
  }

  useEffect(() => {
    const settings = loadSettings();
    if (!settings.saveHistory) return;
  }, []);

  useEffect(() => {
    return () => {
      if (ocrPreviewUrl) {
        window.URL.revokeObjectURL(ocrPreviewUrl);
      }
    };
  }, [ocrPreviewUrl]);

  return (
    <AppShell>
      <div className="mx-auto grid min-h-screen max-w-[1320px] gap-6 px-4 py-6 md:px-8 lg:grid-cols-[1fr_380px] lg:px-12">
        <section className="flex flex-col justify-center">
          <div className="mb-6">
            <p className="font-mono text-xs uppercase tracking-[0.1em] text-signal">Signal Noir / Analyzer</p>
            <h1 className="mt-2 font-display text-3xl font-semibold text-ink md:text-5xl">AI Lie Detector</h1>
            <p className="mt-3 max-w-2xl text-muted">Analyze scam and manipulation signals in messages, links, emails, and OCR text without storing raw content unless you choose local history.</p>
          </div>

          <SignalCard className="relative overflow-hidden p-4 md:p-6">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-signal/70 shadow-signal" />
            <div className="mb-4 flex flex-wrap gap-2">
              {[
                ["text", "Paste"],
                ["whatsapp", "WhatsApp"],
                ["email", "Email"],
                ["screenshot", "Screenshot OCR"]
              ].map(([value, label]) => (
                <button
                  key={value}
                  onClick={() => setInputType(value as InputType)}
                  className={`rounded border px-3 py-2 font-mono text-xs uppercase tracking-[0.1em] transition ${
                    inputType === value ? "border-signal bg-signal/15 text-signal" : "border-white/10 text-muted hover:border-signal/35"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => void handleOcrUpload(event.target.files?.[0] ?? null)}
            />

            <div className="mb-4 grid gap-3 md:grid-cols-[1fr_auto]">
              <div className="rounded border border-dashed border-signal/35 bg-signal/5 p-4 text-sm text-muted">
                <div className="flex items-center gap-2 text-signal">
                  <Camera className="size-4" />
                  Screenshot OCR
                </div>
                <p className="mt-2">Upload a screenshot to extract the text locally in your browser, then review the result before analysis.</p>
                {ocrFileName && <p className="mt-2 truncate font-mono text-xs uppercase tracking-[0.1em] text-ink/80">{ocrFileName}</p>}
                {ocrStatus && <p className="mt-2 font-mono text-xs uppercase tracking-[0.1em] text-signal/85">{ocrStatus}</p>}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isOcring}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded border border-white/15 px-4 py-3 text-sm text-ink transition hover:border-signal/45 hover:text-signal disabled:cursor-not-allowed disabled:opacity-60 md:self-start"
              >
                {isOcring ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
                {isOcring ? "Reading..." : "Upload image"}
              </button>
            </div>

            <div className="relative">
              <textarea
                value={text}
                onChange={(event) => setText(event.target.value)}
                placeholder="Paste the suspicious message here..."
                className="min-h-[300px] w-full resize-y rounded border border-white/10 bg-[#0f1111] p-4 font-mono text-sm leading-7 text-ink transition placeholder:text-muted/55 focus:border-signal focus:shadow-signal"
              />
              {text && <div className="pointer-events-none absolute inset-x-4 top-0 h-16 bg-gradient-to-b from-signal/14 to-transparent animate-scan" />}
            </div>

            {inputType === "screenshot" && text && (
              <div className="mt-3 grid gap-3 rounded border border-white/10 bg-white/[0.03] p-4 md:grid-cols-[180px_1fr]">
                <div className="overflow-hidden rounded border border-white/10 bg-black/30">
                  {ocrPreviewUrl ? (
                    <img src={ocrPreviewUrl} alt="Uploaded screenshot preview" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex min-h-[180px] items-center justify-center p-4 text-center font-mono text-xs uppercase tracking-[0.1em] text-muted">
                      Screenshot preview unavailable
                    </div>
                  )}
                </div>
                <div className="flex flex-col justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="font-mono text-xs uppercase tracking-[0.1em] text-signal">OCR preview</p>
                        <p className="mt-1 text-sm text-muted">Edit the extracted text before analysis if the screenshot was noisy.</p>
                      </div>
                      <div className="font-mono text-xs uppercase tracking-[0.1em] text-muted">
                        {text.split(/\s+/).filter(Boolean).length} words
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="rounded border border-white/15 px-3 py-2 font-mono text-xs uppercase tracking-[0.1em] text-ink transition hover:border-signal/45 hover:text-signal"
                      >
                        Replace screenshot
                      </button>
                      <button
                        type="button"
                        onClick={clearOcrDraft}
                        className="rounded border border-white/15 px-3 py-2 font-mono text-xs uppercase tracking-[0.1em] text-ink transition hover:border-danger/50 hover:text-danger"
                      >
                        Remove screenshot
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <select value={senderType} onChange={(event) => setSenderType(event.target.value as SenderType)} className="rounded border border-white/10 bg-[#111] px-3 py-3 text-sm text-ink">
                <option value="unknown">Unknown sender</option>
                <option value="friend_family">Friend or family</option>
                <option value="company">Company</option>
                <option value="bank_government">Bank or government</option>
                <option value="marketplace">Marketplace</option>
                <option value="job_recruiter">Job recruiter</option>
                <option value="dating_romance">Dating or romance</option>
              </select>
              <select value={requestedAction} onChange={(event) => setRequestedAction(event.target.value as RequestedAction)} className="rounded border border-white/10 bg-[#111] px-3 py-3 text-sm text-ink">
                <option value="none">No requested action</option>
                <option value="pay_money">Pay money</option>
                <option value="click_link">Click a link</option>
                <option value="share_code">Share code/password</option>
                <option value="send_documents">Send documents</option>
                <option value="reply_quickly">Reply quickly</option>
                <option value="other">Other action</option>
              </select>
            </div>

            {error && (
              <p className="mt-4 flex items-center gap-2 rounded border border-danger/40 bg-danger/10 px-3 py-2 text-sm text-danger">
                <AlertTriangle className="size-4" />
                {error}
              </p>
            )}

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <button onClick={analyze} disabled={isScanning} className="inline-flex min-h-12 items-center justify-center gap-2 rounded bg-signal px-5 py-3 font-semibold text-black shadow-signal transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60">
                {isScanning ? <Loader2 className="size-4 animate-spin" /> : <Radar className="size-4" />}
                Analyze
              </button>
              <button onClick={() => setText(sample)} className="min-h-12 rounded border border-white/15 px-5 py-3 text-sm text-ink transition hover:border-signal/45 hover:text-signal">
                Load sample
              </button>
            </div>
          </SignalCard>
        </section>

        <aside className="space-y-4 self-center">
          {isScanning ? (
            <ScanProgress />
          ) : (
            <SignalCard className="p-5">
              <ShieldCheck className="mb-4 size-8 text-signal" />
              <h2 className="font-display text-2xl font-semibold">Forensic protocol</h2>
              <div className="mt-4 grid gap-3">
                {["Pause before acting", "Question urgency or secrecy", "Verify through official channels"].map((item) => (
                  <div key={item} className="rounded border border-white/10 bg-white/[0.03] px-4 py-3 font-mono text-sm text-muted">
                    {item}
                  </div>
                ))}
              </div>
            </SignalCard>
          )}
        </aside>
      </div>
    </AppShell>
  );
}
