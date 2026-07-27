import { describe, expect, it } from "vitest";
import { analysisResultSchema } from "@/lib/analysis-schema";
import { analyzeDeterministically } from "@/lib/risk-scoring";

describe("analysisResultSchema", () => {
  it("accepts generated deterministic results", () => {
    const result = analyzeDeterministically({
      text: "Buy gift cards and send the codes immediately.",
      redactedText: "Buy gift cards and send the codes immediately.",
      senderType: "unknown",
      requestedAction: "pay_money",
      sensitivity: "balanced"
    });

    expect(() => analysisResultSchema.parse(result)).not.toThrow();
  });
});
