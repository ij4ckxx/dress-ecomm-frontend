/**
 * Product catalog domain interfaces matching backend Prisma schema and client endpoints.
 */

export interface ProductPrice {
  regular: number;
  sale: number | null;
  offer: number | null;
  effective: number;
  discountPercentage: number;
}

export interface ProductColorSwatch {
  name: string;
  slug: string;
  hexCode?: string;
}

export interface ProductCardItem {
  id: string;
  name: string;
  slug: string;
  brand?: string | null;
  category?: {
    id: string;
    name: string;
    slug: string;
  } | null;
  thumbnail: string | null;
  secondaryImage?: string | null;
  price: ProductPrice;
  colors?: ProductColorSwatch[];
  rating?: number;
  reviewCount?: number;
  hasVariants: boolean;
  hasModifiers: boolean;
  requiresConfiguration: boolean;
  isWishlisted: boolean;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface FilterValueItem {
  id?: string;
  name: string;
  slug: string;
  count: number;
}

export interface FilterAttributeItem {
  id: string;
  name: string;
  slug: string;
  values: FilterValueItem[];
}

export interface CatalogCategoryFilterItem {
  id: string;
  name: string;
  slug: string;
  imageUrl?: string | null;
  productCount: number;
}

export interface CatalogFilters {
  totalProducts?: number;
  category?: {
    id: string;
    name: string;
    slug: string;
    description?: string | null;
  } | null;
  priceRange?: {
    min: number;
    max: number;
  };
  categories?: CatalogCategoryFilterItem[];
  brands?: {
    name: string;
    count: number;
  }[];
  attributes?: FilterAttributeItem[];
  availability?: {
    inStock: number;
    outOfStock: number;
  };
  ratings?: {
    rating: number;
    count: number;
  }[];
}

export interface CatalogProductsResponse {
  category?: {
    id: string;
    name: string;
    slug: string;
    description?: string | null;
    imageUrl?: string | null;
    parent?: {
      id: string;
      name: string;
      slug: string;
    } | null;
  };
  products: ProductCardItem[];
  pagination: PaginationMeta;
}

export type ProductSortOption =
  | "newest"
  | "price_asc"
  | "price_desc"
  | "bestselling"
  | "rating"
  | "best_deals"
  | "name_asc"
  | "name_desc";

