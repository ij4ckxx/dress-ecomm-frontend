import React from "react";
import Image from "next/image";
import Link from "next/link";
import { JournalArticle } from "@/lib/types/homepage";

export interface JournalPreviewProps {
  articles: JournalArticle[];
}

/**
 * Editorial Journal section inspired by Three Clothing's blog / story narratives.
 */
export const JournalPreview: React.FC<JournalPreviewProps> = ({ articles }) => {
  if (!articles || articles.length === 0) return null;

  return (
    <section
      aria-labelledby="journal-section-title"
      className="w-full py-16 sm:py-24 bg-surface-soft border-b border-border"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-[11px] uppercase tracking-[0.28em] text-accent font-bold block mb-1">
              Curated Narratives
            </span>
            <h2
              id="journal-section-title"
              className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-primary tracking-tight"
            >
              The Maison Journal
            </h2>
          </div>

          <Link
            href="/contact"
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-text-secondary hover:text-primary font-semibold transition-colors focus-ring rounded"
          >
            <span>Read All Articles</span>
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>

        {/* 3-Column Editorial Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((article) => (
            <article
              key={article.id}
              className="group flex flex-col rounded-2xl bg-surface-card border border-border/80 overflow-hidden hover:border-accent/40 shadow-xs hover:shadow-md transition-all duration-300"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-surface-soft">
                <Image
                  src={article.imageUrl}
                  alt={article.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                />
              </div>

              <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between">
                <div>
                  <div className="flex items-center justify-between text-[10px] uppercase font-bold tracking-wider text-accent mb-2">
                    <span>{article.category}</span>
                    <span className="text-text-subtle font-normal">{article.readTime}</span>
                  </div>

                  <h3 className="font-serif text-lg sm:text-xl font-bold text-text-main group-hover:text-primary transition-colors leading-snug mb-2">
                    <Link href={`/contact?subject=${encodeURIComponent(article.title)}`} className="focus-ring rounded">
                      {article.title}
                    </Link>
                  </h3>

                  <p className="text-xs text-text-secondary leading-relaxed line-clamp-3">
                    {article.excerpt}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-border/60 flex items-center justify-between text-xs font-semibold text-primary group-hover:text-accent transition-colors">
                  <span>Read Story</span>
                  <span aria-hidden="true">&rarr;</span>
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

