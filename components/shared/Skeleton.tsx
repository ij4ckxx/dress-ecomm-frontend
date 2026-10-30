import React from "react";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "rectangular" | "circular" | "text";
  width?: string | number;
  height?: string | number;
  label?: string;
}

/**
 * Accessible skeleton placeholder with smooth shimmer animation for asynchronous streaming.
 */
export const Skeleton: React.FC<SkeletonProps> = ({
  variant = "rectangular",
  width,
  height,
  className = "",
  label = "Loading content...",
  style,
  ...rest
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case "circular":
        return "rounded-full";
      case "text":
        return "rounded h-4 my-1";
      case "rectangular":
      default:
        return "rounded-md";
    }
  };

  const computedStyle: React.CSSProperties = {
    ...style,
    ...(width ? { width: typeof width === "number" ? `${width}px` : width } : {}),
    ...(height ? { height: typeof height === "number" ? `${height}px` : height } : {}),
  };

  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label={label}
      style={computedStyle}
      className={`skeleton-shimmer bg-surface-tint/40 ${getVariantClasses()} ${className}`}
      {...rest}
    >
      <span className="sr-only">{label}</span>
    </div>
  );
};

export default Skeleton;
