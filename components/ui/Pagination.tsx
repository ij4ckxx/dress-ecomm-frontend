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
  /** Optional callback when page changes (for client-side pagination) */
  onPageChange?: (page: number) => void;
  /** Optional href generator for URL-based pagination (e.g. `(p) => ?page=${p}`) */
  buildHref?: (page: number) => string;
  /** Optional additional CSS classes */
  className?: string;
  /** Whether to display the "Showing X–Y of Z items" counter */
  showItemCount?: boolean;
  /** Noun to use for items in counter (e.g. "addresses", "items", "products") */
  itemName?: string;
  /** Disable all interactive pagination controls */
  disabled?: boolean;
}

/**
 * Calculates page window numbers with ellipsis markers.
 * e.g. [1, 2, 3, 4, 5, '...', 12] or [1, '...', 4, 5, 6, '...', 12]
 */
function getPageRange(current: number, total: number): (number | "...")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  // Near the start
  if (current <= 4) {
    return [1, 2, 3, 4, 5, "...", total];
  }

  // Near the end
  if (current >= total - 3) {
    return [1, "...", total - 4, total - 3, total - 2, total - 1, total];
  }

  // In the middle
  return [1, "...", current - 1, current, current + 1, "...", total];
}

/**
 * Universal, accessible, luxury boutique Pagination component.
 * Can be used seamlessly across server-rendered routes (via `buildHref`)
 * and interactive client state (via `onPageChange`).
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
  // If there's 1 or 0 pages and no total items to display, hide the component
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
      "min-w-9 h-9 px-3 rounded-xl text-xs font-semibold flex items-center justify-center transition-all duration-200 cursor-pointer select-none focus-ring";

    const stateClasses = isActive
      ? "bg-primary text-primary-contrast font-bold shadow-xs scale-105"
      : isDisabled
      ? "text-text-subtle/40 bg-surface-card border border-border/40 cursor-not-allowed opacity-50"
      : "text-text-secondary bg-surface-card border border-border hover:border-accent hover:text-primary hover:bg-surface-soft";

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
      aria-label="Pagination Navigation"
      className={`pt-6 mt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 ${className}`}
    >
      {/* Item count summary */}
      {showItemCount && totalItems !== undefined && (
        <p className="text-xs text-text-subtle order-2 sm:order-1">
          Showing <span className="font-semibold text-text-main">{startItem}</span>–
          <span className="font-semibold text-text-main">{endItem}</span> of{" "}
          <span className="font-semibold text-text-main">{totalItems}</span> {itemName}
        </p>
      )}

      {/* Pagination Controls */}
      <div className="flex items-center gap-1.5 order-1 sm:order-2">
        {/* Previous Button */}
        {renderItem(
          currentPage - 1,
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="hidden sm:inline">Prev</span>
          </span>,
          false,
          isFirstPage,
          "Previous page"
        )}

        {/* Page Numbers */}
        <div className="flex items-center gap-1">
          {pageRange.map((item, idx) => {
            if (item === "...") {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="w-8 h-9 flex items-center justify-center text-xs text-text-subtle select-none"
                  aria-hidden="true"
                >
                  •••
                </span>
              );
            }

            const pageNum = item as number;
            return (
              <React.Fragment key={pageNum}>
                {renderItem(pageNum, pageNum, pageNum === currentPage, false, `Page ${pageNum}`)}
              </React.Fragment>
            );
          })}
        </div>

        {/* Next Button */}
        {renderItem(
          currentPage + 1,
          <span className="flex items-center gap-1">
            <span className="hidden sm:inline">Next</span>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>,
          false,
          isLastPage,
          "Next page"
        )}
      </div>
    </nav>
  );
};

export default Pagination;

