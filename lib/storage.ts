import type { AnalysisResult } from "@/types/analysis";

const historyKey = "ai-lie-detector.history.v1";
const settingsKey = "ai-lie-detector.settings.v1";

export type AppSettings = {
  saveHistory: boolean;
  redactBeforeAnalysis: boolean;
  sensitivity: "low" | "balanced" | "high";
};

export const defaultSettings: AppSettings = {
  saveHistory: true,
  redactBeforeAnalysis: true,
  sensitivity: "balanced"
};

export function loadSettings(): AppSettings {
  if (typeof window === "undefined") return defaultSettings;
  const raw = window.localStorage.getItem(settingsKey);
  return raw ? { ...defaultSettings, ...JSON.parse(raw) } : defaultSettings;
}

export function saveSettings(settings: AppSettings) {
  window.localStorage.setItem(settingsKey, JSON.stringify(settings));
}

export function loadHistory(): AnalysisResult[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(historyKey);
  return raw ? JSON.parse(raw) : [];
}

export function saveResult(result: AnalysisResult) {
  const next = [result, ...loadHistory().filter((item) => item.id !== result.id)].slice(0, 50);
  window.localStorage.setItem(historyKey, JSON.stringify(next));
}

export function getResult(id: string) {
  return loadHistory().find((item) => item.id === id);
}

export function deleteResult(id: string) {
  window.localStorage.setItem(historyKey, JSON.stringify(loadHistory().filter((item) => item.id !== id)));
}

export function clearHistory() {
  window.localStorage.removeItem(historyKey);
}
