import React, { useState, useRef, useEffect } from 'react';
import type { HoldToConfirmButtonProps } from './schema';
import './HoldToConfirmButton.css';

// 🎨 The Semantic Theme Map
const THEME_MAP: Record<string, string> = {
  primary: "#3797d8", // Blue
  success: "#10b981", // Green
  warning: "#f59e0b", // Amber
  danger:  "#ef4444", // Red
  info:    "#06b6d4", // Cyan
  neutral: "#64748b", // Slate
  dark:    "#1e293b", 
  light:   "#e2e8f0",
};

// Helper to determine text color based on background
function getContrastColor(bgColor: string): string {
  if (!bgColor.startsWith("#")) return "#ffffff"; // Default for CSS vars
  const hex = bgColor.replace("#", "");
  if (hex.length !== 3 && hex.length !== 6) return "#ffffff";

  let r = 0, g = 0, b = 0;
  if (hex.length === 3) {
    r = parseInt(hex[0] + hex[0], 16);
    g = parseInt(hex[1] + hex[1], 16);
    b = parseInt(hex[2] + hex[2], 16);
  } else {
    r = parseInt(hex.substring(0, 2), 16);
    g = parseInt(hex.substring(2, 4), 16);
    b = parseInt(hex.substring(4, 6), 16);
  }
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? "#0f172a" : "#ffffff"; // Dark text for light bgs, Light text for dark bgs
}

export const HoldToConfirmButton: React.FC<HoldToConfirmButtonProps> = ({
  onConfirm,
  label = "Hold to confirm",
  holdDuration = 1000,
  disabled = false,
  theme = "primary",
  size = "md",
  variant = "solid",
  className = "",
  children,
  icon, // 👈 1. ADD THIS
  ...nativeProps
}) => {
  const [isHolding, setIsHolding] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  const startHold = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (disabled || (e.button !== 0 && e.pointerType === 'mouse')) return;
    setIsHolding(true);
    timerRef.current = window.setTimeout(() => {
      setIsHolding(false);
      onConfirm();
    }, holdDuration);
  };

  const cancelHold = () => {
    if (disabled) return;
    setIsHolding(false);
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  // 1. Resolve the actual background color
  const bgColor = THEME_MAP[theme] || theme;
  
  // 2. Calculate the text and progress colors
  const textColor = getContrastColor(bgColor);
  // Use a semi-transparent black overlay for the progress bar so it works on ANY color
  const progressColor = "rgba(0, 0, 0, 0.15)"; 

  const classes = ['hold-btn', isHolding ? 'holding' : '', className].filter(Boolean).join(' ');

  const customStyles = {
    ...nativeProps.style,
    '--btn-duration': `${holdDuration}ms`,
    '--btn-bg': bgColor,
    '--btn-text': textColor,
    '--btn-progress': progressColor,
  } as React.CSSProperties;

  return (
    <button
      {...nativeProps}
      className={classes}
      data-size={size}
      data-variant={variant}
      disabled={disabled}
      style={customStyles}
      onPointerDown={startHold}
      onPointerUp={cancelHold}
      onPointerLeave={cancelHold}
      onContextMenu={(e) => e.preventDefault()}
    >
      <span className="hold-btn__progress" />
      <span className="hold-btn__content">
        {/* 👈 2. Render the icon if provided */}
        {icon && <span className="hold-btn__icon">{icon}</span>}
        
        {children || label}
      </span>
    </button>
  );
};