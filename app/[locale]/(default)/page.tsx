import React from "react";
import type { Metadata } from "next";
import { getHomepageData } from "@/lib/api/homepage.api";
import {
  HeroBanner,
  TrustPillarsBanner,
  CategoryPillsNav,
  FeaturedCollections,
  CampaignStory,
  ShopTheLook,
  BestsellerSlider,
  PressTestimonials,
  JournalPreview,
  InstagramCommunity,
} from "@/components/home";

export const metadata: Metadata = {
  title: "Haute Couture & Heritage Indian Weaves",
  description:
    "Explore artisanal Banarasi sarees, bridal velvet lehengas, French tulle evening gowns, and contemporary resort silhouettes handcrafted by master Indian weavers.",
};

/**
 * Editorial Storefront Homepage for SAAYAL STORIES
 * Inspired by contemporary luxury fashion houses (Three Clothing / wearthree.com).
 * Features server-side streaming, live backend catalog integration, and smooth interactive discovery.
 */
export default async function HomePage() {
  const homepageData = await getHomepageData();

  return (
    <div className="flex flex-col w-full bg-background selection:bg-accent/20 selection:text-primary">
      {/* 1. Cinematic Hero Banner Carousel */}
      <HeroBanner slides={homepageData.heroSlides} />

      {/* 2. Trust Pillars & Artisanal Guarantees Strip */}
      <TrustPillarsBanner />

      {/* 3. Explore By Silhouette / Category Quick Navigation */}
      <CategoryPillsNav categories={homepageData.categoryPills} />

      {/* 4. Signature Curation & Interactive Tabbed Product Grid */}
      <FeaturedCollections products={homepageData.featuredProducts} />

      {/* 5. Maison Ethos & Ancient Loom Artisanal Campaign Story */}
      <CampaignStory />

      {/* 6. Interactive "Shop The Look" Styled Ensemble Spotlight */}
      <ShopTheLook ensemble={homepageData.lookbook} />

      {/* 7. Most Coveted Heirlooms Bestseller Drag Slider */}
      <BestsellerSlider products={homepageData.bestsellers} />

      {/* 8. As Celebrated In Vogue & Luxury Press Accolades */}
      <PressTestimonials quotes={homepageData.pressQuotes} />

      {/* 9. The Maison Journal: Textile Care & Styling Narratives */}
      <JournalPreview articles={homepageData.journalArticles} />

      {/* 10. Community & Patrons Instagram Showcase */}
      <InstagramCommunity posts={homepageData.instagramFeed} />
    </div>
  );
}
