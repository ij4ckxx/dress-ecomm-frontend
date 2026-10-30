import React, { Suspense } from "react";
import { Skeleton } from "./Skeleton";

export interface StreamableProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  skeletonHeight?: string | number;
  skeletonCount?: number;
  label?: string;
  className?: string;
}

/**
 * Standard default fallback skeleton when streaming async content.
 */
const DefaultStreamableFallback: React.FC<{
  height?: string | number;
  count?: number;
  label?: string;
}> = ({ height = 120, count = 1, label = "Loading streamed section..." }) => {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label={label}
      className="w-full space-y-4 my-2"
    >
      <span className="sr-only">{label}</span>
      {Array.from({ length: count }).map((_, idx) => (
        <Skeleton key={idx} height={height} width="100%" className="rounded-lg" />
      ))}
    </div>
  );
};

/**
 * Universal streaming container component wrapping asynchronous Server Component trees
 * with accessible fallbacks and loading state announcements.
 */
export const Streamable: React.FC<StreamableProps> = ({
  children,
  fallback,
  skeletonHeight,
  skeletonCount,
  label,
  className = "",
}) => {
  const renderedFallback = fallback || (
    <DefaultStreamableFallback
      height={skeletonHeight}
      count={skeletonCount}
      label={label}
    />
  );

  return (
    <div className={`streamable-boundary w-full ${className}`}>
      <Suspense fallback={renderedFallback}>{children}</Suspense>
    </div>
  );
};

export default Streamable;

