"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import gsap from "gsap";
import { ProductCardItem, CatalogFilters, PaginationMeta } from "@/lib/types/product";
import { CategoryItem } from "@/lib/types/category";
import { CategorySortBar } from "./CategorySortBar";
import { CategoryFilterSidebar } from "./CategoryFilterSidebar";
import { CategoryProductCard } from "./CategoryProductCard";
import { Pagination } from "@/components/ui/Pagination";
import { ProductCarousel } from "@/components/product/ProductCarousel";

interface CategoryPLPViewProps {
  title: string;
  description?: string | null;
  bannerImage?: string | null;
  products: ProductCardItem[];
  pagination: PaginationMeta;
  filters: CatalogFilters | null;
  categoriesTree: CategoryItem[];
  activeSlug: string;
  parentCategory?: {
    id: string;
    name: string;
    slug: string;
  } | null;
  matchingCategories?: CategoryItem[];
  recommendedProducts?: ProductCardItem[];
}

/**
 * Modern Category & Search PLP View layout.
 * Integrates breadcrumbs, matching category cards at top, category sort bar,
 * dynamic filter sidebar, responsive product grid with luxury cards, universal circular pagination,
 * and curated recommended products at the bottom.
 */
export const CategoryPLPView: React.FC<CategoryPLPViewProps> = ({
  title,
  description,
  bannerImage,
  products,
  pagination,
  filters,
  categoriesTree,
  activeSlug,
  parentCategory,
  matchingCategories = [],
  recommendedProducts = [],
}) => {
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const gridRef = useRef<HTMLDivElement>(null);

  /**
   * GSAP entrance animation for category product cards
   */
  useEffect(() => {
    if (!gridRef.current) return;

    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const ctx = gsap.context(() => {
      const cards = gridRef.current?.querySelectorAll("article");
      if (cards && cards.length > 0) {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.45,
            stagger: 0.04,
            ease: "power2.out",
            clearProps: "transform",
          }
        );
      }
    }, gridRef);

    return () => ctx.revert();
  }, [products, activeSlug]);

  /**
   * Generates pagination link href preserving existing active query parameters
   */
  const buildPaginationHref = (pageNumber: number): string => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(pageNumber));
    return `${pathname}?${params.toString()}`;
  };

  return (
    <div className="w-full bg-background min-h-screen pb-20">
      {/* 1. Category Breadcrumb & Header Banner */}
      <div className="bg-surface-soft border-b border-border py-8 sm:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="text-xs text-text-subtle font-sans">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/" className="hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>/</li>
              <li>
                <Link href="/category" className="hover:text-primary transition-colors">
                  Categories
                </Link>
              </li>
              {parentCategory && (
                <>
                  <li>/</li>
                  <li>
                    <Link
                      href={`/category/${parentCategory.slug}`}
                      className="hover:text-primary transition-colors"
                    >
                      {parentCategory.name}
                    </Link>
                  </li>
                </>
              )}
              {title && (
                <>
                  <li>/</li>
                  <li className="text-text-main font-semibold truncate max-w-xs">{title}</li>
                </>
              )}
            </ol>
          </nav>

          {/* Category Title & Description */}
          <div className="max-w-3xl">
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-text-main tracking-tight">
              {title}
            </h1>
            {description && (
              <p className="mt-2 text-xs sm:text-sm text-text-secondary leading-relaxed">
                {description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 2. Main Catalog Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 space-y-6">
        {/* Matching Categories Section (Visible at top when searching) */}
        {matchingCategories.length > 0 && (
          <div className="bg-surface-card border border-border rounded-xl p-4 sm:p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-border mb-3">
              <span className="text-[11px] font-sans uppercase tracking-[0.2em] font-bold text-accent">
                Matching Categories ({matchingCategories.length})
              </span>
              <span className="text-xs text-text-subtle">
                Click a category to view its complete collection
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {matchingCategories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  className="flex items-center gap-3 p-3 rounded-lg bg-surface-soft hover:bg-primary hover:text-primary-contrast border border-border/80 transition-all shadow-2xs group"
                >
                  {cat.imageUrl ? (
                    <div className="relative w-10 h-10 rounded-md overflow-hidden bg-surface-soft shrink-0">
                      <Image
                        src={cat.imageUrl}
                        alt={cat.name}
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-md bg-surface-card border border-border flex items-center justify-center text-text-subtle group-hover:text-primary-contrast shrink-0">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776" />
                      </svg>
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-semibold truncate group-hover:text-primary-contrast">
                      {cat.name}
                    </h4>
                    {cat.productCount !== undefined && (
                      <span className="text-[10px] text-text-subtle font-mono group-hover:text-primary-contrast/80">
                        {cat.productCount} products
                      </span>
                    )}
                  </div>
                  <svg
                    className="w-3.5 h-3.5 text-text-subtle group-hover:text-primary-contrast shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Controls Sort Bar */}
        <CategorySortBar
          title={title}
          totalResults={pagination.total}
          onToggleMobileFilters={() => setIsMobileFiltersOpen(true)}
        />

        {/* 2-Column PLP Grid: Sidebar + Products */}
        <div className="flex gap-8 items-start">
          {/* Filter Sidebar (Desktop & Mobile Drawer) */}
          <CategoryFilterSidebar
            filters={filters}
            categoriesTree={categoriesTree}
            activeCategorySlug={activeSlug}
            isOpenMobile={isMobileFiltersOpen}
            onCloseMobile={() => setIsMobileFiltersOpen(false)}
          />

          {/* Product Cards Grid & Pagination */}
          <main className="flex-1 min-w-0 space-y-10">
            {products.length > 0 ? (
              <div
                ref={gridRef}
                className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
              >
                {products.map((product, idx) => (
                  <CategoryProductCard
                    key={product.id}
                    product={product}
                    priority={idx < 4}
                  />
                ))}
              </div>
            ) : (
              /* Empty State when no products match filters */
              <div className="bg-surface-card border border-border/80 rounded-2xl p-12 text-center max-w-lg mx-auto space-y-4 my-8">
                <div className="w-12 h-12 rounded-full bg-surface-soft text-text-subtle mx-auto flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                    />
                  </svg>
                </div>
                <h3 className="font-serif text-xl font-bold text-text-main">
                  No matching designs found
                </h3>
                <p className="text-xs text-text-subtle">
                  We couldn&apos;t find any pieces matching your chosen filter options. Try adjusting
                  or clearing some filters to browse more selections.
                </p>
                <div className="pt-2">
                  <Link
                    href={activeSlug ? `/category/${activeSlug}` : "/category"}
                    className="inline-flex items-center px-4 py-2 rounded-lg bg-primary text-primary-contrast text-xs font-semibold uppercase tracking-wider hover:bg-primary-hover transition-colors"
                  >
                    Reset Filters
                  </Link>
                </div>
              </div>
            )}

            {/* Pagination Controls with Circular Round Buttons & Arrow Marks */}
            {pagination.totalPages > 1 && (
              <div className="pt-4 border-t border-border">
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  totalItems={pagination.total}
                  pageSize={pagination.limit}
                  buildHref={buildPaginationHref}
                  itemName="designs"
                  showItemCount
                />
              </div>
            )}
          </main>
        </div>

        {/* 3. Recommended Products ("You May Also Adore") Carousel */}
        <ProductCarousel
          title="You May Also Adore"
          subtitle="Artisanal hand-crafted creations and timeless silhouettes selected to complement your personal wardrobe."
          eyebrow="Curated For You"
          products={recommendedProducts}
          categorySlug={activeSlug || undefined}
        />
      </div>
    </div>
  );
};

export default CategoryPLPView;
