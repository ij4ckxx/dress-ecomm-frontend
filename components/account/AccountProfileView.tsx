"use client";

import React, { useTransition } from "react";
import Link from "next/link";
import { SafeUser } from "@/lib/auth/types";
import { logoutAction } from "@/app/actions/auth.actions";

export interface AccountProfileViewProps {
  user: SafeUser;
}

/**
 * Luxury account dashboard and profile overview component inspired by high-end storefronts.
 */
export const AccountProfileView: React.FC<AccountProfileViewProps> = ({ user }) => {
  const [isLoggingOut, startLogout] = useTransition();

  const handleSignOut = () => {
    startLogout(async () => {
      await logoutAction();
    });
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header Banner */}
      <header className="mb-10 pb-6 border-b border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-accent">
            My Account
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-primary mt-1">
            Welcome back, {user.name}
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Manage your personal profile, addresses, preferences, and order history.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSignOut}
          disabled={isLoggingOut}
          aria-label="Sign out of your account"
          className="self-start sm:self-auto px-5 py-2.5 rounded-xl border border-border bg-surface-card hover:bg-surface-soft text-sm font-medium text-text-main transition-all focus-ring disabled:opacity-50"
        >
          {isLoggingOut ? "Signing out..." : "Sign Out"}
        </button>
      </header>

      {/* Main Grid: Sidebar Navigation + Profile Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Navigation Sidebar */}
        <nav aria-label="Account navigation" className="lg:col-span-1">
          <ul className="space-y-1">
            <li>
              <Link
                href="/account/profile"
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary text-primary-contrast font-medium text-sm transition-colors"
                aria-current="page"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>Profile Details</span>
              </Link>
            </li>
            <li>
              <Link
                href="/account/orders"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-text-secondary hover:text-primary hover:bg-surface-soft font-medium text-sm transition-colors focus-ring"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span>Orders</span>
              </Link>
            </li>
            <li>
              <Link
                href="/account/wishlist"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-text-secondary hover:text-primary hover:bg-surface-soft font-medium text-sm transition-colors focus-ring"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span>Wishlist</span>
              </Link>
            </li>
            <li>
              <Link
                href="/account/addresses"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-text-secondary hover:text-primary hover:bg-surface-soft font-medium text-sm transition-colors focus-ring"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Addresses</span>
              </Link>
            </li>
          </ul>
        </nav>

        {/* Content Pane */}
        <section aria-labelledby="profile-summary-heading" className="lg:col-span-3 space-y-6">
          {/* User Overview Card */}
          <div className="bg-surface-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
            <h2 id="profile-summary-heading" className="text-xl font-serif font-bold text-primary mb-6">
              Personal Information
            </h2>

            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <dt className="text-xs uppercase font-semibold text-text-subtle">Full Name</dt>
                <dd className="mt-1 text-base font-medium text-text-main">{user.name}</dd>
              </div>

              <div>
                <dt className="text-xs uppercase font-semibold text-text-subtle">Email Address</dt>
                <dd className="mt-1 text-base font-medium text-text-main">{user.email}</dd>
              </div>

              <div>
                <dt className="text-xs uppercase font-semibold text-text-subtle">Phone Number</dt>
                <dd className="mt-1 text-base font-medium text-text-main">
                  {user.phone || "Not specified"}
                </dd>
              </div>

              <div>
                <dt className="text-xs uppercase font-semibold text-text-subtle">Account Role</dt>
                <dd className="mt-1">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-surface-tint text-primary">
                    {user.role}
                  </span>
                </dd>
              </div>
            </dl>
          </div>

          {/* Quick Action Tiles */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              href="/account/orders"
              className="p-5 rounded-2xl bg-surface-card border border-border hover:border-accent transition-all shadow-sm group focus-ring"
            >
              <h3 className="text-base font-serif font-bold text-primary group-hover:text-accent transition-colors">
                Recent Orders &rarr;
              </h3>
              <p className="mt-1 text-xs text-text-secondary">
                Track current shipments and view previous purchases.
              </p>
            </Link>

            <Link
              href="/account/addresses"
              className="p-5 rounded-2xl bg-surface-card border border-border hover:border-accent transition-all shadow-sm group focus-ring"
            >
              <h3 className="text-base font-serif font-bold text-primary group-hover:text-accent transition-colors">
                Shipping Addresses &rarr;
              </h3>
              <p className="mt-1 text-xs text-text-secondary">
                Manage your primary delivery locations.
              </p>
            </Link>

            <Link
              href="/account/wishlist"
              className="p-5 rounded-2xl bg-surface-card border border-border hover:border-accent transition-all shadow-sm group focus-ring"
            >
              <h3 className="text-base font-serif font-bold text-primary group-hover:text-accent transition-colors">
                Saved Wishlist &rarr;
              </h3>
              <p className="mt-1 text-xs text-text-secondary">
                Keep track of items you plan to purchase later.
              </p>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AccountProfileView;
