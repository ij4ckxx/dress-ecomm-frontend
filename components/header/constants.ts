import { HighlightItem } from "./types";

/**
 * Promotional highlight links displayed on the right side of the sub-navigation.
 */
export const NAV_HIGHLIGHTS: HighlightItem[] = [
  { label: "New", href: "/products?sort=newest" },
  { label: "Sale", href: "/products?sort=best_deals", isSale: true },
  { label: "Editorial", href: "/editorial" },
  { label: "Our Collections", href: "/collections" },
];

/**
 * Quick search popular keywords suggested to users.
 */
export const POPULAR_SEARCH_TERMS = [
  "Kanjivaram Silk",
  "Velvet Lehenga",
  "Organza Saree",
  "Party Gown",
  "Bridal Red",
];
