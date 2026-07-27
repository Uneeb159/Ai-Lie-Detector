"use client";

import { motion } from "framer-motion";

export function RiskGauge({ score }: { score: number }) {
  const color = score >= 85 ? "#FF4B4B" : score >= 60 ? "#FFB800" : score >= 30 ? "#FFB800" : "#00C853";
  const angle = -90 + (score / 100) * 180;

  return (
    <div className="relative mx-auto aspect-[2/1] w-full max-w-md overflow-hidden">
      <svg viewBox="0 0 220 120" className="h-full w-full">
        <path d="M 20 110 A 90 90 0 0 1 200 110" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="18" strokeLinecap="round" />
        <motion.path
          d="M 20 110 A 90 90 0 0 1 200 110"
          fill="none"
          stroke={color}
          strokeWidth="18"
          strokeLinecap="round"
          pathLength="1"
          initial={{ strokeDasharray: "0 1" }}
          animate={{ strokeDasharray: `${score / 100} 1` }}
          transition={{ duration: 1.1, ease: "easeOut" }}
          style={{ filter: `drop-shadow(0 0 12px ${color}66)` }}
        />
        <motion.line
          x1="110"
          y1="110"
          x2="110"
          y2="36"
          stroke="#e5e2e1"
          strokeWidth="4"
          strokeLinecap="round"
          initial={{ rotate: -90 }}
          animate={{ rotate: angle }}
          transition={{ type: "spring", stiffness: 80, damping: 12 }}
          style={{ transformOrigin: "110px 110px" }}
        />
        <circle cx="110" cy="110" r="8" fill="#e5e2e1" />
      </svg>
      <div className="absolute inset-x-0 bottom-0 text-center">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="font-mono text-6xl font-bold" style={{ color }}>
          {score}%
        </motion.div>
        <p className="font-mono text-xs uppercase tracking-[0.1em] text-muted">Scam risk</p>
      </div>
    </div>
  );
}
