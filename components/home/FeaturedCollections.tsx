"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { HomepageProduct } from "@/lib/types/homepage";
import { ProductCard } from "@/components/product/ProductCard";

export interface FeaturedCollectionsProps {
  products: HomepageProduct[];
}

const TABS = [
  { id: "all", label: "All Masterpieces" },
  { id: "new", label: "New In" },
  { id: "sarees", label: "Banarasi & Heritage Sarees", matchSlug: "sarees" },
  { id: "lehengas", label: "Bridal Lehengas", matchSlug: "lehengas" },
  { id: "gowns", label: "Couture Gowns", matchSlug: "gowns" },
  { id: "kaftans", label: "Resort Kaftans", matchSlug: "resort" },
];

/**
 * Interactive Tabbed Product Grid inspired by Three Clothing (wearthree.com)
 * allowing users to switch between collections seamlessly.
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
      className="w-full py-14 sm:py-20 bg-background"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-[11px] uppercase tracking-[0.28em] text-accent font-bold block mb-1.5">
            The Signature Curation
          </span>
          <h2
            id="featured-collections-title"
            className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-primary tracking-tight mb-3"
          >
            Runway & Iconic Heirlooms
          </h2>
          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
            Discover artisanal Banarasi weaves, architectural evening gowns, and hand-embroidered bridal silhouettes.
          </p>
        </div>

        {/* Tab Pills Bar (wearthree.com style) */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap mb-10">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 sm:px-5 py-2 rounded-full text-xs uppercase tracking-wider font-semibold transition-all focus-ring ${
                  isActive
                    ? "bg-primary text-primary-contrast shadow-xs scale-105"
                    : "bg-surface-card hover:bg-surface-soft text-text-secondary hover:text-text-main border border-border/80"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {filteredProducts.slice(0, 8).map((product, idx) => (
              <ProductCard
                key={product.id}
                product={product}
                priority={idx < 4}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 px-4 bg-surface-soft rounded-xl border border-dashed border-border/80">
            <p className="text-text-secondary text-sm">
              No products found in this category view.
            </p>
          </div>
        )}

        {/* View All Bottom CTA */}
        <div className="mt-12 text-center">
          <Link
            href="/category/new-arrivals"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border border-primary text-primary hover:bg-primary hover:text-primary-contrast text-xs uppercase tracking-widest font-semibold transition-all hover:scale-105 focus-ring"
          >
            <span>Explore Entire Boutique Edit</span>
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCollections;

