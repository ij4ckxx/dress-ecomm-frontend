"use client";

import React, { useState, useRef, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ProductCardItem } from "@/lib/types/product";
import { toggleWishlistAction, addToCartAction } from "@/app/actions/product.actions";

interface CategoryProductCardProps {
  product: ProductCardItem;
  priority?: boolean;
}

/**
 * Maps known color slugs to CSS hex values for visual swatch dots.
 */
const COLOR_HEX_MAP: Record<string, string> = {
  "midnight-black": "#111111",
  "black": "#111111",
  "powder-pink": "#FAD2E1",
  "pink": "#F4A6CD",
  "champagne-gold": "#E5D3B3",
  "gold": "#D4AF37",
  "crimson-red": "#9B111E",
  "red": "#C8102E",
  "emerald-green": "#046307",
  "green": "#1B4D3E",
  "burgundy-wine": "#58111A",
  "peacock-navy-blue": "#0A2342",
  "navy": "#000080",
  "blue": "#1D4ED8",
  "ivory-white": "#FDFBF7",
  "white": "#FFFFFF",
  "mustard-ochre": "#D4A017",
  "sage-mint": "#9CAF88",
  "bronze": "#8C6239",
  "silver": "#C0C0C0",
};

/**
 * Formats Indian Rupee currency standard (e.g., ₹25,000)
 */
const formatPrice = (amount: number): string => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Pure dynamic Category Product Card.
 * Displays only authentic data returned from the database:
 * - Product imagery with hover crossfade
 * - Instant wishlist heart toggle with GSAP pop animation
 * - Genuine variant color swatches
 * - Genuine brand, title, and pricing
 * - Genuine rating/reviews (only if present in backend)
 * - Dynamic Action: "Select Options" for variant/modifier products, "Add to Bag" for simple products.
 */
export const CategoryProductCard: React.FC<CategoryProductCardProps> = ({
  product,
  priority = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(product.isWishlisted);
  const [selectedColor, setSelectedColor] = useState<string | null>(
    product.colors?.[0]?.slug || null
  );
  const [addedStatus, setAddedStatus] = useState<"idle" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState<string>("");

  const [isWishlistPending, startWishlistTransition] = useTransition();
  const [isCartPending, startCartTransition] = useTransition();

  const heartRef = useRef<HTMLButtonElement>(null);
  const cardRef = useRef<HTMLElement>(null);

  /**
   * Handle Wishlist toggle with optimistic UI and GSAP spring bounce
   */
  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const previousState = isWishlisted;
    setIsWishlisted(!previousState);

    if (heartRef.current) {
      gsap.fromTo(
        heartRef.current,
        { scale: 0.8 },
        { scale: 1.3, duration: 0.28, ease: "back.out(2.5)", yoyo: true, repeat: 1 }
      );
    }

    startWishlistTransition(async () => {
      const res = await toggleWishlistAction(product.id);
      if (!res.success) {
        setIsWishlisted(previousState);
        alert(res.message || "Failed to update wishlist");
      }
    });
  };

  /**
   * Quick Add to Cart for simple products without variants/modifiers
   */
  const handleQuickAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    startCartTransition(async () => {
      const res = await addToCartAction(product.id, null, 1);
      if (res.success) {
        setAddedStatus("success");
        setStatusMessage("Added to Bag");
        setTimeout(() => setAddedStatus("idle"), 2500);
      } else {
        setAddedStatus("error");
        setStatusMessage(res.message || "Failed to add");
        setTimeout(() => setAddedStatus("idle"), 3000);
      }
    });
  };

  const hasDiscount =
    product.price.discountPercentage > 0 &&
    product.price.regular > product.price.effective;

  const displayColors = product.colors || [];
  const maxSwatches = 4;
  const visibleColors = displayColors.slice(0, maxSwatches);
  const extraColorCount = Math.max(0, displayColors.length - maxSwatches);

  const hasRating =
    typeof product.rating === "number" && product.rating > 0;
  const hasReviews =
    typeof product.reviewCount === "number" && product.reviewCount > 0;

  return (
    <article
      ref={cardRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group flex flex-col bg-surface-card border border-border/80 hover:border-border rounded-xl p-3.5 transition-all duration-300 hover:shadow-lg relative overflow-hidden"
    >
      {/* 1. Card Top Bar: Only genuine discount badge */}
      {hasDiscount && (
        <div className="flex items-center justify-end pb-1.5 text-xs">
          <span className="px-1.5 py-0.5 rounded-sm bg-accent/10 text-accent font-sans text-[10px] font-bold tracking-tight">
            Save {product.price.discountPercentage}%
          </span>
        </div>
      )}

      {/* 2. Product Visual Container with Image Hover Animation & Wishlist Button */}
      <div className="relative aspect-[3/4] w-full bg-surface-soft rounded-lg overflow-hidden my-1">
        <Link
          href={`/product/${product.slug}`}
          className="block w-full h-full relative focus-ring"
          aria-label={`View product details for ${product.name}`}
        >
          {/* Primary Product Photo */}
          {product.thumbnail ? (
            <Image
              src={product.thumbnail}
              alt={product.name}
              fill
              priority={priority}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className={`object-cover object-center transition-all duration-700 ease-out ${
                isHovered && product.secondaryImage
                  ? "opacity-0 scale-105"
                  : "opacity-100 scale-100 group-hover:scale-105"
              }`}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-text-subtle text-xs">
              No Preview
            </div>
          )}

          {/* Secondary Photo (Crossfade Angle) */}
          {product.secondaryImage && (
            <Image
              src={product.secondaryImage}
              alt={`${product.name} - Alternate view`}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className={`object-cover object-center transition-all duration-700 ease-out absolute inset-0 ${
                isHovered ? "opacity-100 scale-105" : "opacity-0 scale-100"
              }`}
            />
          )}
        </Link>

        {/* Floating Wishlist Heart Icon */}
        <button
          ref={heartRef}
          type="button"
          onClick={handleWishlistToggle}
          disabled={isWishlistPending}
          aria-label={
            isWishlisted
              ? `Remove ${product.name} from wishlist`
              : `Save ${product.name} to wishlist`
          }
          className={`absolute bottom-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md shadow-xs transition-all duration-200 z-10 focus-ring ${
            isWishlisted
              ? "bg-white text-error"
              : "bg-white/85 hover:bg-white text-text-subtle hover:text-text-main"
          }`}
        >
          <svg
            className={`w-4 h-4 transition-colors ${
              isWishlisted ? "fill-error text-error" : "fill-none"
            }`}
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.75}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
            />
          </svg>
        </button>
      </div>

      {/* 3. Color Swatch Dots (Render only if colors actually exist in backend) */}
      {visibleColors.length > 0 && (
        <div className="pt-2 pb-1 flex items-center gap-1.5 min-h-[24px]">
          {visibleColors.map((color) => {
            const hex = COLOR_HEX_MAP[color.slug] || "#CCCCCC";
            const isSelected = selectedColor === color.slug;

            return (
              <button
                key={color.slug}
                type="button"
                onClick={() => setSelectedColor(color.slug)}
                title={color.name}
                aria-label={`Select color ${color.name}`}
                className={`w-3.5 h-3.5 rounded-full border transition-all duration-200 relative ${
                  isSelected
                    ? "ring-2 ring-primary ring-offset-1 scale-110 border-white"
                    : "border-border/80 hover:scale-105"
                }`}
                style={{ backgroundColor: hex }}
              />
            );
          })}
          {extraColorCount > 0 && (
            <span className="text-[10px] text-text-subtle font-mono font-medium ml-1">
              +{extraColorCount}
            </span>
          )}
        </div>
      )}

      {/* 4. Brand Name & Product Title */}
      <div className="flex flex-col flex-1 pt-1">
        {product.brand && (
          <span className="text-[11px] font-sans font-semibold uppercase tracking-wider text-text-subtle line-clamp-1 mb-0.5">
            {product.brand}
          </span>
        )}

        <h3 className="font-serif text-sm font-medium text-text-main line-clamp-2 leading-snug group-hover:text-primary transition-colors mb-2">
          <Link href={`/product/${product.slug}`} className="focus-ring">
            {product.name}
          </Link>
        </h3>

        {/* 5. Pricing Row */}
        <div className="mt-auto pt-1 flex items-baseline gap-2">
          <span className="text-sm sm:text-base font-bold font-sans text-text-main tracking-tight">
            {formatPrice(product.price.effective)}
          </span>
          {hasDiscount && (
            <span className="text-xs font-sans text-text-subtle line-through">
              {formatPrice(product.price.regular)}
            </span>
          )}
          {hasDiscount && (
            <span className="text-xs font-sans font-semibold text-accent">
              Save {product.price.discountPercentage}%
            </span>
          )}
        </div>

        {/* 6. Ratings & Reviews (Only shown if genuinely present from backend) */}
        {hasRating && (
          <div className="pt-1.5 flex items-center gap-1 text-[11px] text-text-subtle">
            <span className="text-accent text-xs">★</span>
            <span className="font-medium text-text-main">
              {product.rating!.toFixed(1)}
            </span>
            {hasReviews && (
              <span className="text-text-subtle/80">
                ({product.reviewCount})
              </span>
            )}
          </div>
        )}

        {/* 7. Action Button (Select Options vs Add to Cart) */}
        <div className="pt-3 mt-1">
          {product.requiresConfiguration ? (
            <Link
              href={`/product/${product.slug}`}
              className="w-full py-2 px-3 rounded-lg border border-primary text-primary hover:bg-primary hover:text-primary-contrast transition-all duration-200 text-xs font-semibold uppercase tracking-wider text-center flex items-center justify-center gap-1.5 focus-ring"
            >
              <span>Select Options</span>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ) : (
            <button
              type="button"
              onClick={handleQuickAddToCart}
              disabled={isCartPending}
              className={`w-full py-2 px-3 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-1.5 focus-ring ${
                addedStatus === "success"
                  ? "bg-success text-white"
                  : addedStatus === "error"
                  ? "bg-error text-white"
                  : "bg-primary text-primary-contrast hover:bg-primary-hover active:scale-[0.98]"
              }`}
            >
              {isCartPending ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : addedStatus === "success" ? (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{statusMessage}</span>
                </>
              ) : addedStatus === "error" ? (
                <span>{statusMessage}</span>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Add to Bag</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </article>
  );
};

export default CategoryProductCard;
