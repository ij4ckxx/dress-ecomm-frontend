"use client";

import React, { forwardRef, useId, useState } from "react";
import { cn } from "@/lib/utils/cn";
import { CometBorder } from "./CometBorder";
import { Label } from "./Label";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  optional?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  wrapperClassName?: string;
  containerClassName?: string;
  duration?: number;
}

/**
 * Accessible luxury text input equipped with an animated glowing train border.
 * Features built-in password visibility toggle, icon adornments, and error alerts.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      id,
      name,
      type = "text",
      label,
      error,
      hint,
      optional = false,
      required = false,
      disabled = false,
      startIcon,
      endIcon,
      className = "",
      wrapperClassName = "",
      containerClassName = "",
      duration = 4,
      onFocus,
      onBlur,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const errorId = `${inputId}-error`;
    const hintId = `${inputId}-hint`;

    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const isPasswordField = type === "password";
    const computedType = isPasswordField && showPassword ? "text" : type;

    const togglePasswordVisibility = () => {
      setShowPassword((prev) => !prev);
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    return (
      <div className={cn("w-full", wrapperClassName)}>
        {/* Optional Field Label */}
        {label && (
          <Label htmlFor={inputId} required={required} optional={optional}>
            {label}
          </Label>
        )}

        {/* Train Border Envelope */}
        <CometBorder
          isFocused={isFocused}
          hasError={Boolean(error)}
          disabled={disabled}
          duration={duration}
          borderRadius={12}
          className={containerClassName}
        >
          <div className="relative flex items-center w-full bg-surface-card rounded-xl">
            {/* Optional Start Icon */}
            {startIcon && (
              <div
                className="pl-3.5 pr-1 flex items-center pointer-events-none text-text-subtle"
                aria-hidden="true"
              >
                {startIcon}
              </div>
            )}

            {/* Core HTML Input */}
            <input
              ref={ref}
              id={inputId}
              name={name}
              type={computedType}
              disabled={disabled}
              required={required}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? errorId : hint ? hintId : undefined}
              onFocus={handleFocus}
              onBlur={handleBlur}
              className={cn(
                "w-full h-11 bg-transparent px-4 py-2.5 text-sm text-text-main placeholder-text-subtle/80 rounded-xl",
                "focus:outline-none focus:ring-0 selection:bg-surface-tint/50",
                "disabled:cursor-not-allowed disabled:text-text-subtle disabled:opacity-50",
                startIcon ? "pl-2" : "",
                isPasswordField || endIcon ? "pr-11" : "",
                className
              )}
              {...props}
            />

            {/* Password Reveal Toggle Button */}
            {isPasswordField && (
              <button
                type="button"
                onClick={togglePasswordVisibility}
                disabled={disabled}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className={cn(
                  "absolute inset-y-0 right-0 pr-3.5 flex items-center text-text-subtle",
                  "hover:text-text-main focus:outline-none focus-visible:text-accent transition-colors cursor-pointer",
                  "disabled:cursor-not-allowed disabled:opacity-50"
                )}
              >
                {showPassword ? (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.8}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.8}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.8}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            )}

            {/* Custom End Icon */}
            {!isPasswordField && endIcon && (
              <div
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-text-subtle"
                aria-hidden="true"
              >
                {endIcon}
              </div>
            )}
          </div>
        </CometBorder>

        {/* Validation Error Notice */}
        {error && (
          <p
            id={errorId}
            role="alert"
            className="mt-1.5 text-xs text-error font-medium flex items-center gap-1.5"
          >
            <svg
              className="w-3.5 h-3.5 flex-shrink-0"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
                clipRule="evenodd"
              />
            </svg>
            <span>{error}</span>
          </p>
        )}

        {/* Helper Hint Text */}
        {hint && !error && (
          <p id={hintId} className="mt-1 text-xs text-text-subtle">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
