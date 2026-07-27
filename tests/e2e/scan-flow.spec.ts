import { expect, test } from "@playwright/test";

test("results page renders a saved scan", async ({ page }) => {
  const scan = {
    id: "scan_e2e_001",
    inputText: "Urgent bank alert. Your account will be locked. Send your OTP now.",
    redactedText: "Urgent bank alert. Your account will be locked. Send your OTP now.",
    riskScore: 96,
    verdict: "likely_scam",
    confidence: "high",
    summaryReason: "Creates false urgency and asks for an OTP.",
    detectedTactics: ["false_urgency", "verification_code_theft", "threat"],
    evidence: [
      {
        quote: "Send your OTP now",
        tactic: "verification_code_theft",
        severity: "high",
        explanation: "The message requests a verification code under pressure.",
        saferInterpretation: "Official organizations do not ask for OTPs in chat."
      }
    ],
    safeActions: ["Do not share codes.", "Verify through the official app.", "Ignore suspicious links."],
    safeReplyOptions: ["I will verify this through the official channel before taking action."],
    categories: ["bank"],
    disclaimer: "This is guidance, not a guarantee. Verify important requests through official channels.",
    createdAt: new Date().toISOString()
  };

  await page.goto("/scan");
  await page.evaluate((value) => {
    window.localStorage.setItem("ai-lie-detector.history.v1", JSON.stringify([value]));
  }, scan);
  await page.goto("/results/scan_e2e_001");
  await page.evaluate((value) => {
    window.localStorage.setItem("ai-lie-detector.history.v1", JSON.stringify([value]));
  }, scan);
  await page.reload();

  await expect(page.getByRole("heading", { name: /likely scam/i })).toBeVisible();
  await expect(page.getByText("Creates false urgency and asks for an OTP.")).toBeVisible();
  await expect(page.getByText("Do not share codes.")).toBeVisible();
});

test("scan page shows screenshot OCR upload controls", async ({ page }) => {
  await page.goto("/scan");

  await page.getByRole("button", { name: "Screenshot OCR" }).click();
  await expect(page.getByRole("button", { name: "Upload image" })).toBeVisible();
  await expect(page.getByText("Upload a screenshot to extract the text locally in your browser, then review the result before analysis.")).toBeVisible();
});
