import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getCategoriesAction } from "@/app/actions/category.actions";
import { CategoryFolderTree } from "@/components/category/CategoryFolderTree";

export const metadata: Metadata = {
  title: "All Categories & Collections | Haute Maison",
  description:
    "Browse our complete luxury fashion directory organized by heritage weaves, artisan capsules, and seasonal collections.",
};

interface CategoryDirectoryPageProps {
  params: Promise<{
    locale: string;
  }>;
}

/**
 * Category Directory Landing Page (/category).
 * Shows an interactive folder structure directory of all collections and subcategories,
 * alongside visual department cards for high-fashion browsing.
 */
export default async function CategoryDirectoryPage({
  params,
}: CategoryDirectoryPageProps) {
  const { locale } = await params;
  const categories = await getCategoriesAction({ tree: true });

  const totalProducts = categories.reduce(
    (sum, cat) => sum + (cat.productCount || 0),
    0
  );

  return (
    <div className="w-full bg-background min-h-screen py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* 1. Directory Header */}
        <div className="border-b border-border pb-6">
          <nav aria-label="Breadcrumb" className="text-xs text-text-subtle mb-3">
            <ol className="flex items-center gap-2">
              <li>
                <Link href="/" className="hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>/</li>
              <li className="text-text-main font-medium">Categories Directory</li>
            </ol>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <span className="text-[11px] font-sans uppercase tracking-[0.25em] text-accent font-semibold block mb-1">
                Storefront Catalog
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-text-main tracking-tight">
                Collections &amp; Departments
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-text-subtle max-w-md font-sans">
              Explore {totalProducts.toLocaleString()} artisanal pieces curated across{" "}
              {categories.length} core ateliers. Navigate via the folder tree or explore department capsules below.
            </p>
          </div>
        </div>

        {/* 2. Main Layout: Interactive Tree Sidebar + Department Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Interactive Folder Tree Directory */}
          <section
            aria-label="Interactive Category Hierarchy"
            className="lg:col-span-4 bg-surface-card border border-border/80 rounded-2xl p-6 shadow-xs sticky top-28"
          >
            <div className="flex items-center justify-between pb-4 border-b border-border mb-4">
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-accent"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776"
                  />
                </svg>
                <h2 className="font-serif text-lg font-bold text-text-main">
                  Folder Directory
                </h2>
              </div>
              <span className="text-xs text-text-subtle font-mono">
                {categories.length} folders
              </span>
            </div>

            <p className="text-xs text-text-subtle mb-4">
              Click any folder to expand subcategories, or select a category to view products.
            </p>

            <CategoryFolderTree categories={categories} />
          </section>

          {/* Right Column: Visual Department Cards */}
          <section
            aria-label="Department Visual Cards"
            className="lg:col-span-8 space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {categories.map((cat) => (
                <article
                  key={cat.id}
                  className="group bg-surface-card border border-border/80 hover:border-border rounded-2xl overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col"
                >
                  {/* Category Cover Image */}
                  <div className="relative h-48 w-full bg-surface-soft overflow-hidden">
                    {cat.imageUrl ? (
                      <Image
                        src={cat.imageUrl}
                        alt={cat.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-text-subtle text-xs">
                        No Preview
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    
                    {/* Badge */}
                    <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
                      <span className="text-[11px] font-mono uppercase tracking-wider font-semibold bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full">
                        {cat.productCount} Designs
                      </span>
                    </div>
                  </div>

                  {/* Category Details */}
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-serif text-xl font-bold text-text-main group-hover:text-primary transition-colors">
                      <Link href={`/category/${cat.slug}`} className="focus-ring">
                        {cat.name}
                      </Link>
                    </h3>

                    {cat.description && (
                      <p className="text-xs text-text-subtle line-clamp-2 mt-1 mb-3">
                        {cat.description}
                      </p>
                    )}

                    {/* Subcategories List */}
                    {Array.isArray(cat.children) && cat.children.length > 0 && (
                      <div className="mt-auto pt-3 border-t border-border/60">
                        <span className="text-[10px] uppercase tracking-wider font-bold text-text-subtle block mb-1.5">
                          Sub-capsules:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {cat.children.map((sub) => (
                            <Link
                              key={sub.id}
                              href={`/category/${sub.slug}`}
                              className="text-xs px-2.5 py-1 rounded-md bg-surface-soft hover:bg-primary hover:text-primary-contrast transition-colors text-text-secondary font-medium"
                            >
                              {sub.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action Link */}
                    <div className="mt-4 pt-3">
                      <Link
                        href={`/category/${cat.slug}`}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary-hover uppercase tracking-wider group-hover:translate-x-0.5 transition-transform"
                      >
                        <span>Explore {cat.name}</span>
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

