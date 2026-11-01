"use client";

import React, { useState, useRef, useEffect, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HeaderSearchProps } from "./types";
import { smartSearchAction, getLiveSearchResultsAction } from "@/app/actions/product.actions";
import { CategoryItem } from "@/lib/types/category";
import { ProductCardItem } from "@/lib/types/product";

/**
 * Format Indian Rupee currency standard (e.g., ₹25,000)
 */
const formatPrice = (amount: number): string => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Modern header search bar with:
 * - Debounced instant autocomplete
 * - Shimmer skeleton loader while fetching
 * - Matching Categories at the top (direct category link)
 * - Matching Products below (direct PDP link)
 * - Server Action form submission fallback
 * - Click outside & Escape key dismissal
 */
export const HeaderSearch: React.FC<HeaderSearchProps> = ({
  className = "",
  placeholder = "Search sarees, dresses, collections...",
  onSearchSubmit,
}) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [products, setProducts] = useState<ProductCardItem[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);

  const [isPending, startTransition] = useTransition();

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Debounced search effect
  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setCategories([]);
      setProducts([]);
      setTotalProducts(0);
      setIsOpen(false);
      return;
    }

    setIsOpen(true);
    const timeoutId = setTimeout(() => {
      startTransition(async () => {
        const results = await getLiveSearchResultsAction(trimmed);
        setCategories(results.categories);
        setProducts(results.products);
        setTotalProducts(results.totalProducts);
      });
    }, 250);

    return () => clearTimeout(timeoutId);
  }, [query]);

  /**
   * Clears the active search query and refocuses input.
   */
  const handleClear = () => {
    setQuery("");
    setCategories([]);
    setProducts([]);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleSelectResult = () => {
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={`relative w-full max-w-2xl ${className}`}>
      <form
        action={smartSearchAction}
        role="search"
        onSubmit={() => setIsOpen(false)}
        className="relative flex items-center w-full"
      >
        <div className="relative w-full flex items-center">
          {/* Search Magnifying Glass Icon / Spinner */}
          <span className="absolute left-3.5 text-text-subtle pointer-events-none flex items-center justify-center">
            {isPending ? (
              <span className="w-4 h-4 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
            ) : (
              <svg
                className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-text-subtle/80"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
            )}
          </span>

          {/* Input Field */}
          <input
            ref={inputRef}
            type="search"
            name="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              if (query.trim().length >= 2) setIsOpen(true);
            }}
            placeholder={placeholder}
            autoComplete="off"
            className="w-full h-10 sm:h-11 pl-10 pr-10 text-xs sm:text-sm bg-surface-card text-text-main placeholder:text-text-subtle/70 rounded-md border border-border/90 hover:border-border transition-colors focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30"
            aria-label="Search storefront products and collections"
          />

          {/* Clear Button (Visible when typing) */}
          {query.length > 0 && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 p-1 rounded-full text-text-subtle hover:text-text-main hover:bg-surface-soft transition-colors"
              aria-label="Clear search input"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </form>

      {/* Live Autocomplete Results Dropdown with Skeleton Loader */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-surface-card border border-border rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-200">
          {/* A. SKELETON LOADER (Visible while fetching) */}
          {isPending ? (
            <div className="p-4 space-y-4">
              {/* Category skeleton chips */}
              <div>
                <div className="h-3 w-28 bg-surface-soft rounded-sm animate-pulse mb-2.5" />
                <div className="flex gap-2">
                  <div className="h-8 w-28 bg-surface-soft rounded-full animate-pulse" />
                  <div className="h-8 w-32 bg-surface-soft rounded-full animate-pulse" />
                  <div className="h-8 w-24 bg-surface-soft rounded-full animate-pulse" />
                </div>
              </div>

              {/* Product items skeleton */}
              <div>
                <div className="h-3 w-24 bg-surface-soft rounded-sm animate-pulse mb-2.5" />
                <div className="space-y-2.5">
                  {[1, 2, 3].map((n) => (
                    <div key={n} className="flex items-center gap-3">
                      <div className="w-12 h-14 bg-surface-soft rounded-md animate-pulse shrink-0" />
                      <div className="flex-1 space-y-1.5">
                        <div className="h-3.5 bg-surface-soft rounded-sm w-3/4 animate-pulse" />
                        <div className="h-3 bg-surface-soft rounded-sm w-1/3 animate-pulse" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : categories.length === 0 && products.length === 0 ? (
            /* B. NO RESULTS FOUND */
            <div className="p-6 text-center text-xs text-text-subtle space-y-1.5">
              <p className="font-medium text-text-main">
                No matches found for &ldquo;{query}&rdquo;
              </p>
              <p>Try searching for pure silk sarees, velvet gowns, or artisan brands.</p>
            </div>
          ) : (
            /* C. LIVE MATCHED CATEGORIES & PRODUCTS */
            <div className="max-h-[75vh] overflow-y-auto divide-y divide-border/60">
              {/* 1. MATCHING CATEGORIES AT THE TOP */}
              {categories.length > 0 && (
                <div className="p-3 bg-surface-soft/40">
                  <span className="text-[10px] font-sans uppercase tracking-[0.2em] font-bold text-accent block mb-2 px-1">
                    Matching Categories
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {categories.map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/category/${cat.slug}`}
                        onClick={handleSelectResult}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-card hover:bg-primary hover:text-primary-contrast border border-border text-xs font-medium text-text-main transition-colors group"
                      >
                        <svg
                          className="w-3.5 h-3.5 text-accent group-hover:text-primary-contrast"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776"
                          />
                        </svg>
                        <span>{cat.name}</span>
                        {cat.productCount !== undefined && (
                          <span className="text-[10px] opacity-70 font-mono">
                            ({cat.productCount})
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* 2. MATCHING PRODUCTS BELOW */}
              {products.length > 0 && (
                <div className="p-3">
                  <span className="text-[10px] font-sans uppercase tracking-[0.2em] font-bold text-text-subtle block mb-2 px-1">
                    Matching Products ({totalProducts})
                  </span>
                  <ul className="space-y-1">
                    {products.map((prod) => (
                      <li key={prod.id}>
                        <Link
                          href={`/product/${prod.slug}`}
                          onClick={handleSelectResult}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-surface-soft transition-colors group"
                        >
                          {/* Thumbnail */}
                          <div className="relative w-11 h-14 bg-surface-soft rounded-md overflow-hidden shrink-0 border border-border/60">
                            {prod.thumbnail ? (
                              <Image
                                src={prod.thumbnail}
                                alt={prod.name}
                                fill
                                sizes="44px"
                                className="object-cover object-center group-hover:scale-105 transition-transform"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[10px] text-text-subtle">
                                No Img
                              </div>
                            )}
                          </div>

                          {/* Product Details */}
                          <div className="flex-1 min-w-0">
                            {prod.brand && (
                              <span className="block text-[10px] font-semibold uppercase tracking-wider text-text-subtle line-clamp-1">
                                {prod.brand}
                              </span>
                            )}
                            <h4 className="text-xs sm:text-sm font-serif font-medium text-text-main line-clamp-1 group-hover:text-primary transition-colors">
                              {prod.name}
                            </h4>
                            <div className="flex items-baseline gap-2 mt-0.5">
                              <span className="text-xs font-bold font-sans text-text-main">
                                {formatPrice(prod.price.effective)}
                              </span>
                              {prod.price.discountPercentage > 0 && (
                                <span className="text-[10px] text-accent font-semibold">
                                  Save {prod.price.discountPercentage}%
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Arrow Icon */}
                          <svg
                            className="w-4 h-4 text-text-subtle group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 3. VIEW ALL RESULTS FOOTER */}
              <div className="p-3 bg-surface-soft/60 flex items-center justify-between text-xs">
                <span className="text-text-subtle font-mono text-[11px]">
                  Found {totalProducts} items
                </span>
                <Link
                  href={`/search?q=${encodeURIComponent(query.trim())}`}
                  onClick={handleSelectResult}
                  className="font-semibold text-primary hover:underline flex items-center gap-1 text-xs"
                >
                  <span>View all search results</span>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HeaderSearch;
