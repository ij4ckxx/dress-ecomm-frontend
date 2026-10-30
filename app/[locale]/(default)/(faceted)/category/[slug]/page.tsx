import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getCategoryBySlugAction, getCategoriesAction } from "@/app/actions/category.actions";

interface CategoryPageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

/**
 * Generate metadata for the category product listing page.
 */
export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlugAction(slug);

  if (!category) {
    return {
      title: "Category Not Found | Haute Maison",
    };
  }

  return {
    title: `${category.name} | Luxury Collection`,
    description:
      category.description ||
      `Explore exclusive handcrafted ${category.name} with artisanal pure silk and heritage zari weaves.`,
  };
}

/**
 * Category PLP (Product Listing Page) presenting category header,
 * subcategory filter navigation pills, and curated pieces.
 *
 * @param {CategoryPageProps} props
 * @returns {Promise<React.ReactElement>}
 */
export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = await getCategoryBySlugAction(slug);

  // If no category matched directly, try matching against all categories and their children
  if (!category) {
    const allCategories = await getCategoriesAction({ tree: true });
    // Check if slug is a subcategory
    let parentCategory = null;
    let subcategory = null;

    for (const cat of allCategories) {
      if (cat.children) {
        const found = cat.children.find((c) => c.slug === slug);
        if (found) {
          parentCategory = cat;
          subcategory = found;
          break;
        }
      }
    }

    if (!subcategory && !parentCategory) {
      return (
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <h1 className="font-serif text-3xl text-text-main mb-3">Collection Not Found</h1>
          <p className="text-text-secondary text-sm mb-6">
            The requested collection &ldquo;{slug}&rdquo; is currently not in our catalog.
          </p>
          <Link
            href="/collections"
            className="inline-flex items-center px-6 py-3 rounded-md bg-primary text-primary-contrast text-xs font-semibold uppercase tracking-wider hover:bg-primary-hover transition-colors"
          >
            Browse All Collections
          </Link>
        </div>
      );
    }
  }

  const currentCategory = category!;

  return (
    <div className="w-full bg-background min-h-screen pb-16">
      {/* 1. Category Editorial Hero Banner */}
      <section className="relative w-full h-72 sm:h-96 bg-surface-soft overflow-hidden border-b border-border">
        <Image
          src={currentCategory.imageUrl}
          alt={currentCategory.name}
          fill
          priority
          sizes="100vw"
          className="object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-text-main/85 via-text-main/45 to-transparent" />

        <div className="absolute inset-0 flex flex-col justify-end max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 sm:pb-12 text-white">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-surface-tint mb-3">
            <Link href="/" className="hover:underline">Home</Link>
            <span>/</span>
            <Link href="/collections" className="hover:underline">Collections</Link>
            <span>/</span>
            <span className="text-white font-medium">{currentCategory.name}</span>
          </nav>

          <div className="flex flex-wrap items-center gap-2 mb-2">
            {currentCategory.isNew && (
              <span className="px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-primary text-primary-contrast rounded-sm">
                New Season
              </span>
            )}
            {currentCategory.isSale && (
              <span className="px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-accent text-white rounded-sm">
                Special Archive
              </span>
            )}
            <span className="text-xs text-surface-tint/90">
              {currentCategory.productCount} Handcrafted Pieces
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-normal leading-tight text-white mb-2">
            {currentCategory.name}
          </h1>

          {currentCategory.description && (
            <p className="max-w-2xl text-xs sm:text-sm text-surface-tint leading-relaxed line-clamp-2">
              {currentCategory.description}
            </p>
          )}
        </div>
      </section>

      {/* 2. Subcategory Pills Navigation */}
      {currentCategory.children && currentCategory.children.length > 0 && (
        <div className="bg-surface-card border-b border-border/70 py-3.5 sticky top-16 z-30 shadow-2xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 overflow-x-auto scrollbar-none">
            <span className="text-xs font-semibold uppercase tracking-wider text-text-subtle mr-2 shrink-0">
              Subcategories:
            </span>
            <Link
              href={`/category/${currentCategory.slug}`}
              className="px-3.5 py-1.5 text-xs font-medium rounded-full bg-primary text-primary-contrast whitespace-nowrap"
            >
              All {currentCategory.name}
            </Link>
            {currentCategory.children.map((sub) => (
              <Link
                key={sub.id || sub.slug}
                href={`/category/${sub.slug}`}
                className="px-3.5 py-1.5 text-xs font-medium rounded-full bg-surface-soft hover:bg-surface-tint/25 text-text-secondary hover:text-text-main border border-border/80 whitespace-nowrap transition-colors"
              >
                {sub.name}
                {sub.productCount ? ` (${sub.productCount})` : ""}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 3. Catalog Catalog Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="flex items-center justify-between pb-6 mb-8 border-b border-border/60">
          <div>
            <h2 className="font-serif text-2xl text-text-main font-normal">
              Featured Creations
            </h2>
            <p className="text-xs text-text-secondary mt-0.5">
              Showing premium creations crafted by master artisans
            </p>
          </div>

          <Link
            href="/collections"
            className="text-xs text-primary font-medium hover:underline flex items-center gap-1"
          >
            <span>All Collections</span>
            <span>→</span>
          </Link>
        </div>

        {/* Informational Capsule Box */}
        <div className="p-8 bg-surface-soft rounded-xl border border-border/80 text-center max-w-2xl mx-auto my-12">
          <span className="text-primary text-2xl mb-2 block">✦</span>
          <h3 className="font-serif text-xl font-normal text-text-main mb-2">
            Artisanal {currentCategory.name}
          </h3>
          <p className="text-xs sm:text-[13px] text-text-secondary leading-relaxed mb-6">
            Each ensemble in our {currentCategory.name.toLowerCase()} catalog is handwoven
            using traditional pit-looms, real zari threads, and precision hand-embroidery.
            For bespoke bridal orders or custom tailoring inquiries, consult our boutique concierge.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/collections"
              className="px-5 py-2.5 rounded-md bg-primary text-primary-contrast text-xs font-semibold uppercase tracking-wider hover:bg-primary-hover transition-colors"
            >
              Explore Other Capsules
            </Link>
            <Link
              href="/products?sort=newest"
              className="px-5 py-2.5 rounded-md border border-border text-text-main text-xs font-semibold uppercase tracking-wider hover:bg-surface-card transition-colors"
            >
              View New Arrivals
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
