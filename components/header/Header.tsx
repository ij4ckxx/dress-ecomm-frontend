"use client";

import React, { useState } from "react";
import { HeaderProps } from "./types";
import { HeaderTopBar } from "./HeaderTopBar";
import { HeaderNav } from "./HeaderNav";
import { MobileHeaderNav } from "./MobileHeaderNav";

/**
 * Modern luxury e-commerce header featuring a two-tiered navigation layout:
 * - Top tier: Logo, full-width search bar, Support, Account, and Cart.
 * - Bottom tier: Primary top 5 categories on the left, promotional highlights on the right.
 */
export const Header: React.FC<HeaderProps> = ({ currentUser = null, className = "" }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className={`sticky top-0 z-40 w-full transition-shadow ${className}`}>
      {/* 1. Top Tier: Logo, Search, Actions */}
      <HeaderTopBar
        currentUser={currentUser}
        isMobileMenuOpen={mobileMenuOpen}
        onMobileMenuToggle={() => setMobileMenuOpen((prev) => !prev)}
      />

      {/* 2. Bottom Tier: Categories (Left) & Highlights (Right) */}
      <HeaderNav />

      {/* 3. Mobile Navigation Drawer */}
      <MobileHeaderNav
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        currentUser={currentUser}
      />
    </header>
  );
};

export default Header;

