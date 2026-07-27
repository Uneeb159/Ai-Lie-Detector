import type { AnalysisResult, EvidenceSpan, RequestedAction, ScamCategory, SenderType, Tactic } from "@/types/analysis";

type AnalyzeArgs = {
  text: string;
  redactedText: string;
  senderType: SenderType;
  requestedAction: RequestedAction;
  sensitivity: "low" | "balanced" | "high";
};

type Signal = {
  tactic: Tactic;
  category?: ScamCategory;
  score: number;
  severity: EvidenceSpan["severity"];
  pattern: RegExp;
  explanation: string;
  saferInterpretation: string;
};

const signals: Signal[] = [
  {
    tactic: "payment_pressure",
    category: "gift_card",
    score: 25,
    severity: "high",
    pattern: /\b(gift card|crypto|bitcoin|wire transfer|western union|cash app|venmo|zelle|send money|registration fee)\b/i,
    explanation: "The message pushes a payment method or direct transfer often used in scams.",
    saferInterpretation: "Legitimate organizations rarely demand urgent payment through chat."
  },
  {
    tactic: "verification_code_theft",
    score: 30,
    severity: "high",
    pattern: /\b(otp|verification code|login code|password|pin|2fa|two[- ]factor)\b/i,
    explanation: "The sender is asking about credentials or verification codes.",
    saferInterpretation: "Codes and passwords should never be shared with another person."
  },
  {
    tactic: "false_urgency",
    score: 15,
    severity: "medium",
    pattern: /\b(urgent|immediately|right now|today only|last chance|act now|within \d+ hours|deadline)\b/i,
    explanation: "The message creates time pressure to reduce careful checking.",
    saferInterpretation: "Real requests can usually be verified through official channels first."
  },
  {
    tactic: "threat",
    category: "account_closure",
    score: 20,
    severity: "high",
    pattern: /\b(locked|closed|suspended|arrest|lawsuit|penalty|blocked|terminate|final warning)\b/i,
    explanation: "The sender uses a threat or consequence to force action.",
    saferInterpretation: "Do not use links in the message; verify from the official app or website."
  },
  {
    tactic: "suspicious_link",
    score: 15,
    severity: "medium",
    pattern: /https?:\/\/|www\.|bit\.ly|tinyurl|t\.co|wa\.me/i,
    explanation: "A link appears in a message that asks for action.",
    saferInterpretation: "Open official websites manually instead of following unknown links."
  },
  {
    tactic: "fake_promise",
    category: "job",
    score: 20,
    severity: "medium",
    pattern: /\b(prize|winner|guaranteed|earn \$?\d+|no interview|investment return|double your money)\b/i,
    explanation: "The message includes an unusually generous or unrealistic promise.",
    saferInterpretation: "Treat unexpected rewards or effortless income claims as unverified."
  },
  {
    tactic: "guilt_tripping",
    score: 15,
    severity: "medium",
    pattern: /\b(if you cared|don't tell anyone|prove you|i trusted you|you are the only one|please help me)\b/i,
    explanation: "The sender uses guilt or secrecy to influence your response.",
    saferInterpretation: "Pressure and secrecy are reasons to pause and verify with another channel."
  },
  {
    tactic: "bank_impersonation",
    category: "bank",
    score: 22,
    severity: "high",
    pattern: /\b(bank|debit|credit card|account activity|fraud department|security alert)\b/i,
    explanation: "The message presents itself as financial security communication.",
    saferInterpretation: "Open your bank app directly or call the official number on your card."
  },
  {
    tactic: "delivery_scam",
    category: "delivery",
    score: 15,
    severity: "medium",
    pattern: /\b(parcel|package|delivery|customs fee|shipping fee|tracking)\b/i,
    explanation: "Delivery language plus a requested action can indicate a fake parcel notice.",
    saferInterpretation: "Use the carrier's official tracking page, not a message link."
  },
  {
    tactic: "job_offer_scam",
    category: "job",
    score: 18,
    severity: "medium",
    pattern: /\b(job offer|recruiter|work from home|hiring|salary|registration fee)\b/i,
    explanation: "The message resembles common fake job offer patterns.",
    saferInterpretation: "Verify the employer through official company channels before paying or sharing documents."
  },
  {
    tactic: "romance_pressure",
    category: "romance",
    score: 18,
    severity: "medium",
    pattern: /\b(love you|my dear|sweetheart|romance|stranded|hospital|emergency money)\b/i,
    explanation: "The message combines emotional intimacy with pressure or need.",
    saferInterpretation: "Do not send money to someone whose identity and situation you cannot verify."
  }
];

function quoteFor(text: string, pattern: RegExp) {
  const match = text.match(pattern);
  if (!match?.[0]) return text.slice(0, 90);
  const start = Math.max(0, (match.index ?? 0) - 24);
  const end = Math.min(text.length, (match.index ?? 0) + match[0].length + 36);
  return text.slice(start, end).trim();
}

export function analyzeDeterministically(args: AnalyzeArgs): AnalysisResult {
  const text = args.redactedText.trim();
  const matches = signals.filter((signal) => signal.pattern.test(text));
  const tactics = [...new Set(matches.map((signal) => signal.tactic))];
  const categories = [...new Set(matches.map((signal) => signal.category).filter(Boolean))] as ScamCategory[];
  const hasRequest = args.requestedAction !== "none" || /\b(send|pay|click|reply|verify|share|download|open|call)\b/i.test(text);
  const actionBoosts: Record<RequestedAction, number> = {
    pay_money: 20,
    click_link: 15,
    share_code: 30,
    send_documents: 18,
    reply_quickly: 12,
    other: 8,
    none: 0
  };
  const senderBoost = args.senderType === "unknown" && hasRequest ? 15 : 0;
  const sensitivityBoost = args.sensitivity === "high" ? 8 : args.sensitivity === "low" ? -8 : 0;
  let riskScore = matches.reduce((sum, signal) => sum + signal.score, 5) + actionBoosts[args.requestedAction] + senderBoost + sensitivityBoost;

  if (text.length < 20) riskScore = Math.min(riskScore, 50);
  if (!hasRequest && !tactics.includes("guilt_tripping")) riskScore = Math.min(riskScore, 65);
  if (matches.length === 0 && hasRequest) riskScore = Math.min(riskScore + 18, 45);
  riskScore = Math.max(0, Math.min(100, Math.round(riskScore)));

  const verdict =
    text.length < 20 ? "unclear" : riskScore >= 85 ? "likely_scam" : riskScore >= 60 ? "suspicious" : riskScore >= 30 ? "suspicious" : "low_risk";
  const confidence = matches.length >= 4 ? "high" : matches.length >= 2 ? "medium" : "low";
  const evidence = matches.slice(0, 5).map((signal) => ({
    quote: quoteFor(text, signal.pattern),
    tactic: signal.tactic,
    severity: signal.severity,
    explanation: signal.explanation,
    saferInterpretation: signal.saferInterpretation
  }));

  return {
    id: `scan_${Date.now()}_${Math.random().toString(16).slice(2, 8)}`,
    inputText: args.text,
    redactedText: args.redactedText,
    riskScore,
    verdict,
    confidence,
    summaryReason:
      text.length < 20
        ? "There is not enough text to analyze confidently."
        : riskScore >= 85
          ? "Multiple high-risk pressure signals were detected."
          : riskScore >= 60
            ? "The message contains strong scam or manipulation indicators."
            : riskScore >= 30
              ? "Some pressure signals were detected; verify before acting."
              : "Few scam indicators were detected, but verify unusual requests.",
    detectedTactics: tactics,
    evidence,
    safeActions: buildSafeActions(riskScore, tactics),
    safeReplyOptions: buildReplies(riskScore),
    categories: categories.length ? categories : ["unknown"],
    disclaimer: "This is safety guidance, not a guarantee. Verify important requests through official channels.",
    createdAt: new Date().toISOString()
  };
}

function buildSafeActions(score: number, tactics: Tactic[]) {
  const actions = ["Pause before replying.", "Verify through an official website, app, or known phone number.", "Do not share passwords, OTPs, or payment details."];
  if (score >= 60) actions.unshift("Do not send money or click message links.");
  if (tactics.includes("bank_impersonation")) actions.push("Contact your bank using the number on your card.");
  if (tactics.includes("delivery_scam")) actions.push("Check shipment status on the carrier site directly.");
  return [...new Set(actions)].slice(0, 6);
}

function buildReplies(score: number) {
  if (score >= 60) {
    return [
      "I will not take action through this message. I am going to verify this through the official channel.",
      "I cannot send money, codes, or personal details here.",
      "Please contact me through a verified number or official account."
    ];
  }
  return [
    "I will verify this first through the official channel.",
    "Please send more context so I can confirm this safely.",
    "I am going to pause and check before taking action."
  ];
}
