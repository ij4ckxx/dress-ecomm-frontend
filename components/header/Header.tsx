"use client";

import React, { useState, useCallback } from "react";
import { HeaderProps } from "./types";
import { HeaderTopBar } from "./HeaderTopBar";
import { HeaderNav } from "./HeaderNav";
import { MobileHeaderNav } from "./MobileHeaderNav";

/**
 * Modern luxury e-commerce header featuring a two-tiered navigation layout:
 * - Top tier: Brand Logo, expanded search bar, Support Concierge, Account, and Bag.
 * - Bottom tier: Dynamic top 5 categories on the left, promotional highlights on the right,
 *   with an interactive category mega-menu dropdown.
 *
 * @param {HeaderProps} props
 * @returns {React.ReactElement}
 */
export const Header: React.FC<HeaderProps> = ({
  currentUser = null,
  categories,
  className = "",
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleMobileMenuToggle = useCallback(() => {
    setMobileMenuOpen((prev) => !prev);
  }, []);

  const handleMobileMenuClose = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  return (
    <header className={`sticky top-0 z-40 w-full transition-shadow ${className}`}>
      {/* 1. Top Tier: Logo, Full-width Search, Concierge, Account, Cart */}
      <HeaderTopBar
        currentUser={currentUser}
        isMobileMenuOpen={mobileMenuOpen}
        onMobileMenuToggle={handleMobileMenuToggle}
      />

      {/* 2. Bottom Tier: First 5 Categories (Left) & Highlights (Right) + Mega Menu */}
      <HeaderNav categories={categories} />

      {/* 3. Mobile Navigation Drawer */}
      <MobileHeaderNav
        isOpen={mobileMenuOpen}
        onClose={handleMobileMenuClose}
        currentUser={currentUser}
        categories={categories}
      />
    </header>
  );
};

export default Header;
