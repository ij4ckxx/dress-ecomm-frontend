import React from "react";
import Link from "next/link";
import { Logo } from "@/components/shared/Logo";
import { PAYMENT_BADGES } from "./constants";

/**
 * Bottom sub-bar rendering the brand emblem, copyright notice and payment method badges.
 */
export const FooterBottom: React.FC = () => {
  const storeName = process.env.NEXT_PUBLIC_STORE_NAME || "Saayal Stories";
  const currentYear = new Date().getFullYear();

  return (
    <div className="mt-10 pt-8 border-t border-white/10 flex flex-col items-center justify-center text-center gap-4">
      {/* Brand Emblem in White */}
      <Link href="/" className="inline-block transition-transform hover:scale-105" aria-label="Saayal Stories Home">
        <Logo variant="white" height={44} />
      </Link>

      {/* Copyright Notice */}
      <p className="text-xs text-white/70 tracking-wide font-sans">
        © {currentYear} {storeName}. All Rights Reserved. Crafted for the Modern Silhouette.
      </p>

      {/* Payment & Security Badges Row */}
      <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
        {PAYMENT_BADGES.map((badge) => (
          <div
            key={badge.code}
            className="h-6 px-2.5 rounded bg-white text-text-main flex items-center justify-center text-[10px] font-bold shadow-2xs border border-white/40"
            title={badge.name}
          >
            {badge.code === "bbb" && (
              <span className="text-[#005a9c] font-black tracking-tighter text-[9px]">
                ACCREDITED BUSINESS
              </span>
            )}
            {badge.code === "paypal" && (
              <span className="text-[#003087] font-extrabold italic text-[11px]">
                PayPal
              </span>
            )}
            {badge.code === "visa" && (
              <span className="text-[#1a1f71] font-black italic text-[12px] tracking-wider">
                VISA
              </span>
            )}
            {badge.code === "mastercard" && (
              <span className="flex items-center gap-0.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#eb001b] inline-block opacity-90" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#f79e1b] -ml-1.5 inline-block opacity-90" />
              </span>
            )}
            {badge.code === "discover" && (
              <span className="text-[#f47b20] font-bold text-[10px] tracking-tight">
                DISCOVER
              </span>
            )}
            {badge.code === "amex" && (
              <span className="text-[#006fcf] font-black text-[10px]">
                AMEX
              </span>
            )}
            {badge.code === "braintree" && (
              <span className="text-[#2b3a42] font-semibold text-[9px] tracking-tight flex items-center gap-1">
                <span className="text-primary font-bold">🔒</span> Braintree
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FooterBottom;
