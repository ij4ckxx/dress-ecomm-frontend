"use client";

import React, { useState, useRef, useEffect, useCallback, useTransition } from "react";
import { ProductCardItem } from "@/lib/types/product";
import { CategoryProductCard } from "@/components/category/CategoryProductCard";
import { getProductsAction } from "@/app/actions/product.actions";

export interface ProductCarouselProps {
  /** Section heading title (default: "You May Also Adore") */
  title?: string;
  /** Section editorial description */
  subtitle?: string | null;
  /** Eyebrow label above title */
  eyebrow?: string;
  /** Direct list of products to render (if available) */
  products?: ProductCardItem[];
  /** Category slug to scope recommendations to */
  categorySlug?: string;
  /** Product ID to exclude (e.g. current product on PDP) */
  excludeProductId?: string;
  /** Maximum number of products to show (default: 8) */
  limit?: number;
  /** Additional wrapper CSS classes */
  className?: string;
}

/**
 * Universal Luxury Product Carousel ("You May Also Adore").
 * Features:
 * - Smooth horizontal snap scrolling with touch swipe and mouse drag support
 * - Elegant circular navigation arrow controls with hover feedback
 * - Scroll progress indicator bar
 * - Automatic background recommendation fetching if products are not preloaded
 * - Shimmer skeleton state while loading
 * - Renders authentic CategoryProductCard instances with wishlist & action support
 */
export const ProductCarousel: React.FC<ProductCarouselProps> = ({
  title = "You May Also Adore",
  subtitle = "Handpicked artisanal creations curated to complement your personal wardrobe.",
  eyebrow = "Curated For You",
  products: initialProducts,
  categorySlug,
  excludeProductId,
  limit = 8,
  className = "",
}) => {
  const [items, setItems] = useState<ProductCardItem[]>(initialProducts || []);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);

  const [isPending, startTransition] = useTransition();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Auto-fetch recommendations if products are not provided
  useEffect(() => {
    if (initialProducts && initialProducts.length > 0) {
      setItems(
        excludeProductId
          ? initialProducts.filter((p) => p.id !== excludeProductId)
          : initialProducts
      );
      return;
    }

    startTransition(async () => {
      const queryParams: Record<string, string | number> = {
        limit: limit + 1,
        sort: "bestselling",
      };
      if (categorySlug) {
        queryParams.category = categorySlug;
      }

      const res = await getProductsAction(queryParams);
      let list = res.products || [];
      if (excludeProductId) {
        list = list.filter((p) => p.id !== excludeProductId);
      }
      setItems(list.slice(0, limit));
    });
  }, [initialProducts, categorySlug, excludeProductId, limit]);

  /**
   * Monitor scroll position to update arrow disabled states and progress bar
   */
  const handleScroll = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);

    const maxScroll = scrollWidth - clientWidth;
    if (maxScroll > 0) {
      setScrollProgress(Math.min(100, Math.max(0, (scrollLeft / maxScroll) * 100)));
    }
  }, []);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => el.removeEventListener("scroll", handleScroll);
  }, [handleScroll, items]);

  const scrollByDirection = (direction: "left" | "right") => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const scrollAmount = el.clientWidth * 0.75;
    el.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  // If not loading and no items found, hide section
  if (!isPending && items.length === 0) {
    return null;
  }

  return (
    <section
      aria-label={title}
      className={`w-full py-12 sm:py-16 border-t border-border/80 ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        {/* 1. Carousel Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            {eyebrow && (
              <span className="text-[10px] sm:text-[11px] font-sans uppercase tracking-[0.25em] text-accent font-bold block mb-1.5">
                {eyebrow}
              </span>
            )}
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-text-main tracking-tight">
              {title}
            </h2>
            {subtitle && (
              <p className="mt-1.5 text-xs sm:text-sm text-text-subtle max-w-xl leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>

          {/* Navigation Controls: Arrows */}
          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            {/* Scroll Left Button */}
            <button
              type="button"
              onClick={() => scrollByDirection("left")}
              disabled={!canScrollLeft}
              aria-label="Scroll to previous recommendations"
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-border flex items-center justify-center transition-all duration-200 focus-ring ${
                canScrollLeft
                  ? "bg-surface-card text-text-main hover:bg-primary hover:text-primary-contrast hover:border-primary shadow-xs active:scale-95"
                  : "bg-surface-soft/60 text-text-subtle/30 border-border/40 cursor-not-allowed opacity-40"
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Scroll Right Button */}
            <button
              type="button"
              onClick={() => scrollByDirection("right")}
              disabled={!canScrollRight}
              aria-label="Scroll to next recommendations"
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-border flex items-center justify-center transition-all duration-200 focus-ring ${
                canScrollRight
                  ? "bg-surface-card text-text-main hover:bg-primary hover:text-primary-contrast hover:border-primary shadow-xs active:scale-95"
                  : "bg-surface-soft/60 text-text-subtle/30 border-border/40 cursor-not-allowed opacity-40"
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* 2. Horizontal Scrollable Track */}
        <div
          ref={scrollContainerRef}
          className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-none snap-x snap-mandatory pt-2 pb-4 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 scroll-smooth"
        >
          {isPending
            ? /* Skeleton Loading Cards */
              [1, 2, 3, 4].map((n) => (
                <div
                  key={n}
                  className="w-[260px] sm:w-[280px] md:w-[300px] shrink-0 snap-start bg-surface-card border border-border/80 rounded-xl p-3.5 space-y-3 animate-pulse"
                >
                  <div className="w-full aspect-[3/4] bg-surface-soft rounded-lg" />
                  <div className="h-3 w-16 bg-surface-soft rounded-sm" />
                  <div className="h-4 w-3/4 bg-surface-soft rounded-sm" />
                  <div className="h-4 w-1/3 bg-surface-soft rounded-sm" />
                  <div className="h-8 w-full bg-surface-soft rounded-lg pt-1" />
                </div>
              ))
            : items.map((product) => (
                <div
                  key={product.id}
                  className="w-[260px] sm:w-[280px] md:w-[300px] shrink-0 snap-start"
                >
                  <CategoryProductCard product={product} />
                </div>
              ))}
        </div>

        {/* 3. Subtle Progress Bar Indicator */}
        <div className="w-full h-0.5 bg-surface-soft rounded-full overflow-hidden max-w-xs mx-auto">
          <div
            className="h-full bg-accent transition-all duration-200"
            style={{ width: `${Math.max(12, scrollProgress)}%` }}
          />
        </div>
      </div>
    </section>
  );
};

export default ProductCarousel;

