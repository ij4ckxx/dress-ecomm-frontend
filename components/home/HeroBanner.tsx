"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { HeroSlide } from "@/lib/types/homepage";

export interface HeroBannerProps {
  slides: HeroSlide[];
}

/**
 * High-Fashion Editorial Hero Section inspired by Three Clothing (wearthree.com)
 * Features full-bleed cinematic fashion imagery, Cormorant Garamond typography,
 * architectural CTAs, GSAP transitions, and minimalist numeric pagination.
 */
export const HeroBanner: React.FC<HeroBannerProps> = ({ slides }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const textContentRef = useRef<HTMLDivElement>(null);

  const slideCount = slides.length;

  // Auto-advance slides every 6.5 seconds when not paused
  useEffect(() => {
    if (isPaused || slideCount <= 1) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideCount);
    }, 6500);

    return () => clearInterval(timer);
  }, [isPaused, slideCount]);

  // GSAP animation on slide change
  useEffect(() => {
    if (!textContentRef.current) return;
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        textContentRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [currentSlide]);

  if (!slides || slides.length === 0) return null;

  const activeSlide = slides[currentSlide];

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + slideCount) % slideCount);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slideCount);
  };

  return (
    <section
      ref={containerRef}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Editorial Seasonal Campaigns"
      className="relative w-full h-[85vh] min-h-[600px] max-h-[880px] overflow-hidden bg-text-main text-primary-contrast flex items-center"
    >
      {/* 1. Background Image Crossfade Layers */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? "opacity-100 z-10 scale-100" : "opacity-0 z-0 scale-105 pointer-events-none"
          }`}
          style={{ transitionProperty: "opacity, transform" }}
        >
          <Image
            src={slide.imageUrl}
            alt={slide.title}
            fill
            priority={index === 0}
            sizes="100vw"
            className="object-cover object-center brightness-[0.82]"
          />
          {/* Subtle gradient vignette for text legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/30" />
          <div className="absolute inset-0 bg-radial from-transparent via-black/20 to-black/60" />
        </div>
      ))}

      {/* 2. Editorial Text Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16">
        <div
          ref={textContentRef}
          className={`max-w-2xl ${
            activeSlide.alignment === "center"
              ? "mx-auto text-center"
              : activeSlide.alignment === "right"
              ? "ml-auto text-right"
              : "text-left"
          }`}
        >
          {/* High-Fashion Category & Season Identifier */}
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="text-[11px] font-sans uppercase tracking-[0.3em] text-surface-tint font-medium">
              {activeSlide.badge}
            </span>
            <span className="text-white/40">•</span>
            <span className="text-[11px] font-sans uppercase tracking-[0.3em] text-white/80 font-medium">
              {activeSlide.seasonTag}
            </span>
          </div>

          {/* Main Editorial Headline in Cormorant Garamond */}
          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-light tracking-tight text-white leading-[1.06] mb-4">
            {activeSlide.title}
          </h1>

          {/* Poetic Subtitle */}
          <p className="text-base sm:text-xl text-surface-tint/90 font-serif italic tracking-wide mb-3 max-w-xl">
            {activeSlide.subtitle}
          </p>

          {/* Editorial Description */}
          <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-sans max-w-lg mb-8 hidden sm:block">
            {activeSlide.description}
          </p>

          {/* Architectural Action CTAs */}
          <div
            className={`flex flex-wrap items-center gap-4 ${
              activeSlide.alignment === "center"
                ? "justify-center"
                : activeSlide.alignment === "right"
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <Link
              href={activeSlide.primaryCtaLink}
              className="px-8 py-3.5 bg-white text-text-main hover:bg-primary hover:text-white text-xs font-sans uppercase tracking-[0.22em] font-medium transition-all shadow-sm focus-ring"
            >
              {activeSlide.primaryCtaText}
            </Link>

            <Link
              href={activeSlide.secondaryCtaLink}
              className="px-8 py-3.5 border border-white/60 hover:border-white text-white hover:bg-white/10 text-xs font-sans uppercase tracking-[0.22em] font-medium transition-all focus-ring"
            >
              {activeSlide.secondaryCtaText}
            </Link>
          </div>
        </div>
      </div>

      {/* 3. Bottom Slide Indicators & Controls Bar */}
      <div className="absolute bottom-8 inset-x-0 z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Numeric Slide Counter */}
        <div className="flex items-center gap-3">
          <span className="font-serif text-sm tracking-widest text-surface-tint">
            {String(currentSlide + 1).padStart(2, "0")}
          </span>
          <div className="w-16 h-[1.5px] bg-white/30 overflow-hidden relative">
            <div
              className="h-full bg-surface-tint transition-all duration-500 ease-out"
              style={{ width: `${((currentSlide + 1) / slideCount) * 100}%` }}
            />
          </div>
          <span className="font-serif text-sm tracking-widest text-white/50">
            {String(slideCount).padStart(2, "0")}
          </span>
        </div>

        {/* Minimalist Arrow Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous slide"
            className="w-10 h-10 flex items-center justify-center rounded-full border border-white/30 hover:border-white text-white hover:bg-white/10 transition-colors focus-ring"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next slide"
            className="w-10 h-10 flex items-center justify-center rounded-full border border-white/30 hover:border-white text-white hover:bg-white/10 transition-colors focus-ring"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
