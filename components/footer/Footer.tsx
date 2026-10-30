import React from "react";
import { FooterProps } from "./types";
import { FooterLinks } from "./FooterLinks";
import { FooterNewsletter } from "./FooterNewsletter";
import { FooterBottom } from "./FooterBottom";

/**
 * Modern luxury e-commerce footer inspired by BaileyStreetHome layout,
 * rendered in our authentic brand dark palette (#241718 deep plum espresso)
 * with compact, balanced spacing and modular architecture.
 */
export const Footer: React.FC<FooterProps> = ({ className = "" }) => {
  return (
    <footer
      role="contentinfo"
      className={`w-full bg-[#241718] text-white pt-8 pb-6 sm:pt-10 sm:pb-7 mt-auto border-t border-[#3d2729] ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 4-Column Directory Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7 lg:gap-8">
          {/* Columns 1, 2, 3: Customer Service (+ Assistance), Shopping, About Us */}
          <FooterLinks />

          {/* Column 4: Newsletter, Social Follow, Auxiliary Links */}
          <FooterNewsletter />
        </div>

        {/* Bottom Sub-Bar: Copyright & Payment Badges */}
        <FooterBottom />
      </div>
    </footer>
  );
};

export default Footer;

