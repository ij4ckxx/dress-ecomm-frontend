"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AccountNav } from "@/components/account/AccountNav";
import { GsapFadeIn } from "@/components/shared/GsapFadeIn";

export interface AccountShellProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  children: React.ReactNode;
}

/**
 * Responsive shell for customer account sections.
 * Automatically switches between the full-width HomeClick-inspired Account Center hub
 * and the organized 2-column sidebar layout when navigating deep subpages (orders, profile, etc.).
 */
export const AccountShell: React.FC<AccountShellProps> = ({
  user,
  children,
}) => {
  const pathname = usePathname();

  // Root account hub path check (e.g. /account, /en/account, /fr/account)
  const isRootAccount = /^\/([a-z]{2}\/)?account\/?$/.test(pathname);

  // Subpage title resolver for breadcrumb and header
  const getSubpageMeta = () => {
    if (pathname.includes("/orders")) {
      return {
        title: "Orders & Shipments",
        description: "Track, return, cancel, or replace your couture orders.",
      };
    }
    if (pathname.includes("/profile")) {
      return {
        title: "Account Details",
        description: "Manage your username, contact email, and telephone.",
      };
    }
    if (pathname.includes("/addresses")) {
      return {
        title: "Addresses",
        description: "Add, edit, or configure your primary delivery address.",
      };
    }
    if (pathname.includes("/wishlist")) {
      return {
        title: "Favorites and Lists",
        description: "Your curated wishlist of handcrafted garments and sarees.",
      };
    }
    if (pathname.includes("/password")) {
      return {
        title: "Security & Credentials",
        description: "Update your password and manage login security.",
      };
    }
    return {
      title: "Account Settings",
      description: "Manage your Maison boutique account preferences.",
    };
  };

  // If on the root /account hub, render full-width without sidebar
  if (isRootAccount) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {children}
      </div>
    );
  }

  const { title, description } = getSubpageMeta();

  // On sub-pages, render breadcrumbs, sub-header, and 2-column sidebar navigation
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Subpage Breadcrumb with link back to Account Center */}
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex items-center space-x-2 text-xs sm:text-sm text-text-muted">
          <li>
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
          </li>
          <li>
            <span className="text-border mx-1">/</span>
          </li>
          <li>
            <Link
              href="/account"
              className="hover:text-primary transition-colors"
            >
              Account Center
            </Link>
          </li>
          <li>
            <span className="text-border mx-1">/</span>
          </li>
          <li className="text-primary font-medium">{title}</li>
        </ol>
      </nav>

      {/* Subpage Header */}
      <header className="mb-8 pb-6 border-b border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-xs uppercase tracking-[0.2em] font-semibold text-accent">
              Maison Member
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider bg-surface-tint/40 text-primary border border-border">
              {user.role}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-primary mt-1">
            {title}
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            {description}
          </p>
        </div>
      </header>

      {/* 2-Column Sidebar Layout for Subpages */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1">
          <AccountNav />
        </aside>

        <section className="lg:col-span-3">
          <GsapFadeIn y={12} duration={0.5}>
            {children}
          </GsapFadeIn>
        </section>
      </div>
    </div>
  );
};

export default AccountShell;

