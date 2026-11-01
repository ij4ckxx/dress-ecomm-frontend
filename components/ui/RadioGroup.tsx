"use client";

import React, { createContext, useContext, useEffect, useId, useRef, useState } from "react";
import gsap from "gsap";
import { cn } from "@/lib/utils/cn";
import { CometBorder } from "./CometBorder";
import { Label } from "./Label";

interface RadioGroupContextType {
  name?: string;
  value?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const RadioGroupContext = createContext<RadioGroupContextType | null>(null);

export interface RadioGroupProps {
  name?: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
}

/**
 * Pure custom luxury Radio Group container providing context to items.
 */
export const RadioGroup: React.FC<RadioGroupProps> = ({
  name,
  value: controlledValue,
  defaultValue = "",
  onValueChange,
  disabled = false,
  className = "",
  children,
}) => {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const currentValue = controlledValue !== undefined ? controlledValue : internalValue;

  const handleChange = (val: string) => {
    if (controlledValue === undefined) {
      setInternalValue(val);
    }
    onValueChange?.(val);
  };

  return (
    <RadioGroupContext.Provider
      value={{ name, value: currentValue, onChange: handleChange, disabled }}
    >
      <div role="radiogroup" className={cn("grid gap-3", className)}>
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
};

export interface RadioGroupItemProps {
  value: string;
  id?: string;
  label?: React.ReactNode;
  description?: React.ReactNode;
  badge?: string;
  disabled?: boolean;
  className?: string;
}

/**
 * Pure custom luxury circular radio button with razor-thin lightning shooting star orbit
 * and GSAP elastic jewel bounce.
 */
export const RadioGroupItem: React.FC<RadioGroupItemProps> = ({
  value,
  id,
  label,
  description,
  badge,
  disabled = false,
  className = "",
}) => {
  const ctx = useContext(RadioGroupContext);
  const generatedId = useId();
  const itemId = id || generatedId;

  const isChecked = ctx ? ctx.value === value : false;
  const isDisabled = disabled || (ctx ? ctx.disabled : false);

  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !isChecked) return;
    const dot = dotRef.current;
    if (!dot) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    // Elastic jewel bounce
    gsap.fromTo(
      dot,
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.32, ease: "back.out(2.4)" }
    );
  }, [isChecked]);

  const handleSelect = () => {
    if (isDisabled || !ctx) return;
    ctx.onChange(value);
  };

  return (
    <div
      onClick={handleSelect}
      className={cn(
        "flex items-start gap-3 select-none cursor-pointer group/radio",
        isDisabled ? "cursor-not-allowed opacity-40" : ""
      )}
    >
      <div className="relative pt-0.5 flex-shrink-0">
        {/* Hidden native radio for accessibility */}
        <input
          type="radio"
          id={itemId}
          name={ctx?.name}
          value={value}
          checked={isChecked}
          disabled={isDisabled}
          onChange={() => handleSelect()}
          className="sr-only"
        />

        {/* Custom Luxury Radio with Lightning Glow Orbit */}
        <CometBorder
          isFocused={isChecked}
          disabled={isDisabled}
          borderRadius={10}
          className="w-5 h-5"
        >
          <div
            role="radio"
            aria-checked={isChecked}
            tabIndex={isDisabled ? -1 : 0}
            onKeyDown={(e) => {
              if (e.key === " " || e.key === "Enter") {
                e.preventDefault();
                handleSelect();
              }
            }}
            className={cn(
              "relative h-5 w-5 rounded-full transition-all duration-200 flex items-center justify-center bg-surface-card",
              "focus:outline-none",
              className
            )}
          >
            {/* Inner Jewel Dot */}
            {isChecked && (
              <div
                ref={dotRef}
                className="w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-primary to-accent shadow-sm"
              />
            )}
          </div>
        </CometBorder>
      </div>

      {(label || description) && (
        <label
          htmlFor={itemId}
          className="text-sm cursor-pointer"
        >
          <div className="flex items-center gap-2">
            {label && (
              <span
                className={cn(
                  "font-medium transition-colors",
                  isChecked ? "text-primary" : "text-text-main group-hover/radio:text-primary"
                )}
              >
                {label}
              </span>
            )}
            {badge && (
              <span className="px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-md bg-surface-tint/30 text-primary">
                {badge}
              </span>
            )}
          </div>
          {description && (
            <p className="mt-0.5 text-xs text-text-subtle leading-relaxed">
              {description}
            </p>
          )}
        </label>
      )}
    </div>
  );
};

export interface RadioOption {
  value: string;
  label: string;
  description?: string;
  badge?: string;
  icon?: React.ReactNode;
}

export interface RadioPillsProps {
  name?: string;
  options: RadioOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

/**
 * Editorial segmented pill selector with active state and smooth transitions.
 */
export const RadioPills: React.FC<RadioPillsProps> = ({
  name,
  options,
  value: controlledValue,
  defaultValue = options[0]?.value || "",
  onValueChange,
  disabled = false,
  className = "",
}) => {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const selected = controlledValue !== undefined ? controlledValue : internalValue;

  const handleSelect = (val: string) => {
    if (disabled) return;
    if (controlledValue === undefined) {
      setInternalValue(val);
    }
    onValueChange?.(val);
  };

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {options.map((opt) => {
        const isSelected = selected === opt.value;
        return (
          <CometBorder
            key={opt.value}
            isFocused={isSelected}
            borderRadius={12}
            className="w-auto inline-block"
          >
            <button
              type="button"
              disabled={disabled}
              onClick={() => handleSelect(opt.value)}
              className={cn(
                "relative px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer",
                "focus:outline-none flex items-center gap-2 select-none",
                isSelected
                  ? "bg-primary text-primary-contrast"
                  : "bg-surface-card text-text-secondary hover:text-text-main hover:bg-surface-soft"
              )}
            >
              {opt.icon && <span className="w-4 h-4">{opt.icon}</span>}
              <span>{opt.label}</span>
              {opt.badge && (
                <span
                  className={cn(
                    "px-1.5 py-0.5 text-[10px] uppercase tracking-wider rounded-md font-semibold",
                    isSelected
                      ? "bg-white/20 text-white"
                      : "bg-surface-tint/40 text-primary"
                  )}
                >
                  {opt.badge}
                </span>
              )}
            </button>
          </CometBorder>
        );
      })}
    </div>
  );
};

export interface RadioGroupFieldProps {
  id?: string;
  name?: string;
  label?: string;
  options: RadioOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  variant?: "pills" | "simple";
  error?: string;
  hint?: string;
  required?: boolean;
  optional?: boolean;
  disabled?: boolean;
  className?: string;
  wrapperClassName?: string;
}

/**
 * High-level luxury Radio Group Field with accessible labeling.
 */
export const RadioGroupField: React.FC<RadioGroupFieldProps> = ({
  name,
  label,
  options,
  value,
  defaultValue,
  onValueChange,
  variant = "pills",
  error,
  hint,
  required = false,
  optional = false,
  disabled = false,
  className = "",
  wrapperClassName = "",
}) => {
  const generatedId = useId();
  const errorId = `${generatedId}-error`;
  const hintId = `${generatedId}-hint`;

  return (
    <div className={cn("w-full", wrapperClassName)}>
      {label && (
        <Label required={required} optional={optional}>
          {label}
        </Label>
      )}

      {variant === "pills" ? (
        <RadioPills
          name={name}
          options={options}
          value={value}
          defaultValue={defaultValue}
          onValueChange={onValueChange}
          disabled={disabled}
          className={className}
        />
      ) : (
        <RadioGroup
          name={name}
          value={value}
          defaultValue={defaultValue}
          onValueChange={onValueChange}
          disabled={disabled}
          className={cn("grid gap-2.5", className)}
        >
          {options.map((opt) => (
            <RadioGroupItem
              key={opt.value}
              value={opt.value}
              label={opt.label}
              description={opt.description}
              badge={opt.badge}
              disabled={disabled}
            />
          ))}
        </RadioGroup>
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

export default RadioGroupField;
