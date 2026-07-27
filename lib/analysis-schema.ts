import { z } from "zod";

export const tacticSchema = z.enum([
  "false_urgency",
  "guilt_tripping",
  "threat",
  "fake_promise",
  "payment_pressure",
  "impersonation",
  "suspicious_link",
  "verification_code_theft",
  "romance_pressure",
  "job_offer_scam",
  "delivery_scam",
  "bank_impersonation"
]);

export const scamCategorySchema = z.enum([
  "bank",
  "delivery",
  "job",
  "romance",
  "family_emergency",
  "gift_card",
  "account_closure",
  "marketplace",
  "unknown"
]);

export const analysisResultSchema = z.object({
  id: z.string(),
  inputText: z.string(),
  redactedText: z.string(),
  riskScore: z.number().int().min(0).max(100),
  verdict: z.enum(["low_risk", "unclear", "suspicious", "likely_scam", "manipulative"]),
  confidence: z.enum(["low", "medium", "high"]),
  summaryReason: z.string().max(180),
  detectedTactics: z.array(tacticSchema),
  evidence: z.array(
    z.object({
      quote: z.string().min(1).max(160),
      tactic: tacticSchema,
      severity: z.enum(["low", "medium", "high"]),
      explanation: z.string(),
      saferInterpretation: z.string()
    })
  ),
  safeActions: z.array(z.string()).min(3).max(6),
  safeReplyOptions: z.array(z.string()).min(1).max(4),
  categories: z.array(scamCategorySchema),
  disclaimer: z.string(),
  createdAt: z.string()
});

export const analyzeRequestSchema = z.object({
  text: z.string().max(12000),
  inputType: z.enum(["text", "email", "whatsapp", "screenshot"]).default("text"),
  senderType: z
    .enum(["unknown", "friend_family", "company", "bank_government", "marketplace", "job_recruiter", "dating_romance"])
    .default("unknown"),
  requestedAction: z
    .enum(["pay_money", "click_link", "share_code", "send_documents", "reply_quickly", "other", "none"])
    .default("none"),
  settings: z
    .object({
      redactBeforeAnalysis: z.boolean().default(true),
      sensitivity: z.enum(["low", "balanced", "high"]).default("balanced")
    })
    .default({ redactBeforeAnalysis: true, sensitivity: "balanced" })
});
