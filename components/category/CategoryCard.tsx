"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { CategoryItem } from "@/lib/types/category";

export interface CategoryCardProps {
  category: CategoryItem;
  priority?: boolean;
}

/**
 * Luxury editorial card presenting full category details:
 * - Real category image from backend API
 * - Category title rendered in elegant serif typography
 * - Editorial description from backend
 * - Pill chips for subcategories
 * - Product count and promotional status badges
 *
 * @param {CategoryCardProps} props
 * @returns {React.ReactElement}
 */
export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  priority = false,
}) => {
  const { name, slug, description, imageUrl, productCount, isNew, isSale, children } =
    category;

  return (
    <article className="group relative flex flex-col bg-surface-card rounded-xl overflow-hidden border border-border/80 hover:border-primary/40 shadow-xs hover:shadow-lg transition-all duration-300">
      {/* 1. Category Image Container */}
      <Link
        href={`/category/${slug}`}
        aria-label={`Explore ${name} collection`}
        className="relative w-full aspect-[4/5] overflow-hidden bg-surface-soft block"
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            priority={priority}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-surface-soft to-surface-tint/20 flex items-center justify-center">
            <span className="font-serif text-3xl font-light text-primary/40">
              {name.charAt(0)}
            </span>
          </div>
        )}

        {/* Ambient Dark Gradient for text readability at bottom of image */}
        <div className="absolute inset-0 bg-gradient-to-t from-text-main/70 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300" />

        {/* Status Badges (Top Left) */}
        <div className="absolute top-3.5 left-3.5 flex flex-wrap gap-1.5 z-10">
          {isNew && (
            <span className="px-2.5 py-1 text-[11px] font-semibold tracking-wider uppercase bg-primary text-primary-contrast rounded-sm shadow-xs">
              New Season
            </span>
          )}
          {isSale && (
            <span className="px-2.5 py-1 text-[11px] font-semibold tracking-wider uppercase bg-accent text-white rounded-sm shadow-xs">
              Special Archive
            </span>
          )}
        </div>

        {/* Piece Count Pill (Top Right) */}
        {productCount > 0 && (
          <div className="absolute top-3.5 right-3.5 z-10">
            <span className="px-2.5 py-1 text-[11px] font-medium tracking-wide bg-surface-card/90 backdrop-blur-xs text-text-main rounded-full border border-border/60 shadow-2xs">
              {productCount} {productCount === 1 ? "Piece" : "Pieces"}
            </span>
          </div>
        )}

        {/* Bottom Image Caption Overlay */}
        <div className="absolute bottom-3.5 left-4 right-4 text-white z-10">
          <p className="text-[11px] uppercase tracking-widest text-surface-tint font-medium mb-0.5">
            Haute Collection
          </p>
          <h3 className="font-serif text-xl sm:text-2xl font-normal leading-tight text-white drop-shadow-xs">
            {name}
          </h3>
        </div>
      </Link>

      {/* 2. Editorial Details & Subcategories */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between gap-4">
        {/* Description */}
        {description && (
          <p className="text-xs sm:text-[13px] text-text-secondary leading-relaxed line-clamp-2">
            {description}
          </p>
        )}

        {/* Subcategory Pills */}
        {children && children.length > 0 && (
          <div className="flex flex-col gap-1.5 pt-1 border-t border-border/50">
            <span className="text-[10px] uppercase tracking-wider text-text-subtle font-medium">
              Featured Subcategories
            </span>
            <div className="flex flex-wrap gap-1.5">
              {children.slice(0, 3).map((sub) => (
                <Link
                  key={sub.id}
                  href={`/category/${sub.slug}`}
                  className="inline-flex items-center text-[11px] font-normal text-text-secondary hover:text-primary bg-surface-soft hover:bg-surface-tint/20 px-2.5 py-1 rounded-sm border border-border/60 transition-colors"
                >
                  {sub.name}
                </Link>
              ))}
              {children.length > 3 && (
                <Link
                  href={`/category/${slug}`}
                  className="inline-flex items-center text-[11px] font-medium text-accent hover:text-accent-hover px-1 py-1"
                >
                  +{children.length - 3} more
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Explore CTA Link */}
        <div className="pt-2">
          <Link
            href={`/category/${slug}`}
            className="w-full inline-flex items-center justify-between px-4 py-2.5 text-xs font-medium uppercase tracking-wider text-primary group-hover:text-primary-contrast bg-surface-soft group-hover:bg-primary rounded-md border border-primary/20 group-hover:border-primary transition-all duration-200"
          >
            <span>Explore Collection</span>
            <svg
              className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.75}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
};
