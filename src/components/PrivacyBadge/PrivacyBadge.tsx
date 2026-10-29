import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cx } from "../../lib/cx";
import "./privacy-badge.css";

type PrivacyBadgeProps = {
  value: string;
  label?: string;
  revealable?: boolean;
  visibleEnd?: number;
  className?: string;
};

const group = (s: string) => s.replace(/(.{4})/g, "$1 ").trim();

export function PrivacyBadge({
  value,
  label,
  revealable = false,
  visibleEnd = 4,
  className,
}: PrivacyBadgeProps) {
  const [shown, setShown] = useState(false);

  const masked = group(
    value.slice(0, -visibleEnd).replace(/./g, "•") + value.slice(-visibleEnd),
  );
  const text = shown ? group(value) : masked;

  return (
    <div className={cx("ui-privacy-badge", className)}>
      {label && <span className="ui-privacy-badge__label">{label}</span>}
      <div className="ui-privacy-badge__row">
        <span className="ui-privacy-badge__value">{text}</span>
        {revealable && (
          <button
            type="button"
            className="ui-privacy-badge__toggle"
            onClick={() => setShown((s) => !s)}
            aria-label={shown ? "Hide value" : "Reveal value"}
            aria-pressed={shown}
          >
            {shown ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
    </div>
  );
}