/**
 * Category domain interfaces matching the backend Prisma schema and client API.
 */

export interface SubcategoryItem {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  productCount?: number;
}

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl: string;
  productCount: number;
  sortOrder?: number;
  isFeatured?: boolean;
  isNew?: boolean;
  isSale?: boolean;
  children?: SubcategoryItem[];
}

export type CategoryFilterType = "all" | "new" | "sale" | "collections";

export interface CategoryFilterOption {
  key: CategoryFilterType;
  label: string;
  badge?: string;
}

