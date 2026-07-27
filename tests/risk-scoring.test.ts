import { describe, expect, it } from "vitest";
import { analyzeDeterministically } from "@/lib/risk-scoring";

describe("analyzeDeterministically", () => {
  it("scores urgent bank OTP requests as likely scam", () => {
    const result = analyzeDeterministically({
      text: "Urgent bank alert. Your account will be locked. Send your OTP now at http://bad.example",
      redactedText: "Urgent bank alert. Your account will be locked. Send your OTP now at http://bad.example",
      senderType: "unknown",
      requestedAction: "share_code",
      sensitivity: "balanced"
    });

    expect(result.riskScore).toBeGreaterThanOrEqual(85);
    expect(result.verdict).toBe("likely_scam");
    expect(result.detectedTactics).toContain("verification_code_theft");
  });

  it("caps short ambiguous messages", () => {
    const result = analyzeDeterministically({
      text: "hi",
      redactedText: "hi",
      senderType: "unknown",
      requestedAction: "none",
      sensitivity: "balanced"
    });

    expect(result.riskScore).toBeLessThanOrEqual(50);
    expect(result.verdict).toBe("unclear");
  });
});
