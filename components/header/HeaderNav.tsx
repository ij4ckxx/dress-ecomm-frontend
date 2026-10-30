"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HeaderNavProps } from "./types";
import { NAV_HIGHLIGHTS } from "./constants";
import { CategoryMegaMenu } from "@/components/category/CategoryMegaMenu";

/**
 * Bottom sub-navigation bar displaying the first 5 dynamic categories on the left
 * and promotional highlight links (New, Sale, Editorial, Our Collections) on the right.
 * Seamlessly integrates the luxury CategoryMegaMenu on hover/focus.
 *
 * @param {HeaderNavProps} props
 * @returns {React.ReactElement}
 */
export const HeaderNav: React.FC<HeaderNavProps> = ({ categories = [] }) => {
  const pathname = usePathname();
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const displayCategories = categories || [];

  // First 5 dynamic categories on the left
  const firstFiveCategories = displayCategories.slice(0, 5);

  const handleMouseEnterItem = (slug?: string) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    if (displayCategories.length > 0) {
      setActiveSlug(slug || displayCategories[0]?.slug || null);
      setMegaMenuOpen(true);
    }
  };

  const handleMouseLeaveNav = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setMegaMenuOpen(false);
      setActiveSlug(null);
    }, 180);
  };

  return (
    <div
      className="relative w-full bg-surface-card border-b border-border/70 shadow-2xs"
      onMouseLeave={handleMouseLeaveNav}
    >
      <nav
        aria-label="Primary Catalog Navigation"
        className="hidden lg:block max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-11"
      >
        <div className="h-full flex items-center justify-between text-xs sm:text-[13px]">
          {/* Left: First 5 Dynamic Categories */}
          <div className="flex items-center gap-7 sm:gap-9">
            {firstFiveCategories.map((category) => {
              const href = `/category/${category.slug}`;
              const isActive = pathname === href || pathname?.startsWith(`${href}/`);

              return (
                <div
                  key={category.id || category.slug}
                  onMouseEnter={() => handleMouseEnterItem(category.slug)}
                  className="relative py-2"
                >
                  <Link
                    href={href}
                    className={`font-medium tracking-wide transition-colors relative py-1 inline-flex items-center gap-1 ${
                      isActive
                        ? "text-primary font-semibold"
                        : "text-text-secondary hover:text-primary"
                    }`}
                  >
                    <span>{category.name}</span>
                    {category.isNew && (
                      <span className="text-[9px] uppercase px-1.5 py-0.2 rounded-xs font-semibold bg-primary/10 text-primary">
                        New
                      </span>
                    )}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 w-full h-[2px] bg-primary rounded-full" />
                    )}
                  </Link>
                </div>
              );
            })}
          </div>

          {/* Right: Special Highlights (New, Sale, Editorial, Our Collections) */}
          <div className="flex items-center gap-6 sm:gap-8">
            {NAV_HIGHLIGHTS.map((item) => {
              const isActive = pathname === item.href;
              const isCollections = item.label === "Our Collections";

              return (
                <div
                  key={item.label}
                  onMouseEnter={() =>
                    isCollections ? handleMouseEnterItem() : undefined
                  }
                  className="relative py-2"
                >
                  <Link
                    href={item.href}
                    className={`font-medium tracking-wide transition-colors relative py-1 inline-flex items-center gap-1 ${
                      item.isSale
                        ? "text-accent font-semibold hover:text-accent-hover"
                        : isActive
                        ? "text-primary font-semibold"
                        : "text-text-secondary hover:text-primary"
                    }`}
                  >
                    <span>{item.label}</span>
                    {isCollections && (
                      <svg
                        className="w-3 h-3 text-text-subtle transition-transform duration-200"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    )}
                    {isActive && (
                      <span
                        className={`absolute bottom-0 left-0 w-full h-[2px] rounded-full ${
                          item.isSale ? "bg-accent" : "bg-primary"
                        }`}
                      />
                    )}
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Dynamic Category Mega Menu Dropdown */}
      {displayCategories.length > 0 && (
        <CategoryMegaMenu
          categories={displayCategories}
          isOpen={megaMenuOpen}
          onClose={() => setMegaMenuOpen(false)}
          activeCategorySlug={activeSlug}
        />
      )}
    </div>
  );
};
