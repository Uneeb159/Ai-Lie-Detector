export function redactSensitiveText(text: string) {
  return text
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "[EMAIL]")
    .replace(/(?:\+?\d[\s.-]?){9,}\d/g, "[PHONE]")
    .replace(/\b(?:\d[ -]*?){13,19}\b/g, "[CARD]")
    .replace(/\b(?:otp|code|pin|verification code)\s*[:#-]?\s*\d{4,8}\b/gi, "$1 [CODE]")
    .replace(/\b\d{6}\b/g, "[CODE]");
}
