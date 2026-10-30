"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { CategoryPill } from "@/lib/types/homepage";

export interface CategoryPillsNavProps {
  categories: CategoryPill[];
}

/**
 * Modern circular category navigation inspired by Three Clothing (wearthree.com)
 * and contemporary luxury fashion storefronts.
 */
export const CategoryPillsNav: React.FC<CategoryPillsNavProps> = ({ categories }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  if (!categories || categories.length === 0) return null;

  return (
    <section
      aria-labelledby="category-pills-title"
      className="w-full py-12 sm:py-16 bg-surface-soft border-b border-border/80"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-10 gap-4">
          <div>
            <span className="text-[11px] uppercase tracking-[0.28em] text-accent font-bold block mb-1">
              Curated Silhouettes
            </span>
            <h2
              id="category-pills-title"
              className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-primary tracking-tight"
            >
              Explore By Category
            </h2>
          </div>

          <Link
            href="/category/new-arrivals"
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-text-secondary hover:text-primary font-semibold transition-colors focus-ring rounded"
          >
            <span>View All Collections</span>
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>

        {/* Category Pills Grid / Horizontal Scroll */}
        <div
          ref={scrollRef}
          className="flex items-center gap-6 sm:gap-8 overflow-x-auto pb-4 pt-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-3 lg:grid-cols-6 sm:overflow-visible no-scrollbar"
        >
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className="group flex flex-col items-center text-center shrink-0 w-32 sm:w-auto focus-ring rounded-2xl"
              aria-label={`Browse ${cat.name} collection`}
            >
              {/* Circular/Arched Image Container */}
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-2 border-border/80 group-hover:border-accent shadow-xs group-hover:shadow-md transition-all duration-300 p-1 bg-surface-card mb-3">
                <div className="relative w-full h-full rounded-full overflow-hidden">
                  <Image
                    src={cat.imageUrl}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 640px) 120px, 150px"
                    className="object-cover object-center group-hover:scale-110 transition-transform duration-500 ease-out"
                  />
                  {/* Subtle darkening on hover */}
                  <div className="absolute inset-0 bg-primary/10 group-hover:bg-primary/0 transition-colors" />
                </div>

                {/* Badge */}
                {cat.badge && (
                  <span className="absolute bottom-1 inset-x-0 mx-auto w-max px-2 py-0.2 rounded-full bg-primary text-primary-contrast text-[8.5px] font-bold uppercase tracking-wider shadow-xs">
                    {cat.badge}
                  </span>
                )}
              </div>

              {/* Title & Item Count */}
              <h3 className="font-serif font-bold text-xs sm:text-sm text-text-main group-hover:text-primary transition-colors line-clamp-1">
                {cat.name}
              </h3>
              {cat.productCount && (
                <span className="text-[10px] text-text-subtle mt-0.5">
                  {cat.productCount} Designs
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryPillsNav;

