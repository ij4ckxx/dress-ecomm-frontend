"use server";

import { CategoryItem, CategoryFilterType } from "@/lib/types/category";
import {
  CatalogProductsResponse,
  CatalogFilters,
  ProductCardItem,
} from "@/lib/types/product";
import {
  fetchCategories,
  fetchCategoryBySlug,
  fetchCategoryProducts,
  fetchCategoryFilters,
} from "@/lib/api/category.api";
import { fetchProducts } from "@/lib/api/product.api";
import { getServerAccessToken } from "@/lib/auth";

/**
 * Server action to retrieve categories from the backend service.
 * Supports hierarchical tree or flat list representation.
 *
 * @param {object} [options]
 * @param {boolean} [options.tree=true] - Whether to return parent-child tree hierarchy
 * @param {boolean} [options.rootOnly=false] - Whether to return only root-level categories
 * @returns {Promise<CategoryItem[]>}
 */
export async function getCategoriesAction(
  options: { tree?: boolean; rootOnly?: boolean } = { tree: true, rootOnly: false }
): Promise<CategoryItem[]> {
  try {
    return await fetchCategories(options);
  } catch (error) {
    console.error("getCategoriesAction encountered an error:", error);
    return [];
  }
}

/**
 * Server action to retrieve a specific category by its unique URL slug.
 *
 * @param {string} slug - Unique category slug
 * @returns {Promise<CategoryItem | null>}
 */
export async function getCategoryBySlugAction(
  slug: string
): Promise<CategoryItem | null> {
  if (!slug) return null;

  try {
    return await fetchCategoryBySlug(slug);
  } catch (error) {
    console.error(`getCategoryBySlugAction error for slug "${slug}":`, error);
    return null;
  }
}

/**
 * Server action to filter categories dynamically based on promotional and collection criteria.
 *
 * @param {CategoryFilterType} filter - Selected filter key
 * @returns {Promise<CategoryItem[]>}
 */
export async function getFilteredCategoriesAction(
  filter: CategoryFilterType = "all"
): Promise<CategoryItem[]> {
  try {
    const allCategories = await fetchCategories({ tree: true });

    if (filter === "new") {
      return allCategories.filter((cat) => cat.isNew);
    }

    if (filter === "sale") {
      return allCategories.filter((cat) => cat.isSale);
    }

    if (filter === "collections") {
      return allCategories.filter(
        (cat) => Array.isArray(cat.children) && cat.children.length > 0
      );
    }

    return allCategories;
  } catch (error) {
    console.error(`getFilteredCategoriesAction error for filter "${filter}":`, error);
    return [];
  }
}

/**
 * Server action to fetch paginated products for a category PLP.
 *
 * @param {string} slug
 * @param {Record<string, unknown>} [params]
 * @returns {Promise<CatalogProductsResponse>}
 */
export async function getCategoryProductsAction(
  slug: string,
  params: Record<string, unknown> = {}
): Promise<CatalogProductsResponse> {
  try {
    const token = await getServerAccessToken();
    return await fetchCategoryProducts(slug, params, token);
  } catch (error) {
    console.error(`getCategoryProductsAction error for "${slug}":`, error);
    return {
      products: [],
      pagination: {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    };
  }
}

/**
 * Server action to fetch dynamic filter aggregations for a category.
 *
 * @param {string} slug
 * @param {Record<string, unknown>} [params]
 * @returns {Promise<CatalogFilters | null>}
 */
export async function getCategoryFiltersAction(
  slug: string,
  params: Record<string, unknown> = {}
): Promise<CatalogFilters | null> {
  try {
    return await fetchCategoryFilters(slug, params);
  } catch (error) {
    console.error(`getCategoryFiltersAction error for "${slug}":`, error);
    return null;
  }
}

/**
 * Server action to fetch curated recommended products for a category page.
 * Combines category featured/bestsellers with boutique highlights,
 * strictly excluding any product IDs currently visible on the page.
 *
 * @param {string} [categorySlug] - The category slug being viewed
 * @param {string[]} [excludeIds=[]] - IDs of products already rendered in main grid
 * @param {number} [limit=4] - Target count of recommendations
 * @returns {Promise<ProductCardItem[]>}
 */
export async function getRecommendedCategoryProductsAction(
  categorySlug?: string,
  excludeIds: string[] = [],
  limit: number = 4
): Promise<ProductCardItem[]> {
  try {
    const token = await getServerAccessToken();
    const excludeSet = new Set(excludeIds);
    const recommended: ProductCardItem[] = [];

    // 1. Fetch bestselling/featured products from current category if provided
    if (categorySlug) {
      const catProducts = await fetchProducts(
        { category: categorySlug, sort: "bestselling", limit: 8 },
        token
      );
      for (const p of catProducts.products || []) {
        if (!excludeSet.has(p.id) && !recommended.some((r) => r.id === p.id)) {
          recommended.push(p);
        }
        if (recommended.length >= limit) break;
      }
    }

    // 2. Supplement with featured luxury boutique products if needed
    if (recommended.length < limit) {
      const featured = await fetchProducts(
        { isFeatured: "true", limit: 8 },
        token
      );
      for (const p of featured.products || []) {
        if (!excludeSet.has(p.id) && !recommended.some((r) => r.id === p.id)) {
          recommended.push(p);
        }
        if (recommended.length >= limit) break;
      }
    }

    // 3. Fallback to newest boutique products if category & featured have limited items
    if (recommended.length < limit) {
      const newest = await fetchProducts(
        { sort: "newest", limit: 8 },
        token
      );
      for (const p of newest.products || []) {
        if (!excludeSet.has(p.id) && !recommended.some((r) => r.id === p.id)) {
          recommended.push(p);
        }
        if (recommended.length >= limit) break;
      }
    }

    return recommended.slice(0, limit);
  } catch (error) {
    console.error("getRecommendedCategoryProductsAction error:", error);
    return [];
  }
}
