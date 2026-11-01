import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getProductsAction, getProductFiltersAction } from "@/app/actions/product.actions";
import {
  getCategoriesAction,
  getRecommendedCategoryProductsAction,
} from "@/app/actions/category.actions";
import { resolveCatalogSearch } from "@/lib/api/product.api";
import { CategoryPLPView } from "@/components/category/CategoryPLPView";
import { CategoryItem } from "@/lib/types/category";

interface SearchPageProps {
  params: Promise<{
    locale: string;
  }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const params = await searchParams;
  const q = (params.q || params.search || "").toString();

  return {
    title: q ? `Search results for "${q}" | Haute Maison` : "Search Catalog | Haute Maison",
    description: "Discover handcrafted luxury fashion, pure silk sarees, and occasion dresses.",
  };
}

/**
 * Intelligent Search PLP Page (/search).
 * - Checks if search term matches a Category Name or Slug -> redirects to /category/[slug]
 * - Checks if search term matches a Single Product Name or SKU -> redirects to /product/[slug]
 * - Displays matched categories in a top capsule bar
 * - Displays matching products, dynamic filter sidebar, and upgraded pagination.
 */
export default async function SearchPage({
  params,
  searchParams,
}: SearchPageProps) {
  const { locale } = await params;
  const rawSearchParams = await searchParams;

  const q = (rawSearchParams.q || rawSearchParams.search || "").toString().trim();

  // Normalize all query parameters for API consumption
  const queryParams: Record<string, string> = {};
  Object.entries(rawSearchParams).forEach(([k, v]) => {
    if (k === "q" || k === "search") return;
    if (typeof v === "string" && v) {
      queryParams[k] = v;
    } else if (Array.isArray(v) && v.length > 0) {
      queryParams[k] = v.join(",");
    }
  });

  if (q) {
    queryParams.search = q;
  }

  // Smart Search Check: If only `q` or `search` is provided (no pagination or deep filters yet),
  // inspect if query points directly to a category or single product
  const nonSearchKeys = Object.keys(queryParams).filter(
    (k) => !["q", "search"].includes(k)
  );

  if (q && nonSearchKeys.length === 0) {
    const { matchedCategory, matchedProduct, totalMatches } =
      await resolveCatalogSearch(q);

    if (matchedCategory) {
      redirect(`/category/${matchedCategory.slug}`);
    }

    if (matchedProduct && totalMatches === 1) {
      redirect(`/product/${matchedProduct.slug}`);
    }
  }

  // Parallel fetching of matching products, filters, and categories tree
  const [productData, filters, categoriesTree] = await Promise.all([
    getProductsAction(queryParams),
    getProductFiltersAction(queryParams),
    getCategoriesAction({ tree: true }),
  ]);

  // Extract matching categories from categories tree
  const matchingCategories: CategoryItem[] = [];
  if (q) {
    const qLower = q.toLowerCase();
    const seenCatIds = new Set<string>();

    categoriesTree.forEach((cat) => {
      if (
        (cat.name.toLowerCase().includes(qLower) ||
          cat.slug.toLowerCase().includes(qLower)) &&
        !seenCatIds.has(cat.id)
      ) {
        seenCatIds.add(cat.id);
        matchingCategories.push(cat);
      }

      cat.children?.forEach((child) => {
        if (
          (child.name.toLowerCase().includes(qLower) ||
            child.slug.toLowerCase().includes(qLower)) &&
          !seenCatIds.has(child.id)
        ) {
          seenCatIds.add(child.id);
          matchingCategories.push({
            id: child.id,
            name: child.name,
            slug: child.slug,
            description: child.description,
            imageUrl: child.imageUrl || cat.imageUrl,
            productCount: child.productCount ?? 0,
          });
        }
      });
    });
  }

  const searchTitle = q ? `Search: "${q}"` : "All Products";
  const searchDescription = q
    ? `Showing curated pieces matching "${q}" across our catalog.`
    : "Explore our comprehensive directory of artisanal designs.";

  const visibleProductIds = productData.products.map((p) => p.id);
  const recommendedProducts = await getRecommendedCategoryProductsAction(
    undefined,
    visibleProductIds,
    4
  );

  return (
    <CategoryPLPView
      title={searchTitle}
      description={searchDescription}
      products={productData.products}
      pagination={productData.pagination}
      filters={filters}
      categoriesTree={categoriesTree}
      activeSlug=""
      matchingCategories={matchingCategories}
      recommendedProducts={recommendedProducts}
    />
  );
}
