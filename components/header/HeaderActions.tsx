"use client";

import React, { useState, useRef, useEffect, useTransition } from "react";
import Link from "next/link";
import { SafeUser } from "@/lib/auth/types";
import { logoutAction } from "@/app/actions/auth.actions";
import { AccountDropdown } from "./AccountDropdown";

export interface HeaderActionsProps {
  currentUser?: SafeUser | null;
  cartCount?: number;
}

/**
 * Header right actions container rendering Support, Account, and Cart
 * matching modern two-tier storefront conventions.
 */
export const HeaderActions: React.FC<HeaderActionsProps> = ({
  currentUser = null,
  cartCount = 0,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLoggingOut, startLogout] = useTransition();
  const dropdownRef = useRef<HTMLDivElement>(null);

  /**
   * Close account dropdown when clicking outside.
   */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  /**
   * Dispatches logout action.
   */
  const handleLogout = () => {
    startLogout(async () => {
      await logoutAction();
      setDropdownOpen(false);
    });
  };

  return (
    <div className="flex items-center gap-3 sm:gap-5 shrink-0">
      {/* 1. Support / Concierge Link */}
      <Link
        href="/contact"
        className="hidden md:inline-flex items-center gap-1.5 text-xs sm:text-sm text-text-secondary hover:text-primary transition-colors group"
        title="Concierge & Customer Support"
      >
        <svg
          className="w-5 h-5 text-accent group-hover:scale-105 transition-transform"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.8}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
          />
        </svg>
        <span className="font-medium">Support</span>
      </Link>

      {/* 2. Account Button / Direct Login Link */}
      {currentUser ? (
        <div ref={dropdownRef} className="relative">
          <button
            type="button"
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-text-secondary hover:text-primary transition-colors p-1 rounded-md focus:outline-none focus:ring-1 focus:ring-accent/40"
            aria-expanded={dropdownOpen}
            aria-haspopup="true"
          >
            <svg
              className="w-5 h-5 text-text-main"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.8}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
              />
            </svg>
            <span className="font-medium hidden sm:inline truncate max-w-[100px]">
              {currentUser.name ? currentUser.name.split(" ")[0] : "Account"}
            </span>
            <svg
              className={`w-3 h-3 text-text-subtle transition-transform duration-150 ${
                dropdownOpen ? "rotate-180" : ""
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </button>

          <AccountDropdown
            currentUser={currentUser}
            isOpen={dropdownOpen}
            onClose={() => setDropdownOpen(false)}
            isLoggingOut={isLoggingOut}
            onLogout={handleLogout}
          />
        </div>
      ) : (
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-text-secondary hover:text-primary transition-colors p-1 rounded-md focus:outline-none focus:ring-1 focus:ring-accent/40"
          title="Sign In"
        >
          <svg
            className="w-5 h-5 text-text-main"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.8}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
            />
          </svg>
          <span className="font-medium hidden sm:inline">Sign In</span>
        </Link>
      )}

      {/* 3. Shopping Cart */}
      <Link
        href="/cart"
        className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-text-secondary hover:text-primary transition-colors p-1 group"
        aria-label={`Shopping Cart with ${cartCount} items`}
      >
        <div className="relative">
          <svg
            className="w-5 h-5 text-text-main group-hover:scale-105 transition-transform"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.8}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
            />
          </svg>
        </div>
        <span className="font-semibold text-text-main group-hover:text-primary">
          ({cartCount})
        </span>
      </Link>
    </div>
  );
};

