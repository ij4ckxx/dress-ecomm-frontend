import { CategoryItem } from "../types/category";

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
