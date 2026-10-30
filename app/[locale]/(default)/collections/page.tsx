import React from "react";
import { Metadata } from "next";
import { getCategoriesAction } from "@/app/actions/category.actions";
import { CategoryShowcaseGrid } from "@/components/category";

export const metadata: Metadata = {
  title: "Our Curated Collections | Artisan Sarees, Lehengas & Couture",
  description:
    "Explore our full luxury catalog featuring traditional handloom silk sarees, royal bridal lehengas, and contemporary couture gowns.",
};

/**
 * Editorial collections showcase page presenting all product categories,
 * subcategory capsules, and dynamic filters for New Arrivals and Special Archive sales.
 *
 * @returns {Promise<React.ReactElement>}
 */
export default async function CollectionsPage() {
  const categories = await getCategoriesAction({ tree: true });

  return (
    <div className="w-full bg-background min-h-screen py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Hero Header */}
        <header className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <span className="inline-block text-[11px] uppercase tracking-widest font-semibold text-primary bg-primary/10 px-3.5 py-1 rounded-full mb-3">
            Maison Catalog & Haute Capsules
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal text-text-main tracking-tight leading-tight mb-4">
            Our Curated Collections
          </h1>
          <p className="text-sm sm:text-base text-text-secondary leading-relaxed font-sans max-w-2xl mx-auto">
            Discover artisanal handloom silk sarees, opulent bridal lehengas, and red-carpet
            couture gowns crafted with authentic zari, intricate zardozi, and time-honored Indian heritage.
          </p>
        </header>

        {/* Dynamic Category Showcase Grid with Filter Tabs & GSAP Animation */}
        <CategoryShowcaseGrid
          categories={categories}
          initialFilter="all"
        />

        {/* Brand Concierge & Craftsmanship Banner */}
        <section className="mt-16 sm:mt-24 pt-12 border-t border-border/80 grid grid-cols-1 md:grid-cols-3 gap-8 text-center sm:text-left">
          <div className="flex flex-col items-center sm:items-start p-6 bg-surface-card rounded-xl border border-border/60">
            <span className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
              </svg>
            </span>
            <h3 className="font-serif text-lg font-medium text-text-main mb-1">
              Pure Silk Mark Certified
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Every saree and lehenga is certified for pure handloom silk weaves with authentic metallic zari craftsmanship.
            </p>
          </div>

          <div className="flex flex-col items-center sm:items-start p-6 bg-surface-card rounded-xl border border-border/60">
            <span className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </span>
            <h3 className="font-serif text-lg font-medium text-text-main mb-1">
              Bespoke Made-to-Measure
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Custom neckline alterations, blouse tailoring, and personalized bridal fittings coordinated by our master artisans.
            </p>
          </div>

          <div className="flex flex-col items-center sm:items-start p-6 bg-surface-card rounded-xl border border-border/60">
            <span className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </span>
            <h3 className="font-serif text-lg font-medium text-text-main mb-1">
              Insured Worldwide Delivery
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Complimentary expedited express delivery across India and insured international courier options worldwide.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

