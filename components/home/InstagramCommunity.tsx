import React from "react";
import Image from "next/image";
import { InstagramPost } from "@/lib/types/homepage";

export interface InstagramCommunityProps {
  posts: InstagramPost[];
}

/**
 * Editorial Instagram community gallery inspired by Three Clothing (wearthree.com)
 */
export const InstagramCommunity: React.FC<InstagramCommunityProps> = ({ posts }) => {
  if (!posts || posts.length === 0) return null;

  return (
    <section
      aria-labelledby="instagram-section-title"
      className="w-full py-16 sm:py-24 bg-background overflow-hidden border-b border-border/60"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10 sm:mb-12">
          <span className="text-[11px] font-sans uppercase tracking-[0.3em] text-accent font-medium block mb-2">
            The Atelier Patrons
          </span>
          <h2
            id="instagram-section-title"
            className="text-3xl sm:text-4xl lg:text-5xl font-serif font-light text-text-main tracking-tight mb-2"
          >
            @saayalstories
          </h2>
          <p className="text-xs sm:text-sm text-text-secondary font-sans">
            Tag us to be featured in our seasonal lookbook and salon journals.
          </p>
        </div>

        {/* 5-Column Clean Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {posts.slice(0, 5).map((post) => (
            <a
              key={post.id}
              href={post.permalink}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square overflow-hidden bg-surface-soft block focus-ring"
              aria-label={`View Instagram post: ${post.caption}`}
            >
              <Image
                src={post.imageUrl}
                alt={post.altText}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              />

              {/* Hover Darkening & Instagram Overlay */}
              <div className="absolute inset-0 bg-primary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4 text-center text-white">
                <svg
                  className="w-5 h-5 mb-2 text-surface-tint"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
                <span className="text-[11px] font-sans font-medium line-clamp-2">
                  {post.caption}
                </span>
                <span className="text-[10px] text-surface-tint mt-1 font-sans">
                  Patron Love • {post.likes}
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InstagramCommunity;
