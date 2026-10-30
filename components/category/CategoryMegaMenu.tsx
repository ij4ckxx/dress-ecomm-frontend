"use client";

import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { CategoryItem } from "@/lib/types/category";

export interface CategoryMegaMenuProps {
  categories: CategoryItem[];
  isOpen: boolean;
  onClose: () => void;
  activeCategorySlug?: string | null;
}

/**
 * Editorial header mega-menu displaying category hierarchy, featured collection imagery,
 * subcategory links, and quick promotional filters.
 *
 * @param {CategoryMegaMenuProps} props
 * @returns {React.ReactElement | null}
 */
export const CategoryMegaMenu: React.FC<CategoryMegaMenuProps> = ({
  categories,
  isOpen,
  onClose,
  activeCategorySlug,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Active category selected inside the mega menu (defaults to hovered or first)
  const [selectedSlug, setSelectedSlug] = useState<string>(
    activeCategorySlug || (categories[0]?.slug ?? "")
  );

  // Sync selected slug when prop changes
  useEffect(() => {
    if (activeCategorySlug) {
      setSelectedSlug(activeCategorySlug);
    } else if (categories[0]?.slug) {
      setSelectedSlug(categories[0].slug);
    }
  }, [activeCategorySlug, categories]);

  // GSAP Entrance animation
  useEffect(() => {
    if (!isOpen || !containerRef.current) return;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: -6 },
        { opacity: 1, y: 0, duration: 0.25, ease: "power2.out" }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const activeCategory =
    categories.find((c) => c.slug === selectedSlug) || categories[0];

  return (
    <div
      ref={containerRef}
      onMouseLeave={onClose}
      className="absolute top-full left-0 w-full bg-surface-card border-b border-border shadow-xl z-50 backdrop-blur-md"
      role="region"
      aria-label="Category Navigation Menu"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-12 gap-8">
          {/* 1. Left: Root Categories List (4 Cols) */}
          <div className="col-span-12 md:col-span-4 border-r border-border/70 pr-6">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-border/60">
              <span className="text-[11px] uppercase tracking-widest text-text-subtle font-semibold">
                Haute Collections
              </span>
              <Link
                href="/collections"
                onClick={onClose}
                className="text-xs text-primary font-medium hover:underline"
              >
                View All →
              </Link>
            </div>

            <ul className="space-y-1">
              {categories.map((category) => {
                const isCurrent = category.slug === activeCategory?.slug;
                return (
                  <li key={category.id || category.slug}>
                    <button
                      type="button"
                      onMouseEnter={() => setSelectedSlug(category.slug)}
                      onClick={() => setSelectedSlug(category.slug)}
                      className={`w-full text-left px-3 py-2 rounded-md text-xs sm:text-[13px] font-medium transition-all flex items-center justify-between cursor-pointer ${
                        isCurrent
                          ? "bg-surface-soft text-primary font-semibold"
                          : "text-text-secondary hover:text-text-main hover:bg-surface-soft/60"
                      }`}
                    >
                      <span>{category.name}</span>
                      <div className="flex items-center gap-1.5">
                        {category.isNew && (
                          <span className="text-[9px] uppercase px-1.5 py-0.2 rounded-xs font-semibold bg-primary/10 text-primary">
                            New
                          </span>
                        )}
                        {category.isSale && (
                          <span className="text-[9px] uppercase px-1.5 py-0.2 rounded-xs font-semibold bg-accent/15 text-accent">
                            Sale
                          </span>
                        )}
                        <span className="text-[11px] text-text-subtle">
                          ({category.productCount})
                        </span>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* 2. Middle: Subcategories for Active Category (4 Cols) */}
          <div className="col-span-12 md:col-span-4 border-r border-border/70 pr-6">
            <div className="pb-3 mb-3 border-b border-border/60">
              <span className="text-[11px] uppercase tracking-widest text-text-subtle font-semibold">
                Explore {activeCategory?.name}
              </span>
            </div>

            {activeCategory?.description && (
              <p className="text-xs text-text-secondary mb-4 leading-relaxed line-clamp-2">
                {activeCategory.description}
              </p>
            )}

            {activeCategory?.children && activeCategory.children.length > 0 ? (
              <div className="grid grid-cols-1 gap-2">
                {activeCategory.children.map((sub) => (
                  <Link
                    key={sub.id || sub.slug}
                    href={`/category/${sub.slug}`}
                    onClick={onClose}
                    className="p-2 rounded-md hover:bg-surface-soft text-xs sm:text-[13px] text-text-secondary hover:text-primary transition-colors flex items-center justify-between group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform">
                      {sub.name}
                    </span>
                    <span className="text-[11px] text-text-subtle">
                      {sub.productCount} pieces
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-xs text-text-subtle italic">
                Direct capsule collection with all artisanal designs.
              </p>
            )}

            <div className="mt-6 pt-4 border-t border-border/50">
              <Link
                href={`/category/${activeCategory?.slug}`}
                onClick={onClose}
                className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-primary hover:text-primary-hover"
              >
                <span>Browse All {activeCategory?.name}</span>
                <span>→</span>
              </Link>
            </div>
          </div>

          {/* 3. Right: Featured Category Visual Spotlight (4 Cols) */}
          <div className="col-span-12 md:col-span-4">
            {activeCategory && (
              <div className="relative h-full min-h-[260px] rounded-lg overflow-hidden bg-surface-soft border border-border/60 flex flex-col justify-end p-5 group">
                <Image
                  src={activeCategory.imageUrl}
                  alt={activeCategory.name}
                  fill
                  sizes="320px"
                  className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-text-main/80 via-text-main/30 to-transparent" />

                <div className="relative z-10 text-white">
                  <span className="text-[10px] uppercase tracking-widest text-surface-tint font-medium">
                    Curated Spotlight
                  </span>
                  <h4 className="font-serif text-lg sm:text-xl font-normal leading-snug mt-1 mb-2 text-white">
                    {activeCategory.name}
                  </h4>
                  <Link
                    href={`/category/${activeCategory.slug}`}
                    onClick={onClose}
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium uppercase tracking-wider bg-white text-text-main hover:bg-surface-tint rounded-sm transition-colors"
                  >
                    <span>Shop Capsule</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

