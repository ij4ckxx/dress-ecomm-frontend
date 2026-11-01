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
 * Features signature breadcrumb, personalized greeting, and the 4 primary hub cards
 * (Orders, Account Details, Addresses, Favorites and Lists) with Saayal Stories 3D animations.
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
        { opacity: 0, y: -12 },
        { opacity: 1, y: 0, duration: 0.55, ease: "power2.out" }
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
            <li className="text-primary font-medium" aria-current="page">
              Account Center
            </li>
          </ol>
        </nav>

        {/* Primary Welcome Title */}
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-primary tracking-tight">
          Welcome, {user.name || "Member"}!
        </h1>
      </div>

      {/* 2. Core 4 Hub Cards matching the reference layout */}
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
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.6}
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
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.6}
                  d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm-3 6.375c0-1.657 1.343-2.625 3-2.625s3 .968 3 2.625v.375h-6v-.375z"
                />
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
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.6}
                  d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.6}
                  d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                />
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
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.6}
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
