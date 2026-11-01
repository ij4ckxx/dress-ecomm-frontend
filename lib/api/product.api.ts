import { CatalogProductsResponse, CatalogFilters, ProductCardItem } from "../types/product";
import { CategoryItem } from "../types/category";

/**
 * Resolves the backend API base URL with fallback to local development server.
 */
export const getProductBackendUrl = (): string => {
  return (
    process.env.INTERNAL_BACKEND_URL ||
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    process.env.AUTH_API_BASE_URL ||
    "http://127.0.0.1:5000/api/v1"
  );
};

/**
 * Fetches paginated and filtered product cards for catalog discovery and search.
 *
 * @param {Record<string, unknown>} [params]
 * @param {string|null} [accessToken=null]
 * @returns {Promise<CatalogProductsResponse>}
 */
export async function fetchProducts(
  params: Record<string, unknown> = {},
  accessToken: string | null = null
): Promise<CatalogProductsResponse> {
  const baseUrl = getProductBackendUrl();
  const searchParams = new URLSearchParams();
  const searchVal = params.search || params.q;

  Object.entries(params).forEach(([key, value]) => {
    if (key === "q" || key === "search") return;
    if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, String(value));
    }
  });

  if (searchVal !== undefined && searchVal !== null && searchVal !== "") {
    searchParams.set("search", String(searchVal));
  }

  const headers: Record<string, string> = {
    Accept: "application/json",
  };
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  try {
    const res = await fetch(`${baseUrl}/products?${searchParams.toString()}`, {
      headers,
      cache: "no-store",
    });

    if (!res.ok) {
      console.error(`Products API returned error status: ${res.status}`);
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

    const json = await res.json();
    return {
      products: json.data || [],
      pagination: json.pagination || {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    };
  } catch (error) {
    console.error("fetchProducts failed:", error);
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
 * Fetches dynamic sidebar filter options for search / catalog browsing.
 *
 * @param {Record<string, unknown>} [params]
 * @returns {Promise<CatalogFilters | null>}
 */
export async function fetchProductFilters(
  params: Record<string, unknown> = {}
): Promise<CatalogFilters | null> {
  const baseUrl = getProductBackendUrl();
  const searchParams = new URLSearchParams();
  const searchVal = params.search || params.q;

  Object.entries(params).forEach(([key, value]) => {
    if (key === "q" || key === "search") return;
    if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, String(value));
    }
  });

  if (searchVal !== undefined && searchVal !== null && searchVal !== "") {
    searchParams.set("search", String(searchVal));
  }

  try {
    const res = await fetch(`${baseUrl}/products/filters?${searchParams.toString()}`, {
      next: { revalidate: 120 },
    });

    if (!res.ok) {
      console.error(`Product filters API returned error status: ${res.status}`);
      return null;
    }

    const json = await res.json();
    return json.data || null;
  } catch (error) {
    console.error("fetchProductFilters failed:", error);
    return null;
  }
}

/**
 * Performs a live search query returning matched categories and products
 * for instant header autocomplete with skeleton loading states.
 *
 * @param {string} query
 * @returns {Promise<{
 *   categories: CategoryItem[];
 *   products: ProductCardItem[];
 *   totalProducts: number;
 * }>}
 */
export async function fetchLiveSearchResults(query: string): Promise<{
  categories: CategoryItem[];
  products: ProductCardItem[];
  totalProducts: number;
}> {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) {
    return { categories: [], products: [], totalProducts: 0 };
  }

  const baseUrl = getProductBackendUrl();

  try {
    const [catRes, prodRes] = await Promise.all([
      fetch(`${baseUrl}/categories?tree=false`, {
        next: { revalidate: 300 },
      }).catch(() => null),
      fetch(`${baseUrl}/products?search=${encodeURIComponent(trimmed)}&limit=6`, {
        cache: "no-store",
      }).catch(() => null),
    ]);

    let matchedCategories: CategoryItem[] = [];
    if (catRes && catRes.ok) {
      const catJson = await catRes.json();
      if (catJson?.success && Array.isArray(catJson.data)) {
        matchedCategories = catJson.data
          .filter(
            (c: any) =>
              c.name.toLowerCase().includes(trimmed) ||
              c.slug.toLowerCase().includes(trimmed) ||
              (c.description && c.description.toLowerCase().includes(trimmed))
          )
          .slice(0, 4);
      }
    }

    let matchedProducts: ProductCardItem[] = [];
    let totalProducts = 0;
    if (prodRes && prodRes.ok) {
      const prodJson = await prodRes.json();
      matchedProducts = prodJson.data || [];
      totalProducts = prodJson.pagination?.total || matchedProducts.length;
    }

    return {
      categories: matchedCategories,
      products: matchedProducts,
      totalProducts,
    };
  } catch (error) {
    console.error("fetchLiveSearchResults failed:", error);
    return { categories: [], products: [], totalProducts: 0 };
  }
}

/**
 * Performs a smart catalog resolution for search queries:
 * 1. Checks if search matches a category name or slug.
 * 2. Checks if search matches a single unique product.
 *
 * @param {string} query
 * @returns {Promise<{
 *   matchedCategory?: CategoryItem | null;
 *   matchedProduct?: ProductCardItem | null;
 *   totalMatches: number;
 * }>}
 */
export async function resolveCatalogSearch(query: string): Promise<{
  matchedCategory?: CategoryItem | null;
  matchedProduct?: ProductCardItem | null;
  totalMatches: number;
}> {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) {
    return { totalMatches: 0 };
  }

  const baseUrl = getProductBackendUrl();

  try {
    // 1. Fetch categories to check for a category name/slug match
    const catRes = await fetch(`${baseUrl}/categories?tree=false`, {
      next: { revalidate: 300 },
    }).catch(() => null);

    if (catRes && catRes.ok) {
      const catJson = await catRes.json();
      if (catJson?.success && Array.isArray(catJson.data)) {
        const exactCat = catJson.data.find(
          (c: any) =>
            c.slug.toLowerCase() === trimmed ||
            c.name.toLowerCase() === trimmed
        );
        if (exactCat) {
          return { matchedCategory: exactCat, totalMatches: 1 };
        }
      }
    }

    // 2. Check products search results
    const prodRes = await fetch(
      `${baseUrl}/products?search=${encodeURIComponent(trimmed)}&limit=2`,
      { cache: "no-store" }
    ).catch(() => null);

    if (prodRes && prodRes.ok) {
      const prodJson = await prodRes.json();
      const products: ProductCardItem[] = prodJson?.data || [];
      const total = prodJson?.pagination?.total || products.length;

      // If exactly 1 product matched, or the top result matches exact name/slug
      if (products.length === 1 && total === 1) {
        return { matchedProduct: products[0], totalMatches: 1 };
      }

      if (
        products.length > 0 &&
        (products[0].name.toLowerCase() === trimmed ||
          products[0].slug.toLowerCase() === trimmed)
      ) {
        return { matchedProduct: products[0], totalMatches: total };
      }

      return { totalMatches: total };
    }

    return { totalMatches: 0 };
  } catch (error) {
    console.error("resolveCatalogSearch failed:", error);
    return { totalMatches: 0 };
  }
}

/**
 * Toggles a product in the customer wishlist.
 *
 * @param {string} productId
 * @param {string} accessToken
 * @returns {Promise<{ isWishlisted: boolean; message: string }>}
 */
export async function toggleWishlistApi(
  productId: string,
  accessToken: string
): Promise<{ isWishlisted: boolean; message: string }> {
  const baseUrl = getProductBackendUrl();

  const res = await fetch(`${baseUrl}/wishlist/toggle`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ productId }),
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || "Failed to update wishlist");
  }

  return {
    isWishlisted: Boolean(json.data?.inWishlist ?? json.data?.action === "added"),
    message: json.message || "Wishlist updated",
  };
}

/**
 * Adds an item to the active customer or guest cart.
 *
 * @param {object} item
 * @param {string} item.productId
 * @param {string|null} [item.variantId]
 * @param {number} [item.quantity=1]
 * @param {string|null} [accessToken=null]
 * @returns {Promise<{ success: boolean; message: string }>}
 */
export async function addToCartApi(
  item: { productId: string; variantId?: string | null; quantity?: number },
  accessToken: string | null = null
): Promise<{ success: boolean; message: string }> {
  const baseUrl = getProductBackendUrl();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  const res = await fetch(`${baseUrl}/cart/items`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      productId: item.productId,
      variantId: item.variantId || undefined,
      quantity: item.quantity ?? 1,
    }),
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || "Failed to add item to bag");
  }

  return {
    success: true,
    message: json.message || "Added to shopping bag",
  };
}
