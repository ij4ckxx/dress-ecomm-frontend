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
 * Interactive "Shop The Look" ensemble spotlight inspired by contemporary luxury boutiques
 * allowing patrons to explore complete coordinated outfits via interactive hotspot pins.
 */
export const ShopTheLook: React.FC<ShopTheLookProps> = ({ ensemble }) => {
  const [activePin, setActivePin] = useState<HotspotItem | null>(ensemble.hotspots[0] || null);

  if (!ensemble) return null;

  return (
    <section
      aria-labelledby="shop-the-look-title"
      className="w-full py-16 sm:py-24 bg-background"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-[11px] uppercase tracking-[0.28em] text-accent font-bold block mb-1.5">
            Curated Styling
          </span>
          <h2
            id="shop-the-look-title"
            className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-primary tracking-tight mb-2"
          >
            {ensemble.title}
          </h2>
          <p className="text-xs sm:text-sm text-text-secondary">
            {ensemble.subtitle} — {ensemble.description}
          </p>
        </div>

        {/* Main Canvas with Hotspots */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Main Editorial Image with Hotspot Pins (8 cols) */}
          <div className="lg:col-span-8 relative aspect-[4/5] sm:aspect-[16/10] rounded-3xl overflow-hidden shadow-xl border border-border bg-surface-soft">
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
                    className={`relative w-8 h-8 rounded-full flex items-center justify-center transition-all focus-ring ${
                      isActive
                        ? "bg-primary text-primary-contrast scale-110 shadow-lg ring-4 ring-white/50"
                        : "bg-surface-card/90 text-primary hover:bg-primary hover:text-primary-contrast shadow-md"
                    }`}
                  >
                    {/* Pulsing Outer Radar Ring */}
                    <span className="absolute inset-0 rounded-full bg-accent/40 animate-ping opacity-75" />
                    <span className="relative text-xs font-bold font-serif">+</span>
                  </button>
                </div>
              );
            })}
          </div>

          {/* Active Piece Card Spotlight (4 cols) */}
          <div className="lg:col-span-4 flex flex-col">
            <div className="p-6 rounded-3xl bg-surface-soft border border-border shadow-sm">
              <span className="text-[10px] uppercase font-bold tracking-widest text-accent block mb-1">
                Featured Coordinate
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-primary mb-4">
                The Ensemble Breakdown
              </h3>

              {activePin ? (
                <div className="flex flex-col gap-4 animate-in fade-in duration-300">
                  <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden border border-border bg-surface-card">
                    <Image
                      src={activePin.imageUrl}
                      alt={activePin.productName}
                      fill
                      sizes="350px"
                      className="object-cover object-center"
                    />
                    <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-surface-card/90 backdrop-blur-xs text-[10px] font-bold uppercase tracking-wider text-primary border border-border">
                      {activePin.tag}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-serif font-bold text-base text-text-main mb-1">
                      {activePin.productName}
                    </h4>
                    <span className="block font-serif font-bold text-lg text-primary mb-4">
                      {formatPrice(activePin.price)}
                    </span>

                    <div className="flex items-center gap-3">
                      <Link
                        href={`/product/${activePin.productSlug}`}
                        className="flex-1 text-center py-3 px-4 rounded-full bg-primary hover:bg-primary-hover text-primary-contrast text-xs uppercase tracking-wider font-semibold transition-all focus-ring shadow-xs"
                      >
                        Shop This Piece
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-text-subtle">
                  Tap or hover over the hotspot pins on the lookbook to inspect coordinated items.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShopTheLook;

