import { CategoryItem } from "../types/category";
import { CatalogProductsResponse, CatalogFilters } from "../types/product";

/**
 * Resolves the backend API base URL with fallback to local development server.
 */
export const getCategoryBackendUrl = (): string => {
  return (
    process.env.INTERNAL_BACKEND_URL ||
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    process.env.AUTH_API_BASE_URL ||
    "http://localhost:5000/api/v1"
  );
};

/**
 * Fetches hierarchical category tree or flat list dynamically from the backend service.
 * Returns an empty array if the endpoint is unavailable or returns no data.
 *
 * @param {object} [options]
 * @param {boolean} [options.tree=true]
 * @param {boolean} [options.rootOnly=false]
 * @returns {Promise<CategoryItem[]>}
 */
export async function fetchCategories({
  tree = true,
  rootOnly = false,
}: {
  tree?: boolean;
  rootOnly?: boolean;
} = {}): Promise<CategoryItem[]> {
  const baseUrl = getCategoryBackendUrl();
  const query = new URLSearchParams();
  if (tree) query.set("tree", "true");
  if (rootOnly) query.set("rootOnly", "true");

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(`${baseUrl}/categories?${query.toString()}`, {
      signal: controller.signal,
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      console.error(`Categories API returned error status: ${res.status}`);
      return [];
    }

    const json = await res.json();
    if (json?.success && Array.isArray(json.data)) {
      return json.data.map((cat: any) => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description || null,
        imageUrl: cat.imageUrl || "",
        productCount: cat.productCount ?? 0,
        sortOrder: cat.sortOrder ?? 0,
        isFeatured: Boolean(cat.isFeatured),
        isNew: Boolean(cat.isNew),
        isSale: Boolean(cat.isSale),
        children: Array.isArray(cat.children)
          ? cat.children.map((child: any) => ({
              id: child.id,
              name: child.name,
              slug: child.slug,
              description: child.description || null,
              imageUrl: child.imageUrl || null,
              productCount: child.productCount ?? 0,
              children: Array.isArray(child.children)
                ? child.children.map((sub: any) => ({
                    id: sub.id,
                    name: sub.name,
                    slug: sub.slug,
                    description: sub.description || null,
                    imageUrl: sub.imageUrl || null,
                    productCount: sub.productCount ?? 0,
                  }))
                : [],
            }))
          : [],
      }));
    }

    return [];
  } catch (error) {
    console.error("Failed to fetch categories from backend API:", error);
    return [];
  }
}

/**
 * Fetches category details dynamically from the backend by unique slug.
 * Returns null if not found.
 *
 * @param {string} slug
 * @returns {Promise<CategoryItem | null>}
 */
export async function fetchCategoryBySlug(slug: string): Promise<CategoryItem | null> {
  const baseUrl = getCategoryBackendUrl();

  try {
    const res = await fetch(`${baseUrl}/categories/${encodeURIComponent(slug)}`, {
      next: { revalidate: 300 },
    }).catch(() => null);

    if (res && res.ok) {
      const json = await res.json();
      if (json?.success && json.data) {
        const cat = json.data;
        return {
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
          description: cat.description || null,
          imageUrl: cat.imageUrl || "",
          productCount: cat.productCount ?? 0,
          sortOrder: cat.sortOrder ?? 0,
          isFeatured: Boolean(cat.isFeatured),
          isNew: Boolean(cat.isNew),
          isSale: Boolean(cat.isSale),
          children: Array.isArray(cat.children)
            ? cat.children.map((child: any) => ({
                id: child.id,
                name: child.name,
                slug: child.slug,
                description: child.description || null,
                imageUrl: child.imageUrl || null,
                productCount: child.productCount ?? 0,
              }))
            : [],
        };
      }
    }

    // Secondary lookup in category list if endpoint returns tree
    const allCategories = await fetchCategories({ tree: false });
    return allCategories.find((c) => c.slug === slug) || null;
  } catch (error) {
    console.error(`Failed to fetch category by slug "${slug}":`, error);
    return null;
  }
}

/**
 * Fetches paginated and filtered product cards for a category PLP.
 *
 * @param {string} slug
 * @param {Record<string, unknown>} [params]
 * @param {string|null} [accessToken=null]
 * @returns {Promise<CatalogProductsResponse>}
 */
export async function fetchCategoryProducts(
  slug: string,
  params: Record<string, unknown> = {},
  accessToken: string | null = null
): Promise<CatalogProductsResponse> {
  const baseUrl = getCategoryBackendUrl();
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, String(value));
    }
  });

  const headers: Record<string, string> = {
    Accept: "application/json",
  };
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  try {
    const res = await fetch(
      `${baseUrl}/categories/${encodeURIComponent(slug)}/products?${searchParams.toString()}`,
      {
        headers,
        cache: "no-store",
      }
    );

    if (!res.ok) {
      console.error(`Category products API returned error status: ${res.status}`);
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
      category: json.data?.category,
      products: json.data?.products || [],
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
    console.error(`fetchCategoryProducts failed for "${slug}":`, error);
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
 * Fetches dynamic sidebar filter options scoped to a category.
 *
 * @param {string} slug
 * @param {Record<string, unknown>} [params]
 * @returns {Promise<CatalogFilters | null>}
 */
export async function fetchCategoryFilters(
  slug: string,
  params: Record<string, unknown> = {}
): Promise<CatalogFilters | null> {
  const baseUrl = getCategoryBackendUrl();
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, String(value));
    }
  });

  try {
    const res = await fetch(
      `${baseUrl}/categories/${encodeURIComponent(slug)}/filters?${searchParams.toString()}`,
      {
        next: { revalidate: 120 }, // Cache filters for 2 minutes
      }
    );

    if (!res.ok) {
      console.error(`Category filters API returned error status: ${res.status}`);
      return null;
    }

    const json = await res.json();
    return json.data || null;
  } catch (error) {
    console.error(`fetchCategoryFilters failed for "${slug}":`, error);
    return null;
  }
}
