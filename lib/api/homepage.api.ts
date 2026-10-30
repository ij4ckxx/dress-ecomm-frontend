import {
  HomepageData,
  HomepageProduct,
  CategoryPill,
} from "../types/homepage";
import {
  MOCK_HERO_SLIDES,
  MOCK_LOOKBOOK_ENSEMBLE,
  MOCK_PRESS_QUOTES,
  MOCK_JOURNAL_ARTICLES,
  MOCK_INSTAGRAM_FEED,
} from "../data/homepage-mock";

/**
 * Resolves the backend API base URL with fallback to local development server.
 */
export const getHomepageBackendUrl = (): string => {
  return (
    process.env.INTERNAL_BACKEND_URL ||
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    process.env.AUTH_API_BASE_URL ||
    "http://localhost:5000/api/v1"
  );
};

interface BackendCategory {
  id: string;
  name: string;
  slug: string;
  imageUrl?: string | null;
  productCount?: number;
}

interface BackendProduct {
  id: string;
  name: string;
  slug: string;
  brand?: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  thumbnail?: string;
  secondaryImage?: string;
  price?: {
    regular: number;
    sale?: number | null;
    effective: number;
    discountPercentage?: number;
  };
  rating?: number;
  reviewCount?: number;
  isNewArrival?: boolean;
  isBestseller?: boolean;
}

/**
 * Fetches homepage data directly from the backend API.
 * Uses zero static fallback products or categories.
 *
 * @returns {Promise<HomepageData>}
 */
export async function getHomepageData(): Promise<HomepageData> {
  const baseUrl = getHomepageBackendUrl();

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const [categoriesRes, productsRes] = await Promise.all([
      fetch(`${baseUrl}/categories`, {
        signal: controller.signal,
        next: { revalidate: 120 },
      }).catch(() => null),
      fetch(`${baseUrl}/products?limit=12`, {
        signal: controller.signal,
        next: { revalidate: 120 },
      }).catch(() => null),
    ]);

    clearTimeout(timeoutId);

    let categoryPills: CategoryPill[] = [];
    let featuredProducts: HomepageProduct[] = [];

    // Map Categories from live backend API
    if (categoriesRes && categoriesRes.ok) {
      const catJson = await categoriesRes.json();
      if (catJson?.success && Array.isArray(catJson.data)) {
        categoryPills = catJson.data
          .filter((cat: BackendCategory) => cat.imageUrl)
          .slice(0, 6)
          .map((cat: BackendCategory) => ({
            id: cat.id,
            name: cat.name.replace("Traditional ", "").replace("Exclusive ", ""),
            slug: cat.slug,
            imageUrl: cat.imageUrl || "",
            productCount: cat.productCount || 0,
            badge: cat.name.includes("Saree")
              ? "Handloom"
              : cat.name.includes("Lehenga")
              ? "Heirloom"
              : "Runway",
          }));
      }
    }

    // Map Products from live backend API
    if (productsRes && productsRes.ok) {
      const prodJson = await productsRes.json();
      const rawProducts: BackendProduct[] =
        prodJson?.data?.products || prodJson?.data || [];
      if (Array.isArray(rawProducts)) {
        featuredProducts = rawProducts.map((p, idx) => ({
          id: p.id,
          name: p.name,
          slug: p.slug,
          brand: p.brand || "Saayal Stories",
          categoryName: p.category?.name || "Haute Couture",
          categorySlug: p.category?.slug || "womens-couture",
          thumbnail: p.thumbnail || "",
          secondaryImage: p.secondaryImage || "",
          regularPrice: p.price?.regular || 0,
          salePrice: p.price?.sale || null,
          discountPercentage: p.price?.discountPercentage || 0,
          rating: p.rating || 5.0,
          reviewCount: p.reviewCount || 0,
          fabric: "Handcrafted Pure Silk",
          tag: idx % 2 === 0 ? "SilkMark Certified" : "Runway Edit",
          availableSizes: ["XS", "S", "M", "L", "XL"],
          isNewArrival: Boolean(p.isNewArrival ?? idx < 4),
          isBestseller: Boolean(p.isBestseller ?? idx >= 4),
        }));
      }
    }

    const bestsellers = featuredProducts
      .filter((p) => p.isBestseller || p.rating >= 4.9)
      .slice(0, 6);

    return {
      heroSlides: MOCK_HERO_SLIDES,
      categoryPills,
      featuredProducts,
      bestsellers,
      lookbook: MOCK_LOOKBOOK_ENSEMBLE,
      pressQuotes: MOCK_PRESS_QUOTES,
      journalArticles: MOCK_JOURNAL_ARTICLES,
      instagramFeed: MOCK_INSTAGRAM_FEED,
    };
  } catch (error) {
    console.error("Failed to fetch live homepage data from backend:", error);
    return {
      heroSlides: MOCK_HERO_SLIDES,
      categoryPills: [],
      featuredProducts: [],
      bestsellers: [],
      lookbook: MOCK_LOOKBOOK_ENSEMBLE,
      pressQuotes: MOCK_PRESS_QUOTES,
      journalArticles: MOCK_JOURNAL_ARTICLES,
      instagramFeed: MOCK_INSTAGRAM_FEED,
    };
  }
}
