"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { LookbookEnsemble, HotspotItem } from "@/lib/types/homepage";

export interface ShopTheLookProps {
  ensemble: LookbookEnsemble;
}

const formatPrice = (amount: number): string => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Editorial "Shop The Look" ensemble spotlight inspired by Three Clothing (wearthree.com)
 * Patrons can explore complete coordinated outfits via interactive minimal hotspot markers.
 */
export const ShopTheLook: React.FC<ShopTheLookProps> = ({ ensemble }) => {
  const [activePin, setActivePin] = useState<HotspotItem | null>(ensemble.hotspots[0] || null);

  if (!ensemble) return null;

  return (
    <section
      aria-labelledby="shop-the-look-title"
      className="w-full py-16 sm:py-24 bg-background border-b border-border/60"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="text-[11px] font-sans uppercase tracking-[0.3em] text-accent font-medium block mb-2">
            The Styled Lookbook
          </span>
          <h2
            id="shop-the-look-title"
            className="text-3xl sm:text-4xl lg:text-5xl font-serif font-light text-text-main tracking-tight mb-2"
          >
            {ensemble.title}
          </h2>
          <p className="text-xs sm:text-sm text-text-secondary font-sans">
            {ensemble.subtitle} — {ensemble.description}
          </p>
        </div>

        {/* Main Canvas with Hotspots */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Main Editorial Image with Hotspot Pins (8 cols) */}
          <div className="lg:col-span-8 relative aspect-[4/5] sm:aspect-[16/10] overflow-hidden bg-surface-soft">
            <Image
              src={ensemble.mainImageUrl}
              alt={ensemble.title}
              fill
              sizes="(max-width: 1024px) 100vw, 66vw"
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-black/10 pointer-events-none" />

            {/* Hotspot Pins */}
            {ensemble.hotspots.map((pin) => {
              const isActive = activePin?.id === pin.id;
              return (
                <div
                  key={pin.id}
                  className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${pin.xPercent}%`, top: `${pin.yPercent}%` }}
                >
                  <button
                    type="button"
                    onClick={() => setActivePin(pin)}
                    onMouseEnter={() => setActivePin(pin)}
                    aria-label={`View ${pin.productName}`}
                    className={`relative w-7 h-7 rounded-full flex items-center justify-center transition-all focus-ring ${
                      isActive
                        ? "bg-primary text-white scale-110 ring-4 ring-white/60 shadow-md"
                        : "bg-white/90 text-text-main hover:bg-primary hover:text-white shadow-xs"
                    }`}
                  >
                    <span className="relative text-xs font-serif font-light">+</span>
                  </button>
                </div>
              );
            })}
          </div>

          {/* Active Piece Card Spotlight (4 cols) */}
          <div className="lg:col-span-4 flex flex-col">
            <div className="p-6 sm:p-8 bg-surface-soft border border-border/70">
              <span className="text-[10px] font-sans uppercase font-medium tracking-[0.25em] text-accent block mb-2">
                Featured Coordinate
              </span>
              <h3 className="font-serif text-2xl font-normal text-text-main mb-6">
                Ensemble Details
              </h3>

              {activePin ? (
                <div className="space-y-4">
                  <div className="relative aspect-[3/4] w-28 overflow-hidden bg-surface-card float-left mr-4 mb-2">
                    <Image
                      src={activePin.imageUrl}
                      alt={activePin.productName}
                      fill
                      sizes="120px"
                      className="object-cover object-center"
                    />
                  </div>

                  <div>
                    <h4 className="font-serif text-base font-normal text-text-main mb-1">
                      {activePin.productName}
                    </h4>
                    <span className="font-sans text-sm font-semibold text-primary block mb-2">
                      {formatPrice(activePin.price)}
                    </span>
                    <p className="text-xs text-text-secondary leading-relaxed font-sans mb-4">
                      Handcrafted with pure silk threads, designed to drape fluidly for festive ceremonies and evening galas.
                    </p>
                    <Link
                      href={`/product/${activePin.productSlug}`}
                      className="inline-flex items-center gap-2 text-xs font-sans uppercase tracking-[0.2em] text-primary hover:text-primary-hover font-medium border-b border-primary pb-0.5"
                    >
                      <span>Explore Piece</span>
                      <span aria-hidden="true">&rarr;</span>
                    </Link>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-text-subtle font-sans">
                  Hover or tap any pinpoint on the lookbook canvas to explore the coordinate.
                </p>
              )}

              {/* All Coordinate Pills */}
              <div className="clear-both pt-6 mt-6 border-t border-border/60">
                <span className="text-[10px] font-sans uppercase tracking-widest text-text-subtle block mb-2">
                  All Pieces in this Look:
                </span>
                <div className="flex flex-wrap gap-2">
                  {ensemble.hotspots.map((pin) => (
                    <button
                      key={pin.id}
                      type="button"
                      onClick={() => setActivePin(pin)}
                      className={`px-3 py-1 text-xs font-sans transition-colors ${
                        activePin?.id === pin.id
                          ? "bg-primary text-white"
                          : "bg-surface-card hover:bg-surface-soft text-text-secondary border border-border"
                      }`}
                    >
                      {pin.productName}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShopTheLook;
