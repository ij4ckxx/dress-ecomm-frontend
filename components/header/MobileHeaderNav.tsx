"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MobileHeaderNavProps } from "./types";
import { NAV_HIGHLIGHTS } from "./constants";

/**
 * Returns initials from customer name.
 */
const getInitials = (name?: string | null): string => {
  if (!name) return "SS";
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return parts[0].slice(0, 2).toUpperCase();
};

/**
 * Mobile responsive navigation drawer providing access to dynamic categories,
 * subcategory accordions, promotional highlights, account actions, and concierge support.
 *
 * @param {MobileHeaderNavProps} props
 * @returns {React.ReactElement | null}
 */
export const MobileHeaderNav: React.FC<MobileHeaderNavProps> = ({
  isOpen,
  onClose,
  currentUser = null,
  categories = [],
}) => {
  const pathname = usePathname();
  const prevPathnameRef = useRef(pathname);
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null);

  const displayCategories = categories || [];

  // Close drawer ONLY when navigation route changes, never on initial mount or re-render
  useEffect(() => {
    if (prevPathnameRef.current !== pathname) {
      prevPathnameRef.current = pathname;
      onClose();
    }
  }, [pathname, onClose]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const toggleCategory = (slug: string) => {
    setExpandedSlug((prev) => (prev === slug ? null : slug));
  };

  return (
    <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-surface-card shadow-2xl flex flex-col z-50 animate-in slide-in-from-left duration-250">
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-border/80">
          <span className="font-serif text-lg font-bold text-primary tracking-wide">
            Navigation
          </span>
          <button
            type="button"
            onClick={onClose}
            className="p-2 -mr-2 rounded-lg text-text-subtle hover:text-text-main hover:bg-surface-soft transition-colors"
            aria-label="Close menu"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4 divide-y divide-border/60">
          {/* 1. Dynamic Categories with Subcategory Expansion */}
          {displayCategories.length > 0 && (
            <div className="pb-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[11px] font-semibold text-text-subtle uppercase tracking-wider">
                  Collections
                </p>
                <Link
                  href="/collections"
                  onClick={onClose}
                  className="text-xs text-primary font-medium hover:underline"
                >
                  All →
                </Link>
              </div>

              <div className="flex flex-col gap-1">
                {displayCategories.map((category) => {
                  const hasChildren =
                    Array.isArray(category.children) && category.children.length > 0;
                  const isExpanded = expandedSlug === category.slug;

                  return (
                    <div key={category.id || category.slug} className="flex flex-col">
                      <div className="flex items-center justify-between py-1.5">
                        <Link
                          href={`/category/${category.slug}`}
                          onClick={onClose}
                          className="text-sm font-medium text-text-main hover:text-primary transition-colors flex items-center gap-2"
                        >
                          <span>{category.name}</span>
                          {category.isNew && (
                            <span className="text-[9px] uppercase px-1.5 py-0.2 rounded-xs font-semibold bg-primary/10 text-primary">
                              New
                            </span>
                          )}
                        </Link>

                        {hasChildren && (
                          <button
                            type="button"
                            onClick={() => toggleCategory(category.slug)}
                            className="p-1 text-text-subtle hover:text-primary"
                            aria-label={`Toggle ${category.name} subcategories`}
                          >
                            <svg
                              className={`w-4 h-4 transform transition-transform ${
                                isExpanded ? "rotate-180" : ""
                              }`}
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                        )}
                      </div>

                      {/* Subcategories Accordion */}
                      {hasChildren && isExpanded && (
                        <div className="pl-3 py-1 flex flex-col gap-1.5 border-l-2 border-primary/20 ml-2 mb-2">
                          {category.children!.map((sub) => (
                            <Link
                              key={sub.id || sub.slug}
                              href={`/category/${sub.slug}`}
                              onClick={onClose}
                              className="text-xs text-text-secondary hover:text-primary py-1"
                            >
                              {sub.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 2. Highlights & Promotions */}
          <div className="py-4">
            <p className="text-[11px] font-semibold text-text-subtle uppercase tracking-wider mb-2">
              Featured Highlights
            </p>
            <div className="flex flex-col gap-1">
              {NAV_HIGHLIGHTS.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={onClose}
                  className={`py-2 text-sm font-medium transition-colors ${
                    item.isSale
                      ? "text-accent font-semibold"
                      : "text-text-main hover:text-primary"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* 3. Account Actions */}
          <div className="pt-4">
            {currentUser ? (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3 pb-3 mb-1 border-b border-border/60">
                  {currentUser.avatarUrl ? (
                    <img
                      src={currentUser.avatarUrl}
                      alt={currentUser.name || "Customer Portrait"}
                      className="w-10 h-10 rounded-full object-cover border border-primary/20 shrink-0 shadow-2xs"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                      {getInitials(currentUser.name)}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-[11px] text-text-subtle uppercase tracking-wider">Signed in as</p>
                    <p className="font-semibold text-text-main text-sm truncate">
                      {currentUser.name || currentUser.email}
                    </p>
                  </div>
                </div>

                <Link
                  href="/account"
                  onClick={onClose}
                  className="py-1.5 text-sm font-semibold text-text-main hover:text-primary transition-colors"
                >
                  Account Center
                </Link>
                <Link
                  href="/account/profile"
                  onClick={onClose}
                  className="py-1 text-sm text-text-secondary hover:text-primary transition-colors"
                >
                  Account Details
                </Link>
                <Link
                  href="/account/orders"
                  onClick={onClose}
                  className="py-1 text-sm text-text-secondary hover:text-primary transition-colors"
                >
                  My Orders
                </Link>
                <Link
                  href="/account/addresses"
                  onClick={onClose}
                  className="py-1 text-sm text-text-secondary hover:text-primary transition-colors"
                >
                  Addresses
                </Link>
                <Link
                  href="/account/wishlist"
                  onClick={onClose}
                  className="py-1 text-sm text-text-secondary hover:text-primary transition-colors"
                >
                  Favorites and Lists
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-2 pt-1">
                <Link
                  href="/login"
                  onClick={onClose}
                  className="w-full text-center py-2.5 px-4 text-xs font-semibold uppercase tracking-wider bg-primary text-primary-contrast rounded-md hover:bg-primary-hover transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={onClose}
                  className="w-full text-center py-2.5 px-4 text-xs font-semibold uppercase tracking-wider border border-border text-text-main rounded-md hover:bg-surface-soft transition-colors"
                >
                  Create Account
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
