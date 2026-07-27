import { describe, expect, it } from "vitest";
import { normalizeOcrText } from "@/lib/ocr";

describe("normalizeOcrText", () => {
  it("collapses noisy screenshot spacing without changing meaning", () => {
    const normalized = normalizeOcrText("Hello  \r\n\r\n  your code is  492881\n\n\nThanks");

    expect(normalized).toBe("Hello\n\n your code is 492881\n\nThanks");
  });
});
