"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { CatalogProductsResponse, CatalogFilters, ProductCardItem } from "@/lib/types/product";
import { CategoryItem } from "@/lib/types/category";
import {
  fetchProducts,
  fetchProductFilters,
  fetchLiveSearchResults,
  resolveCatalogSearch,
  toggleWishlistApi,
  addToCartApi,
} from "@/lib/api/product.api";
import { getServerAccessToken } from "@/lib/auth";

/**
 * Server action to fetch paginated products for catalog and search.
 *
 * @param {Record<string, unknown>} [params]
 * @returns {Promise<CatalogProductsResponse>}
 */
export async function getProductsAction(
  params: Record<string, unknown> = {}
): Promise<CatalogProductsResponse> {
  try {
    const token = await getServerAccessToken();
    return await fetchProducts(params, token);
  } catch (error) {
    console.error("getProductsAction error:", error);
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
 * Server action to fetch dynamic filter aggregations for search / catalog.
 *
 * @param {Record<string, unknown>} [params]
 * @returns {Promise<CatalogFilters | null>}
 */
export async function getProductFiltersAction(
  params: Record<string, unknown> = {}
): Promise<CatalogFilters | null> {
  try {
    return await fetchProductFilters(params);
  } catch (error) {
    console.error("getProductFiltersAction error:", error);
    return null;
  }
}

/**
 * Server action for live search autocomplete with matched categories & products.
 *
 * @param {string} query
 * @returns {Promise<{
 *   categories: CategoryItem[];
 *   products: ProductCardItem[];
 *   totalProducts: number;
 * }>}
 */
export async function getLiveSearchResultsAction(query: string): Promise<{
  categories: CategoryItem[];
  products: ProductCardItem[];
  totalProducts: number;
}> {
  try {
    return await fetchLiveSearchResults(query);
  } catch (error) {
    console.error("getLiveSearchResultsAction error:", error);
    return { categories: [], products: [], totalProducts: 0 };
  }
}

/**
 * Server action to toggle a product in the customer's wishlist.
 *
 * @param {string} productId
 * @returns {Promise<{ success: boolean; isWishlisted?: boolean; message?: string }>}
 */
export async function toggleWishlistAction(
  productId: string
): Promise<{ success: boolean; isWishlisted?: boolean; message?: string }> {
  try {
    const token = await getServerAccessToken();
    if (!token) {
      return {
        success: false,
        message: "Please sign in to save items to your wishlist.",
      };
    }

    const res = await toggleWishlistApi(productId, token);
    revalidatePath("/wishlist");
    revalidatePath("/account/wishlist");
    return {
      success: true,
      isWishlisted: res.isWishlisted,
      message: res.message,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to update wishlist.",
    };
  }
}

/**
 * Server action to quickly add a simple product (without variants) to the cart.
 *
 * @param {string} productId
 * @param {string|null} [variantId]
 * @param {number} [quantity=1]
 * @returns {Promise<{ success: boolean; message?: string }>}
 */
export async function addToCartAction(
  productId: string,
  variantId: string | null = null,
  quantity: number = 1
): Promise<{ success: boolean; message?: string }> {
  try {
    const token = await getServerAccessToken();
    const res = await addToCartApi({ productId, variantId, quantity }, token);
    revalidatePath("/cart");
    return {
      success: true,
      message: res.message,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to add product to bag.",
    };
  }
}

/**
 * Server action for intelligent search routing:
 * - If matches a category name or slug -> redirects to /category/[slug]
 * - If matches a single product (or exact title) -> redirects to /product/[slug]
 * - Otherwise -> redirects to /search?q=[query]
 *
 * @param {FormData} formData
 */
export async function smartSearchAction(formData: FormData): Promise<void> {
  const query = (formData.get("search") || formData.get("q") || "").toString().trim();
  if (!query) {
    redirect("/category");
  }

  const { matchedCategory, matchedProduct, totalMatches } = await resolveCatalogSearch(query);

  if (matchedCategory) {
    redirect(`/category/${matchedCategory.slug}`);
  }

  if (matchedProduct && totalMatches === 1) {
    redirect(`/product/${matchedProduct.slug}`);
  }

  redirect(`/search?q=${encodeURIComponent(query)}`);
}
