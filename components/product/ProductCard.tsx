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
 * Luxury Product Card inspired by Three Clothing (wearthree.com)
 * Features borderless 3:4 portrait fashion photography, dual-image crossfade,
 * minimalist wishlist toggle, slide-up quick size selector, and clean editorial typography.
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
      className="group flex flex-col relative bg-transparent"
    >
      {/* 1. 3:4 Portrait Image Container with Dual Image Hover Crossfade */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-surface-soft">
        <Link
          href={`/product/${product.slug}`}
          className="block w-full h-full relative focus-ring"
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

        {/* Minimalist Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 pointer-events-none z-10">
          {product.isNewArrival && (
            <span className="px-2 py-0.5 bg-primary text-primary-contrast text-[9px] font-sans uppercase tracking-[0.2em] font-medium">
              New In
            </span>
          )}
          {hasDiscount && product.discountPercentage && (
            <span className="px-2 py-0.5 bg-accent text-primary-contrast text-[9px] font-sans uppercase tracking-[0.18em] font-medium">
              {product.discountPercentage}% Off
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          ref={heartRef}
          type="button"
          onClick={handleWishlistToggle}
          aria-label={isWishlisted ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 hover:bg-white text-text-main hover:text-accent shadow-2xs transition-colors z-20 focus-ring"
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
              strokeWidth={1.25}
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
            />
          </svg>
        </button>

        {/* Quick Size Selector Slide-up Drawer */}
        <div
          className={`absolute inset-x-0 bottom-0 py-2.5 px-3 bg-white/95 backdrop-blur-sm border-t border-border/60 transition-all duration-300 z-20 ${
            isHovered
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 translate-y-2 pointer-events-none"
          }`}
        >
          {addedMessage ? (
            <div className="text-center py-0.5 text-xs font-sans font-medium text-primary flex items-center justify-center gap-1.5 animate-in fade-in">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Added Size {selectedSize} to Bag</span>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-1">
              <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-text-subtle font-medium">
                Quick Add:
              </span>
              <div className="flex items-center gap-1">
                {(product.availableSizes || ["XS", "S", "M", "L", "XL"]).map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={(e) => handleQuickAddSize(e, size)}
                    className="w-6 h-6 rounded-xs border border-border text-[10px] font-sans font-medium text-text-main hover:bg-primary hover:text-white hover:border-primary transition-colors flex items-center justify-center"
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
      <div className="pt-3 pb-2 flex flex-col flex-1">
        {/* Category & Collection Tag */}
        <span className="block text-[10px] font-sans uppercase tracking-[0.25em] text-text-subtle font-medium mb-1">
          {product.categoryName}
        </span>

        {/* Product Title in Cormorant Garamond */}
        <h3 className="font-serif text-sm sm:text-base font-normal text-text-main line-clamp-1 group-hover:text-primary transition-colors">
          <Link href={`/product/${product.slug}`} className="focus-ring">
            {product.name}
          </Link>
        </h3>

        {/* Price Row */}
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-xs sm:text-sm font-sans tracking-wide font-medium text-text-main">
            {formatPrice(displayPrice)}
          </span>
          {hasDiscount && (
            <span className="text-xs font-sans text-text-subtle line-through">
              {formatPrice(product.regularPrice)}
            </span>
          )}
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
