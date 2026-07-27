# AI Lie Detector - Code PRD

Version: 1.0  
Audience: Claude / implementation agent  
Goal: build the full AI Lie Detector web application aligned to the UI PRD.

## 1. Product Objective

Build a production-ready web app where a user can paste suspicious text from WhatsApp, SMS, email, or chat, optionally upload a screenshot for OCR, and receive:

- Scam risk score from 0-100
- Plain-English verdict
- Emotional manipulation analysis
- Guilt-tripping detection
- Scam indicators
- Urgency tactics
- Fake promise detection
- Evidence highlights mapped to the original text
- Recommended safe actions
- Optional safe reply

The app must prioritize speed, clarity, privacy, and a visually excellent animated UI.

## 2. Reference Findings

Implementation should reflect observed successful product patterns:

- Norton Genie lets users copy/paste or upload screenshots and receive instant scam advice plus follow-up explanations. Source: [Norton Genie](https://play.google.com/store/apps/details?hl=en_GB&id=com.norton.genieapp)
- Bitdefender Scamio supports text, links, QR codes, screenshots, and chatbot-style recommendations across web and messaging platforms. Source: [Bitdefender Scamio](https://www.bitdefender.com/en-us/consumer/scamio)
- McAfee Scam Detector includes on-demand checks, message/email analysis, risk explanations, and sensitivity controls. Source: [McAfee Scam Detector](https://www.mcafee.com/blogs/mcafee-news/introducing-mcafees-scam-detector-now-included-in-all-core-plans/)
- FTC scam guidance identifies common patterns: bank impersonation, fake delivery issues, fake job offers, account threats, gift card/payment demands, urgency, and impersonation. Sources: [FTC text scams](https://www.ftc.gov/news-events/news/press-releases/2023/06/new-ftc-data-analysis-shows-bank-impersonation-most-reported-text-message-scam), [FTC gift card scams](https://consumer.ftc.gov/articles/avoiding-and-reporting-gift-card-scams)
- WhatsApp safety guidance recommends "pause, question, verify"; this should drive the app's action guidance. Source: [WhatsApp scam tips](https://about.fb.com/news/2025/08/new-whatsapp-tools-tips-beat-messaging-scams/)

## 3. Recommended Tech Stack

Use:

- Framework: Next.js with App Router
- Language: TypeScript
- Styling: Tailwind CSS
- UI primitives: shadcn/ui or equivalent accessible primitives
- Icons: lucide-react
- Animation: Framer Motion
- Charts/gauge: custom SVG/CSS or lightweight React component
- OCR: Tesseract.js for browser-side OCR, with optional server OCR adapter later
- AI provider: OpenAI API or compatible LLM provider
- Validation: Zod
- Persistence: Supabase/Postgres or local IndexedDB for MVP
- Auth: optional for MVP; allow anonymous scans first
- Testing: Vitest for utilities, Playwright for critical flows

If building as MVP without backend persistence, store history in localStorage or IndexedDB and clearly mark it as local-only.

## 4. Architecture

Recommended structure:

```text
app/
  page.tsx
  scan/page.tsx
  results/[id]/page.tsx
  patterns/page.tsx
  history/page.tsx
  settings/page.tsx
  api/analyze/route.ts
  api/ocr/route.ts
components/
  app-shell.tsx
  paste-analyzer.tsx
  scan-progress.tsx
  risk-gauge.tsx
  verdict-card.tsx
  annotated-message.tsx
  evidence-drawer.tsx
  action-plan.tsx
  safe-reply-card.tsx
  pattern-card.tsx
  history-card.tsx
lib/
  analysis-schema.ts
  risk-scoring.ts
  redaction.ts
  ocr.ts
  storage.ts
  prompts.ts
  scam-patterns.ts
types/
  analysis.ts
tests/
  risk-scoring.test.ts
  redaction.test.ts
  analysis-schema.test.ts
```

## 5. Core User Flows

### Flow 1: Text Scan

1. User lands on `/scan`.
2. User pastes suspicious message.
3. App detects suspicious keywords client-side for pre-scan visual highlights.
4. User optionally selects sender type and requested action.
5. User clicks Analyze.
6. Client calls `/api/analyze`.
7. API redacts sensitive data before LLM call if enabled.
8. API validates LLM output against Zod schema.
9. UI shows animated scan progress.
10. UI reveals result page with score, verdict, reasons, evidence, and action plan.

### Flow 2: Screenshot OCR

1. User switches to Screenshot OCR.
2. User uploads image.
3. Browser-side OCR extracts text.
4. User edits OCR preview.
5. User submits text to same analysis flow.

### Flow 3: Safe Reply

1. User opens result.
2. User selects safe reply tone:
   - Neutral
   - Firm
   - Verify first
3. App generates safe reply locally from templates or through LLM.
4. User copies reply.

### Flow 4: History

1. After scan, result is saved if setting is enabled.
2. History list shows redacted preview, verdict, risk score, tactics, date.
3. User can open, delete one result, or delete all.

## 6. Data Model

```ts
type ScanInput = {
  id: string;
  rawText: string;
  redactedText?: string;
  inputType: "text" | "email" | "whatsapp" | "screenshot";
  senderType?: "unknown" | "friend_family" | "company" | "bank_government" | "marketplace" | "job_recruiter" | "dating_romance";
  requestedAction?: "pay_money" | "click_link" | "share_code" | "send_documents" | "reply_quickly" | "other" | "none";
  createdAt: string;
};

type AnalysisResult = {
  id: string;
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

type Tactic =
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

type EvidenceSpan = {
  quote: string;
  tactic: Tactic;
  severity: "low" | "medium" | "high";
  explanation: string;
  saferInterpretation: string;
};

type ScamCategory =
  | "bank"
  | "delivery"
  | "job"
  | "romance"
  | "family_emergency"
  | "gift_card"
  | "account_closure"
  | "marketplace"
  | "unknown";
```

## 7. AI Analysis Requirements

The LLM must return structured JSON only. Validate with Zod. If invalid, retry once with a repair prompt.

Required output fields:

- `riskScore`: integer 0-100
- `verdict`: enum
- `confidence`: enum
- `summaryReason`: max 160 characters
- `detectedTactics`: array
- `evidence`: array of quoted spans from the submitted text
- `safeActions`: array of 3-6 short actions
- `safeReplyOptions`: array of 2-4 safe replies
- `categories`: array
- `disclaimer`: short safety disclaimer

Prompt requirements:

- Analyze manipulation and scams, not factual truth in general.
- Focus on emotional pressure, money requests, credentials, links, threats, unrealistic promises, impersonation, and urgency.
- Do not claim certainty unless the text directly contains conclusive scam markers.
- Do not provide instructions for committing scams.
- Do not expose chain-of-thought; provide concise reasons only.
- If text is too short or ambiguous, return `unclear` with verification advice.

Example system instruction:

```text
You are a consumer safety assistant. Analyze the submitted message for scam indicators and emotional manipulation. Return only valid JSON matching the schema. Use cautious language. Quote only short evidence spans from the user's message. Recommend safe, non-confrontational next steps.
```

## 8. Risk Scoring Logic

Use hybrid scoring:

1. LLM semantic analysis
2. Deterministic signal boosts
3. Deterministic caps for uncertainty

Suggested deterministic boosts:

- Money request: +20
- Gift card, crypto, wire transfer, payment app: +25
- Urgency words: +15
- Account closure/threat: +20
- Verification code/password/OTP request: +30
- Unknown sender + money/action request: +15
- Suspicious URL: +15
- Unrealistic reward/prize/job pay: +20
- Guilt phrase combined with request: +15

Suggested caps:

- If no request/action/link/money is present, cap at 65 unless strong manipulation exists.
- If text is under 20 characters, return unclear and cap at 50.
- If message is a normal personal request without pressure, cap at 40.

Risk bands:

- 0-29: Low risk
- 30-59: Suspicious/medium risk
- 60-84: High risk
- 85-100: Likely scam

## 9. Redaction And Privacy

Before server submission, optionally redact:

- Email addresses
- Phone numbers
- OTPs and verification codes
- Credit card-like numbers
- Bank account-like numbers
- Addresses if detected
- Full names where feasible

Redaction should preserve scam meaning:

```text
"Send code 492881 to me" -> "Send code [CODE] to me"
"Call +1 555 123 4567" -> "Call [PHONE]"
```

Default settings:

- Save history: off or local-only
- Redact before analysis: on
- OCR: user-triggered only
- Do not train on user data

## 10. UI Implementation Requirements

Implement screens from the UI PRD:

- Scan
- Scanning state
- Result
- Evidence breakdown
- Safe action plan
- Pattern library
- Pattern detail
- History
- Settings

Required animated components:

- Scanner beam over message preview
- Signal layer progress cards
- Risk score count-up
- Risk gauge reveal
- Evidence phrase highlight sweep
- Staggered tactic chips
- Hover transitions for pattern cards
- Reduced-motion fallback

The UI must be responsive across:

- Mobile: 360px width minimum
- Tablet
- Desktop

Use accessibility:

- Keyboard navigation
- Visible focus states
- ARIA labels for icon buttons
- Color plus text for risk
- `prefers-reduced-motion` support

## 11. Pattern Library Content

Seed app with pattern data:

```ts
const scamPatterns = [
  {
    id: "bank-impersonation",
    title: "Bank impersonation",
    example: "Your account has suspicious activity. Verify now or it will be locked.",
    warningSigns: ["Urgency", "Account threat", "Suspicious verification link"],
    safeActions: ["Open your bank app directly", "Do not click the message link"]
  },
  {
    id: "gift-card-payment",
    title: "Gift card payment demand",
    example: "Buy gift cards and send me the codes immediately.",
    warningSigns: ["Untraceable payment", "Urgency", "Pressure"],
    safeActions: ["Do not buy cards", "Report the message"]
  },
  {
    id: "fake-job",
    title: "Fake job offer",
    example: "Earn $500 daily with no interview. Pay a registration fee now.",
    warningSigns: ["Unrealistic pay", "Upfront fee", "Fast action pressure"],
    safeActions: ["Verify the company website", "Avoid paying to get a job"]
  }
];
```

Add more categories from UI PRD.

## 12. API Contracts

### `POST /api/analyze`

Request:

```json
{
  "text": "Send me $50 urgently or your account will be closed.",
  "inputType": "text",
  "senderType": "unknown",
  "requestedAction": "pay_money",
  "settings": {
    "redactBeforeAnalysis": true,
    "sensitivity": "balanced"
  }
}
```

Response:

```json
{
  "id": "scan_123",
  "riskScore": 96,
  "verdict": "likely_scam",
  "confidence": "high",
  "summaryReason": "Creates false urgency and asks for money.",
  "detectedTactics": ["false_urgency", "payment_pressure", "threat"],
  "evidence": [
    {
      "quote": "Send me $50 urgently",
      "tactic": "payment_pressure",
      "severity": "high",
      "explanation": "The sender asks for money under time pressure.",
      "saferInterpretation": "Real organizations do not usually demand urgent payment through chat."
    }
  ],
  "safeActions": [
    "Do not send money.",
    "Do not click links or share codes.",
    "Verify through the official website or phone number."
  ],
  "safeReplyOptions": [
    "I will verify this through the official channel before taking action."
  ],
  "categories": ["account_closure"],
  "disclaimer": "This is guidance, not a guarantee. Verify important requests through official channels."
}
```

### `POST /api/ocr`

Optional. Use only if OCR is processed server-side. For MVP, prefer browser-side Tesseract.js.

## 13. Error States

Handle:

- Empty text
- Very short text
- OCR failure
- Unsupported image file
- AI timeout
- Invalid AI JSON
- Network failure
- Rate limit

User-facing messages:

- "Paste a message first."
- "This text is too short to analyze confidently."
- "OCR could not read this image. Try a clearer screenshot or paste the text."
- "Analysis could not finish. Your draft is still here."

## 14. Security And Abuse Prevention

- Rate limit anonymous scans.
- Do not log raw messages in production.
- Redact server logs.
- Add input length limits.
- Block executable file uploads.
- Only allow image uploads for OCR.
- Do not render submitted text as HTML.
- Escape all user content.
- Avoid storing raw screenshots unless user explicitly saves them.

## 15. Testing Plan

Unit tests:

- Redaction patterns
- Risk scoring boosts/caps
- Zod schema validation
- Pattern category mapping

Integration tests:

- Analyze endpoint returns valid schema
- Invalid LLM output repair path
- OCR preview to scan flow

Playwright tests:

- User pastes message and receives high-risk result
- User uploads screenshot and edits OCR text
- User opens evidence drawer
- User copies safe reply
- User deletes history
- Reduced-motion mode does not break layout

Manual visual QA:

- Desktop result screen
- Mobile scan screen
- Mobile evidence bottom sheet
- High-risk and low-risk colors
- Long message wrapping
- Button text fitting

## 16. Acceptance Criteria

MVP is complete when:

- User can paste text and get a validated analysis result.
- The result includes score, verdict, reason, evidence, tactics, and safe actions.
- Screenshot OCR path works or is cleanly marked optional.
- UI follows the "Signal Noir" animated theme.
- History can save/delete scans if enabled.
- Settings include privacy/redaction and sensitivity.
- App handles failures without losing user input.
- Tests cover scoring, redaction, schema validation, and the main scan flow.

## 17. Build Order

1. Project setup and app shell.
2. Static UI screens using mock data.
3. Paste analyzer and scan animation.
4. Result page and risk gauge.
5. Evidence highlighting and drawer.
6. Safe action plan and reply templates.
7. Analysis API with Zod schema.
8. Risk scoring and redaction utilities.
9. Local history and settings.
10. OCR upload/preview.
11. Pattern library.
12. Tests and responsive polish.

## 18. Important Product Constraints

- Do not market the app as a perfect truth detector.
- It detects scam/manipulation signals in text.
- It should not make legal, financial, or law-enforcement decisions for the user.
- It should not shame the user.
- It should encourage verification through official channels.
- It should keep sensitive message content private wherever possible.

