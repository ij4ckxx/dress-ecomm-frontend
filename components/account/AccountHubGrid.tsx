"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { cn } from "@/lib/utils/cn";

export interface AccountHubGridProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Grid wrapper for Account Hub cards providing coordinated GSAP 3D staggered entrance animations
 * with strict React Strict Mode context cleanup and reduced-motion compliance.
 */
export const AccountHubGrid: React.FC<AccountHubGridProps> = ({
  children,
  className = "",
}) => {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const grid = gridRef.current;
    if (!grid) return;

    const ctx = gsap.context(() => {
      const cards = grid.querySelectorAll(".account-hub-card");
      if (!cards.length) return;

      gsap.fromTo(
        cards,
        {
          opacity: 0,
          y: 28,
          rotateX: 10,
          transformPerspective: 1000,
        },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 0.65,
          stagger: 0.08,
          ease: "power2.out",
          clearProps: "transform",
        }
      );
    }, grid);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={gridRef}
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6",
        className
      )}
    >
      {children}
    </div>
  );
};

export default AccountHubGrid;
