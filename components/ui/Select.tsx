"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/utils/cn";
import { CometBorder } from "./CometBorder";
import { Label } from "./Label";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectFieldProps {
  id?: string;
  name?: string;
  label?: string;
  placeholder?: string;
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  error?: string;
  hint?: string;
  required?: boolean;
  optional?: boolean;
  disabled?: boolean;
  className?: string;
  wrapperClassName?: string;
  duration?: number;
}

/**
 * Pure custom luxury select dropdown wrapped with the animated glowing train border.
 * Features portal-like positioning, click-outside handling, and keyboard accessibility.
 */
export const SelectField: React.FC<SelectFieldProps> = ({
  id,
  name,
  label,
  placeholder = "Select an option...",
  options,
  value: controlledValue,
  defaultValue = "",
  onValueChange,
  error,
  hint,
  required = false,
  optional = false,
  disabled = false,
  className = "",
  wrapperClassName = "",
  duration = 4,
}) => {
  const generatedId = useId();
  const selectId = id || generatedId;
  const errorId = `${selectId}-error`;
  const hintId = `${selectId}-hint`;

  const [isOpen, setIsOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(defaultValue);
  const currentValue = controlledValue !== undefined ? controlledValue : internalValue;

  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (val: string) => {
    if (controlledValue === undefined) {
      setInternalValue(val);
    }
    onValueChange?.(val);
    setIsOpen(false);
  };

  const selectedOption = options.find((opt) => opt.value === currentValue);

  return (
    <div ref={containerRef} className={cn("w-full relative", wrapperClassName)}>
      {label && (
        <Label htmlFor={selectId} required={required} optional={optional}>
          {label}
        </Label>
      )}

      {/* Hidden input for form submission */}
      {name && <input type="hidden" name={name} value={currentValue} />}

      <CometBorder
        isFocused={isOpen}
        hasError={Boolean(error)}
        disabled={disabled}
        duration={duration}
        borderRadius={12}
      >
        <button
          type="button"
          id={selectId}
          disabled={disabled}
          onClick={() => !disabled && setIsOpen((prev) => !prev)}
          className={cn(
            "flex h-11 w-full items-center justify-between rounded-xl bg-surface-card px-4 py-2.5 text-sm text-text-main text-left",
            "focus:outline-none focus:ring-0 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer",
            className
          )}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <span
            className={cn(
              "truncate",
              selectedOption ? "text-text-main font-medium" : "text-text-subtle/80"
            )}
          >
            {selectedOption ? selectedOption.label : placeholder}
          </span>

          <svg
            className={cn(
              "w-4 h-4 text-text-subtle transition-transform duration-200 flex-shrink-0 ml-2",
              isOpen ? "rotate-180 text-primary" : ""
            )}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </CometBorder>

      {/* Floating Dropdown Menu */}
      {isOpen && (
        <div
          role="listbox"
          className="absolute left-0 right-0 top-full mt-2 z-50 overflow-hidden rounded-xl border border-border/80 bg-surface-card shadow-xl p-1.5 backdrop-blur-md animate-fadeIn"
        >
          {options.map((opt) => {
            const isSelected = opt.value === currentValue;
            return (
              <div
                key={opt.value}
                role="option"
                aria-selected={isSelected}
                onClick={() => !opt.disabled && handleSelect(opt.value)}
                className={cn(
                  "flex items-center justify-between px-3 py-2 rounded-lg text-sm cursor-pointer select-none transition-colors",
                  opt.disabled ? "opacity-40 cursor-not-allowed pointer-events-none" : "",
                  isSelected
                    ? "bg-surface-tint/30 text-primary font-semibold"
                    : "text-text-main hover:bg-surface-soft hover:text-primary"
                )}
              >
                <span>{opt.label}</span>
                {isSelected && (
                  <svg
                    className="w-4 h-4 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </div>
            );
          })}
        </div>
      )}

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
};

export default SelectField;
