/* ============================================================
   Omni-Input Helpers: Pure, Testable, Fast
   ============================================================ */

export function sanitizeInput(raw: string, decimals: number, enableShortcuts: boolean): string {
  let sanitized = raw.replace(/[^\d.kmb]/gi, '');

  // 1. Handle Shortcuts (1k, 1.5m, 2b)
  if (enableShortcuts) {
    const lower = sanitized.toLowerCase();
    const multiplier = lower.includes('k') ? 1000 : lower.includes('m') ? 1000000 : lower.includes('b') ? 1000000000 : 1;
    
    if (multiplier > 1) {
      const numStr = lower.replace(/[kmb]/g, '');
      const num = parseFloat(numStr);
      if (!isNaN(num)) {
        sanitized = String(num * multiplier);
      }
    }
  }

  // 2. Standard cleanup (remove non-numbers/dots)
  sanitized = sanitized.replace(/[^\d.]/g, '');
  
  // 3. Handle multiple dots (e.g., 1.2.3 -> 1.23)
  const parts = sanitized.split('.');
  if (parts.length > 2) sanitized = parts[0] + '.' + parts.slice(1).join('');
  
  // 4. Cap decimals
  const currentParts = sanitized.split('.');
  if (currentParts.length === 2 && currentParts[1].length > decimals) {
    sanitized = currentParts[0] + '.' + currentParts[1].slice(0, decimals);
  }

  // 5. Drop leading zeros
  if (sanitized.length > 1 && sanitized.startsWith('0') && sanitized[1] !== '.') {
    sanitized = sanitized.replace(/^0+/, '');
  }

  return sanitized;
}

export function parseValue(sanitized: string): number | null {
  if (!sanitized || sanitized === '.') return null;
  const num = parseFloat(sanitized);
  return isNaN(num) ? null : num;
}

export function formatDisplayValue(
  value: number | null,
  format: "currency" | "decimal" | "percent" | "compact",
  locale: string,
  currency: string,
  customSymbol: string | undefined,
  symbolPosition: "prefix" | "suffix",
  showSymbol: boolean,
  isFocused: boolean,
  decimals: number
): string {
  if (value === null) return '';

  let formatted = '';
  const options: Intl.NumberFormatOptions = {};

  // Base formatting rules
  if (format === "compact") {
    options.notation = "compact";
    options.compactDisplay = "short";
    options.maximumFractionDigits = 1; // 1.5M
  } else if (format === "percent") {
    options.style = "percent";
    options.minimumFractionDigits = isFocused ? 0 : decimals;
    options.maximumFractionDigits = decimals;
  } else if (format === "currency" && !customSymbol) {
    options.style = "currency";
    options.currency = currency;
    options.minimumFractionDigits = isFocused ? 0 : decimals;
    options.maximumFractionDigits = decimals;
  } else {
    // Decimal or Custom Symbol (Crypto/Stocks)
    options.style = "decimal";
    options.minimumFractionDigits = isFocused ? 0 : decimals;
    options.maximumFractionDigits = decimals;
  }

  const formatter = new Intl.NumberFormat(locale, options);
  formatted = formatter.format(value);

  // Inject custom symbols (e.g., BTC, AAPL, %)
  if (showSymbol) {
    let displaySymbol = customSymbol;
    if (!displaySymbol && format === "percent") displaySymbol = "%";
    
    if (displaySymbol) {
      formatted = symbolPosition === "prefix" 
        ? `${displaySymbol}${formatted}` 
        : `${formatted} ${displaySymbol}`;
    }
  }

  return formatted;
}

export function calculateCaretPosition(
  raw: string,
  selectionStart: number,
  nextFormatted: string
): number {
  const textBeforeCaret = raw.slice(0, selectionStart);
  const digitCount = textBeforeCaret.replace(/[^\d]/g, '').length;

  let newPos = 0;
  let digitsFound = 0;
  
  for (let i = 0; i < nextFormatted.length; i++) {
    if (/\d/.test(nextFormatted[i])) digitsFound++;
    if (digitsFound === digitCount) { newPos = i + 1; break; }
  }

  if (digitsFound < digitCount) newPos = nextFormatted.length;
  return newPos;
}