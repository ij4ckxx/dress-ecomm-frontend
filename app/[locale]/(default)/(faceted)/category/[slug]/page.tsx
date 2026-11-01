import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getCategoryBySlugAction,
  getCategoryProductsAction,
  getCategoryFiltersAction,
  getCategoriesAction,
  getRecommendedCategoryProductsAction,
} from "@/app/actions/category.actions";
import { CategoryPLPView } from "@/components/category/CategoryPLPView";

interface CategoryPageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
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
      `Explore exclusive handcrafted ${category.name} featuring artisanal pure silk and heritage zari weaves.`,
  };
}

/**
 * Category PLP Page (/category/[slug]).
 * Displays category header, interactive folder hierarchy sidebar,
 * dynamic filter options, luxury product cards grid, and pagination.
 */
export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { slug } = await params;
  const rawSearchParams = await searchParams;

  // Normalize query search params for API consumption
  const queryParams: Record<string, string> = {};
  Object.entries(rawSearchParams).forEach(([k, v]) => {
    if (typeof v === "string" && v) {
      queryParams[k] = v;
    } else if (Array.isArray(v) && v.length > 0) {
      queryParams[k] = v.join(",");
    }
  });

  // Parallel data fetching: products, filters, and full categories tree
  const [productData, filters, categoriesTree] = await Promise.all([
    getCategoryProductsAction(slug, queryParams),
    getCategoryFiltersAction(slug, queryParams),
    getCategoriesAction({ tree: true }),
  ]);

  // If the category does not exist and no products returned
  if (!productData.category && productData.products.length === 0) {
    // Attempt to verify if slug is valid category
    const cat = await getCategoryBySlugAction(slug);
    if (!cat) {
      return (
        <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-4">
          <h1 className="font-serif text-3xl font-bold text-text-main">
            Collection Not Found
          </h1>
          <p className="text-sm text-text-subtle max-w-md mx-auto">
            The collection &ldquo;{slug}&rdquo; could not be found in our current directory.
          </p>
          <div className="pt-4">
            <Link
              href="/category"
              className="inline-flex items-center px-6 py-2.5 rounded-lg bg-primary text-primary-contrast text-xs font-semibold uppercase tracking-wider hover:bg-primary-hover transition-colors"
            >
              Browse All Categories
            </Link>
          </div>
        </div>
      );
    }
  }

  const activeCategory = productData.category;
  const categoryTitle = activeCategory?.name || slug.replace(/-/g, " ");
  const categoryDescription = activeCategory?.description || null;
  const bannerImage = activeCategory?.imageUrl || null;
  const parentCategory = activeCategory?.parent || null;

  // Retrieve curated recommendations excluding currently visible product IDs
  const visibleProductIds = productData.products.map((p) => p.id);
  const recommendedProducts = await getRecommendedCategoryProductsAction(
    slug,
    visibleProductIds,
    4
  );

  return (
    <CategoryPLPView
      title={categoryTitle}
      description={categoryDescription}
      bannerImage={bannerImage}
      products={productData.products}
      pagination={productData.pagination}
      filters={filters}
      categoriesTree={categoriesTree}
      activeSlug={slug}
      parentCategory={parentCategory}
      recommendedProducts={recommendedProducts}
    />
  );
}
