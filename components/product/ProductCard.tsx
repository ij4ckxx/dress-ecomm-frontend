"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { HomepageProduct } from "@/lib/types/homepage";

export interface ProductCardProps {
  product: HomepageProduct;
  priority?: boolean;
}

/**
 * Format Indian Rupee currency format (e.g., ₹18,500)
 */
const formatPrice = (amount: number): string => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Reusable luxury product card inspired by Three Clothing (wearthree.com)
 * featuring dual-image hover crossfade, quick size selector, wishlist toggle,
 * and elegant editorial typography.
 */
export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  priority = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [addedMessage, setAddedMessage] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);
  const heartRef = useRef<HTMLButtonElement>(null);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsWishlisted((prev) => !prev);

    if (heartRef.current) {
      gsap.fromTo(
        heartRef.current,
        { scale: 0.8 },
        { scale: 1.25, duration: 0.25, ease: "back.out(2)", yoyo: true, repeat: 1 }
      );
    }
  };

  const handleQuickAddSize = (e: React.MouseEvent, size: string) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedSize(size);
    setAddedMessage(true);
    setTimeout(() => setAddedMessage(false), 2200);
  };

  const hasDiscount = product.salePrice && product.salePrice < product.regularPrice;
  const displayPrice = product.salePrice || product.regularPrice;

  return (
    <article
      ref={cardRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group flex flex-col relative rounded-2xl bg-surface-card border border-border/70 hover:border-accent/40 shadow-xs hover:shadow-md transition-all duration-300 overflow-hidden"
    >
      {/* 1. Image Container with Dual Image Hover Crossfade */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-surface-soft">
        <Link
          href={`/product/${product.slug}`}
          className="block w-full h-full relative"
          aria-label={`View details for ${product.name}`}
        >
          {/* Primary View */}
          <Image
            src={product.thumbnail}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            priority={priority}
            className={`object-cover object-center transition-all duration-700 ease-out ${
              isHovered && product.secondaryImage
                ? "opacity-0 scale-105"
                : "opacity-100 scale-100"
            }`}
          />

          {/* Secondary View (Hover Angle) */}
          {product.secondaryImage && (
            <Image
              src={product.secondaryImage}
              alt={`${product.name} - Detailed draped view`}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className={`object-cover object-center transition-all duration-700 ease-out absolute inset-0 ${
                isHovered ? "opacity-100 scale-105" : "opacity-0 scale-100"
              }`}
            />
          )}
        </Link>

        {/* Badges Overlay */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 pointer-events-none z-10">
          {product.isNewArrival && (
            <span className="px-2 py-0.5 rounded-full bg-primary text-primary-contrast text-[10px] font-bold uppercase tracking-widest shadow-2xs">
              New In
            </span>
          )}
          {hasDiscount && product.discountPercentage && (
            <span className="px-2 py-0.5 rounded-full bg-accent text-primary-contrast text-[10px] font-bold uppercase tracking-wider shadow-2xs">
              {product.discountPercentage}% Off
            </span>
          )}
          {product.tag && (
            <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-surface-card/90 backdrop-blur-xs text-text-main border border-border text-[9px] font-semibold tracking-wider">
              {product.tag}
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          ref={heartRef}
          type="button"
          onClick={handleWishlistToggle}
          aria-label={isWishlisted ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
          className="absolute top-2.5 right-2.5 p-2 rounded-full bg-surface-card/90 backdrop-blur-xs text-text-main hover:text-accent border border-border/80 shadow-xs transition-colors z-20 focus-ring"
        >
          <svg
            className={`w-4 h-4 transition-colors ${
              isWishlisted ? "text-error fill-error" : "text-text-main"
            }`}
            fill={isWishlisted ? "currentColor" : "none"}
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
            />
          </svg>
        </button>

        {/* Quick Size Selector Slide-up Overlay (wearthree.com style) */}
        <div
          className={`absolute inset-x-2 bottom-2 p-2 rounded-xl bg-surface-card/95 backdrop-blur-md border border-border shadow-md transition-all duration-300 z-20 ${
            isHovered
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 translate-y-4 pointer-events-none"
          }`}
        >
          {addedMessage ? (
            <div className="text-center py-1 text-xs font-semibold text-success flex items-center justify-center gap-1.5 animate-in fade-in">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Added Size {selectedSize} to Bag!</span>
            </div>
          ) : (
            <div>
              <span className="block text-[10px] uppercase font-bold text-text-subtle tracking-wider mb-1.5 text-center">
                Select Size to Add
              </span>
              <div className="flex items-center justify-center gap-1.5">
                {(product.availableSizes || ["XS", "S", "M", "L", "XL"]).map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={(e) => handleQuickAddSize(e, size)}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg border border-border text-[11px] font-semibold text-text-main hover:bg-primary hover:text-primary-contrast hover:border-primary transition-all focus-ring flex items-center justify-center"
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2. Product Information Hierarchy */}
      <div className="p-3.5 sm:p-4 flex flex-col flex-1 justify-between">
        <div>
          {/* Category & Brand Subtitle */}
          <span className="block text-[10px] uppercase tracking-widest text-text-subtle font-semibold mb-1">
            {product.categoryName}
          </span>

          {/* Product Title */}
          <h3 className="font-serif text-sm sm:text-base font-bold text-text-main line-clamp-1 group-hover:text-primary transition-colors">
            <Link href={`/product/${product.slug}`} className="focus-ring rounded">
              {product.name}
            </Link>
          </h3>

          {/* Fabric Specifier */}
          {product.fabric && (
            <p className="text-[11px] text-text-secondary mt-0.5 line-clamp-1">
              {product.fabric}
            </p>
          )}
        </div>

        {/* 3. Price & Ratings Row */}
        <div className="mt-3 pt-2.5 border-t border-border/60 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-sm sm:text-base font-serif font-bold text-primary">
              {formatPrice(displayPrice)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-text-subtle line-through">
                {formatPrice(product.regularPrice)}
              </span>
            )}
          </div>

          {/* Review Score */}
          {product.rating > 0 && (
            <div className="flex items-center gap-1 text-[11px] text-text-secondary">
              <svg className="w-3.5 h-3.5 text-accent fill-accent" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span>{product.rating.toFixed(1)}</span>
            </div>
          )}
        </div>
      </div>
    </article>
  );
};

export default ProductCard;

