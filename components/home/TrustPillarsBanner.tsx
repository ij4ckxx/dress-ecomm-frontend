import React from "react";

const COMMITMENTS = [
  {
    number: "01",
    title: "100% Certified SilkMark",
    description: "Verified pure handloom mulberry & katan silk threads with authentic zari weave.",
  },
  {
    number: "02",
    title: "Insured Express Delivery",
    description: "Complimentary luxury bespoke silk box delivery on all domestic & international orders.",
  },
  {
    number: "03",
    title: "Bespoke Atelier Tailoring",
    description: "Personal drape concierge and made-to-measure custom blouse padding.",
  },
  {
    number: "04",
    title: "7-Day Boutique Exchange",
    description: "Effortless size swaps and dedicated styling assistance whenever you need it.",
  },
];

/**
 * Minimalist Artisanal Commitments Bar for luxury storefront peace of mind.
 * Inspired by Three Clothing (wearthree.com) understated editorial design.
 */
export const TrustPillarsBanner: React.FC = () => {
  return (
    <div className="w-full bg-surface-soft border-t border-border/60 py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {COMMITMENTS.map((item) => (
            <div key={item.title} className="flex flex-col">
              <span className="font-serif text-sm tracking-widest text-accent font-light mb-2">
                {item.number}
              </span>
              <h4 className="font-serif text-base font-normal text-text-main mb-1.5">
                {item.title}
              </h4>
              <p className="text-xs text-text-secondary leading-relaxed font-sans">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrustPillarsBanner;
