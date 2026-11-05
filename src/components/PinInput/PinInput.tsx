import React, { useState, useRef, useEffect } from "react";
import type { PinInputProps } from "./schema";

export const PinInput = React.forwardRef<HTMLInputElement, PinInputProps>(
  (
    {
      length = 4,
      type = "numeric",
      variant = "box",
      size = "md",
      value,
      defaultValue,
      error,
      mask = false,
      allowCopy = false,
      autoFocus = false,
      className = "",
      onChange,
      onComplete,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState(defaultValue || "");
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      if (typeof ref === "function") {
        ref(inputRef.current);
      } else if (ref) {
        ref.current = inputRef.current;
      }
    }, [ref]);

    useEffect(() => {
      if (autoFocus && inputRef.current) {
        inputRef.current.focus();
      }
    }, [autoFocus]);

    const isControlled = value !== undefined;
    const currentValue = isControlled ? value : internalValue;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let val = e.target.value;

      if (type === "numeric") {
        val = val.replace(/\D/g, "");
      } else {
        val = val.replace(/[^a-zA-Z0-9]/g, "");
      }

      if (val.length > length) return;

      if (!isControlled) {
        setInternalValue(val);
      }
      
      onChange?.(val);

      if (val.length === length) {
        onComplete?.(val);
      }
    };

    const hasError = Boolean(error);
    const errorMessage = typeof error === "string" ? error : null;

    const wrapperClass = [
      "pin-wrapper",
      !allowCopy ? "pin-no-copy" : "",
      className
    ].filter(Boolean).join(" ");

    return (
      <div className="pin-container">
        <div
          className={wrapperClass}
          onClick={() => inputRef.current?.focus()}
        >
          <input
            {...props}
            ref={inputRef}
            type="text"
            inputMode={type === "numeric" ? "numeric" : "text"}
            pattern={type === "numeric" ? "[0-9]*" : undefined}
            value={currentValue}
            onChange={handleChange}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e); 
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e); 
            }}
            autoComplete="one-time-code"
            className="pin-hidden-input"
            aria-invalid={hasError}
          />

          {Array.from({ length }).map((_, index) => {
            const char = currentValue[index];
            
            const isActiveBox = isFocused && (
              currentValue.length === index || 
              (currentValue.length === length && index === length - 1)
            );

            const boxClass = [
              "pin-box",
              `pin-size-${size}`,
              `pin-variant-${variant}`,
              hasError ? "pin-error" : isActiveBox ? "pin-active" : "pin-default"
            ].filter(Boolean).join(" ");

            return (
              <div key={index} className={boxClass}>
                {char ? (mask ? "•" : char) : ""}
              </div>
            );
          })}
        </div>
        
        {errorMessage && (
          <span className="pin-error-text">{errorMessage}</span>
        )}
      </div>
    );
  }
);

PinInput.displayName = "PinInput";