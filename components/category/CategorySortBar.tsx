"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ProductSortOption } from "@/lib/types/product";

interface CategorySortBarProps {
  totalResults: number;
  title?: string;
  onToggleMobileFilters?: () => void;
  className?: string;
}

const SORT_OPTIONS: { label: string; value: ProductSortOption }[] = [
  { label: "Newest Arrivals", value: "newest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Best Selling", value: "bestselling" },
  { label: "Top Rated", value: "rating" },
  { label: "Best Deals", value: "best_deals" },
];

/**
 * Modern Category & Search Controls Header Bar.
 * Directly reflects the user's reference layout:
 * - Result count header
 * - Quick filter pills
 * - "ALL FILTERS" drawer button
 * - Sort dropdown
 */
export const CategorySortBar: React.FC<CategorySortBarProps> = ({
  totalResults,
  title,
  onToggleMobileFilters,
  className = "",
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSort = (searchParams.get("sort") as ProductSortOption) || "newest";

  const handleSortChange = (newSort: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");
    params.set("sort", newSort);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const removeFilterParam = (key: string, valueToRemove?: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");

    if (!valueToRemove) {
      params.delete(key);
    } else {
      const current = params.get(key) || "";
      const filtered = current
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s !== valueToRemove);

      if (filtered.length > 0) {
        params.set(key, filtered.join(","));
      } else {
        params.delete(key);
      }
    }

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  // Collect active removable filter pills
  const activePills: { key: string; label: string; valueToRemove?: string }[] = [];
  searchParams.forEach((val, key) => {
    if (["page", "limit", "sort"].includes(key)) return;
    if (key === "minPrice") activePills.push({ key, label: `Min ₹${val}` });
    else if (key === "maxPrice") activePills.push({ key, label: `Max ₹${val}` });
    else if (key === "inStock") activePills.push({ key, label: "In Stock" });
    else {
      val.split(",").forEach((item) => {
        activePills.push({
          key,
          label: `${key}: ${item}`,
          valueToRemove: item,
        });
      });
    }
  });

  return (
    <div className={`space-y-4 ${className}`}>
      {/* 1. Header Row: Results Count and Sort Dropdown */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border pb-3">
        <div>
          <p className="text-xs sm:text-sm text-text-subtle font-mono">
            Showing <span className="font-semibold text-text-main">{totalResults.toLocaleString()}</span>{" "}
            {totalResults === 1 ? "design" : "designs"}
          </p>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          <label htmlFor="sort-dropdown" className="text-xs font-semibold text-text-secondary font-sans whitespace-nowrap">
            Sort By:
          </label>
          <div className="relative">
            <select
              id="sort-dropdown"
              value={currentSort}
              onChange={(e) => handleSortChange(e.target.value)}
              className="appearance-none bg-surface-card border border-border rounded-lg pl-3 pr-8 py-1.5 text-xs font-medium text-text-main hover:border-border/80 focus:outline-none focus:border-accent cursor-pointer shadow-2xs"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-text-subtle">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Controls Sub-bar: ALL FILTERS toggle + Active Filter Badges */}
      <div className="flex flex-wrap items-center gap-2">
        {/* "ALL FILTERS" Button (Opens Drawer / Sidebar) */}
        <button
          type="button"
          onClick={onToggleMobileFilters}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary text-primary-contrast text-xs font-semibold uppercase tracking-wider hover:bg-primary-hover shadow-2xs transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
          <span>All Filters</span>
          {activePills.length > 0 && (
            <span className="w-4 h-4 rounded-full bg-accent text-primary-contrast text-[10px] font-mono flex items-center justify-center font-bold">
              {activePills.length}
            </span>
          )}
        </button>

        {/* Removable Active Filter Pills */}
        {activePills.map((pill, idx) => (
          <button
            key={`${pill.key}-${pill.label}-${idx}`}
            type="button"
            onClick={() => removeFilterParam(pill.key, pill.valueToRemove)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-soft hover:bg-surface-card border border-border text-xs text-text-main transition-colors group"
            title={`Remove ${pill.label}`}
          >
            <span className="capitalize">{pill.label}</span>
            <span className="text-text-subtle group-hover:text-error text-xs font-bold">
              &times;
            </span>
          </button>
        ))}

        {activePills.length > 0 && (
          <button
            type="button"
            onClick={() => {
              const params = new URLSearchParams();
              const sort = searchParams.get("sort");
              if (sort) params.set("sort", sort);
              router.push(`${pathname}?${params.toString()}`, { scroll: false });
            }}
            className="text-xs text-accent hover:underline font-medium ml-1"
          >
            Clear All
          </button>
        )}
      </div>
    </div>
  );
};

export default CategorySortBar;

