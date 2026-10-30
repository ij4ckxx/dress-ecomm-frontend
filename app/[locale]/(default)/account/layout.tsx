import React from "react";
import { requireAuth } from "@/lib/auth";
import { AccountNav } from "@/components/account/AccountNav";
import { GsapFadeIn } from "@/components/shared/GsapFadeIn";

interface AccountLayoutProps {
  children: React.ReactNode;
}

/**
 * Shared account shell layout wrapping all customer dashboard sections
 * with HomeClick-inspired sidebar navigation, role indicator, and GSAP reveals.
 */
export default async function AccountLayout({ children }: AccountLayoutProps) {
  const user = await requireAuth();

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* 1. Account Greeting & Header */}
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
            Welcome, {user.name}
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Manage your personal couture profile, addresses, orders, and saved wishlist.
          </p>
        </div>
      </header>

      {/* 2. Main Layout Grid: Sidebar Navigation + Main Section Content */}
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
}

