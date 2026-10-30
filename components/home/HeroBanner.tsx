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
 * Editorial Hero Section inspired by Three Clothing (wearthree.com)
 * featuring full-bleed cinematic imagery, seasonal capsule badges,
 * GSAP text transitions, and interactive slide indicators.
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
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.75, ease: "power3.out" }
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
      className="relative w-full h-[82vh] min-h-[580px] max-h-[850px] overflow-hidden bg-text-main text-primary-contrast flex items-center"
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
            className="object-cover object-center brightness-[0.78]"
          />
          {/* Subtle gradient vignette for text legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-black/30" />
          <div className="absolute inset-0 bg-radial from-transparent via-black/20 to-black/60" />
        </div>
      ))}

      {/* 2. Editorial Text Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12">
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
          {/* Season Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-surface-card/20 backdrop-blur-md border border-white/25 text-surface-tint text-xs font-semibold tracking-[0.2em] uppercase mb-4 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <span>{activeSlide.badge}</span>
          </div>

          {/* Main Editorial Headline in Cormorant Garamond */}
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.1] mb-4">
            {activeSlide.title}
          </h1>

          {/* Cursive Subtitle */}
          <p className="text-sm sm:text-lg text-surface-tint font-medium tracking-wide mb-3 max-w-xl">
            {activeSlide.subtitle}
          </p>

          {/* Description */}
          <p className="text-xs sm:text-sm text-white/85 leading-relaxed max-w-lg mb-8 hidden sm:block">
            {activeSlide.description}
          </p>

          {/* Dual Action Buttons */}
          <div
            className={`flex flex-wrap items-center gap-4 ${
              activeSlide.alignment === "center" ? "justify-center" : activeSlide.alignment === "right" ? "justify-end" : "justify-start"
            }`}
          >
            <Link
              href={activeSlide.primaryCtaLink}
              className="px-7 py-3.5 rounded-full bg-primary hover:bg-primary-hover text-primary-contrast text-xs uppercase tracking-[0.18em] font-semibold transition-all shadow-md hover:shadow-lg hover:scale-[1.02] focus-ring"
            >
              {activeSlide.primaryCtaText}
            </Link>

            <Link
              href={activeSlide.secondaryCtaLink}
              className="px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/30 text-xs uppercase tracking-[0.18em] font-semibold transition-all hover:scale-[1.02] focus-ring"
            >
              {activeSlide.secondaryCtaText}
            </Link>
          </div>
        </div>
      </div>

      {/* 3. Bottom Slide Indicators & Controls Bar */}
      <div className="absolute bottom-6 inset-x-0 z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Season Tag Line */}
        <span className="hidden sm:inline-block text-[11px] font-sans uppercase tracking-[0.25em] text-surface-tint/90 font-medium">
          {activeSlide.seasonTag}
        </span>

        {/* Slide Pagination Pills */}
        <div className="flex items-center gap-2 mx-auto sm:mx-0">
          {slides.map((slide, idx) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => setCurrentSlide(idx)}
              aria-label={`Go to slide ${idx + 1}: ${slide.title}`}
              className={`transition-all duration-300 rounded-full h-1.5 focus-ring ${
                idx === currentSlide
                  ? "w-8 bg-surface-tint shadow-xs"
                  : "w-2 bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>

        {/* Previous / Next Arrow Controls */}
        <div className="hidden sm:flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous slide"
            className="p-2 rounded-full bg-white/10 hover:bg-white/25 text-white backdrop-blur-md border border-white/20 transition-all focus-ring"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next slide"
            className="p-2 rounded-full bg-white/10 hover:bg-white/25 text-white backdrop-blur-md border border-white/20 transition-all focus-ring"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;

