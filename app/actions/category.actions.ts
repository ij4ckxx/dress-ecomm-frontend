"use server";

import { CategoryItem, CategoryFilterType } from "@/lib/types/category";
import { fetchCategories, fetchCategoryBySlug } from "@/lib/api/category.api";

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
 * Supports:
 * - "all": Returns all top-level categories.
 * - "new": Returns categories featuring new season designs.
 * - "sale": Returns categories with curated promotional/sale items.
 * - "collections": Returns rich multi-tiered categories with subcategory capsules.
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

