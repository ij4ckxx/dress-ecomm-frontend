"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { HomepageProduct } from "@/lib/types/homepage";
import { ProductCard } from "@/components/product/ProductCard";

export interface FeaturedCollectionsProps {
  products: HomepageProduct[];
}

const TABS = [
  { id: "all", label: "All Pieces" },
  { id: "new", label: "New Arrivals" },
  { id: "sarees", label: "Banarasi & Heritage Sarees", matchSlug: "sarees" },
  { id: "lehengas", label: "Bridal Lehengas", matchSlug: "lehengas" },
  { id: "gowns", label: "Couture Gowns", matchSlug: "gowns" },
  { id: "kaftans", label: "Resort Kaftans", matchSlug: "resort" },
];

/**
 * Editorial Curated Masterpieces Section inspired by Three Clothing (wearthree.com)
 * Features minimalist text tabs, borderless high-fashion product grid,
 * and responsive discoverability.
 */
export const FeaturedCollections: React.FC<FeaturedCollectionsProps> = ({ products }) => {
  const [activeTab, setActiveTab] = useState("all");

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    if (activeTab === "all") return products;
    if (activeTab === "new") return products.filter((p) => p.isNewArrival);

    const currentTab = TABS.find((t) => t.id === activeTab);
    if (!currentTab?.matchSlug) return products;

    const slugKeyword = currentTab.matchSlug.toLowerCase();
    return products.filter(
      (p) =>
        p.categorySlug.toLowerCase().includes(slugKeyword) ||
        p.categoryName.toLowerCase().includes(slugKeyword) ||
        p.name.toLowerCase().includes(slugKeyword)
    );
  }, [products, activeTab]);

  return (
    <section
      aria-labelledby="featured-collections-title"
      className="w-full py-16 sm:py-24 bg-background"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <span className="text-[11px] font-sans uppercase tracking-[0.3em] text-accent font-medium block mb-2">
            The Signature Curation
          </span>
          <h2
            id="featured-collections-title"
            className="text-3xl sm:text-4xl lg:text-5xl font-serif font-light text-text-main tracking-tight mb-3"
          >
            Runway & Iconic Heirlooms
          </h2>
          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed font-sans max-w-lg mx-auto">
            Hand-curated Banarasi weaves, architectural evening gowns, and artisanal bridal silhouettes.
          </p>
        </div>

        {/* Minimalist Editorial Tabs (wearthree.com style) */}
        <div className="flex items-center justify-center gap-6 sm:gap-10 border-b border-border/60 pb-3 mb-10 sm:mb-12 overflow-x-auto no-scrollbar">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`relative pb-3 text-xs font-sans uppercase tracking-[0.2em] transition-all whitespace-nowrap focus-ring ${
                  isActive
                    ? "text-primary font-medium"
                    : "text-text-subtle hover:text-text-main"
                }`}
              >
                <span>{tab.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 inset-x-0 h-[1.5px] bg-primary" />
                )}
              </button>
            );
          })}
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-8">
            {filteredProducts.slice(0, 8).map((product, idx) => (
              <ProductCard
                key={product.id}
                product={product}
                priority={idx < 4}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-4 bg-surface-soft border border-dashed border-border/80">
            <p className="text-sm font-serif text-text-secondary mb-3">
              No heirlooms found matching this capsule category.
            </p>
            <button
              type="button"
              onClick={() => setActiveTab("all")}
              className="text-xs font-sans uppercase tracking-widest text-primary font-medium underline"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* View All Collection Link */}
        <div className="mt-14 text-center">
          <Link
            href="/category/all"
            className="inline-flex items-center gap-2 px-9 py-3.5 border border-primary text-primary hover:bg-primary hover:text-white transition-all text-xs font-sans uppercase tracking-[0.22em] font-medium focus-ring"
          >
            <span>Explore Entire Catalog</span>
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCollections;
