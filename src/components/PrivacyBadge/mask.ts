export type MaskPattern = "all" | "last4" | "first4";

export function groupDigits(value: string, size = 4): string {
  const digits = value.replace(/\D/g, "");
  return digits.match(new RegExp(`.{1,${size}}`, "g"))?.join(" ") ?? "";
}

export function maskValue(value: string, pattern: MaskPattern, maskChar: string): string {
  const total = value.replace(/\D/g, "").length;
  const canShow = total > 4; // never reveal short numbers
  let seen = 0;

  return value.replace(/\d/g, (digit) => {
    const i = seen++;
    const visible =
      canShow &&
      ((pattern === "last4" && i >= total - 4) ||
        (pattern === "first4" && i < 4));
    return visible ? digit : maskChar;
  });
}