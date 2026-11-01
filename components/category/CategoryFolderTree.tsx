"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { CategoryItem, SubcategoryItem } from "@/lib/types/category";

interface CategoryFolderTreeProps {
  categories: CategoryItem[];
  activeSlug?: string;
  className?: string;
  compact?: boolean;
  onSelectCategory?: (slug: string) => void;
}

/**
 * Modern interactive Folder-Tree directory component.
 * Visualizes store categories and subcategories in an expandable/collapsible
 * directory tree with folder icons, branch connectors, and product count badges.
 */
export const CategoryFolderTree: React.FC<CategoryFolderTreeProps> = ({
  categories,
  activeSlug,
  className = "",
  compact = false,
  onSelectCategory,
}) => {
  // Initialize open state: expand all roots or the branch containing activeSlug
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    categories.forEach((cat) => {
      // By default open roots or if activeSlug is this root or a child
      const isCurrentActive =
        cat.slug === activeSlug ||
        cat.children?.some((child) => child.slug === activeSlug);
      initial[cat.id] = isCurrentActive || !compact;
    });
    return initial;
  });

  const toggleFolder = (catId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setOpenFolders((prev) => ({
      ...prev,
      [catId]: !prev[catId],
    }));
  };

  const handleLinkClick = (slug: string) => {
    if (onSelectCategory) {
      onSelectCategory(slug);
    }
  };

  return (
    <nav
      aria-label="Category Folder Hierarchy"
      className={`select-none font-sans ${className}`}
    >
      <ul className="space-y-1">
        {categories.map((cat) => {
          const isOpen = Boolean(openFolders[cat.id]);
          const hasChildren = Array.isArray(cat.children) && cat.children.length > 0;
          const isActive = cat.slug === activeSlug;

          return (
            <li key={cat.id} className="relative group/node">
              {/* Category Node Row */}
              <div
                className={`flex items-center justify-between rounded-lg px-2.5 py-2 transition-all duration-200 ${
                  isActive
                    ? "bg-primary text-primary-contrast font-medium shadow-xs"
                    : "text-text-main hover:bg-surface-soft hover:text-primary"
                }`}
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  {/* Expand / Collapse Chevron Button */}
                  {hasChildren ? (
                    <button
                      type="button"
                      onClick={(e) => toggleFolder(cat.id, e)}
                      aria-label={isOpen ? `Collapse ${cat.name}` : `Expand ${cat.name}`}
                      className={`p-1 rounded-sm transition-transform duration-200 ${
                        isActive
                          ? "text-primary-contrast/90 hover:bg-white/10"
                          : "text-text-subtle hover:text-text-main hover:bg-surface-card"
                      } ${isOpen ? "rotate-90" : "rotate-0"}`}
                    >
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  ) : (
                    <span className="w-5.5" />
                  )}

                  {/* Folder Icon / Category Thumbnail */}
                  <span className="shrink-0 flex items-center justify-center">
                    {cat.imageUrl && !compact ? (
                      <div className="relative w-6 h-6 rounded-md overflow-hidden bg-surface-soft border border-border/60">
                        <Image
                          src={cat.imageUrl}
                          alt={cat.name}
                          fill
                          sizes="24px"
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <svg
                        className={`w-4 h-4 ${
                          isActive
                            ? "text-primary-contrast"
                            : isOpen
                            ? "text-accent fill-accent/20"
                            : "text-text-subtle"
                        }`}
                        fill={isOpen ? "currentColor" : "none"}
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.75}
                      >
                        {isOpen ? (
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776"
                          />
                        ) : (
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-19.5 0A2.25 2.25 0 004.5 15h15a2.25 2.25 0 002.25-2.25m-19.5 0v.243a2.25 2.25 0 001.07 1.916l7.5 4.615a2.25 2.25 0 002.36 0l7.5-4.615a2.25 2.25 0 001.07-1.916V12.75"
                          />
                        )}
                      </svg>
                    )}
                  </span>

                  {/* Category Name Link */}
                  <Link
                    href={`/category/${cat.slug}`}
                    onClick={() => handleLinkClick(cat.slug)}
                    className="truncate text-xs sm:text-sm font-medium focus-ring"
                  >
                    {cat.name}
                  </Link>
                </div>

                {/* Product Count Badge */}
                <span
                  className={`text-[11px] px-2 py-0.5 rounded-full font-mono font-medium ml-2 shrink-0 ${
                    isActive
                      ? "bg-white/20 text-primary-contrast"
                      : "bg-surface-soft text-text-subtle group-hover/node:bg-surface-card"
                  }`}
                >
                  {cat.productCount}
                </span>
              </div>

              {/* Subcategories (Children Nodes) with branch line indicators */}
              {hasChildren && isOpen && (
                <ul className="ml-5 pl-3.5 my-1 border-l border-border/70 space-y-1 relative animate-in fade-in duration-200">
                  {cat.children!.map((child) => {
                    const isChildActive = child.slug === activeSlug;

                    return (
                      <li key={child.id} className="relative">
                        {/* Branch horizontal connector tick */}
                        <span className="absolute -left-3.5 top-1/2 w-3 h-px bg-border/70" />

                        <div
                          className={`flex items-center justify-between rounded-md px-2 py-1.5 transition-colors ${
                            isChildActive
                              ? "bg-primary/10 text-primary font-semibold"
                              : "text-text-secondary hover:text-primary hover:bg-surface-soft"
                          }`}
                        >
                          <Link
                            href={`/category/${child.slug}`}
                            onClick={() => handleLinkClick(child.slug)}
                            className="flex items-center gap-2 min-w-0 flex-1 truncate text-xs focus-ring"
                          >
                            <svg
                              className={`w-3.5 h-3.5 shrink-0 ${
                                isChildActive ? "text-primary" : "text-text-subtle/70"
                              }`}
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                              />
                            </svg>
                            <span className="truncate">{child.name}</span>
                          </Link>

                          {child.productCount !== undefined && (
                            <span
                              className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full shrink-0 ml-1.5 ${
                                isChildActive
                                  ? "bg-primary text-primary-contrast"
                                  : "text-text-subtle bg-surface-soft/80"
                              }`}
                            >
                              {child.productCount}
                            </span>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default CategoryFolderTree;

