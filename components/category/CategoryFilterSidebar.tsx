"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { CatalogFilters } from "@/lib/types/product";
import { CategoryItem } from "@/lib/types/category";
import { CategoryFolderTree } from "./CategoryFolderTree";

interface CategoryFilterSidebarProps {
  filters: CatalogFilters | null;
  categoriesTree: CategoryItem[];
  activeCategorySlug?: string;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  className?: string;
}

/**
 * Modern dynamic filter sidebar for Category & Search PLPs.
 * Features:
 * - Category folder directory tree
 * - Dual-bound Price filter with dedicated Clear button
 * - Brand checkboxes with product counts and dedicated Clear button
 * - Color swatches & Size pills with dedicated Clear buttons
 * - Customer Rating filter (4★ & above, etc.) with Clear button
 * - In-stock toggle with Clear button
 * - Prominent "Clear All Filters" controls in header and footer
 * - URL query synchronization and mobile drawer support
 */
export const CategoryFilterSidebar: React.FC<CategoryFilterSidebarProps> = ({
  filters,
  categoriesTree,
  activeCategorySlug,
  isOpenMobile = false,
  onCloseMobile,
  className = "",
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Price inputs state synced with URL
  const currentMinPrice = searchParams.get("minPrice") || "";
  const currentMaxPrice = searchParams.get("maxPrice") || "";
  const [minPrice, setMinPrice] = useState(currentMinPrice);
  const [maxPrice, setMaxPrice] = useState(currentMaxPrice);
  const [brandSearch, setBrandSearch] = useState("");

  useEffect(() => {
    setMinPrice(currentMinPrice);
    setMaxPrice(currentMaxPrice);
  }, [currentMinPrice, currentMaxPrice]);

  // Sections accordion toggle state
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    categories: true,
    price: true,
    brand: true,
    color: true,
    size: true,
    rating: false,
    fabric: false,
    occasion: false,
    availability: true,
  });

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  /**
   * Helper to update URL search parameters and reset page to 1
   */
  const updateQueryParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");

    if (value === null || value === "") {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  /**
   * Clears specific filter keys from active search params
   */
  const clearFilterKeys = (keys: string[]) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");
    keys.forEach((k) => params.delete(k));

    if (keys.includes("minPrice")) setMinPrice("");
    if (keys.includes("maxPrice")) setMaxPrice("");

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  /**
   * Toggle multi-select items in comma-separated query parameters (e.g. brand, color, size)
   */
  const toggleMultiSelect = (key: string, itemSlug: string) => {
    const currentVal = searchParams.get(key) || "";
    const list = currentVal
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const exists = list.includes(itemSlug);
    const updated = exists
      ? list.filter((s) => s !== itemSlug)
      : [...list, itemSlug];

    updateQueryParam(key, updated.length > 0 ? updated.join(",") : null);
  };

  const handleApplyPrice = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");

    if (minPrice) params.set("minPrice", minPrice);
    else params.delete("minPrice");

    if (maxPrice) params.set("maxPrice", maxPrice);
    else params.delete("maxPrice");

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleClearAll = () => {
    setMinPrice("");
    setMaxPrice("");
    const params = new URLSearchParams();
    const sort = searchParams.get("sort");
    if (sort) params.set("sort", sort);
    const q = searchParams.get("q") || searchParams.get("search");
    if (q) params.set("q", q);

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  // Active filters count check
  const activeParams = Array.from(searchParams.entries()).filter(
    ([k]) => !["page", "limit", "sort", "q", "search"].includes(k)
  );
  const hasActiveFilters = activeParams.length > 0;

  // Selected values
  const hasPriceFilter = Boolean(searchParams.get("minPrice") || searchParams.get("maxPrice"));
  const selectedBrands = (searchParams.get("brand") || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const isInStockOnly = searchParams.get("inStock") === "true";
  const selectedRating = searchParams.get("rating") || "";

  // Dynamic attributes
  const colorAttr = filters?.attributes?.find((a) => a.slug === "color");
  const sizeAttr = filters?.attributes?.find((a) => a.slug === "size");
  const fabricAttr = filters?.attributes?.find((a) => a.slug === "fabric");
  const occasionAttr = filters?.attributes?.find((a) => a.slug === "occasion");

  const selectedColors = (searchParams.get("color") || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const selectedSizes = (searchParams.get("size") || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const selectedFabrics = (searchParams.get("fabric") || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const selectedOccasions = (searchParams.get("occasion") || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  // Filter content markup
  const sidebarContent = (
    <div className="space-y-6">
      {/* Sidebar Header & Clear All Button */}
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <h2 className="font-serif text-lg font-semibold text-text-main">
          Filter Selection
        </h2>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={handleClearAll}
            className="text-xs font-sans text-accent hover:underline font-semibold flex items-center gap-1"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span>Clear All</span>
          </button>
        )}
      </div>

      {/* 1. Category Tree Section */}
      <div className="border-b border-border pb-5">
        <button
          type="button"
          onClick={() => toggleSection("categories")}
          className="w-full flex items-center justify-between py-1 text-sm font-semibold text-text-main text-left group"
        >
          <span>Categories &amp; Weaves</span>
          <svg
            className={`w-4 h-4 text-text-subtle transition-transform duration-200 ${
              openSections.categories ? "rotate-180" : ""
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {openSections.categories && (
          <div className="pt-3">
            <CategoryFolderTree
              categories={categoriesTree}
              activeSlug={activeCategorySlug}
              compact
            />
          </div>
        )}
      </div>

      {/* 2. Price Range Filter with Section Clear */}
      <div className="border-b border-border pb-5">
        <div className="flex items-center justify-between py-1">
          <button
            type="button"
            onClick={() => toggleSection("price")}
            className="flex-1 flex items-center justify-between text-sm font-semibold text-text-main text-left group"
          >
            <span>Price Range</span>
            <svg
              className={`w-4 h-4 text-text-subtle transition-transform duration-200 ${
                openSections.price ? "rotate-180" : ""
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {hasPriceFilter && (
            <button
              type="button"
              onClick={() => clearFilterKeys(["minPrice", "maxPrice"])}
              className="text-[11px] text-accent hover:underline ml-2"
            >
              Clear
            </button>
          )}
        </div>

        {openSections.price && (
          <form onSubmit={handleApplyPrice} className="pt-3 space-y-3">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="block text-[11px] text-text-subtle mb-1">Min Price (₹)</label>
                <input
                  type="number"
                  min="0"
                  step="500"
                  placeholder={filters?.priceRange?.min ? String(filters.priceRange.min) : "0"}
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-md border border-border text-xs bg-surface-card focus:outline-none focus:border-accent"
                />
              </div>
              <div>
                <label className="block text-[11px] text-text-subtle mb-1">Max Price (₹)</label>
                <input
                  type="number"
                  min="0"
                  step="500"
                  placeholder={filters?.priceRange?.max ? String(filters.priceRange.max) : "50000"}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-md border border-border text-xs bg-surface-card focus:outline-none focus:border-accent"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 py-1.5 rounded-md bg-surface-soft hover:bg-surface-card border border-border text-xs font-semibold text-text-main transition-colors"
              >
                Apply Price
              </button>
              {hasPriceFilter && (
                <button
                  type="button"
                  onClick={() => clearFilterKeys(["minPrice", "maxPrice"])}
                  className="px-2.5 py-1.5 rounded-md text-xs text-text-subtle hover:text-error hover:bg-surface-soft transition-colors"
                >
                  Reset
                </button>
              )}
            </div>
          </form>
        )}
      </div>

      {/* 3. Brands Filter with Section Clear */}
      {filters?.brands && filters.brands.length > 0 && (
        <div className="border-b border-border pb-5">
          <div className="flex items-center justify-between py-1">
            <button
              type="button"
              onClick={() => toggleSection("brand")}
              className="flex-1 flex items-center justify-between text-sm font-semibold text-text-main text-left group"
            >
              <span>Brand ({filters.brands.length})</span>
              <svg
                className={`w-4 h-4 text-text-subtle transition-transform duration-200 ${
                  openSections.brand ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {selectedBrands.length > 0 && (
              <button
                type="button"
                onClick={() => clearFilterKeys(["brand"])}
                className="text-[11px] text-accent hover:underline ml-2"
              >
                Clear ({selectedBrands.length})
              </button>
            )}
          </div>

          {openSections.brand && (
            <div className="pt-3 space-y-2">
              {filters.brands.length > 5 && (
                <input
                  type="search"
                  placeholder="Filter brands..."
                  value={brandSearch}
                  onChange={(e) => setBrandSearch(e.target.value)}
                  className="w-full px-2.5 py-1 rounded-md border border-border text-xs bg-surface-card mb-2 focus:outline-none focus:border-accent"
                />
              )}
              <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
                {filters.brands
                  .filter((b) =>
                    b.name.toLowerCase().includes(brandSearch.toLowerCase())
                  )
                  .map((brand) => {
                    const isChecked = selectedBrands.includes(brand.name);
                    return (
                      <label
                        key={brand.name}
                        className="flex items-center justify-between text-xs text-text-secondary hover:text-text-main cursor-pointer select-none py-0.5"
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleMultiSelect("brand", brand.name)}
                            className="w-3.5 h-3.5 rounded-xs border-border text-primary focus:ring-accent"
                          />
                          <span className="truncate max-w-[150px]">{brand.name}</span>
                        </div>
                        <span className="text-[10px] text-text-subtle font-mono">
                          ({brand.count})
                        </span>
                      </label>
                    );
                  })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. Color Swatches Filter with Section Clear */}
      {colorAttr && colorAttr.values.length > 0 && (
        <div className="border-b border-border pb-5">
          <div className="flex items-center justify-between py-1">
            <button
              type="button"
              onClick={() => toggleSection("color")}
              className="flex-1 flex items-center justify-between text-sm font-semibold text-text-main text-left group"
            >
              <span>Color Palette</span>
              <svg
                className={`w-4 h-4 text-text-subtle transition-transform duration-200 ${
                  openSections.color ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {selectedColors.length > 0 && (
              <button
                type="button"
                onClick={() => clearFilterKeys(["color"])}
                className="text-[11px] text-accent hover:underline ml-2"
              >
                Clear ({selectedColors.length})
              </button>
            )}
          </div>

          {openSections.color && (
            <div className="pt-3 flex flex-wrap gap-1.5">
              {colorAttr.values.map((val) => {
                const isSelected = selectedColors.includes(val.slug);
                return (
                  <button
                    key={val.slug}
                    type="button"
                    onClick={() => toggleMultiSelect("color", val.slug)}
                    className={`px-2.5 py-1 rounded-full text-xs transition-all duration-150 flex items-center gap-1.5 ${
                      isSelected
                        ? "bg-primary text-primary-contrast font-medium shadow-xs"
                        : "bg-surface-soft hover:bg-surface-card border border-border text-text-main"
                    }`}
                  >
                    <span>{val.name}</span>
                    <span className="text-[10px] opacity-70">({val.count})</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 5. Size Pills Filter with Section Clear */}
      {sizeAttr && sizeAttr.values.length > 0 && (
        <div className="border-b border-border pb-5">
          <div className="flex items-center justify-between py-1">
            <button
              type="button"
              onClick={() => toggleSection("size")}
              className="flex-1 flex items-center justify-between text-sm font-semibold text-text-main text-left group"
            >
              <span>Size</span>
              <svg
                className={`w-4 h-4 text-text-subtle transition-transform duration-200 ${
                  openSections.size ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {selectedSizes.length > 0 && (
              <button
                type="button"
                onClick={() => clearFilterKeys(["size"])}
                className="text-[11px] text-accent hover:underline ml-2"
              >
                Clear ({selectedSizes.length})
              </button>
            )}
          </div>

          {openSections.size && (
            <div className="pt-3 grid grid-cols-4 gap-1.5">
              {sizeAttr.values.map((val) => {
                const isSelected = selectedSizes.includes(val.slug);
                return (
                  <button
                    key={val.slug}
                    type="button"
                    onClick={() => toggleMultiSelect("size", val.slug)}
                    className={`py-1.5 rounded-md text-xs font-semibold uppercase tracking-wider transition-colors ${
                      isSelected
                        ? "bg-primary text-primary-contrast"
                        : "border border-border text-text-main hover:bg-surface-soft"
                    }`}
                  >
                    {val.name}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 6. Customer Rating Filter (4★ & above, etc.) */}
      <div className="border-b border-border pb-5">
        <div className="flex items-center justify-between py-1">
          <button
            type="button"
            onClick={() => toggleSection("rating")}
            className="flex-1 flex items-center justify-between text-sm font-semibold text-text-main text-left group"
          >
            <span>Customer Rating</span>
            <svg
              className={`w-4 h-4 text-text-subtle transition-transform duration-200 ${
                openSections.rating ? "rotate-180" : ""
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {selectedRating && (
            <button
              type="button"
              onClick={() => clearFilterKeys(["rating"])}
              className="text-[11px] text-accent hover:underline ml-2"
            >
              Clear
            </button>
          )}
        </div>

        {openSections.rating && (
          <div className="pt-3 space-y-1.5">
            {[4, 3, 2].map((stars) => {
              const isSelected = selectedRating === String(stars);
              return (
                <button
                  key={stars}
                  type="button"
                  onClick={() => updateQueryParam("rating", isSelected ? null : String(stars))}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition-colors text-left ${
                    isSelected
                      ? "bg-primary/10 text-primary font-semibold"
                      : "hover:bg-surface-soft text-text-secondary hover:text-text-main"
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="text-accent text-sm">{"★".repeat(stars)}</span>
                    <span className="text-text-subtle/50 text-sm">{"☆".repeat(5 - stars)}</span>
                    <span className="text-xs">&amp; up</span>
                  </div>
                  {isSelected && (
                    <span className="text-[10px] text-primary font-bold">Selected</span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 7. Fabric Filter with Section Clear */}
      {fabricAttr && fabricAttr.values.length > 0 && (
        <div className="border-b border-border pb-5">
          <div className="flex items-center justify-between py-1">
            <button
              type="button"
              onClick={() => toggleSection("fabric")}
              className="flex-1 flex items-center justify-between text-sm font-semibold text-text-main text-left group"
            >
              <span>Fabric</span>
              <svg
                className={`w-4 h-4 text-text-subtle transition-transform duration-200 ${
                  openSections.fabric ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {selectedFabrics.length > 0 && (
              <button
                type="button"
                onClick={() => clearFilterKeys(["fabric"])}
                className="text-[11px] text-accent hover:underline ml-2"
              >
                Clear ({selectedFabrics.length})
              </button>
            )}
          </div>

          {openSections.fabric && (
            <div className="pt-3 space-y-1.5">
              {fabricAttr.values.map((val) => {
                const isChecked = selectedFabrics.includes(val.slug);
                return (
                  <label
                    key={val.slug}
                    className="flex items-center justify-between text-xs text-text-secondary hover:text-text-main cursor-pointer select-none py-0.5"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleMultiSelect("fabric", val.slug)}
                        className="w-3.5 h-3.5 rounded-xs border-border text-primary focus:ring-accent"
                      />
                      <span>{val.name}</span>
                    </div>
                    <span className="text-[10px] text-text-subtle font-mono">({val.count})</span>
                  </label>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 8. Occasion Filter with Section Clear */}
      {occasionAttr && occasionAttr.values.length > 0 && (
        <div className="border-b border-border pb-5">
          <div className="flex items-center justify-between py-1">
            <button
              type="button"
              onClick={() => toggleSection("occasion")}
              className="flex-1 flex items-center justify-between text-sm font-semibold text-text-main text-left group"
            >
              <span>Occasion</span>
              <svg
                className={`w-4 h-4 text-text-subtle transition-transform duration-200 ${
                  openSections.occasion ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {selectedOccasions.length > 0 && (
              <button
                type="button"
                onClick={() => clearFilterKeys(["occasion"])}
                className="text-[11px] text-accent hover:underline ml-2"
              >
                Clear ({selectedOccasions.length})
              </button>
            )}
          </div>

          {openSections.occasion && (
            <div className="pt-3 space-y-1.5">
              {occasionAttr.values.map((val) => {
                const isChecked = selectedOccasions.includes(val.slug);
                return (
                  <label
                    key={val.slug}
                    className="flex items-center justify-between text-xs text-text-secondary hover:text-text-main cursor-pointer select-none py-0.5"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleMultiSelect("occasion", val.slug)}
                        className="w-3.5 h-3.5 rounded-xs border-border text-primary focus:ring-accent"
                      />
                      <span>{val.name}</span>
                    </div>
                    <span className="text-[10px] text-text-subtle font-mono">({val.count})</span>
                  </label>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 9. In-Stock Availability with Clear */}
      <div className="pt-1">
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm font-semibold text-text-main cursor-pointer select-none py-1">
            <input
              type="checkbox"
              checked={isInStockOnly}
              onChange={(e) => updateQueryParam("inStock", e.target.checked ? "true" : null)}
              className="w-4 h-4 rounded-xs border-border text-primary focus:ring-accent"
            />
            <span>In Stock Only</span>
          </label>
          {isInStockOnly && (
            <button
              type="button"
              onClick={() => clearFilterKeys(["inStock"])}
              className="text-[11px] text-accent hover:underline"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* 10. Bottom Reset All Button */}
      {hasActiveFilters && (
        <div className="pt-4 border-t border-border">
          <button
            type="button"
            onClick={handleClearAll}
            className="w-full py-2 px-3 rounded-lg border border-border hover:border-error hover:text-error text-text-secondary text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span>Reset All Filters</span>
          </button>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar Column */}
      <aside className={`hidden lg:block w-64 shrink-0 ${className}`}>
        <div className="sticky top-28 bg-surface-card border border-border/80 rounded-xl p-5 shadow-xs max-h-[calc(100vh-8rem)] overflow-y-auto">
          {sidebarContent}
        </div>
      </aside>

      {/* Mobile / Tablet Drawer */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
            aria-hidden="true"
          />

          {/* Drawer Pane */}
          <div className="relative ml-auto w-full max-w-xs sm:max-w-sm bg-background h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300">
            {/* Drawer Header */}
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold text-text-main">
                Filters &amp; Options
              </h3>
              <button
                type="button"
                onClick={onCloseMobile}
                className="p-2 rounded-full text-text-subtle hover:text-text-main hover:bg-surface-soft"
                aria-label="Close filters"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Drawer Body */}
            <div className="p-5 overflow-y-auto flex-1">{sidebarContent}</div>

            {/* Drawer Bottom Bar */}
            <div className="p-4 border-t border-border bg-surface-card flex gap-2">
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="flex-1 py-2.5 rounded-lg border border-border hover:border-error hover:text-error text-text-secondary text-xs font-semibold uppercase tracking-wider text-center"
                >
                  Clear All
                </button>
              )}
              <button
                type="button"
                onClick={onCloseMobile}
                className="flex-1 py-2.5 rounded-lg bg-primary text-primary-contrast font-semibold text-xs uppercase tracking-wider text-center"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CategoryFilterSidebar;
