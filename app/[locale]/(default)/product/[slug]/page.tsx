import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { ProductCarousel } from "@/components/product/ProductCarousel";

interface ProductDetailPageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const readableTitle = slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return {
    title: `${readableTitle} | Haute Maison`,
    description: `Explore ${readableTitle} crafted with artisanal weaves and couture silhouettes.`,
  };
}

/**
 * Product Detail Page (PDP).
 * Features product showcase and the shared "You May Also Adore" carousel.
 */
export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { slug } = await params;
  const readableTitle = slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <div className="w-full bg-background min-h-screen">
      {/* Breadcrumb Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
        <nav aria-label="Breadcrumb" className="text-xs text-text-subtle font-sans">
          <ol className="flex items-center gap-2">
            <li>
              <Link href="/" className="hover:text-primary transition-colors">
                Home
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/category" className="hover:text-primary transition-colors">
                Collections
              </Link>
            </li>
            <li>/</li>
            <li className="text-text-main font-semibold truncate max-w-xs">
              {readableTitle}
            </li>
          </ol>
        </nav>
      </div>

      {/* Main PDP Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="border border-dashed border-border/80 rounded-2xl p-8 sm:p-12 text-center bg-surface-card/40 max-w-2xl mx-auto space-y-3">
          <span className="text-[11px] uppercase tracking-[0.2em] font-bold text-accent">
            Atelier Collection Piece
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-text-main">
            {readableTitle}
          </h1>
          <p className="text-xs sm:text-sm text-text-subtle">
            Detailed dimensions, colorways, drapery views, and fabric composition for this design.
          </p>
        </div>
      </main>

      {/* Shared "You May Also Adore" Carousel */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ProductCarousel
          title="You May Also Adore"
          subtitle="Explore handpicked complementary designs tailored for your occasion."
          eyebrow="Complete The Silhouette"
          limit={8}
        />
      </div>
    </div>
  );
}
