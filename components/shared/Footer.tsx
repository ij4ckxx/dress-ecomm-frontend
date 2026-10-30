import React from "react";
import Link from "next/link";
import { SafeUser } from "@/lib/auth/types";
import { NewsletterForm } from "./NewsletterForm";

export interface FooterProps {
  currentUser?: SafeUser | null;
}

/**
 * 4 Pillars of luxury couture shopping inspired by HomeClick.
 */
const TRUST_PILLARS = [
  {
    title: "Artisanal Handlooms",
    description: "Certified SilkMark weaves handcrafted by master artisans in Varanasi & Kanchipuram.",
    icon: (
      <svg className="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
      </svg>
    ),
  },
  {
    title: "Complimentary Delivery",
    description: "Insured, luxury gift-box packaging with zero courier fees on orders above ₹5,000.",
    icon: (
      <svg className="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.25V3.75a1.5 1.5 0 00-1.5-1.5h-9a1.5 1.5 0 00-1.5 1.5v10.5h12z" />
      </svg>
    ),
  },
  {
    title: "Bespoke Concierge",
    description: "Dedicated stylists offering virtual drape assistance and custom blouse tailoring.",
    icon: (
      <svg className="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" />
      </svg>
    ),
  },
  {
    title: "Encrypted Transactions",
    description: "256-bit bank-grade encryption supporting UPI, RuPay, NetBanking, and global credit cards.",
    icon: (
      <svg className="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
  },
];

/**
 * Shared luxury fashion footer inspired by HomeClick with trust pillars,
 * VIP club newsletter signup, rich brand storytelling, and customer concierge directory.
 */
export const Footer: React.FC<FooterProps> = ({ currentUser }) => {
  return (
    <footer className="w-full bg-surface-soft border-t border-border mt-auto">
      {/* 1. Trust & Value Pillars Bar (HomeClick inspired) */}
      <div className="border-b border-border bg-surface-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {TRUST_PILLARS.map((pillar) => (
              <div
                key={pillar.title}
                className="flex items-start gap-4 p-4 rounded-2xl bg-surface-soft/50 border border-border/80 hover:border-accent/60 transition-all group"
              >
                <div className="p-2.5 rounded-xl bg-surface-card border border-border shadow-xs group-hover:scale-105 transition-transform shrink-0">
                  {pillar.icon}
                </div>
                <div>
                  <h4 className="font-serif font-bold text-sm text-primary mb-1">
                    {pillar.title}
                  </h4>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. VIP Club Newsletter Banner (The Vanya Privé) */}
      <div className="border-b border-border bg-surface-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 text-center">
          <span className="text-[11px] uppercase tracking-[0.3em] text-accent font-bold block mb-2">
            The Vanya Privé
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-primary mb-3">
            Experience Private Salon Previews
          </h2>
          <p className="text-xs sm:text-sm text-text-secondary max-w-xl mx-auto mb-7 leading-relaxed">
            Receive exclusive invitations to preview seasonal bridal collections, master weaver trunk shows, and rare handloom releases before public unveiling.
          </p>

          <NewsletterForm />
        </div>
      </div>

      {/* 3. Multi-Column Navigation Directory */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Column 1: Maison & Ateliers */}
          <div>
            <Link href="/" className="inline-block group mb-3">
              <span className="font-serif text-2xl font-bold tracking-[0.2em] text-primary uppercase block group-hover:text-accent transition-colors">
                VANYA
              </span>
              <span className="text-[9px] font-sans tracking-[0.3em] text-text-subtle uppercase block -mt-1 font-semibold">
                Haute Couture
              </span>
            </Link>
            <p className="text-xs leading-relaxed text-text-secondary mb-4">
              Celebrating India&apos;s timeless textile heritage through handcrafted Banarasi weaves, bridal silks, and contemporary luxury silhouettes.
            </p>
            <div className="space-y-1.5 text-xs text-text-subtle">
              <p>
                <strong className="text-text-main font-semibold">Concierge:</strong> +91 98765 43210
              </p>
              <p>
                <strong className="text-text-main font-semibold">Inquiries:</strong> concierge@vanya-couture.com
              </p>
              <p>
                <strong className="text-text-main font-semibold">Salon Hours:</strong> Mon – Sat, 10 AM – 7:30 PM IST
              </p>
            </div>
          </div>

          {/* Column 2: Exclusive Collections */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-text-main mb-4 pb-1 border-b border-border/70">
              Haute Couture
            </h3>
            <ul className="space-y-2.5 text-xs text-text-secondary">
              <li>
                <Link href="/category/sarees" className="hover:text-primary transition-colors focus-ring rounded">
                  Heritage Banarasi Sarees
                </Link>
              </li>
              <li>
                <Link href="/category/lehengas" className="hover:text-primary transition-colors focus-ring rounded">
                  Bridal & Reception Lehengas
                </Link>
              </li>
              <li>
                <Link href="/category/kurtis" className="hover:text-primary transition-colors focus-ring rounded">
                  Chanderi & Silk Suits
                </Link>
              </li>
              <li>
                <Link href="/category/dresses" className="hover:text-primary transition-colors focus-ring rounded">
                  Designer Evening Gowns
                </Link>
              </li>
              <li>
                <Link href="/category/new-arrivals" className="hover:text-primary transition-colors focus-ring rounded">
                  Seasonal Runway Lookbook
                </Link>
              </li>
              <li>
                <Link href="/category/handloom" className="hover:text-primary transition-colors focus-ring rounded">
                  Certified Master Weaves
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Care & Concierge */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-text-main mb-4 pb-1 border-b border-border/70">
              Client Concierge
            </h3>
            <ul className="space-y-2.5 text-xs text-text-secondary">
              <li>
                <Link href="/orders/track" className="hover:text-primary transition-colors focus-ring rounded">
                  Track Your Courier Shipment
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary transition-colors focus-ring rounded">
                  Bespoke Bridal Consultations
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary transition-colors focus-ring rounded">
                  Custom Blouse Stitching & Fall
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary transition-colors focus-ring rounded">
                  Pure Silk Preservation Guide
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary transition-colors focus-ring rounded">
                  Complimentary Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary transition-colors focus-ring rounded">
                  Returns & Exchange Assistance
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Customer Account (Dynamic depending on session!) */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-text-main mb-4 pb-1 border-b border-border/70">
              Customer Account
            </h3>
            {currentUser ? (
              <div className="space-y-2.5 text-xs text-text-secondary">
                <p className="text-xs font-serif font-bold text-primary">
                  Logged in as {currentUser.name}
                </p>
                <ul className="space-y-2">
                  <li>
                    <Link href="/account" className="hover:text-primary transition-colors focus-ring rounded">
                      Dashboard Overview
                    </Link>
                  </li>
                  <li>
                    <Link href="/account/orders" className="hover:text-primary transition-colors focus-ring rounded">
                      My Orders & Tracking
                    </Link>
                  </li>
                  <li>
                    <Link href="/account/addresses" className="hover:text-primary transition-colors focus-ring rounded">
                      Saved Delivery Addresses
                    </Link>
                  </li>
                  <li>
                    <Link href="/account/wishlist" className="hover:text-primary transition-colors focus-ring rounded">
                      My Saved Wishlist
                    </Link>
                  </li>
                  <li>
                    <Link href="/account/password" className="hover:text-primary transition-colors focus-ring rounded">
                      Security & Password
                    </Link>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="space-y-2.5 text-xs text-text-secondary">
                <p className="text-[11px] text-text-subtle">
                  Sign in to track orders, save luxury bridal wishlists, and manage boutique addresses.
                </p>
                <div className="pt-1 flex flex-col gap-2">
                  <Link
                    href="/login"
                    className="inline-block text-center py-2 px-3 rounded-xl bg-primary hover:bg-primary-hover text-primary-contrast text-xs uppercase tracking-wider font-semibold transition-colors focus-ring shadow-xs"
                  >
                    Customer Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="inline-block text-center py-2 px-3 rounded-xl border border-border hover:border-accent bg-surface-card text-text-main text-xs uppercase tracking-wider font-semibold transition-colors focus-ring"
                  >
                    Create Account
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 4. Bottom Legal & Payment Badges Bar */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between text-xs text-text-subtle gap-6">
          <p>© {new Date().getFullYear()} VANYA Haute Couture. Handcrafted in India. All rights reserved.</p>

          {/* Payment Trust Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-1 rounded-md bg-surface-card border border-border text-[10px] font-bold uppercase tracking-wider text-text-secondary">
              UPI
            </span>
            <span className="px-2.5 py-1 rounded-md bg-surface-card border border-border text-[10px] font-bold uppercase tracking-wider text-text-secondary">
              RuPay
            </span>
            <span className="px-2.5 py-1 rounded-md bg-surface-card border border-border text-[10px] font-bold uppercase tracking-wider text-text-secondary">
              Visa
            </span>
            <span className="px-2.5 py-1 rounded-md bg-surface-card border border-border text-[10px] font-bold uppercase tracking-wider text-text-secondary">
              MasterCard
            </span>
            <span className="px-2.5 py-1 rounded-md bg-surface-card border border-border text-[10px] font-bold uppercase tracking-wider text-text-secondary">
              NetBanking
            </span>
          </div>

          {/* Legal Links */}
          <div className="flex items-center space-x-6">
            <Link href="/privacy" className="hover:text-text-main transition-colors focus-ring rounded">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-text-main transition-colors focus-ring rounded">
              Terms of Service
            </Link>
            <span className="hidden sm:inline text-text-subtle/60">•</span>
            <span className="hidden sm:inline">256-Bit SSL Protection</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
