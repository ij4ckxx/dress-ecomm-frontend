"use client";

import React from "react";
import { cn } from "@/lib/utils/cn";

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
  optional?: boolean;
  helperText?: string;
}

/**
 * Accessible luxury form field label with editorial typography and indicators.
 * Pure custom React component without external dependencies.
 */
export const Label: React.FC<LabelProps> = ({
  htmlFor,
  className = "",
  required = false,
  optional = false,
  helperText,
  children,
  ...props
}) => {
  return (
    <div className="flex items-center justify-between gap-2 mb-1.5">
      <label
        htmlFor={htmlFor}
        className={cn(
          "block text-xs uppercase tracking-wider font-semibold text-text-main select-none cursor-pointer",
          className
        )}
        {...props}
      >
        {children}
        {required && (
          <span className="text-error ml-1" aria-hidden="true">
            *
          </span>
        )}
      </label>

      {optional && (
        <span className="text-[10px] text-text-subtle normal-case font-normal">
          (Optional)
        </span>
      )}

      {helperText && !optional && (
        <span className="text-[10px] text-text-subtle normal-case font-normal">
          {helperText}
        </span>
      )}
    </div>
  );
};

export default Label;
