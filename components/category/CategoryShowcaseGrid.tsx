"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import gsap from "gsap";
import { CategoryItem, CategoryFilterType } from "@/lib/types/category";
import { CategoryCard } from "./CategoryCard";
import { CategoryFilterTabs } from "./CategoryFilterTabs";

export interface CategoryShowcaseGridProps {
  categories: CategoryItem[];
  initialFilter?: CategoryFilterType;
  title?: string;
  subtitle?: string;
  className?: string;
}

/**
 * Responsive showcase grid with category filtering and GSAP staggered entrance animations.
 * Allows customers to browse categories by All, New Arrivals, Special Offers, or Curated Capsules.
 *
 * @param {CategoryShowcaseGridProps} props
 * @returns {React.ReactElement}
 */
export const CategoryShowcaseGrid: React.FC<CategoryShowcaseGridProps> = ({
  categories,
  initialFilter = "all",
  title,
  subtitle,
  className = "",
}) => {
  const [activeFilter, setActiveFilter] = useState<CategoryFilterType>(initialFilter);
  const gridContainerRef = useRef<HTMLDivElement>(null);

  // Compute category counts for each tab
  const tabCounts = useMemo(() => {
    return {
      all: categories.length,
      new: categories.filter((c) => c.isNew).length,
      sale: categories.filter((c) => c.isSale).length,
      collections: categories.filter(
        (c) => Array.isArray(c.children) && c.children.length > 0
      ).length,
    };
  }, [categories]);

  // Filter categories according to active tab
  const filteredCategories = useMemo(() => {
    if (activeFilter === "new") {
      return categories.filter((c) => c.isNew);
    }
    if (activeFilter === "sale") {
      return categories.filter((c) => c.isSale);
    }
    if (activeFilter === "collections") {
      return categories.filter(
        (c) => Array.isArray(c.children) && c.children.length > 0
      );
    }
    return categories;
  }, [categories, activeFilter]);

  // Animate grid cards using GSAP context with reduced-motion support
  useEffect(() => {
    if (!gridContainerRef.current) return;

    // Respect user's motion preferences
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const items = gridContainerRef.current?.querySelectorAll(".category-card-item");
      if (items && items.length > 0) {
        gsap.fromTo(
          items,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.06,
            ease: "power2.out",
            clearProps: "transform",
          }
        );
      }
    }, gridContainerRef);

    return () => ctx.revert();
  }, [filteredCategories, activeFilter]);

  return (
    <section className={`w-full ${className}`}>
      {/* 1. Header & Section Intro */}
      {(title || subtitle) && (
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          {title && (
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-text-main tracking-tight mb-3">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-sm sm:text-base text-text-secondary leading-relaxed font-sans">
              {subtitle}
            </p>
          )}
        </div>
      )}

      {/* 2. Interactive Filter Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-border/60">
        <CategoryFilterTabs
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          counts={tabCounts}
        />

        <span className="text-xs text-text-subtle">
          Showing {filteredCategories.length} of {categories.length} Categories
        </span>
      </div>

      {/* 3. Category Grid */}
      <div
        ref={gridContainerRef}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
      >
        {filteredCategories.map((category, index) => (
          <div key={category.id || category.slug} className="category-card-item">
            <CategoryCard category={category} priority={index < 3} />
          </div>
        ))}
      </div>

      {/* 4. Empty State View */}
      {filteredCategories.length === 0 && (
        <div className="text-center py-16 px-4 bg-surface-soft rounded-xl border border-dashed border-border/80">
          <p className="text-text-secondary text-sm mb-4">
            No collections found in this filter view.
          </p>
          <button
            type="button"
            onClick={() => setActiveFilter("all")}
            className="inline-flex items-center px-4 py-2 text-xs font-medium uppercase tracking-wider bg-primary text-primary-contrast rounded-md hover:bg-primary-hover transition-colors"
          >
            View All Collections
          </button>
        </div>
      )}
    </section>
  );
};

