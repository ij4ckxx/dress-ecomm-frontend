import React from "react";
import Image from "next/image";
import Link from "next/link";

/**
 * Editorial Campaign & Slow Fashion Story block inspired by Three Clothing (wearthree.com)
 * celebrating slow luxury, Varanasi handloom mastery, and conscious craft.
 */
export const CampaignStory: React.FC = () => {
  return (
    <section
      aria-labelledby="campaign-story-title"
      className="w-full py-20 sm:py-28 bg-surface-soft border-y border-border/60"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Asymmetrical Editorial Photography (7 cols) */}
          <div className="lg:col-span-7 relative">
            <div className="relative aspect-[4/5] sm:aspect-[16/11] overflow-hidden bg-surface-card">
              <Image
                src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1400&auto=format&fit=crop&q=85"
                alt="Master artisan weaving authentic Banarasi Katan silk on pit loom in Varanasi"
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              {/* Floating Quote Stamp */}
              <div className="absolute bottom-6 left-6 right-6 p-5 bg-white/95 backdrop-blur-xs border-l-2 border-primary">
                <p className="font-serif italic text-xs sm:text-sm text-text-main leading-relaxed">
                  &ldquo;A genuine handloom does not simply adorn the body — it preserves the rhythmic heartbeat of four generations of master weavers.&rdquo;
                </p>
                <span className="block mt-2 text-[10px] font-sans uppercase font-medium tracking-[0.2em] text-accent">
                  Atelier Varanasi • Master Weavers Guild
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Narrative & Statistics (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <span className="text-[11px] font-sans uppercase tracking-[0.3em] text-accent font-medium block mb-2">
              Maison Ethos • Slow Luxury
            </span>

            <h2
              id="campaign-story-title"
              className="text-3xl sm:text-4xl lg:text-5xl font-serif font-light text-text-main tracking-tight leading-[1.12] mb-5"
            >
              Woven with Intention. Honoring Ancient Looms.
            </h2>

            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed font-sans mb-4">
              At Saayal Stories, every warp and weft is an ode to patience. We bridge the sacred heritage of pedal-drawn pit looms in Varanasi and Kanchipuram with contemporary European drapery and tailored silhouettes.
            </p>

            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed font-sans mb-8">
              We reject fleeting micro-trends and synthetic polyester replicas. By partnering directly with hereditary weaver families, each heirloom piece honors the maker through ethical, life-affirming remuneration.
            </p>

            {/* 3 Pillars Metrics Bar */}
            <div className="grid grid-cols-3 gap-6 py-6 border-y border-border/80 mb-8">
              <div>
                <span className="block font-serif text-3xl font-light text-primary">
                  120+
                </span>
                <span className="block text-[10px] font-sans uppercase tracking-widest text-text-subtle font-medium mt-1">
                  Artisan Looms
                </span>
              </div>

              <div>
                <span className="block font-serif text-3xl font-light text-primary">
                  100%
                </span>
                <span className="block text-[10px] font-sans uppercase tracking-widest text-text-subtle font-medium mt-1">
                  Pure Katan Silk
                </span>
              </div>

              <div>
                <span className="block font-serif text-3xl font-light text-primary">
                  48h
                </span>
                <span className="block text-[10px] font-sans uppercase tracking-widest text-text-subtle font-medium mt-1">
                  Weaving Time
                </span>
              </div>
            </div>

            {/* Architectural Link */}
            <div>
              <Link
                href="/about"
                className="group inline-flex items-center gap-2 text-xs font-sans uppercase tracking-[0.22em] text-primary font-medium border-b border-primary pb-1 hover:text-primary-hover focus-ring"
              >
                <span>Read The Artisan Manifesto</span>
                <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CampaignStory;
