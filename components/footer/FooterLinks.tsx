import React from "react";
import Link from "next/link";
import {
  CUSTOMER_SERVICE_LINKS,
  SHOPPING_LINKS,
  ABOUT_US_LINKS,
} from "./constants";
import { FooterAssistance } from "./FooterAssistance";

/**
 * Renders the primary 3 columns of directory links: Customer Service,
 * Shopping, and About Us.
 */
export const FooterLinks: React.FC = () => {
  return (
    <>
      {/* Column 1: Customer Service & Shopping Assistance */}
      <div>
        <h3 className="text-sm font-semibold text-white tracking-wide mb-3">
          Customer Service
        </h3>
        <ul className="space-y-2 text-xs text-white/80">
          {CUSTOMER_SERVICE_LINKS.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                className="hover:text-white hover:underline transition-colors block py-0.5"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Shopping Assistance Block directly under Column 1 as in reference */}
        <FooterAssistance />
      </div>

      {/* Column 2: Shopping */}
      <div>
        <h3 className="text-sm font-semibold text-white tracking-wide mb-3">
          Shopping
        </h3>
        <ul className="space-y-2 text-xs text-white/80">
          {SHOPPING_LINKS.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                className="hover:text-white hover:underline transition-colors block py-0.5"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Column 3: About Us */}
      <div>
        <h3 className="text-sm font-semibold text-white tracking-wide mb-3">
          About Us
        </h3>
        <ul className="space-y-2 text-xs text-white/80">
          {ABOUT_US_LINKS.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                className="hover:text-white hover:underline transition-colors inline-flex items-center gap-1.5 py-0.5"
              >
                {item.icon && <span>{item.icon}</span>}
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

