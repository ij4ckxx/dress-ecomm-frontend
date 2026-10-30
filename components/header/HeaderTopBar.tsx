"use client";

import React from "react";
import Link from "next/link";
import { SafeUser } from "@/lib/auth/types";
import { Logo } from "@/components/shared/Logo";
import { HeaderSearch } from "./HeaderSearch";
import { HeaderActions } from "./HeaderActions";

export interface HeaderTopBarProps {
  currentUser?: SafeUser | null;
  onMobileMenuToggle: () => void;
  isMobileMenuOpen: boolean;
}

/**
 * Top bar of the luxury e-commerce header rendering the logo,
 * centralized search bar, and primary account/cart actions.
 */
export const HeaderTopBar: React.FC<HeaderTopBarProps> = ({
  currentUser = null,
  onMobileMenuToggle,
  isMobileMenuOpen,
}) => {
  return (
    <div className="w-full bg-surface-card border-b border-border/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4 sm:gap-8">
        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={onMobileMenuToggle}
          className="lg:hidden p-2 -ml-2 rounded-lg text-text-main hover:bg-surface-soft transition-colors"
          aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          )}
        </button>

        {/* Brand Logo */}
        <Link
          href="/"
          className="inline-flex items-center shrink-0 focus:outline-none focus:ring-1 focus:ring-accent rounded-sm py-1 transition-transform hover:scale-[1.02]"
          aria-label="Saayal Stories Home"
        >
          <Logo variant="default" height={54} priority />
        </Link>

        {/* Centralized Search Bar (Desktop & Tablet) */}
        <div className="hidden lg:flex flex-1 justify-center px-4">
          <HeaderSearch />
        </div>

        {/* Right Actions: Support, Account, Cart */}
        <HeaderActions currentUser={currentUser} />
      </div>

      {/* Mobile Search Bar Row (Visible on small screens below top bar) */}
      <div className="lg:hidden px-4 pb-3 pt-1 bg-surface-card">
        <HeaderSearch placeholder="Search dresses, sarees, lehengas..." />
      </div>
    </div>
  );
};

