"use client";

import React from "react";
import { CategoryFilterType, CategoryFilterOption } from "@/lib/types/category";

export interface CategoryFilterTabsProps {
  activeFilter: CategoryFilterType;
  onFilterChange: (filter: CategoryFilterType) => void;
  counts?: {
    all: number;
    new: number;
    sale: number;
    collections: number;
  };
}

const FILTER_OPTIONS: CategoryFilterOption[] = [
  { key: "all", label: "All Collections" },
  { key: "new", label: "New Arrivals", badge: "New" },
  { key: "sale", label: "Special Offers", badge: "Sale" },
  { key: "collections", label: "Curated Capsules" },
];

/**
 * Filter bar allowing customers to view All, New Arrivals, Sale collections, or Curated Capsules.
 * Implements accessible tab navigation with responsive touch scrolling.
 *
 * @param {CategoryFilterTabsProps} props
 * @returns {React.ReactElement}
 */
export const CategoryFilterTabs: React.FC<CategoryFilterTabsProps> = ({
  activeFilter,
  onFilterChange,
  counts,
}) => {
  return (
    <div
      role="tablist"
      aria-label="Filter Collections"
      className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-none"
    >
      {FILTER_OPTIONS.map((option) => {
        const isActive = activeFilter === option.key;
        const count = counts ? counts[option.key] : null;

        return (
          <button
            key={option.key}
            role="tab"
            type="button"
            aria-selected={isActive}
            onClick={() => onFilterChange(option.key)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-xs sm:text-[13px] font-medium tracking-wide transition-all duration-200 cursor-pointer flex items-center gap-2 border ${
              isActive
                ? "bg-primary text-primary-contrast border-primary shadow-xs"
                : "bg-surface-soft hover:bg-surface-tint/25 text-text-secondary hover:text-text-main border-border/80"
            }`}
          >
            <span>{option.label}</span>

            {/* Optional badge or count */}
            {option.badge && !isActive && (
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold uppercase ${
                  option.key === "sale"
                    ? "bg-accent/15 text-accent"
                    : "bg-primary/10 text-primary"
                }`}
              >
                {option.badge}
              </span>
            )}

            {count !== null && (
              <span
                className={`text-[11px] px-1.5 py-0.2 rounded-full ${
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-border/60 text-text-subtle"
                }`}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

