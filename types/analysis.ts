export type InputType = "text" | "email" | "whatsapp" | "screenshot";

export type SenderType =
  | "unknown"
  | "friend_family"
  | "company"
  | "bank_government"
  | "marketplace"
  | "job_recruiter"
  | "dating_romance";

export type RequestedAction =
  | "pay_money"
  | "click_link"
  | "share_code"
  | "send_documents"
  | "reply_quickly"
  | "other"
  | "none";

export type Tactic =
  | "false_urgency"
  | "guilt_tripping"
  | "threat"
  | "fake_promise"
  | "payment_pressure"
  | "impersonation"
  | "suspicious_link"
  | "verification_code_theft"
  | "romance_pressure"
  | "job_offer_scam"
  | "delivery_scam"
  | "bank_impersonation";

export type ScamCategory =
  | "bank"
  | "delivery"
  | "job"
  | "romance"
  | "family_emergency"
  | "gift_card"
  | "account_closure"
  | "marketplace"
  | "unknown";

export type EvidenceSpan = {
  quote: string;
  tactic: Tactic;
  severity: "low" | "medium" | "high";
  explanation: string;
  saferInterpretation: string;
};

export type AnalysisResult = {
  id: string;
  inputText: string;
  redactedText: string;
  riskScore: number;
  verdict: "low_risk" | "unclear" | "suspicious" | "likely_scam" | "manipulative";
  confidence: "low" | "medium" | "high";
  summaryReason: string;
  detectedTactics: Tactic[];
  evidence: EvidenceSpan[];
  safeActions: string[];
  safeReplyOptions: string[];
  categories: ScamCategory[];
  disclaimer: string;
  createdAt: string;
};
