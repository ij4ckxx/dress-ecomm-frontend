import React from "react";
import Image from "next/image";
import Link from "next/link";

/**
 * Editorial Campaign & Sustainability Story block inspired by Three Clothing (wearthree.com)
 * celebrating slow luxury, Varanasi handloom mastery, and conscious craft.
 */
export const CampaignStory: React.FC = () => {
  return (
    <section
      aria-labelledby="campaign-story-title"
      className="w-full py-16 sm:py-24 bg-surface-soft border-y border-border"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Left Column: Asymmetrical Editorial Photography (7 cols) */}
          <div className="lg:col-span-7 relative">
            <div className="relative aspect-[4/5] sm:aspect-[16/11] rounded-3xl overflow-hidden shadow-xl border border-border">
              <Image
                src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1400&auto=format&fit=crop&q=85"
                alt="Master artisan weaving authentic Banarasi Katan silk on pit loom in Varanasi"
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              {/* Floating Quote Stamp */}
              <div className="absolute bottom-6 left-6 right-6 p-4 sm:p-6 rounded-2xl bg-surface-card/90 backdrop-blur-md border border-border/80 shadow-md">
                <p className="font-serif italic text-xs sm:text-sm text-text-main leading-relaxed">
                  &ldquo;A genuine handloom does not simply adorn the body — it preserves the rhythmic heartbeat of four generations of master weavers.&rdquo;
                </p>
                <span className="block mt-2 text-[10px] uppercase font-bold tracking-widest text-accent">
                  Atelier Varanasi • Master Weavers Guild
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Narrative & Statistics (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <span className="text-[11px] uppercase tracking-[0.3em] text-accent font-bold block mb-2">
              Maison Ethos • Conscious Luxury
            </span>

            <h2
              id="campaign-story-title"
              className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-primary tracking-tight leading-[1.15] mb-5"
            >
              Woven with Intention. Honoring Ancient Looms.
            </h2>

            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed mb-4">
              At Saayal Stories, every warp and weft is an ode to patience. We bridge the sacred heritage of pedal-drawn pit looms in Varanasi and Kanchipuram with contemporary European drapery and tailored silhouettes.
            </p>

            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed mb-8">
              We reject fleeting micro-trends and synthetic polyester replicas. By partnering directly with hereditary weaver families, each heirloom piece honors the maker through ethical, life-affirming remuneration.
            </p>

            {/* 3 Pillars Metrics Bar */}
            <div className="grid grid-cols-3 gap-4 py-6 border-y border-border/80 mb-8">
              <div>
                <span className="block font-serif text-2xl sm:text-3xl font-bold text-primary">
                  120+
                </span>
                <span className="block text-[10px] uppercase tracking-wider text-text-subtle font-semibold mt-0.5">
                  Artisan Looms
                </span>
              </div>

              <div>
                <span className="block font-serif text-2xl sm:text-3xl font-bold text-primary">
                  100%
                </span>
                <span className="block text-[10px] uppercase tracking-wider text-text-subtle font-semibold mt-0.5">
                  Pure Katan Silk
                </span>
              </div>

              <div>
                <span className="block font-serif text-2xl sm:text-3xl font-bold text-primary">
                  0%
                </span>
                <span className="block text-[10px] uppercase tracking-wider text-text-subtle font-semibold mt-0.5">
                  Synthetic Blends
                </span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/contact"
                className="px-7 py-3.5 rounded-full bg-primary hover:bg-primary-hover text-primary-contrast text-xs uppercase tracking-widest font-semibold transition-all shadow-sm hover:scale-105 focus-ring"
              >
                Discover The Craft
              </Link>

              <Link
                href="/category/handloom"
                className="px-6 py-3.5 rounded-full border border-border hover:border-accent text-text-main text-xs uppercase tracking-widest font-semibold transition-all focus-ring"
              >
                Explore Master Weaves
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CampaignStory;

