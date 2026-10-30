"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { HomepageProduct } from "@/lib/types/homepage";
import { ProductCard } from "@/components/product/ProductCard";

export interface BestsellerSliderProps {
  products: HomepageProduct[];
}

/**
 * Editorial horizontal carousel of customer favorite pieces inspired by Three Clothing (wearthree.com)
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
      className="w-full py-16 sm:py-24 bg-surface-soft/40 border-b border-border/60"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header & Minimalist Slider Navigation */}
        <div className="flex items-end justify-between mb-10 sm:mb-12">
          <div>
            <span className="text-[11px] font-sans uppercase tracking-[0.3em] text-accent font-medium block mb-2">
              Patron Favorites
            </span>
            <h2
              id="bestsellers-title"
              className="text-3xl sm:text-4xl lg:text-5xl font-serif font-light text-text-main tracking-tight"
            >
              Most Coveted Heirlooms
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={scrollLeft}
              aria-label="Previous bestsellers"
              className="w-10 h-10 rounded-full border border-border/80 hover:border-primary text-text-main hover:text-primary transition-colors flex items-center justify-center focus-ring"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={scrollRight}
              aria-label="Next bestsellers"
              className="w-10 h-10 rounded-full border border-border/80 hover:border-primary text-text-main hover:text-primary transition-colors flex items-center justify-center focus-ring"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Horizontal Scrolling Products Row */}
        <div
          ref={sliderRef}
          className="flex items-stretch gap-6 sm:gap-8 overflow-x-auto pb-6 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0 no-scrollbar snap-x snap-mandatory"
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

        {/* Bottom Link for Mobile */}
        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/category/sarees"
            className="text-xs font-sans uppercase tracking-[0.2em] text-primary font-medium hover:underline"
          >
            Explore All Heirlooms &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BestsellerSlider;
