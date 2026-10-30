"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PRIMARY_CATEGORIES, NAV_HIGHLIGHTS } from "./constants";

/**
 * Bottom sub-navigation bar displaying the first 5 primary categories on the left
 * and promotional/highlight links (New, Sale, Blog, Brands) on the right.
 */
export const HeaderNav: React.FC = () => {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary Catalog Navigation"
      className="hidden lg:block w-full bg-surface-card border-b border-border/70 shadow-2xs"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-11 flex items-center justify-between text-xs sm:text-[13px]">
        {/* Left: First 5 Primary Categories */}
        <div className="flex items-center gap-7 sm:gap-9">
          {PRIMARY_CATEGORIES.map((category) => {
            const isActive = pathname === category.href;
            return (
              <Link
                key={category.label}
                href={category.href}
                className={`font-medium tracking-wide transition-colors relative py-2 ${
                  isActive
                    ? "text-primary font-semibold"
                    : "text-text-secondary hover:text-primary"
                }`}
              >
                {category.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-primary rounded-full" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Right: Special Highlights (New, Sale, Editorial, Collections) */}
        <div className="flex items-center gap-6 sm:gap-8">
          {NAV_HIGHLIGHTS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`font-medium tracking-wide transition-colors relative py-2 ${
                  item.isSale
                    ? "text-accent font-semibold hover:text-accent-hover"
                    : isActive
                    ? "text-primary font-semibold"
                    : "text-text-secondary hover:text-primary"
                }`}
              >
                {item.label}
                {isActive && (
                  <span
                    className={`absolute bottom-0 left-0 w-full h-[2px] rounded-full ${
                      item.isSale ? "bg-accent" : "bg-primary"
                    }`}
                  />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

