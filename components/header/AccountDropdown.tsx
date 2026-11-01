"use client";

import React from "react";
import Link from "next/link";
import { USER_ROLES } from "@/lib/auth/types";
import { AccountDropdownProps } from "./types";

/**
 * Returns initials from customer name.
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
 * Animated user dropdown menu providing quick access to profile,
 * orders, wishlist, or guest authentication links.
 */
export const AccountDropdown: React.FC<AccountDropdownProps> = ({
  currentUser,
  isOpen,
  onClose,
  isLoggingOut,
  onLogout,
}) => {
  if (!isOpen) return null;

  const isAdmin =
    currentUser?.role === USER_ROLES.STORE_ADMIN ||
    currentUser?.role === USER_ROLES.SUPER_ADMIN;

  return (
    <div
      role="menu"
      aria-label="User Account Menu"
      className="absolute right-0 top-full mt-2 w-64 bg-surface-card rounded-xl border border-border shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
    >
      {currentUser ? (
        <>
          {/* User Profile Header */}
          <div className="px-4 py-3 border-b border-border/80 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-xs shrink-0">
              {getInitials(currentUser.name)}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-text-main truncate">
                {currentUser.name || "Valued Customer"}
              </p>
              <p className="text-xs text-text-subtle truncate">{currentUser.email}</p>
            </div>
          </div>

          {/* Account Navigation Links */}
          <div className="py-1">
            <Link
              href="/account"
              onClick={onClose}
              className="flex items-center gap-2.5 px-4 py-2 text-xs sm:text-sm font-semibold text-text-main hover:text-primary hover:bg-surface-soft transition-colors"
              role="menuitem"
            >
              <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
              </svg>
              Account Center
            </Link>
            <Link
              href="/account/profile"
              onClick={onClose}
              className="flex items-center gap-2.5 px-4 py-2 text-xs sm:text-sm text-text-secondary hover:text-primary hover:bg-surface-soft transition-colors"
              role="menuitem"
            >
              <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
              My Profile
            </Link>

            <Link
              href="/account/orders"
              onClick={onClose}
              className="flex items-center gap-2.5 px-4 py-2 text-xs sm:text-sm text-text-secondary hover:text-primary hover:bg-surface-soft transition-colors"
              role="menuitem"
            >
              <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
              </svg>
              Orders & Exchanges
            </Link>

            <Link
              href="/account/wishlist"
              onClick={onClose}
              className="flex items-center gap-2.5 px-4 py-2 text-xs sm:text-sm text-text-secondary hover:text-primary hover:bg-surface-soft transition-colors"
              role="menuitem"
            >
              <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
              Saved Wishlist
            </Link>

            {isAdmin && (
              <Link
                href="/admin"
                onClick={onClose}
                className="flex items-center gap-2.5 px-4 py-2 text-xs sm:text-sm text-primary font-semibold hover:bg-surface-soft transition-colors border-t border-border/50"
                role="menuitem"
              >
                <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
                </svg>
                Admin Control Room
              </Link>
            )}
          </div>

          {/* Logout Action */}
          <div className="pt-1 border-t border-border/80">
            <button
              type="button"
              onClick={onLogout}
              disabled={isLoggingOut}
              className="w-full text-left flex items-center gap-2.5 px-4 py-2.5 text-xs sm:text-sm text-error hover:bg-error-bg/60 transition-colors disabled:opacity-50"
              role="menuitem"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
              </svg>
              {isLoggingOut ? "Signing Out..." : "Sign Out"}
            </button>
          </div>
        </>
      ) : (
        /* Guest State */
        <div className="p-3">
          <p className="text-xs text-text-subtle mb-3 px-1">
            Sign in to track orders, manage addresses, and save favorites.
          </p>
          <div className="flex flex-col gap-2">
            <Link
              href="/login"
              onClick={onClose}
              className="w-full py-2 px-3 rounded-lg bg-primary hover:bg-primary-hover text-primary-contrast text-center text-xs font-semibold tracking-wide transition-colors"
              role="menuitem"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              onClick={onClose}
              className="w-full py-2 px-3 rounded-lg border border-border hover:border-primary text-text-main text-center text-xs font-semibold transition-colors"
              role="menuitem"
            >
              Create Account
            </Link>
          </div>
          <div className="mt-2.5 pt-2 border-t border-border/70">
            <Link
              href="/track-order"
              onClick={onClose}
              className="block px-1 py-1 text-[11px] text-text-subtle hover:text-accent transition-colors"
            >
              Track an existing order →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
