"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";

export interface GsapFadeInProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  y?: number;
  stagger?: number;
  className?: string;
}

/**
 * Accessible GSAP entrance component providing subtle, elegant staggered reveals
 * with strict React Strict Mode context cleanup and reduced-motion compliance.
 */
export const GsapFadeIn: React.FC<GsapFadeInProps> = ({
  children,
  delay = 0.05,
  duration = 0.65,
  y = 16,
  stagger,
  className = "",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Respect user motion preferences
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const element = containerRef.current;
    if (!element) return;

    const ctx = gsap.context(() => {
      const targets = stagger ? element.children : element;
      gsap.fromTo(
        targets,
        {
          opacity: 0,
          y,
        },
        {
          opacity: 1,
          y: 0,
          duration,
          delay,
          stagger: stagger || 0,
          ease: "power2.out",
          clearProps: "all",
        }
      );
    }, element);

    return () => ctx.revert();
  }, [delay, duration, y, stagger]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
};

export default GsapFadeIn;

