import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        graphite: "#121212",
        panel: "#1E1E1E",
        panelHigh: "#2a2a2a",
        signal: "#00f0ff",
        signalSoft: "#7df4ff",
        violet: "#8a2be2",
        amber: "#FFB800",
        danger: "#FF4B4B",
        safe: "#00C853",
        ink: "#e5e2e1",
        muted: "#b9cacb",
        outline: "#3b494b"
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Hanken Grotesk", "Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"]
      },
      boxShadow: {
        signal: "0 0 24px rgba(0, 240, 255, 0.22)",
        danger: "0 0 28px rgba(255, 75, 75, 0.22)"
      },
      keyframes: {
        scan: {
          "0%": { transform: "translateY(-120%)", opacity: "0" },
          "15%": { opacity: "1" },
          "85%": { opacity: "1" },
          "100%": { transform: "translateY(520%)", opacity: "0" }
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 10px rgba(0,240,255,0.18)" },
          "50%": { boxShadow: "0 0 28px rgba(0,240,255,0.42)" }
        },
        sweep: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" }
        }
      },
      animation: {
        scan: "scan 2.9s ease-in-out infinite",
        pulseGlow: "pulseGlow 2.4s ease-in-out infinite",
        sweep: "sweep 2.2s linear infinite"
      }
    }
  },
  plugins: []
};

export default config;
