"use client";

import React, { useState, useRef, useEffect, useTransition } from "react";
import Link from "next/link";
import gsap from "gsap";
import { SafeUser } from "@/lib/auth/types";
import { searchProductsAction } from "@/app/actions/customer.actions";
import { logoutAction } from "@/app/actions/auth.actions";

export interface HeaderProps {
  currentUser: SafeUser | null;
}

/**
 * Navigation categories suitable for luxury women's ethnic wear and designer dresses.
 */
const NAVIGATION_CATEGORIES = [
  { label: "New Arrivals", href: "/category/new-arrivals", isHighlight: true },
  { label: "Heritage Sarees", href: "/category/sarees" },
  { label: "Bridal Lehengas", href: "/category/lehengas" },
  { label: "Silk Kurtis & Suits", href: "/category/kurtis" },
  { label: "Designer Gowns", href: "/category/dresses" },
  { label: "Festive Capsule", href: "/category/festive-collection" },
  { label: "Artisanal Weaves", href: "/category/handloom" },
];

/**
 * Returns two-letter initials from customer full name.
 */
const getInitials = (name?: string | null): string => {
  if (!name) return "VY";
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return parts[0].slice(0, 2).toUpperCase();
};

/**
 * Shared luxury fashion header inspired by HomeClick with responsive navigation,
 * prominent search, GSAP-animated account dropdown, and dynamic session states.
 */
export const Header: React.FC<HeaderProps> = ({ currentUser }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const [isLoggingOut, startLogout] = useTransition();

  const headerRef = useRef<HTMLElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileDrawerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click or escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setAccountDropdownOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setAccountDropdownOpen(false);
        setMobileMenuOpen(false);
        setMobileSearchOpen(false);
      }
    };

    if (accountDropdownOpen || mobileMenuOpen || mobileSearchOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [accountDropdownOpen, mobileMenuOpen, mobileSearchOpen]);

  // GSAP animation for Account Dropdown
  useEffect(() => {
    if (!dropdownRef.current) return;
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const ctx = gsap.context(() => {
      if (accountDropdownOpen) {
        gsap.fromTo(
          dropdownRef.current,
          { opacity: 0, y: -8, scale: 0.98 },
          { opacity: 1, y: 0, scale: 1, duration: 0.22, ease: "power2.out" }
        );
      }
    }, dropdownRef);

    return () => ctx.revert();
  }, [accountDropdownOpen]);

  // GSAP animation for Mobile Drawer
  useEffect(() => {
    if (!mobileDrawerRef.current) return;
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const ctx = gsap.context(() => {
      if (mobileMenuOpen) {
        gsap.fromTo(
          mobileDrawerRef.current,
          { x: "-100%" },
          { x: "0%", duration: 0.35, ease: "power3.out" }
        );
      }
    }, mobileDrawerRef);

    return () => ctx.revert();
  }, [mobileMenuOpen]);

  const handleSignOut = () => {
    startLogout(async () => {
      await logoutAction();
    });
  };

  const userFirstName = currentUser?.name?.split(/\s+/)[0] || "Valued Guest";
  const userInitials = getInitials(currentUser?.name);

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-40 w-full bg-background/98 backdrop-blur-md border-b border-border shadow-xs transition-all"
    >
      {/* 1. Top Utility & Announcement Bar (HomeClick inspired) */}
      <div className="bg-primary text-primary-contrast text-[11px] sm:text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-surface-tint animate-pulse" />
            <span className="tracking-wide uppercase font-medium">
              Complimentary Insured Shipping & Silk Packaging on Orders Over ₹5,000
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-6 text-[11px] text-primary-contrast/90 tracking-wider uppercase font-medium">
            <span className="hover:text-surface-tint transition-colors cursor-pointer">
              Boutique Concierge: +91 98765 43210
            </span>
            <span className="text-primary-contrast/40">•</span>
            <Link href="/orders/track" className="hover:text-surface-tint transition-colors focus-ring rounded">
              Track Order
            </Link>
            <span className="text-primary-contrast/40">•</span>
            <Link href="/contact" className="hover:text-surface-tint transition-colors focus-ring rounded">
              Atelier Locations
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Main Brand Bar with Prominent Central Search & Actions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4 sm:gap-8">
          {/* Mobile menu trigger */}
          <div className="flex items-center lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open boutique navigation drawer"
              className="p-2 -ml-2 rounded-xl text-text-main hover:text-primary hover:bg-surface-soft transition-colors focus-ring"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
          </div>

          {/* Luxury Brand Logo */}
          <div className="shrink-0 text-center lg:text-left">
            <Link
              href="/"
              className="inline-block group focus-ring rounded-lg px-1 py-0.5"
              aria-label="VANYA Haute Couture - Return to storefront"
            >
              <span className="block font-serif text-2xl sm:text-3xl font-bold tracking-[0.2em] text-primary uppercase group-hover:text-accent transition-colors">
                VANYA
              </span>
              <span className="block text-[8.5px] font-sans tracking-[0.32em] text-accent uppercase font-bold -mt-1 group-hover:text-primary transition-colors">
                Haute Couture
              </span>
            </Link>
          </div>

          {/* Central Prominent Search Bar (HomeClick style - desktop) */}
          <div className="hidden lg:flex flex-1 max-w-xl mx-auto">
            <form action={searchProductsAction} className="w-full relative flex items-center">
              <label htmlFor="desktop-store-search" className="sr-only">
                Search Handloom Sarees, Lehengas, and Dresses
              </label>
              <input
                id="desktop-store-search"
                name="q"
                type="search"
                placeholder="Search Banarasi sarees, bridal lehengas, silk dresses..."
                className="w-full pl-11 pr-24 py-2.5 rounded-full border border-border bg-surface-card text-text-main placeholder-text-subtle text-xs focus-ring shadow-xs transition-colors"
              />
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-subtle pointer-events-none">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </div>
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 px-4 py-1.5 rounded-full bg-primary hover:bg-primary-hover text-primary-contrast text-[11px] uppercase tracking-wider font-semibold transition-colors focus-ring"
              >
                Search
              </button>
            </form>
          </div>

          {/* Right Action Utilities (Mobile search trigger, Account dropdown, Wishlist, Cart) */}
          <div className="flex items-center space-x-2 sm:space-x-4 shrink-0">
            {/* Mobile Search Toggle */}
            <button
              type="button"
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              aria-label="Toggle mobile search input"
              className="lg:hidden p-2 rounded-full text-text-main hover:text-accent hover:bg-surface-soft transition-colors focus-ring"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </button>

            {/* Account Trigger & GSAP Dropdown */}
            <div className="relative" ref={dropdownRef}>
              {currentUser ? (
                /* LOGGED IN TRIGGER */
                <button
                  type="button"
                  onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
                  aria-expanded={accountDropdownOpen}
                  aria-haspopup="true"
                  className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-1.5 rounded-full border border-primary/25 bg-surface-soft/80 hover:bg-surface-soft hover:border-primary transition-all focus-ring shadow-xs"
                >
                  <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary text-primary-contrast text-xs font-bold flex items-center justify-center shrink-0 ring-2 ring-accent/30 shadow-xs">
                    {userInitials}
                  </span>
                  <div className="hidden sm:block text-left pr-1">
                    <span className="text-[10px] text-text-subtle font-medium uppercase tracking-wider block leading-tight">
                      Hello, {userFirstName}
                    </span>
                    <span className="text-xs font-serif font-bold text-primary flex items-center gap-1 leading-tight">
                      My Account
                      <svg
                        className={`w-3.5 h-3.5 text-text-subtle transition-transform duration-200 ${accountDropdownOpen ? "rotate-180" : ""}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </div>
                </button>
              ) : (
                /* LOGGED OUT TRIGGER */
                <button
                  type="button"
                  onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
                  aria-expanded={accountDropdownOpen}
                  aria-haspopup="true"
                  className="flex items-center gap-2.5 p-1.5 sm:px-3.5 sm:py-2 rounded-full border border-border bg-surface-card hover:border-accent hover:bg-surface-soft transition-all focus-ring shadow-xs"
                >
                  <span className="w-7 h-7 sm:w-7 sm:h-7 rounded-full bg-surface-soft border border-border text-text-secondary flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                  </span>
                  <div className="hidden sm:block text-left pr-1">
                    <span className="text-[10px] text-text-subtle font-medium uppercase tracking-wider block leading-tight">
                      Sign In / Join
                    </span>
                    <span className="text-xs font-serif font-bold text-primary flex items-center gap-1 leading-tight">
                      My Account
                      <svg
                        className={`w-3.5 h-3.5 text-text-subtle transition-transform duration-200 ${accountDropdownOpen ? "rotate-180" : ""}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </div>
                </button>
              )}

              {/* GSAP DROPDOWN MENU */}
              {accountDropdownOpen && (
                <div
                  className="absolute right-0 mt-2.5 w-72 rounded-2xl bg-surface-card border border-border shadow-xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150"
                  role="menu"
                  aria-orientation="vertical"
                >
                  {currentUser ? (
                    /* LOGGED IN DROPDOWN CONTENT */
                    <div>
                      {/* Customer Card Header */}
                      <div className="pb-3 mb-3 border-b border-border flex items-center gap-3">
                        <span className="w-10 h-10 rounded-full bg-primary text-primary-contrast font-bold text-sm flex items-center justify-center shrink-0 shadow-xs">
                          {userInitials}
                        </span>
                        <div className="overflow-hidden">
                          <div className="flex items-center gap-1.5">
                            <span className="font-serif font-bold text-sm text-primary truncate block">
                              {currentUser.name}
                            </span>
                          </div>
                          <span className="text-xs text-text-subtle truncate block">
                            {currentUser.email}
                          </span>
                          <span className="inline-block mt-0.5 px-2 py-0.2 rounded-full text-[9px] uppercase font-bold tracking-wider bg-surface-tint/40 text-primary border border-border">
                            {currentUser.role || "Maison Member"}
                          </span>
                        </div>
                      </div>

                      {/* Quick Links */}
                      <ul className="space-y-1 text-xs">
                        <li>
                          <Link
                            href="/account"
                            onClick={() => setAccountDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-text-secondary hover:text-primary hover:bg-surface-soft transition-colors focus-ring font-medium"
                          >
                            <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6z" />
                            </svg>
                            <span>Dashboard Overview</span>
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/account/orders"
                            onClick={() => setAccountDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-text-secondary hover:text-primary hover:bg-surface-soft transition-colors focus-ring font-medium"
                          >
                            <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25" />
                            </svg>
                            <span>Orders & Tracking</span>
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/account/addresses"
                            onClick={() => setAccountDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-text-secondary hover:text-primary hover:bg-surface-soft transition-colors focus-ring font-medium"
                          >
                            <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                            </svg>
                            <span>Saved Addresses</span>
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/account/wishlist"
                            onClick={() => setAccountDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-text-secondary hover:text-primary hover:bg-surface-soft transition-colors focus-ring font-medium"
                          >
                            <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                            </svg>
                            <span>My Wishlist</span>
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/account/password"
                            onClick={() => setAccountDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-text-secondary hover:text-primary hover:bg-surface-soft transition-colors focus-ring font-medium"
                          >
                            <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                            </svg>
                            <span>Security & Password</span>
                          </Link>
                        </li>
                      </ul>

                      {/* Sign Out Button */}
                      <div className="mt-3 pt-3 border-t border-border">
                        <button
                          type="button"
                          onClick={handleSignOut}
                          disabled={isLoggingOut}
                          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs uppercase tracking-wider font-semibold text-text-subtle hover:text-error hover:bg-error-bg/60 transition-colors focus-ring disabled:opacity-50"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                          </svg>
                          <span>{isLoggingOut ? "Signing Out..." : "Sign Out"}</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* LOGGED OUT DROPDOWN CONTENT (HomeClick inspired) */
                    <div>
                      <div className="text-center pb-3 mb-3 border-b border-border">
                        <h4 className="font-serif font-bold text-sm text-primary mb-1">
                          Welcome to VANYA
                        </h4>
                        <p className="text-[11px] text-text-secondary leading-relaxed">
                          Sign in to access your bespoke orders, track shipments, and view saved heirlooms.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Link
                          href="/login"
                          onClick={() => setAccountDropdownOpen(false)}
                          className="block w-full py-2.5 px-4 rounded-xl bg-primary hover:bg-primary-hover text-primary-contrast text-xs uppercase tracking-wider font-semibold text-center transition-colors shadow-xs focus-ring"
                        >
                          Sign In
                        </Link>
                        <Link
                          href="/register"
                          onClick={() => setAccountDropdownOpen(false)}
                          className="block w-full py-2.5 px-4 rounded-xl border border-border hover:border-accent bg-surface-card hover:bg-surface-soft text-text-main text-xs uppercase tracking-wider font-semibold text-center transition-colors focus-ring"
                        >
                          Create Account
                        </Link>
                      </div>

                      <div className="mt-3 pt-3 border-t border-border space-y-1 text-xs">
                        <Link
                          href="/orders/track"
                          onClick={() => setAccountDropdownOpen(false)}
                          className="flex items-center justify-between py-1.5 px-2 rounded-lg text-text-secondary hover:text-primary hover:bg-surface-soft transition-colors"
                        >
                          <span>Track An Order</span>
                          <span className="text-text-subtle">&rarr;</span>
                        </Link>
                        <Link
                          href="/contact"
                          onClick={() => setAccountDropdownOpen(false)}
                          className="flex items-center justify-between py-1.5 px-2 rounded-lg text-text-secondary hover:text-primary hover:bg-surface-soft transition-colors"
                        >
                          <span>Boutique Concierge</span>
                          <span className="text-text-subtle">&rarr;</span>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Wishlist Icon Button */}
            <Link
              href={currentUser ? "/account/wishlist" : "/login"}
              aria-label="View saved wishlist heirlooms"
              className="p-2 sm:p-2.5 rounded-full text-text-main hover:text-accent hover:bg-surface-soft transition-colors focus-ring relative"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
            </Link>

            {/* Shopping Bag Icon Button */}
            <Link
              href="/cart"
              aria-label="View shopping bag"
              className="flex items-center gap-1.5 p-2 sm:px-3 sm:py-2 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-contrast transition-all focus-ring relative"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
              </svg>
              <span className="hidden sm:inline text-xs font-semibold uppercase tracking-wider">
                Bag
              </span>
            </Link>
          </div>
        </div>

        {/* Mobile Search Drawer */}
        {mobileSearchOpen && (
          <div className="lg:hidden py-3 pb-4 border-t border-border">
            <form action={searchProductsAction} className="relative flex items-center">
              <label htmlFor="mobile-store-search" className="sr-only">
                Search Collections
              </label>
              <input
                id="mobile-store-search"
                name="q"
                type="search"
                placeholder="Search Banarasi sarees, bridal lehengas, silk dresses..."
                autoFocus
                className="w-full pl-10 pr-20 py-2.5 rounded-full border border-border bg-surface-card text-text-main placeholder-text-subtle text-xs focus-ring shadow-xs"
              />
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-subtle pointer-events-none">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </div>
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1 rounded-full bg-primary text-primary-contrast text-[11px] uppercase tracking-wider font-semibold"
              >
                Go
              </button>
            </form>
          </div>
        )}
      </div>

      {/* 3. Category Navigation Bar (Desktop horizontal bar with smooth hover) */}
      <div className="hidden lg:block border-t border-border/70 bg-surface-soft/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav aria-label="Haute Couture Categories" className="flex items-center justify-center space-x-9 py-2.5">
            {NAVIGATION_CATEGORIES.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`relative text-xs uppercase tracking-[0.16em] font-medium transition-colors hover:text-primary py-1 group focus-ring rounded ${
                  item.isHighlight ? "text-accent font-semibold" : "text-text-main"
                }`}
              >
                <span>{item.label}</span>
                {/* Subtle Hover Underline */}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* 4. Mobile Navigation Slide-over Drawer (GSAP animated) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-text-main/50 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <div
            ref={mobileDrawerRef}
            className="fixed inset-y-0 left-0 w-full max-w-xs bg-surface-card border-r border-border shadow-2xl p-6 flex flex-col justify-between overflow-y-auto"
          >
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-border">
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-serif text-xl font-bold tracking-[0.2em] text-primary uppercase"
                >
                  VANYA
                </Link>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close navigation drawer"
                  className="p-1.5 rounded-lg text-text-subtle hover:text-text-main hover:bg-surface-soft transition-colors focus-ring"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Customer Greeting in Mobile Drawer */}
              <div className="p-3.5 mb-5 rounded-xl bg-surface-soft border border-border">
                {currentUser ? (
                  <div className="flex items-center gap-3">
                    <span className="w-9 h-9 rounded-full bg-primary text-primary-contrast font-bold text-xs flex items-center justify-center shrink-0">
                      {userInitials}
                    </span>
                    <div>
                      <span className="text-xs font-serif font-bold text-primary block">
                        {currentUser.name}
                      </span>
                      <Link
                        href="/account"
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-[11px] text-accent hover:underline block"
                      >
                        Manage Account &rarr;
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div>
                    <span className="text-xs font-serif font-bold text-primary block mb-2">
                      Sign in to your Boutique Account
                    </span>
                    <div className="flex items-center gap-2">
                      <Link
                        href="/login"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex-1 text-center py-1.5 rounded-lg bg-primary text-primary-contrast text-[11px] uppercase font-semibold tracking-wider"
                      >
                        Sign In
                      </Link>
                      <Link
                        href="/register"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex-1 text-center py-1.5 rounded-lg border border-border text-text-main text-[11px] uppercase font-semibold tracking-wider hover:bg-surface-card"
                      >
                        Join
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation Category Links */}
              <nav aria-label="Mobile categories" className="space-y-1">
                <span className="text-[10px] uppercase tracking-widest text-text-subtle font-bold px-3 block mb-2">
                  Collections
                </span>
                {NAVIGATION_CATEGORIES.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs uppercase tracking-wider font-semibold text-text-main hover:text-primary hover:bg-surface-soft transition-colors"
                  >
                    <span>{item.label}</span>
                    <span className="text-text-subtle">&rarr;</span>
                  </Link>
                ))}
              </nav>
            </div>

            {/* Drawer Footer Links */}
            <div className="pt-6 border-t border-border space-y-2 text-xs">
              <Link
                href="/orders/track"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-text-secondary hover:text-primary font-medium"
              >
                Track Your Shipment
              </Link>
              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-text-secondary hover:text-primary font-medium"
              >
                Boutique Concierge & Styling
              </Link>
              {currentUser && (
                <button
                  type="button"
                  onClick={handleSignOut}
                  disabled={isLoggingOut}
                  className="w-full text-left text-error hover:underline pt-2 font-semibold"
                >
                  {isLoggingOut ? "Signing Out..." : "Sign Out of Account"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
