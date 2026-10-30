"use client";

import React, { useState } from "react";
import { PressQuote } from "@/lib/types/homepage";

export interface PressTestimonialsProps {
  quotes: PressQuote[];
}

/**
 * Editorial press accolades section inspired by high-end luxury fashion publications.
 */
export const PressTestimonials: React.FC<PressTestimonialsProps> = ({ quotes }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!quotes || quotes.length === 0) return null;

  const currentQuote = quotes[activeIndex];

  return (
    <section
      aria-labelledby="press-section-title"
      className="w-full py-16 sm:py-20 bg-background border-b border-border"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span
          id="press-section-title"
          className="text-[10px] uppercase tracking-[0.3em] text-accent font-bold block mb-6"
        >
          As Celebrated In Press
        </span>

        {/* Large Editorial Quote */}
        <div className="min-h-[140px] flex items-center justify-center">
          <blockquote className="font-serif text-lg sm:text-2xl lg:text-3xl text-text-main leading-snug italic max-w-3xl transition-opacity duration-300">
            &ldquo;{currentQuote.quote}&rdquo;
          </blockquote>
        </div>

        {/* Publication Credential */}
        <div className="mt-6">
          <cite className="not-italic font-sans text-xs sm:text-sm font-bold tracking-[0.25em] text-primary uppercase block">
            {currentQuote.publication}
          </cite>
          <span className="text-[10px] text-text-subtle uppercase tracking-wider">
            {currentQuote.city}
          </span>
        </div>

        {/* Navigation Selector Dots */}
        <div className="flex items-center justify-center gap-3 mt-8">
          {quotes.map((q, idx) => (
            <button
              key={q.id}
              type="button"
              onClick={() => setActiveIndex(idx)}
              aria-label={`View quote from ${q.publication}`}
              className={`transition-all duration-300 rounded-full h-1.5 focus-ring ${
                idx === activeIndex
                  ? "w-8 bg-primary shadow-xs"
                  : "w-2 bg-border hover:bg-text-subtle"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PressTestimonials;

