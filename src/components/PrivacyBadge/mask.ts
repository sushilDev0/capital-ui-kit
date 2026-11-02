export type MaskPattern = "all" | "last4" | "first4";

// Letters and digits are maskable, so account numbers such as IBANs work too.
// Spaces and dashes are separators and are never masked.
const MASKABLE = /[A-Za-z0-9]/g;

export function groupDigits(value: string, size = 4): string {
  const digits = value.replace(/\D/g, "");
  return digits.match(new RegExp(`.{1,${size}}`, "g"))?.join(" ") ?? "";
}

/** Removes spaces and dashes so the value can be masked and regrouped consistently. */
export function compact(value: string): string {
  return value.replace(/[\s-]/g, "");
}

/** Splits a string into space-separated groups, e.g. "•••• •••• 3456". */
export function groupChars(value: string, size = 4): string {
  return value.match(new RegExp(`.{1,${size}}`, "g"))?.join(" ") ?? "";
}

export function maskValue(value: string, pattern: MaskPattern, maskChar: string): string {
  const total = (value.match(MASKABLE) ?? []).length;
  const canShow = total > 4; // never reveal short numbers
  let seen = 0;

  return value.replace(MASKABLE, (ch) => {
    const i = seen++;
    const visible =
      canShow &&
      ((pattern === "last4" && i >= total - 4) ||
        (pattern === "first4" && i < 4));
    return visible ? ch : maskChar;
  });
}

/** Text for screen readers while the value is hidden. Never includes more than the visible part. */
export function describeMasked(value: string, pattern: MaskPattern): string {
  const chars = compact(value);
  if (chars.length <= 4 || pattern === "all") return "Hidden";
  const spoken = (s: string) => s.split("").join(" ");
  return pattern === "last4"
    ? `Hidden, ending in ${spoken(chars.slice(-4))}`
    : `Hidden, starting with ${spoken(chars.slice(0, 4))}`;
}
