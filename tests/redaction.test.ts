import { describe, expect, it } from "vitest";
import { redactSensitiveText } from "@/lib/redaction";

describe("redactSensitiveText", () => {
  it("masks contact and code data while preserving intent", () => {
    const redacted = redactSensitiveText("Email me at user@example.com or call +1 555 123 4567. OTP: 492881");
    expect(redacted).toContain("[EMAIL]");
    expect(redacted).toContain("[PHONE]");
    expect(redacted).toContain("[CODE]");
  });
});
