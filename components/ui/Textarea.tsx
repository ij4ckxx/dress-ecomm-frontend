"use client";

import React, { forwardRef, useId, useState } from "react";
import { cn } from "@/lib/utils/cn";
import { CometBorder } from "./CometBorder";
import { Label } from "./Label";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  optional?: boolean;
  wrapperClassName?: string;
  containerClassName?: string;
  duration?: number;
}

/**
 * Pure custom luxury multi-line textarea with animated glowing train border.
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      id,
      name,
      label,
      error,
      hint,
      optional = false,
      required = false,
      disabled = false,
      rows = 4,
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
    const textareaId = id || generatedId;
    const errorId = `${textareaId}-error`;
    const hintId = `${textareaId}-hint`;
    const [isFocused, setIsFocused] = useState(false);

    return (
      <div className={cn("w-full", wrapperClassName)}>
        {label && (
          <Label htmlFor={textareaId} required={required} optional={optional}>
            {label}
          </Label>
        )}

        <CometBorder
          isFocused={isFocused}
          hasError={Boolean(error)}
          disabled={disabled}
          duration={duration}
          borderRadius={12}
          className={containerClassName}
        >
          <textarea
            ref={ref}
            id={textareaId}
            name={name}
            rows={rows}
            disabled={disabled}
            required={required}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : hint ? hintId : undefined}
            onFocus={(e) => {
              setIsFocused(true);
              onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              onBlur?.(e);
            }}
            className={cn(
              "w-full bg-surface-card rounded-xl px-4 py-3 text-sm text-text-main placeholder-text-subtle/80",
              "focus:outline-none focus:ring-0 resize-y min-h-[96px] selection:bg-surface-tint/50",
              "disabled:cursor-not-allowed disabled:text-text-subtle disabled:opacity-50",
              className
            )}
            {...props}
          />
        </CometBorder>

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

        {hint && !error && (
          <p id={hintId} className="mt-1 text-xs text-text-subtle">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export default Textarea;
