"use client";

import React from "react";
import Link from "next/link";

export interface PaginationProps {
  /** Current active 1-indexed page */
  currentPage: number;
  /** Total number of available pages */
  totalPages: number;
  /** Total count of items across all pages */
  totalItems?: number;
  /** Items per page (default: 10) */
  pageSize?: number;
  /** Optional callback when page changes (for client-side state) */
  onPageChange?: (page: number) => void;
  /** Optional href generator for URL-based pagination (e.g. `(p) => ?page=${p}`) */
  buildHref?: (page: number) => string;
  /** Optional additional CSS classes */
  className?: string;
  /** Whether to display the "Showing X–Y of Z items" counter */
  showItemCount?: boolean;
  /** Noun to use for items in counter (e.g. "designs", "products", "items") */
  itemName?: string;
  /** Disable all interactive pagination controls */
  disabled?: boolean;
}

/**
 * Calculates page window numbers with ellipsis markers.
 */
function getPageRange(current: number, total: number): (number | "...")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  if (current <= 4) {
    return [1, 2, 3, 4, 5, "...", total];
  }

  if (current >= total - 3) {
    return [1, "...", total - 4, total - 3, total - 2, total - 1, total];
  }

  return [1, "...", current - 1, current, current + 1, "...", total];
}

/**
 * Advanced Luxury Boutique Circular Pagination component.
 * Features:
 * - Circular round buttons for elegant high-fashion aesthetics
 * - Go to First Page Arrow («) without text labels
 * - Previous Page Arrow (‹) without text labels
 * - Numeric circular page window with Ellipsis jumps
 * - Next Page Arrow (›) without text labels
 * - Go to Last Page Arrow (») without text labels
 * - Full accessibility compliance with aria-labels and touch target sizes
 * - Dual support for Next.js SEO href routing and client state callbacks
 */
export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  pageSize = 10,
  onPageChange,
  buildHref,
  className = "",
  showItemCount = true,
  itemName = "items",
  disabled = false,
}) => {
  // If there's 1 or 0 pages and no total items, hide component
  if (totalPages <= 1 && (!totalItems || totalItems <= pageSize)) {
    return null;
  }

  const pageRange = getPageRange(currentPage, totalPages);
  const isFirstPage = currentPage <= 1;
  const isLastPage = currentPage >= totalPages;

  // Item range text calculation
  const startItem = totalItems ? Math.min((currentPage - 1) * pageSize + 1, totalItems) : 0;
  const endItem = totalItems ? Math.min(currentPage * pageSize, totalItems) : 0;

  const handlePageClick = (page: number, e?: React.MouseEvent) => {
    if (disabled || page === currentPage || page < 1 || page > totalPages) {
      if (e) e.preventDefault();
      return;
    }
    if (onPageChange) {
      onPageChange(page);
    }
  };

  /**
   * Helper to render a navigation button or Next.js Link
   */
  const renderItem = (
    page: number,
    label: React.ReactNode,
    isActive: boolean = false,
    isDisabled: boolean = false,
    ariaLabel?: string
  ) => {
    const baseClasses =
      "w-9 h-9 sm:w-10 sm:h-10 rounded-full text-xs font-semibold flex items-center justify-center transition-all duration-200 select-none focus-ring shrink-0";

    const stateClasses = isActive
      ? "bg-primary text-primary-contrast font-bold shadow-sm scale-105 pointer-events-none"
      : isDisabled
      ? "text-text-subtle/30 bg-surface-card/60 border border-border/40 cursor-not-allowed opacity-40 pointer-events-none"
      : "text-text-main bg-surface-card border border-border hover:border-accent hover:text-primary hover:bg-surface-soft active:scale-95 cursor-pointer shadow-2xs";

    if (buildHref && !isDisabled) {
      return (
        <Link
          href={buildHref(page)}
          onClick={(e) => handlePageClick(page, e)}
          aria-label={ariaLabel || `Page ${page}`}
          aria-current={isActive ? "page" : undefined}
          className={`${baseClasses} ${stateClasses}`}
        >
          {label}
        </Link>
      );
    }

    return (
      <button
        type="button"
        onClick={(e) => handlePageClick(page, e)}
        disabled={isDisabled || disabled}
        aria-label={ariaLabel || `Page ${page}`}
        aria-current={isActive ? "page" : undefined}
        className={`${baseClasses} ${stateClasses}`}
      >
        {label}
      </button>
    );
  };

  return (
    <nav
      role="navigation"
      aria-label="Storefront Pagination"
      className={`pt-6 mt-6 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4 ${className}`}
    >
      {/* Item count summary */}
      {showItemCount && totalItems !== undefined && (
        <p className="text-xs text-text-subtle order-2 md:order-1 font-mono">
          Showing <span className="font-semibold text-text-main">{startItem}</span>–
          <span className="font-semibold text-text-main">{endItem}</span> of{" "}
          <span className="font-semibold text-text-main">{totalItems.toLocaleString()}</span>{" "}
          {itemName} (Page {currentPage} of {totalPages})
        </p>
      )}

      {/* Pagination Controls */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 order-1 md:order-2">
        {/* 1. Go to First Page Arrow («) */}
        {renderItem(
          1,
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>,
          false,
          isFirstPage,
          "Go to first page"
        )}

        {/* 2. Previous Page Arrow (‹) */}
        {renderItem(
          currentPage - 1,
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>,
          false,
          isFirstPage,
          "Go to previous page"
        )}

        {/* 3. Numbered Pages Window */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {pageRange.map((page, index) => {
            if (page === "...") {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="w-8 h-9 sm:w-8 sm:h-10 flex items-center justify-center text-text-subtle font-mono text-sm"
                  aria-hidden="true"
                >
                  …
                </span>
              );
            }

            return (
              <React.Fragment key={`page-${page}`}>
                {renderItem(
                  page,
                  <span>{page}</span>,
                  page === currentPage,
                  false,
                  `Page ${page}`
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* 4. Next Page Arrow (›) */}
        {renderItem(
          currentPage + 1,
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>,
          false,
          isLastPage,
          "Go to next page"
        )}

        {/* 5. Go to Last Page Arrow (») */}
        {renderItem(
          totalPages,
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          </svg>,
          false,
          isLastPage,
          "Go to last page"
        )}
      </div>
    </nav>
  );
};

export default Pagination;
