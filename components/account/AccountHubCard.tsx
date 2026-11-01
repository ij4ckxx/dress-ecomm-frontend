"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import gsap from "gsap";
import { CometBorder } from "@/components/ui/CometBorder";
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
  /** Saayal Stories heritage color theme */
  theme: "teal" | "amber" | "rose" | "plum";
  /** Optional extra CSS classes */
  className?: string;
}

/**
 * Saayal Stories 3D Interactive Account Hub Card.
 * Matches HomeClick layout (circular icon on left, title & description on right)
 * with authentic Saayal Stories royal colors, smooth GSAP 3D cursor perspective tilt,
 * specular sheen lighting, and continuous razor-thin lightning yellow comet glow.
 */
export const AccountHubCard: React.FC<AccountHubCardProps> = ({
  href,
  title,
  description,
  icon,
  theme = "teal",
  className = "",
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const cardInnerRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<SVGSVGElement>(null);

  // Saayal Stories heritage color palettes
  const themeStyles = {
    teal: {
      icon: "bg-teal-50/90 text-teal-700 border-teal-200/90 group-hover:bg-teal-600 group-hover:text-white group-hover:border-teal-600",
      titleHover: "group-hover:text-teal-800",
      arrowHover: "group-hover:text-teal-600",
      borderHover: "group-hover:border-teal-300/70",
    },
    amber: {
      icon: "bg-amber-50/90 text-amber-700 border-amber-200/90 group-hover:bg-amber-600 group-hover:text-white group-hover:border-amber-600",
      titleHover: "group-hover:text-amber-800",
      arrowHover: "group-hover:text-amber-600",
      borderHover: "group-hover:border-amber-300/70",
    },
    rose: {
      icon: "bg-rose-50/90 text-rose-700 border-rose-200/90 group-hover:bg-rose-600 group-hover:text-white group-hover:border-rose-600",
      titleHover: "group-hover:text-rose-800",
      arrowHover: "group-hover:text-rose-600",
      borderHover: "group-hover:border-rose-300/70",
    },
    plum: {
      icon: "bg-fuchsia-50/90 text-primary border-fuchsia-200/90 group-hover:bg-primary group-hover:text-white group-hover:border-primary",
      titleHover: "group-hover:text-primary",
      arrowHover: "group-hover:text-primary",
      borderHover: "group-hover:border-fuchsia-300/70",
    },
  }[theme];

  // GSAP 3D Interactive Cursor Tilt
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

    // Subtle 5-degree 3D perspective tilt
    const rotateX = ((y - centerY) / centerY) * -5.5;
    const rotateY = ((x - centerX) / centerX) * 5.5;

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
        x: rotateY * 0.7,
        y: -rotateX * 0.7,
        scale: 1.08,
        duration: 0.25,
        ease: "power1.out",
        overwrite: "auto",
      });
    }

    if (glare) {
      glare.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.45) 0%, transparent 65%)`;
      gsap.to(glare, { opacity: 1, duration: 0.15, overwrite: "auto" });
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    const card = cardInnerRef.current;
    const arrow = arrowRef.current;

    if (card) {
      gsap.to(card, {
        y: -4,
        duration: 0.3,
        ease: "power2.out",
        boxShadow:
          "0 18px 36px -10px rgba(66, 15, 36, 0.12), 0 4px 12px -2px rgba(66, 15, 36, 0.05)",
        overwrite: "auto",
      });
    }

    if (arrow) {
      gsap.to(arrow, { x: 4, opacity: 1, duration: 0.25, overwrite: "auto" });
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    const card = cardInnerRef.current;
    const glare = glareRef.current;
    const iconEl = iconRef.current;
    const arrow = arrowRef.current;

    if (card) {
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        y: 0,
        duration: 0.5,
        ease: "power2.out",
        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.04)",
        overwrite: "auto",
      });
    }

    if (iconEl) {
      gsap.to(iconEl, {
        x: 0,
        y: 0,
        scale: 1,
        duration: 0.5,
        ease: "power2.out",
        overwrite: "auto",
      });
    }

    if (glare) {
      gsap.to(glare, { opacity: 0, duration: 0.35, overwrite: "auto" });
    }

    if (arrow) {
      gsap.to(arrow, { x: 0, opacity: 0.45, duration: 0.25, overwrite: "auto" });
    }
  };

  // Cleanup GSAP context on unmount
  useEffect(() => {
    const card = cardInnerRef.current;
    return () => {
      if (card) gsap.killTweensOf(card);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn("account-hub-card relative group [perspective:1000px]", className)}
    >
      <CometBorder
        borderRadius={16}
        duration={3.5}
        isFocused={isHovered || isFocused}
        className="h-full"
      >
        <Link
          href={href}
          onMouseEnter={handleMouseEnter}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="block h-full focus:outline-none"
          aria-label={`${title} - ${description}`}
        >
          <div
            ref={cardInnerRef}
            style={{ transformStyle: "preserve-3d" }}
            className={cn(
              "relative flex items-center gap-5 p-6 sm:p-7 rounded-2xl bg-surface-card border border-border/80 transition-colors h-full overflow-hidden shadow-xs",
              themeStyles.borderHover
            )}
          >
            {/* Dynamic 3D Specular Light Glare following mouse */}
            <div
              ref={glareRef}
              className="absolute inset-0 pointer-events-none opacity-0 transition-opacity rounded-2xl z-10"
              aria-hidden="true"
            />

            {/* Circular Icon Badge */}
            <div
              ref={iconRef}
              style={{ transformStyle: "preserve-3d" }}
              className={cn(
                "w-14 h-14 sm:w-16 sm:h-16 rounded-full border flex items-center justify-center shrink-0 transition-all shadow-xs z-20",
                themeStyles.icon
              )}
            >
              {icon}
            </div>

            {/* Text Content */}
            <div className="flex-1 min-w-0 pr-2 z-20">
              <h2
                className={cn(
                  "text-lg sm:text-xl font-serif font-bold text-primary transition-colors tracking-tight",
                  themeStyles.titleHover
                )}
              >
                {title}
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-text-secondary leading-relaxed">
                {description}
              </p>
            </div>

            {/* Subtle Directional Chevron */}
            <div
              className={cn(
                "shrink-0 text-text-muted transition-colors z-20",
                themeStyles.arrowHover
              )}
            >
              <svg
                ref={arrowRef}
                className="w-5 h-5 opacity-45 group-hover:opacity-100 transition-opacity"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>
        </Link>
      </CometBorder>
    </div>
  );
};

export default AccountHubCard;
