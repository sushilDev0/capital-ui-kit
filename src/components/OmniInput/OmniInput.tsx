import React, { useState, useEffect, useRef, useId } from 'react';
import { motion, useAnimation } from 'motion/react';
import type { OmniInputProps } from './schema';
import { sanitizeInput, parseValue, formatDisplayValue, calculateCaretPosition } from './omni-helpers';
import './OmniInput.css';

export const OmniInput: React.FC<OmniInputProps> = ({
  value = null,
  onChange,
  format = 'currency',
  locale = 'en-IN',
  decimals = 2,
  currency = 'INR',
  symbol,
  symbolPosition = 'prefix',
  showSymbol = true,
  min,
  max,
  label,
  placeholder = '0.00',
  error: externalError,
  disabled = false,
  enableShortcuts = true,
  presets,
  id,
  name,
  theme = 'dark',
  size = 'md',
  variant = 'default',
  align = 'right',
  className = '',
  prefix,
  suffix,
}) => {
  const autoId = useId();
  const inputId = id || autoId;
  const inputRef = useRef<HTMLInputElement>(null);
  const shakeControls = useAnimation();
  
  const [displayValue, setDisplayValue] = useState('');
  const [internalError, setInternalError] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);

  const activeError = externalError || internalError;

  // 1. Shake on Error
  useEffect(() => {
    if (activeError) {
      shakeControls.start({ x: [0, -8, 8, -6, 6, -3, 3, 0], transition: { duration: 0.4, ease: "easeInOut" } });
    }
  }, [activeError, shakeControls]);

  // 2. Sync external value changes (formats differently when focused vs blurred)
  useEffect(() => {
    if (value === null) {
      if (displayValue !== '') setDisplayValue('');
      return;
    }

    const parsedDisplay = parseValue(displayValue);
    // Only overwrite display if the value actually changed (prevents caret jumping)
    if (value !== parsedDisplay) {
      setDisplayValue(
        formatDisplayValue(value, format, locale, currency, symbol, symbolPosition, showSymbol, isFocused, decimals)
      );
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, format, locale, currency, symbol, symbolPosition, showSymbol, isFocused, decimals]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const selectionStart = e.target.selectionStart || 0;

    // A. Sanitize and Parse
    const sanitized = sanitizeInput(raw, decimals, enableShortcuts);
    const parsed = parseValue(sanitized);
    onChange(parsed);

    // B. Format for Display (Always use isFocused=true here so we don't add .00 while typing)
    const formatted = formatDisplayValue(parsed, format, locale, currency, symbol, symbolPosition, showSymbol, true, decimals);
    setDisplayValue(formatted);
    setInternalError(null);

    // C. Restore Caret
    requestAnimationFrame(() => {
      if (inputRef.current) {
        // If they typed a shortcut, push cursor to end
        const isShortcut = /[kmb]/i.test(raw);
        if (isShortcut) {
          const len = formatted.length;
          inputRef.current.setSelectionRange(len, len);
        } else {
          const newPos = calculateCaretPosition(raw, selectionStart, formatted);
          inputRef.current.setSelectionRange(newPos, newPos);
        }
      }
    });
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (value !== null) {
      // Validate
      if (min !== undefined && value < min) setInternalError(`Minimum is ${formatDisplayValue(min, format, locale, currency, symbol, symbolPosition, showSymbol, false, decimals)}`);
      else if (max !== undefined && value > max) setInternalError(`Maximum is ${formatDisplayValue(max, format, locale, currency, symbol, symbolPosition, showSymbol, false, decimals)}`);
      else setInternalError(null);

      // Force full decimals on blur
      setDisplayValue(
        formatDisplayValue(value, format, locale, currency, symbol, symbolPosition, showSymbol, false, decimals)
      );
    }
  };

  const applyPreset = (amount: number) => {
    onChange(amount);
    setDisplayValue(
      formatDisplayValue(amount, format, locale, currency, symbol, symbolPosition, showSymbol, false, decimals)
    );
    setInternalError(null);
    inputRef.current?.focus();
  };

  const classes = ['omni-input', className].filter(Boolean).join(' ');
  
  // Dynamic font sizing for huge numbers
  const stringLen = displayValue.length;
  const dynamicScale = stringLen > 18 ? '0.6em' : stringLen > 14 ? '0.7em' : stringLen > 10 ? '0.85em' : '1em';

  return (
    <div 
      className={classes}
      data-theme={theme}
      data-size={size}
      data-variant={variant}
      data-disabled={disabled ? 'true' : 'false'}
      data-error={activeError ? 'true' : 'false'}
      data-focused={isFocused ? 'true' : 'false'}
      data-align={align}
    >
      <div className="omni-input__header">
        {label && <label htmlFor={inputId} className="omni-input__label">{label}</label>}
        {activeError && <motion.span className="omni-input__error" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{activeError}</motion.span>}
      </div>
      
      <motion.div 
        className="omni-input__wrapper" 
        onClick={() => inputRef.current?.focus()}
        animate={shakeControls}
      >
        {prefix && <div className="omni-input__slot omni-input__prefix">{prefix}</div>}

        <input
          ref={inputRef}
          id={inputId}
          name={name}
          type="text"
          inputMode={format === 'currency' || format === 'decimal' ? 'decimal' : 'numeric'}
          autoComplete="off"
          className="omni-input__field"
          value={displayValue}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={() => setIsFocused(true)}
          placeholder={placeholder}
          disabled={disabled}
          aria-invalid={!!activeError}
          aria-describedby={activeError ? `${inputId}-error` : undefined}
          style={{ fontSize: `calc(var(--omni-base-size) * ${dynamicScale})` }}
        />

        {suffix && <div className="omni-input__slot omni-input__suffix">{suffix}</div>}
      </motion.div>

      {presets && presets.length > 0 && (
        <div className="omni-input__presets">
          {presets.map((preset) => (
            <motion.button
              key={preset}
              type="button"
              className="omni-input__preset-btn"
              onClick={() => applyPreset(preset)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {formatDisplayValue(preset, format, locale, currency, symbol, symbolPosition, showSymbol, false, 0)}
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
};

export default OmniInput;