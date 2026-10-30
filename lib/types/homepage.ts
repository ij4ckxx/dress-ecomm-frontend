/**
 * Homepage Data Type Definitions for SAAYAL STORIES
 * Inspired by luxury contemporary fashion stores (Three Clothing / wearthree.com).
 */

export interface HeroSlide {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
  imageUrl: string;
  mobileImageUrl?: string;
  alignment: "left" | "center" | "right";
  seasonTag: string;
}

export interface CategoryPill {
  id: string;
  name: string;
  slug: string;
  imageUrl: string;
  productCount?: number;
  badge?: string;
}

export interface HomepageProduct {
  id: string;
  name: string;
  slug: string;
  brand: string;
  categoryName: string;
  categorySlug: string;
  thumbnail: string;
  secondaryImage?: string;
  regularPrice: number;
  salePrice?: number | null;
  discountPercentage?: number;
  rating: number;
  reviewCount: number;
  fabric?: string;
  tag?: string;
  availableSizes?: string[];
  isNewArrival?: boolean;
  isBestseller?: boolean;
}

export interface HotspotItem {
  id: string;
  xPercent: number; // 0 - 100
  yPercent: number; // 0 - 100
  productName: string;
  productSlug: string;
  price: number;
  imageUrl: string;
  tag: string;
}

export interface LookbookEnsemble {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  mainImageUrl: string;
  hotspots: HotspotItem[];
}

export interface PressQuote {
  id: string;
  quote: string;
  publication: string;
  city: string;
}

export interface JournalArticle {
  id: string;
  title: string;
  category: string;
  readTime: string;
  excerpt: string;
  slug: string;
  imageUrl: string;
  publishedDate: string;
}

export interface InstagramPost {
  id: string;
  imageUrl: string;
  altText: string;
  likes: number;
  caption: string;
  permalink: string;
}

export interface HomepageData {
  heroSlides: HeroSlide[];
  categoryPills: CategoryPill[];
  featuredProducts: HomepageProduct[];
  bestsellers: HomepageProduct[];
  lookbook: LookbookEnsemble;
  pressQuotes: PressQuote[];
  journalArticles: JournalArticle[];
  instagramFeed: InstagramPost[];
}

