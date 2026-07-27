import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Lie Detector",
  description: "Scam and manipulation signal analysis with privacy-first guidance."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
