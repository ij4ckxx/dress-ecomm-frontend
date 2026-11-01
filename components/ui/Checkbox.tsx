"use client";

import React, { forwardRef, useEffect, useId, useRef, useState } from "react";
import gsap from "gsap";
import { cn } from "@/lib/utils/cn";
import { CometBorder } from "./CometBorder";

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "onChange"> {
  label?: React.ReactNode;
  description?: React.ReactNode;
  error?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  wrapperClassName?: string;
  cardVariant?: boolean;
}

/**
 * Pure custom luxury checkbox with GSAP drawn SVG checkmark animation
 * and the razor-thin lightning shooting star border on active/checked state.
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      id,
      name,
      label,
      description,
      error,
      cardVariant = false,
      disabled = false,
      className = "",
      wrapperClassName = "",
      checked: controlledChecked,
      defaultChecked = false,
      onCheckedChange,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const checkboxId = id || generatedId;
    const errorId = `${checkboxId}-error`;

    const [internalChecked, setInternalChecked] = useState(defaultChecked);
    const isChecked = controlledChecked !== undefined ? controlledChecked : internalChecked;

    const pathRef = useRef<SVGPathElement>(null);
    const boxRef = useRef<HTMLDivElement>(null);

    // Animate the SVG checkmark draw on check toggle
    useEffect(() => {
      if (typeof window === "undefined") return;
      const path = pathRef.current;
      const box = boxRef.current;
      if (!path || !box) return;

      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (isChecked) {
        if (prefersReducedMotion) {
          path.style.strokeDashoffset = "0";
          return;
        }

        const length = path.getTotalLength() || 24;

        gsap.set(path, {
          strokeDasharray: length,
          strokeDashoffset: length,
        });

        // Box scale pulse
        gsap.fromTo(
          box,
          { scale: 0.85 },
          { scale: 1, duration: 0.25, ease: "back.out(2.2)" }
        );

        // Path draw animation
        gsap.to(path, {
          strokeDashoffset: 0,
          duration: 0.25,
          delay: 0.04,
          ease: "power2.out",
        });
      }
    }, [isChecked]);

    const handleToggle = () => {
      if (disabled) return;
      const next = !isChecked;
      if (controlledChecked === undefined) {
        setInternalChecked(next);
      }
      onCheckedChange?.(next);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        handleToggle();
      }
    };

    const checkboxControl = (
      <div className="flex items-start gap-3 select-none">
        <div className="relative pt-0.5 flex-shrink-0">
          {/* Hidden native input for form accessibility */}
          <input
            ref={ref}
            type="checkbox"
            id={checkboxId}
            name={name}
            checked={isChecked}
            disabled={disabled}
            onChange={(e) => {
              if (controlledChecked === undefined) {
                setInternalChecked(e.target.checked);
              }
              onCheckedChange?.(e.target.checked);
            }}
            className="sr-only"
            {...props}
          />

          {/* Custom Luxury Checkbox with Lightning Glow Border */}
          <CometBorder
            isFocused={isChecked}
            hasError={Boolean(error)}
            disabled={disabled}
            borderRadius={6}
            className="w-5 h-5"
          >
            <div
              ref={boxRef}
              tabIndex={disabled ? -1 : 0}
              role="checkbox"
              aria-checked={isChecked}
              aria-disabled={disabled}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? errorId : undefined}
              onClick={handleToggle}
              onKeyDown={handleKeyDown}
              className={cn(
                "relative h-5 w-5 rounded-[6px] transition-all duration-200 cursor-pointer flex items-center justify-center",
                "focus:outline-none",
                isChecked
                  ? "bg-primary text-white"
                  : "bg-surface-card hover:bg-surface-soft",
                disabled ? "cursor-not-allowed opacity-40" : "",
                className
              )}
            >
              {/* Animated SVG Checkmark */}
              <svg
                className={cn(
                  "w-3.5 h-3.5 text-white transition-opacity duration-150",
                  isChecked ? "opacity-100" : "opacity-0"
                )}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path ref={pathRef} d="M5 13l4.5 4.5L19 7" />
              </svg>
            </div>
          </CometBorder>
        </div>

        {(label || description) && (
          <div
            onClick={handleToggle}
            className={cn(
              "text-sm cursor-pointer leading-normal",
              disabled ? "cursor-not-allowed opacity-50" : ""
            )}
          >
            {label && (
              <span className="font-normal text-text-main text-xs sm:text-sm">
                {label}
              </span>
            )}
            {description && (
              <p className="mt-0.5 text-xs text-text-subtle leading-relaxed">
                {description}
              </p>
            )}
          </div>
        )}
      </div>
    );

    return (
      <div className={cn("w-full flex flex-col gap-1", wrapperClassName)}>
        {cardVariant ? (
          <div
            onClick={handleToggle}
            className={cn(
              "p-3.5 rounded-xl border transition-all duration-200 bg-surface-card cursor-pointer",
              isChecked
                ? "border-accent/60 bg-surface-soft/60 shadow-xs"
                : "border-border/80 hover:border-accent/40 hover:bg-surface-soft/30"
            )}
          >
            {checkboxControl}
          </div>
        ) : (
          checkboxControl
        )}

        {error && (
          <p
            id={errorId}
            role="alert"
            className="mt-1 text-xs text-error font-medium flex items-center gap-1.5"
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
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";

export default Checkbox;
