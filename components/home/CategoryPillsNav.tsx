"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { CategoryPill } from "@/lib/types/homepage";

export interface CategoryPillsNavProps {
  categories: CategoryPill[];
}

/**
 * Editorial Collections & Silhouette Edit inspired by Three Clothing (wearthree.com)
 * Features architectural 3:4 portrait editorial cards, clean typography,
 * subtle hover zoom, and minimalist navigation.
 */
export const CategoryPillsNav: React.FC<CategoryPillsNavProps> = ({ categories }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  if (!categories || categories.length === 0) return null;

  return (
    <section
      aria-labelledby="category-editorial-title"
      className="w-full py-16 sm:py-24 bg-background border-b border-border/60"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 sm:mb-14 gap-4">
          <div>
            <span className="text-[11px] font-sans uppercase tracking-[0.3em] text-accent font-medium block mb-2">
              The Silhouette Edit
            </span>
            <h2
              id="category-editorial-title"
              className="text-3xl sm:text-4xl lg:text-5xl font-serif font-light text-text-main tracking-tight"
            >
              Curated Collections
            </h2>
          </div>

          <Link
            href="/category/new-arrivals"
            className="group inline-flex items-center gap-2 text-xs font-sans uppercase tracking-[0.2em] text-text-secondary hover:text-primary transition-colors py-1 border-b border-border hover:border-primary"
          >
            <span>View All Silhouettes</span>
            <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">&rarr;</span>
          </Link>
        </div>

        {/* Editorial Collection Grid */}
        <div
          ref={scrollRef}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 lg:gap-6"
        >
          {categories.map((cat, idx) => (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className="group flex flex-col relative focus-ring"
              aria-label={`Explore ${cat.name} collection`}
            >
              {/* 3:4 Portrait Image Container */}
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-surface-soft mb-3.5">
                <Image
                  src={cat.imageUrl}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                
                {/* Subtle dark gradient overlay on hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-500" />

                {/* Editorial Collection Number */}
                <span className="absolute top-3 left-3 text-[10px] font-sans tracking-widest text-white/90 bg-black/35 backdrop-blur-xs px-2 py-0.5">
                  0{idx + 1}
                </span>

                {/* Minimalist Badge */}
                {cat.badge && (
                  <span className="absolute bottom-3 right-3 text-[9px] font-sans uppercase tracking-widest text-primary bg-white/95 px-2 py-0.5 shadow-2xs font-medium">
                    {cat.badge}
                  </span>
                )}
              </div>

              {/* Title & Item Count in Editorial Typography */}
              <div className="flex flex-col">
                <h3 className="font-serif text-sm sm:text-base font-normal text-text-main group-hover:text-primary transition-colors line-clamp-1">
                  {cat.name}
                </h3>
                {cat.productCount && (
                  <span className="text-[11px] font-sans tracking-wider text-text-subtle mt-0.5">
                    {cat.productCount} Designs
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryPillsNav;
