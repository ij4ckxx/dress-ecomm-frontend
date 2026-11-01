import React from "react";

/**
 * Shimmer skeleton loading state for Category and Search PLPs.
 * Shows breadcrumb shimmer, header banner placeholder, sort bar placeholder,
 * sidebar filter placeholders, and a grid of 8 product card skeletons.
 */
export const CatalogSkeleton: React.FC = () => {
  return (
    <div className="w-full bg-background min-h-screen pb-20 animate-pulse">
      {/* 1. Header Banner Skeleton */}
      <div className="bg-surface-soft border-b border-border py-8 sm:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="h-3 w-48 bg-border/60 rounded-sm" />
          <div className="h-9 sm:h-12 w-64 sm:w-80 bg-border/60 rounded-md" />
          <div className="h-4 w-full max-w-lg bg-border/40 rounded-sm" />
        </div>
      </div>

      {/* 2. Main Body Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        {/* Sort Bar Skeleton */}
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="h-5 w-36 bg-border/50 rounded-sm" />
          <div className="h-8 w-44 bg-border/50 rounded-lg" />
        </div>

        {/* 2-Column PLP Layout */}
        <div className="flex gap-8 items-start">
          {/* Sidebar Skeleton (hidden on mobile) */}
          <aside className="hidden lg:block w-64 shrink-0 space-y-6 bg-surface-card border border-border/80 rounded-xl p-5">
            <div className="h-5 w-32 bg-border/60 rounded-sm" />
            <div className="space-y-3 pt-3 border-t border-border">
              <div className="h-4 w-24 bg-border/50 rounded-sm" />
              <div className="space-y-2">
                <div className="h-3 w-full bg-border/40 rounded-sm" />
                <div className="h-3 w-4/5 bg-border/40 rounded-sm" />
                <div className="h-3 w-3/4 bg-border/40 rounded-sm" />
              </div>
            </div>
            <div className="space-y-3 pt-3 border-t border-border">
              <div className="h-4 w-20 bg-border/50 rounded-sm" />
              <div className="h-8 w-full bg-border/40 rounded-md" />
            </div>
            <div className="space-y-3 pt-3 border-t border-border">
              <div className="h-4 w-28 bg-border/50 rounded-sm" />
              <div className="flex gap-1.5">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-5 h-5 rounded-full bg-border/50" />
                ))}
              </div>
            </div>
          </aside>

          {/* Product Grid Skeleton (8 items) */}
          <main className="flex-1 min-w-0">
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
                <div
                  key={idx}
                  className="bg-surface-card border border-border/80 rounded-xl p-3.5 space-y-3"
                >
                  <div className="w-full aspect-[3/4] bg-surface-soft rounded-lg" />
                  <div className="flex gap-1.5">
                    <div className="w-3.5 h-3.5 rounded-full bg-border/50" />
                    <div className="w-3.5 h-3.5 rounded-full bg-border/50" />
                  </div>
                  <div className="space-y-1.5">
                    <div className="h-2.5 w-16 bg-border/50 rounded-sm" />
                    <div className="h-4 w-full bg-border/60 rounded-sm" />
                    <div className="h-4 w-24 bg-border/60 rounded-sm" />
                  </div>
                  <div className="h-8 w-full bg-border/40 rounded-lg pt-1" />
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default CatalogSkeleton;

