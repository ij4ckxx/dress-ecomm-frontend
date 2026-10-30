---
name: premium-fashion-ui
description: >-
  Use this skill whenever designing, building, modifying, or improving frontend
  UI for the women's fashion ecommerce website. Specializes in premium fashion
  aesthetics, Indian ethnic wear, sarees, dresses, editorial layouts, typography,
  responsive design, color systems, and sophisticated ecommerce experiences.
---

# Premium Fashion UI Design Standards

## Instructions & Rules

### 1. Design Philosophy

- Design like a senior UI/UX designer specializing in premium women's fashion brands.
- Create elegant, sophisticated, feminine, and modern interfaces.
- Prefer luxury editorial fashion aesthetics over generic ecommerce templates.
- Focus on visual hierarchy, whitespace, typography, and high-quality imagery.
- Make the shopping experience visually immersive without sacrificing usability.
- Avoid unnecessarily complicated layouts and decorative elements.

### 2. Brand Color System

The client-provided brand palette is mandatory.

Never replace or modify these original color values:

```css
:root {
  --primary: #754b4d;
  --primary-hover: #5e393b;
  --primary-contrast: #ffffff;

  --accent: #a86a65;
  --accent-hover: #925651;

  --secondary: #ab8882;
  --muted: #d8a694;

  --surface-tint: #e0cbb9;
  --surface-soft: #fcf9f7;
  --surface-card: #ffffff;

  --border: #e6d8ce;

  --text-main: #241718;
  --text-secondary: #634f4e;
  --text-subtle: #8f7978;

  --error: #b91c1c;
  --error-bg: #fef2f2;
  --error-border: #fecaca;

  --success: #15803d;
  --success-bg: #f0fdf4;
  --success-border: #bbf7d0;

  --background: #faf8f5;
  --foreground: var(--text-main);
}
```

Additional rules:
- Use plum wine for primary actions.
- Use warm ivory and neutral backgrounds for most sections.
- Use copper rose and dusty rose for subtle accents.
- Maintain sufficient text contrast.
- Do not introduce unrelated colors.
- Use existing CSS variables instead of hardcoding brand colors.

### 3. Typography

Preferred font combination:

- Cormorant Garamond: Editorial headings, collection titles, and promotional text.
- DM Sans: Navigation, body text, buttons, labels, and product information.

Rules:
- Establish a consistent typography scale.
- Use elegant and expressive headings.
- Maintain readable body text.
- Avoid excessive font weights.
- Use appropriate line heights and letter spacing.
- Follow the existing font-loading strategy.

### 4. Layout and Composition

- Use generous whitespace.
- Create clear visual hierarchy.
- Prefer editorial and asymmetrical compositions where appropriate.
- Avoid making every section look identical.
- Use consistent spacing.
- Avoid excessive rounded corners.
- Avoid heavy shadows and unnecessary borders.
- Use full-width imagery when it improves the composition.
- Maintain visual balance between text and photography.

### 5. Fashion Ecommerce Design

The website specializes in:
- Women's dresses.
- Sarees.
- Kurtis.
- Ethnic wear.
- Casual wear.
- Party wear.
- Fashion accessories.

Design should reflect Indian women's fashion while maintaining a contemporary premium boutique appearance.

### 6. Homepage Design

Where appropriate, use:
- Announcement bar.
- Premium navigation.
- Editorial hero section.
- Featured categories.
- New arrivals.
- Bestselling products.
- Saree collections.
- Fashion campaign sections.
- Brand storytelling.
- Newsletter section.
- Elegant footer.

Do not force unnecessary sections into the homepage.

### 7. Product Cards

- Give product images visual priority.
- Maintain consistent image ratios.
- Use appropriate object-fit behavior.
- Display product name and price clearly.
- Use subtle hover interactions.
- Support secondary images when available.
- Keep badges minimal.
- Make wishlist and shopping interactions intuitive.
- Avoid excessive card borders and shadows.

### 8. Product Details

- Use large product imagery.
- Create an elegant gallery.
- Maintain clear pricing hierarchy.
- Make size and color selection intuitive.
- Keep product descriptions readable.
- Make Add to Cart visually prominent.
- Organize product information logically.
- Preserve existing shopping functionality.

### 9. Responsive Design

- Design independently for desktop, tablet, and mobile.
- Do not simply shrink desktop layouts.
- Maintain typography hierarchy on smaller screens.
- Use appropriate product grid columns.
- Ensure navigation works properly on mobile.
- Maintain comfortable touch targets.
- Avoid horizontal overflow.

### 10. Accessibility

- Use semantic HTML.
- Maintain sufficient color contrast.
- Provide meaningful image alt text.
- Ensure keyboard accessibility.
- Use visible focus states.
- Do not rely only on color to communicate information.
- Respect reduced-motion preferences.

### 11. Code Quality

- Use functional components only. Never use classes.
- Follow the existing folder structure.
- Reuse existing components and utilities.
- Search before creating new components.
- Avoid duplicate styling.
- Follow existing Tailwind CSS conventions.
- Keep Server Components as the default.
- Use Client Components only when required.
- Preserve existing business logic and functionality.

### 12. Before Completing Any UI Task

1. Inspect the existing implementation.
2. Review available reusable components.
3. Verify the brand color palette.
4. Check typography and spacing consistency.
5. Verify desktop and mobile layouts.
6. Ensure existing interactions still work.
7. Check for unnecessary CSS and duplicated components.

## Final Design Principle

Every page should feel like part of the same premium women's fashion brand.

Prioritize elegance, simplicity, fashion photography, typography, whitespace, and usability.

Never sacrifice usability for visual decoration.

