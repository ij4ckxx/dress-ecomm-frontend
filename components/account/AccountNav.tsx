"use client";

import React, { useTransition } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/app/actions/auth.actions";

interface NavItem {
  label: string;
  href: string;
  icon: (active: boolean) => React.ReactNode;
}

/**
 * Account navigation links.
 */
const ACCOUNT_NAV_ITEMS: NavItem[] = [
  {
    label: "Overview",
    href: "/account",
    icon: (active) => (
      <svg className={`w-5 h-5 ${active ? "text-primary" : "text-text-subtle"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
      </svg>
    ),
  },
  {
    label: "Orders",
    href: "/account/orders",
    icon: (active) => (
      <svg className={`w-5 h-5 ${active ? "text-primary" : "text-text-subtle"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
      </svg>
    ),
  },
  {
    label: "Account Details",
    href: "/account/profile",
    icon: (active) => (
      <svg className={`w-5 h-5 ${active ? "text-primary" : "text-text-subtle"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
  },
  {
    label: "Addresses",
    href: "/account/addresses",
    icon: (active) => (
      <svg className={`w-5 h-5 ${active ? "text-primary" : "text-text-subtle"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
      </svg>
    ),
  },
  {
    label: "Wishlist",
    href: "/account/wishlist",
    icon: (active) => (
      <svg className={`w-5 h-5 ${active ? "text-primary" : "text-text-subtle"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      </svg>
    ),
  },
];

/**
 * Customer account sidebar and responsive tab navigation inspired by HomeClick.
 */
export const AccountNav: React.FC = () => {
  const pathname = usePathname();
  const [isLoggingOut, startLogout] = useTransition();

  const handleSignOut = () => {
    startLogout(async () => {
      await logoutAction();
    });
  };

  return (
    <nav aria-label="Customer account navigation" className="w-full">
      {/* Desktop Sidebar List */}
      <div className="hidden lg:block bg-surface-card border border-border rounded-2xl p-3 shadow-sm">
        <ul className="space-y-1">
          {ACCOUNT_NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/account"
                ? pathname.endsWith("/account")
                : pathname.includes(item.href);

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs uppercase tracking-wider font-semibold transition-all focus-ring ${
                    isActive
                      ? "bg-surface-tint/30 text-primary border-l-3 border-primary"
                      : "text-text-secondary hover:text-primary hover:bg-surface-soft"
                  }`}
                >
                  {item.icon(isActive)}
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="mt-4 pt-3 border-t border-border">
          <button
            type="button"
            onClick={handleSignOut}
            disabled={isLoggingOut}
            aria-label="Sign out of your boutique account"
            className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs uppercase tracking-wider font-semibold text-text-subtle hover:text-error hover:bg-error-bg/60 transition-colors focus-ring disabled:opacity-50"
          >
            <svg className="w-5 h-5 text-current" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
            </svg>
            <span>{isLoggingOut ? "Signing Out..." : "Sign Out"}</span>
          </button>
        </div>
      </div>

      {/* Mobile Horizontal Pill Scrollbar */}
      <div className="lg:hidden flex items-center gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-none">
        {ACCOUNT_NAV_ITEMS.map((item) => {
          const isActive =
            item.href === "/account"
              ? pathname.endsWith("/account")
              : pathname.includes(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-semibold tracking-wide uppercase transition-all shrink-0 focus-ring ${
                isActive
                  ? "bg-primary text-primary-contrast shadow-sm"
                  : "bg-surface-card border border-border text-text-secondary hover:text-primary"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default AccountNav;
