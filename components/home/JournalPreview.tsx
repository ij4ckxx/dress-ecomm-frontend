import React from "react";
import Image from "next/image";
import Link from "next/link";
import { JournalArticle } from "@/lib/types/homepage";

export interface JournalPreviewProps {
  articles: JournalArticle[];
}

/**
 * Editorial Journal section inspired by Three Clothing's blog / story narratives (wearthree.com)
 */
export const JournalPreview: React.FC<JournalPreviewProps> = ({ articles }) => {
  if (!articles || articles.length === 0) return null;

  return (
    <section
      aria-labelledby="journal-section-title"
      className="w-full py-16 sm:py-24 bg-surface-soft/40 border-b border-border/60"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 sm:mb-14 gap-4">
          <div>
            <span className="text-[11px] font-sans uppercase tracking-[0.3em] text-accent font-medium block mb-2">
              Curated Narratives
            </span>
            <h2
              id="journal-section-title"
              className="text-3xl sm:text-4xl lg:text-5xl font-serif font-light text-text-main tracking-tight"
            >
              The Maison Journal
            </h2>
          </div>

          <Link
            href="/contact"
            className="group inline-flex items-center gap-2 text-xs font-sans uppercase tracking-[0.2em] text-text-secondary hover:text-primary transition-colors py-1 border-b border-border hover:border-primary"
          >
            <span>Read All Articles</span>
            <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">&rarr;</span>
          </Link>
        </div>

        {/* 3-Column Editorial Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
          {articles.map((article) => (
            <article
              key={article.id}
              className="group flex flex-col bg-transparent"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-surface-soft mb-4">
                <Image
                  src={article.imageUrl}
                  alt={article.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>

              <div className="flex flex-col flex-1">
                <div className="flex items-center justify-between text-[10px] font-sans uppercase tracking-[0.2em] text-accent mb-2 font-medium">
                  <span>{article.category}</span>
                  <span className="text-text-subtle font-normal">{article.readTime}</span>
                </div>

                <h3 className="font-serif text-lg sm:text-xl font-normal text-text-main group-hover:text-primary transition-colors leading-snug mb-2">
                  <Link href={`/contact?subject=${encodeURIComponent(article.title)}`} className="focus-ring">
                    {article.title}
                  </Link>
                </h3>

                <p className="text-xs text-text-secondary leading-relaxed font-sans line-clamp-3 mb-4">
                  {article.excerpt}
                </p>

                <div className="mt-auto">
                  <span className="inline-flex items-center gap-1.5 text-xs font-sans uppercase tracking-[0.2em] text-primary group-hover:text-accent font-medium transition-colors">
                    <span>Read Story</span>
                    <span aria-hidden="true">&rarr;</span>
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default JournalPreview;
