"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import gsap from "gsap";
import { cn } from "@/lib/utils/cn";

export interface AccountHubCardProps {
  /** Destination route (e.g. /account/orders, /account/profile) */
  href: string;
  /** Primary title of the hub card (e.g. Orders, Account Details) */
  title: string;
  /** Explanatory description text matching the reference layout */
  description: string;
  /** SVG icon element */
  icon: React.ReactNode;
  /** Accent color theme */
  theme?: "teal" | "amber" | "rose" | "plum";
  /** Optional extra CSS classes */
  className?: string;
}

/**
 * Saayal Stories 3D Interactive Account Hub Card.
 * Faithfully matches the HomeClick reference layout:
 * - Circular icon on left with crisp white backing
 * - Clean title and description on right
 * - Smooth GSAP 3D interactive cursor tilt with specular light reflection
 * - Clean, distraction-free aesthetic with soft card backing
 */
export const AccountHubCard: React.FC<AccountHubCardProps> = ({
  href,
  title,
  description,
  icon,
  theme = "teal",
  className = "",
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const cardInnerRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);

  // Theme palettes providing subtle jewel accents while keeping the clean HomeClick feel
  const themeStyles = {
    teal: {
      iconBg: "bg-white text-teal-600 border-teal-100 group-hover:text-teal-700 group-hover:border-teal-300",
      titleHover: "group-hover:text-teal-900",
      glow: "rgba(13, 148, 136, 0.12)",
    },
    amber: {
      iconBg: "bg-white text-amber-600 border-amber-100 group-hover:text-amber-700 group-hover:border-amber-300",
      titleHover: "group-hover:text-amber-900",
      glow: "rgba(217, 119, 6, 0.12)",
    },
    rose: {
      iconBg: "bg-white text-rose-600 border-rose-100 group-hover:text-rose-700 group-hover:border-rose-300",
      titleHover: "group-hover:text-rose-900",
      glow: "rgba(225, 29, 72, 0.12)",
    },
    plum: {
      iconBg: "bg-white text-primary border-primary/20 group-hover:text-primary group-hover:border-primary/40",
      titleHover: "group-hover:text-primary",
      glow: "rgba(66, 15, 36, 0.12)",
    },
  }[theme];

  // GSAP 3D Cursor Tracking Tilt
  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const card = cardInnerRef.current;
    const glare = glareRef.current;
    const iconEl = iconRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Subtle 4.5-degree 3D perspective tilt
    const rotateX = ((y - centerY) / centerY) * -4.5;
    const rotateY = ((x - centerX) / centerX) * 4.5;

    gsap.to(card, {
      rotateX,
      rotateY,
      transformPerspective: 1000,
      duration: 0.25,
      ease: "power1.out",
      overwrite: "auto",
    });

    if (iconEl) {
      gsap.to(iconEl, {
        x: rotateY * 0.65,
        y: -rotateX * 0.65,
        scale: 1.05,
        duration: 0.25,
        ease: "power1.out",
        overwrite: "auto",
      });
    }

    if (glare) {
      glare.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.6) 0%, transparent 65%)`;
      gsap.to(glare, { opacity: 1, duration: 0.15, overwrite: "auto" });
    }
  };

  const handleMouseEnter = () => {
    const card = cardInnerRef.current;
    if (card) {
      gsap.to(card, {
        y: -4,
        duration: 0.3,
        ease: "power2.out",
        boxShadow: `0 16px 32px -8px ${themeStyles.glow}, 0 4px 12px -2px rgba(0, 0, 0, 0.04)`,
        overwrite: "auto",
      });
    }
  };

  const handleMouseLeave = () => {
    const card = cardInnerRef.current;
    const glare = glareRef.current;
    const iconEl = iconRef.current;

    if (card) {
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        y: 0,
        duration: 0.45,
        ease: "power2.out",
        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.03)",
        overwrite: "auto",
      });
    }

    if (iconEl) {
      gsap.to(iconEl, {
        x: 0,
        y: 0,
        scale: 1,
        duration: 0.45,
        ease: "power2.out",
        overwrite: "auto",
      });
    }

    if (glare) {
      gsap.to(glare, { opacity: 0, duration: 0.3, overwrite: "auto" });
    }
  };

  // Cleanup GSAP tweens on unmount
  useEffect(() => {
    const card = cardInnerRef.current;
    return () => {
      if (card) gsap.killTweensOf(card);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn("account-hub-card relative group [perspective:1000px] h-full", className)}
    >
      <Link
        href={href}
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={cn(
          "block h-full rounded-2xl focus:outline-none transition-shadow",
          isFocused ? "ring-2 ring-primary/40 ring-offset-2" : ""
        )}
        aria-label={`${title} - ${description}`}
      >
        <div
          ref={cardInnerRef}
          style={{ transformStyle: "preserve-3d" }}
          className={cn(
            "relative flex items-center gap-5 p-6 sm:p-7 rounded-2xl bg-[#F4F7F9] hover:bg-white border border-slate-200/70 hover:border-slate-300 transition-colors h-full overflow-hidden shadow-xs"
          )}
        >
          {/* Dynamic 3D Specular Light Glare following mouse */}
          <div
            ref={glareRef}
            className="absolute inset-0 pointer-events-none opacity-0 transition-opacity rounded-2xl z-10"
            aria-hidden="true"
          />

          {/* Circular Icon Badge matching HomeClick */}
          <div
            ref={iconRef}
            style={{ transformStyle: "preserve-3d" }}
            className={cn(
              "w-14 h-14 sm:w-16 sm:h-16 rounded-full border shadow-xs flex items-center justify-center shrink-0 transition-all z-20",
              themeStyles.iconBg
            )}
          >
            {icon}
          </div>

          {/* Text Content matching HomeClick */}
          <div className="flex-1 min-w-0 z-20">
            <h2
              className={cn(
                "text-lg sm:text-xl font-serif font-bold text-slate-800 transition-colors tracking-tight",
                themeStyles.titleHover
              )}
            >
              {title}
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-500 group-hover:text-slate-600 leading-relaxed">
              {description}
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default AccountHubCard;
