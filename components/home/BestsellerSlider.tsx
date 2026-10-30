"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { HomepageProduct } from "@/lib/types/homepage";
import { ProductCard } from "@/components/product/ProductCard";

export interface BestsellerSliderProps {
  products: HomepageProduct[];
}

/**
 * Modern horizontal carousel of customer favorite pieces inspired by Three Clothing (wearthree.com)
 */
export const BestsellerSlider: React.FC<BestsellerSliderProps> = ({ products }) => {
  const sliderRef = useRef<HTMLDivElement>(null);

  if (!products || products.length === 0) return null;

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -360, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 360, behavior: "smooth" });
    }
  };

  return (
    <section
      aria-labelledby="bestsellers-title"
      className="w-full py-16 sm:py-24 bg-surface-soft/60 border-b border-border/80"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header & Slider Navigation */}
        <div className="flex items-end justify-between mb-8 sm:mb-10">
          <div>
            <span className="text-[11px] uppercase tracking-[0.28em] text-accent font-bold block mb-1">
              Customer Favorites
            </span>
            <h2
              id="bestsellers-title"
              className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-primary tracking-tight"
            >
              Most Coveted Heirlooms
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={scrollLeft}
              aria-label="Scroll left in bestsellers"
              className="p-2.5 rounded-full border border-border bg-surface-card hover:bg-surface-soft hover:border-primary text-text-main transition-colors focus-ring shadow-xs"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={scrollRight}
              aria-label="Scroll right in bestsellers"
              className="p-2.5 rounded-full border border-border bg-surface-card hover:bg-surface-soft hover:border-primary text-text-main transition-colors focus-ring shadow-xs"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Horizontal Scrolling Products Row */}
        <div
          ref={sliderRef}
          className="flex items-stretch gap-5 sm:gap-6 overflow-x-auto pb-4 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0 no-scrollbar snap-x snap-mandatory"
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="w-64 sm:w-72 lg:w-80 shrink-0 snap-start flex flex-col"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* Bottom Link */}
        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/category/sarees"
            className="text-xs uppercase tracking-widest text-primary font-bold hover:underline"
          >
            View All Bestsellers &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BestsellerSlider;

