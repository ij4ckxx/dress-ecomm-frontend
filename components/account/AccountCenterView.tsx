"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { AccountHubGrid } from "./AccountHubGrid";
import { AccountHubCard } from "./AccountHubCard";

export interface AccountCenterViewProps {
  user: {
    name?: string | null;
    email?: string | null;
  };
}

/**
 * Account Center Hub Page matching HomeClick reference layout.
 * Features signature breadcrumb, personalized greeting, and the 4 primary hub cards:
 * 1. Orders
 * 2. Account Details
 * 3. Addresses
 * 4. Favorites and Lists
 * with smooth GSAP 3D interactive animations and Saayal Stories elegance.
 */
export const AccountCenterView: React.FC<AccountCenterViewProps> = ({ user }) => {
  const headerRef = useRef<HTMLDivElement>(null);

  // GSAP subtle entrance animation for breadcrumbs and title
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const header = headerRef.current;
    if (!header) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        header,
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
      );
    }, header);

    return () => ctx.revert();
  }, []);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* 1. Breadcrumbs & Personalized Greeting */}
      <div ref={headerRef} className="space-y-2">
        {/* Breadcrumb Navigation matching HomeClick */}
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-xs sm:text-sm text-text-muted">
            <li>
              <Link
                href="/"
                className="hover:text-primary transition-colors focus:outline-none focus:underline"
              >
                Home
              </Link>
            </li>
            <li>
              <span className="text-border mx-1">/</span>
            </li>
            <li className="text-slate-800 font-medium" aria-current="page">
              Account Center
            </li>
          </ol>
        </nav>

        {/* Primary Welcome Title matching HomeClick */}
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-slate-800 tracking-tight">
          Welcome, {user.name || "Valued Member"}!
        </h1>
      </div>

      {/* 2. Core 4 Hub Cards in 3-column grid matching the reference layout */}
      <section aria-label="Account Shortcuts">
        <AccountHubGrid>
          {/* Card 1: Orders */}
          <AccountHubCard
            href="/account/orders"
            title="Orders"
            description="Track, return, cancel, or replace items."
            theme="teal"
            icon={
              <svg
                className="w-7 h-7 sm:w-8 sm:h-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.75}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"
                />
              </svg>
            }
          />

          {/* Card 2: Account Details */}
          <AccountHubCard
            href="/account/profile"
            title="Account Details"
            description="Username, password, and contact information."
            theme="amber"
            icon={
              <svg
                className="w-7 h-7 sm:w-8 sm:h-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.75}
                aria-hidden="true"
              >
                <rect x="9" y="2" width="6" height="3" rx="1" />
                <rect x="4" y="5" width="16" height="16" rx="2" />
                <circle cx="9" cy="11" r="2" />
                <path d="M6 17c0-1.657 1.343-3 3-3s3 1.343 3 3" />
                <path strokeLinecap="round" d="M14 10h4M14 13h4M14 16h3" />
              </svg>
            }
          />

          {/* Card 3: Addresses */}
          <AccountHubCard
            href="/account/addresses"
            title="Addresses"
            description="Add and edit addresses, set your default address."
            theme="rose"
            icon={
              <svg
                className="w-7 h-7 sm:w-8 sm:h-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.75}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 21s7-4.35 7-10a7 7 0 10-14 0c0 5.65 7 10 7 10z"
                />
                <circle cx="12" cy="11" r="2.5" />
              </svg>
            }
          />

          {/* Card 4: Favorites and Lists */}
          <AccountHubCard
            href="/account/wishlist"
            title="Favorites and Lists"
            description="Your saved products and collections of products."
            theme="plum"
            icon={
              <svg
                className="w-7 h-7 sm:w-8 sm:h-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.75}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                />
              </svg>
            }
          />
        </AccountHubGrid>
      </section>
    </div>
  );
};

export default AccountCenterView;
