"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { cn } from "@/lib/utils/cn";

export interface CometBorderProps {
  children: React.ReactNode;
  isFocused?: boolean;
  hasError?: boolean;
  disabled?: boolean;
  className?: string;
  borderRadius?: number;
  duration?: number;
  alwaysActive?: boolean;
}

/**
 * Ultra-Thin Sharp Lightning Glow Border.
 * Delivers a razor-thin (1.2px tapering down to 0.25px) streak of pure glowing light.
 * Completely eliminates any capsule or dash '-' symbol by using flush butt caps and needle-thin segments.
 */
export const CometBorder: React.FC<CometBorderProps> = ({
  children,
  isFocused = false,
  hasError = false,
  disabled = false,
  className = "",
  borderRadius = 12,
  duration = 3.5,
}) => {
  const [internalFocused, setInternalFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const starGroupRef = useRef<SVGGElement>(null);

  // Six razor-thin micro-tapered segments (all strictly <= 1.2px)
  const tipRef = useRef<SVGRectElement>(null);
  const s1Ref = useRef<SVGRectElement>(null);
  const s2Ref = useRef<SVGRectElement>(null);
  const s3Ref = useRef<SVGRectElement>(null);
  const s4Ref = useRef<SVGRectElement>(null);
  const s5Ref = useRef<SVGRectElement>(null);

  const active = isFocused || internalFocused;

  // Continuous linear GSAP loop driving the razor-thin shooting star
  useEffect(() => {
    if (typeof window === "undefined") return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const tip = tipRef.current;
    const s1 = s1Ref.current;
    const s2 = s2Ref.current;
    const s3 = s3Ref.current;
    const s4 = s4Ref.current;
    const s5 = s5Ref.current;

    if (!tip || !s1 || !s2 || !s3 || !s4 || !s5) return;

    // Relative trailing offsets behind the leading sharp tip
    const layers = [
      { el: tip, trail: 0 },
      { el: s1, trail: 0.3 },
      { el: s2, trail: 1.8 },
      { el: s3, trail: 4.5 },
      { el: s4, trail: 8.5 },
      { el: s5, trail: 13.5 },
    ];

    const progress = { offset: 0 };
    const tween = gsap.to(progress, {
      offset: -100,
      duration,
      ease: "none",
      repeat: -1,
      onUpdate: () => {
        for (let i = 0; i < layers.length; i++) {
          const val = (progress.offset + layers[i].trail).toFixed(2);
          layers[i].el.setAttribute("stroke-dashoffset", val);
          layers[i].el.style.strokeDashoffset = val;
        }
      },
    });

    return () => {
      tween.kill();
    };
  }, [duration]);

  // Brightness adjustments on hover or focus
  useEffect(() => {
    const starGroup = starGroupRef.current;
    if (!starGroup) return;

    let targetOpacity = 0.8;
    if (active) {
      targetOpacity = 1.0;
    } else if (isHovered) {
      targetOpacity = 0.95;
    }

    if (disabled) {
      targetOpacity = 0.2;
    }

    gsap.to(starGroup, {
      opacity: targetOpacity,
      duration: 0.25,
      ease: "power2.out",
    });
  }, [active, isHovered, disabled]);

  const trackColor = hasError ? "rgba(239, 68, 68, 0.45)" : "#e6d8ce";

  return (
    <div
      ref={containerRef}
      onFocusCapture={() => setInternalFocused(true)}
      onBlurCapture={() => setInternalFocused(false)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn("relative w-full rounded-xl group/comet", className)}
    >
      {/* Inner form field */}
      <div className="relative z-10 w-full h-full">{children}</div>

      {/* SVG Razor-Thin Lightning Track */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none rounded-xl overflow-visible z-20"
        style={{ width: "100%", height: "100%" }}
        aria-hidden="true"
      >
        {/* Crisp 1px neutral base track */}
        <rect
          x="1"
          y="1"
          rx={borderRadius}
          fill="none"
          stroke={trackColor}
          strokeWidth="1"
          style={{ width: "calc(100% - 2px)", height: "calc(100% - 2px)" }}
        />

        {/* 
          Ultra-thin sharp lightning glow group:
          Pure lightning yellow glow from start to end with NO thick dash/capsule symbols!
        */}
        <g
          ref={starGroupRef}
          opacity={0.8}
          style={{
            filter: hasError
              ? "drop-shadow(0 0 2px #ef4444) drop-shadow(0 0 4px #dc2626)"
              : "drop-shadow(0 0 2px #fef08a) drop-shadow(0 0 4px #fde047)",
          }}
        >
          {/* Segment 5: Fading Tail Whisper (0.25px - Ultra-thin, opacity 0.15) */}
          <rect
            ref={s5Ref}
            x="1"
            y="1"
            rx={borderRadius}
            fill="none"
            stroke={hasError ? "#f87171" : "#fef08a"}
            strokeWidth="0.25"
            pathLength="100"
            strokeDasharray="5.0 95.0"
            strokeDashoffset="0"
            strokeLinecap="butt"
            opacity="0.15"
            style={{ width: "calc(100% - 2px)", height: "calc(100% - 2px)" }}
          />

          {/* Segment 4: Lower Tail (0.4px - Lightning Yellow, opacity 0.3) */}
          <rect
            ref={s4Ref}
            x="1"
            y="1"
            rx={borderRadius}
            fill="none"
            stroke={hasError ? "#ef4444" : "#fde047"}
            strokeWidth="0.4"
            pathLength="100"
            strokeDasharray="4.5 95.5"
            strokeDashoffset="0"
            strokeLinecap="butt"
            opacity="0.3"
            style={{ width: "calc(100% - 2px)", height: "calc(100% - 2px)" }}
          />

          {/* Segment 3: Mid Tail (0.65px - Lightning Yellow, opacity 0.5) */}
          <rect
            ref={s3Ref}
            x="1"
            y="1"
            rx={borderRadius}
            fill="none"
            stroke={hasError ? "#dc2626" : "#facc15"}
            strokeWidth="0.65"
            pathLength="100"
            strokeDasharray="3.8 96.2"
            strokeDashoffset="0"
            strokeLinecap="butt"
            opacity="0.5"
            style={{ width: "calc(100% - 2px)", height: "calc(100% - 2px)" }}
          />

          {/* Segment 2: Upper Body (0.85px - Electric Lightning Yellow, opacity 0.75) */}
          <rect
            ref={s2Ref}
            x="1"
            y="1"
            rx={borderRadius}
            fill="none"
            stroke={hasError ? "#fca5a5" : "#fde047"}
            strokeWidth="0.85"
            pathLength="100"
            strokeDasharray="3.0 97.0"
            strokeDashoffset="0"
            strokeLinecap="butt"
            opacity="0.75"
            style={{ width: "calc(100% - 2px)", height: "calc(100% - 2px)" }}
          />

          {/* Segment 1: Neck (1.05px - Brilliant White/Yellow, opacity 0.9) */}
          <rect
            ref={s1Ref}
            x="1"
            y="1"
            rx={borderRadius}
            fill="none"
            stroke={hasError ? "#ffffff" : "#fef08a"}
            strokeWidth="1.05"
            pathLength="100"
            strokeDasharray="1.8 98.2"
            strokeDashoffset="0"
            strokeLinecap="butt"
            opacity="0.9"
            style={{ width: "calc(100% - 2px)", height: "calc(100% - 2px)" }}
          />

          {/* Tip: Sharp Electric White Point (1.2px max, tiny 0.4 length, flush butt cap) */}
          <rect
            ref={tipRef}
            x="1"
            y="1"
            rx={borderRadius}
            fill="none"
            stroke="#ffffff"
            strokeWidth="1.2"
            pathLength="100"
            strokeDasharray="0.4 99.6"
            strokeDashoffset="0"
            strokeLinecap="butt"
            style={{ width: "calc(100% - 2px)", height: "calc(100% - 2px)" }}
          />
        </g>
      </svg>
    </div>
  );
};

export default CometBorder;
