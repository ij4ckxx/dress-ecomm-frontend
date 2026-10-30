import { FooterLink } from "./types";

/**
 * Customer service navigation links matching reference layout.
 */
export const CUSTOMER_SERVICE_LINKS: FooterLink[] = [
  { label: "Help Center", href: "/contact" },
  { label: "Returns", href: "/policies/returns" },
  { label: "Replacements", href: "/policies/replacements" },
  { label: "Shipping", href: "/policies/shipping" },
  { label: "View Order Status", href: "/track-order" },
];

/**
 * Shopping shortcuts links.
 */
export const SHOPPING_LINKS: FooterLink[] = [
  { label: "On Sale", href: "/products?sort=best_deals" },
  { label: "View your Cart", href: "/cart" },
  { label: "Coupon Policy", href: "/policies/coupons" },
];

/**
 * Company information and regulatory policy links.
 */
export const ABOUT_US_LINKS: FooterLink[] = [
  { label: "About Us", href: "/about" },
  { label: "Privacy Policy", href: "/policies/privacy" },
  { label: "Terms of Use", href: "/policies/terms" },
  { label: "Accessibility", href: "/policies/accessibility" },
  { label: "Influencer Program", href: "/influencer-program", icon: "💙" },
];

/**
 * Support phone and chat operational hours.
 */
export const ASSISTANCE_INFO = {
  phoneHoursLabel: "PHONE HOURS",
  phoneHours: "Monday - Friday: 6:00am - 4:00pm PST",
  phoneNumber: "888-280-1265",
  chatHoursLabel: "CHAT HOURS",
  chatWeekday: "Monday - Friday: 6:00am - 5:00pm PST",
  chatWeekend: "Saturday & Sunday: 6:00am - 3:00pm PST",
};

/**
 * Official social media presence links.
 */
export const SOCIAL_LINKS = [
  { label: "Pinterest", href: "https://pinterest.com", icon: "pinterest" },
  { label: "Instagram", href: "https://instagram.com", icon: "instagram" },
  { label: "Facebook", href: "https://facebook.com", icon: "facebook" },
];

/**
 * Supported payment method indicators displayed in the bottom footer.
 */
export const PAYMENT_BADGES = [
  { name: "Accredited Business", code: "bbb" },
  { name: "PayPal", code: "paypal" },
  { name: "Visa", code: "visa" },
  { name: "MasterCard", code: "mastercard" },
  { name: "Discover", code: "discover" },
  { name: "Amex", code: "amex" },
  { name: "Braintree", code: "braintree" },
];

