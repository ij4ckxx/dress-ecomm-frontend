"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SafeUser } from "@/lib/auth/types";
import { PRIMARY_CATEGORIES, NAV_HIGHLIGHTS } from "./constants";

export interface MobileHeaderNavProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser?: SafeUser | null;
}

/**
 * Mobile responsive navigation drawer providing access to all primary
 * categories, promotional highlights, and support.
 */
export const MobileHeaderNav: React.FC<MobileHeaderNavProps> = ({
  isOpen,
  onClose,
  currentUser = null,
}) => {
  const pathname = usePathname();

  // Close drawer on path change
  useEffect(() => {
    onClose();
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

  return (
    <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-text-main/40 backdrop-blur-xs transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-surface-card shadow-2xl flex flex-col z-50 animate-in slide-in-from-left duration-250">
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-border/80">
          <span className="font-serif text-lg font-bold text-primary tracking-wide">
            Menu
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
          {/* 1. Primary Categories */}
          <div className="pb-4">
            <p className="text-[11px] font-semibold text-text-subtle uppercase tracking-wider mb-2">
              Categories
            </p>
            <div className="flex flex-col gap-1">
              {PRIMARY_CATEGORIES.map((category) => (
                <Link
                  key={category.label}
                  href={category.href}
                  className="py-2 text-sm font-medium text-text-main hover:text-primary transition-colors"
                >
                  {category.label}
                </Link>
              ))}
            </div>
          </div>

          {/* 2. Highlights & Promotions */}
          <div className="py-4">
            <p className="text-[11px] font-semibold text-text-subtle uppercase tracking-wider mb-2">
              Featured
            </p>
            <div className="flex flex-col gap-1">
              {NAV_HIGHLIGHTS.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
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

          {/* 3. Account / Support Links */}
          <div className="pt-4 flex flex-col gap-2">
            <Link
              href="/contact"
              className="py-2 text-sm text-text-secondary hover:text-primary flex items-center gap-2"
            >
              <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
              </svg>
              Customer Support
            </Link>

            {currentUser ? (
              <Link
                href="/account/profile"
                className="py-2 text-sm text-text-secondary hover:text-primary flex items-center gap-2"
              >
                <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
                My Account ({currentUser.name?.split(" ")[0]})
              </Link>
            ) : (
              <Link
                href="/login"
                className="mt-2 w-full py-2.5 px-4 rounded-lg bg-primary text-primary-contrast text-center text-xs font-semibold tracking-wide hover:bg-primary-hover transition-colors"
              >
                Sign In / Register
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

