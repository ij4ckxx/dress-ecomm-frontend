---
name: gsap-animation-standards
description: >-
  Use this skill whenever implementing, modifying, or optimizing animations
  in the Next.js ecommerce frontend using GSAP, GSAP timelines, ScrollTrigger,
  entrance animations, hover effects, page transitions, and scroll-based interactions.
  Ensures smooth, reusable, performant, and accessible animations.
---

# GSAP Animation Development Standards

## Instructions & Rules

### 1. Animation Philosophy

- Create smooth, subtle, premium animations.
- Animations should enhance the fashion shopping experience.
- Prefer elegant transitions over exaggerated effects.
- Avoid animating every element.
- Keep animations purposeful.
- Never sacrifice usability or performance for animation.
- Avoid distracting, excessive, or unnecessarily long animations.

### 2. GSAP Usage

- Use the existing GSAP package.
- Do not install another animation library.
- Prefer GSAP timelines for coordinating multiple animations.
- Use ScrollTrigger for scroll-based animations.
- Use reusable animation utilities when appropriate.
- Keep animation logic separate from unrelated business logic.
- Follow the existing project architecture.

### 3. React and Next.js Integration

- Use GSAP only in components where browser-side animation is required.
- Keep Server Components as the default.
- Add "use client" only when necessary.
- If @gsap/react is installed, prefer its useGSAP integration.
- Otherwise, use GSAP context management and proper cleanup.
- Avoid unnecessary useEffect hooks.
- Ensure animations work correctly with React Strict Mode.
- Avoid duplicate animation initialization during re-renders.
- Scope selectors to their relevant component.

### 4. GSAP Timeline Standards

- Use timelines when multiple elements need coordinated animations.
- Use stagger for groups of elements.
- Use appropriate easing functions.
- Keep animation durations consistent.
- Avoid deeply complicated timelines.
- Use labels when they improve timeline readability.
- Avoid unnecessary nested timelines.

Example:

```javascript
/**
 * Creates an entrance animation for the hero section.
 */
const createHeroAnimation = (container) => {
  const timeline = gsap.timeline();

  timeline
    .from(container.querySelector(".hero-image"), {
      clipPath: "inset(0 0 100% 0)",
      duration: 1.2,
      ease: "power3.out",
    })
    .from(
      container.querySelectorAll(".hero-content"),
      {
        y: 30,
        opacity: 0,
        stagger: 0.15,
        duration: 0.8,
        ease: "power3.out",
      },
      "-=0.6"
    );

  return timeline;
};
```

### 5. ScrollTrigger Standards

Use ScrollTrigger for:
- Section entrance animations.
- Editorial text reveals.
- Image reveals.
- Subtle parallax.
- Product collection animations.
- Scroll-based storytelling.

Rules:
- Use appropriate trigger elements.
- Avoid unnecessary ScrollTriggers.
- Configure start and end positions intentionally.
- Clean up ScrollTriggers when components unmount.
- Avoid pinning sections unless there is a clear design reason.
- Avoid scroll animations that interfere with natural scrolling.
- Verify behavior on mobile devices.
- Handle layout changes and refreshes appropriately.

### 6. Fashion Website Animation Patterns

#### Hero Section
- Smooth image reveals.
- Staggered heading entrance.
- Delayed CTA entrance.
- Subtle image movement.

#### Product Cards
- Image scale on hover.
- Secondary image reveal.
- Subtle product information transitions.
- Staggered viewport entrance.

#### Navigation
- Dropdown reveal.
- Mobile menu transitions.
- Header appearance transitions.
- Smooth menu closing.

#### Editorial Sections
- Image clip-path reveals.
- Text entrance animations.
- Subtle parallax.
- Scroll-based storytelling.

#### Shopping Interactions
- Add-to-cart feedback.
- Wishlist interaction.
- Cart drawer transitions.
- Quick-view transitions.

Never animate essential shopping interactions in ways that delay user actions.

### 7. Animation Performance

- Prefer transform and opacity animations.
- Avoid excessive layout-triggering properties.
- Avoid unnecessary continuous animations.
- Avoid excessive blur and filter effects.
- Keep animation complexity low on mobile.
- Avoid animating large numbers of DOM elements simultaneously.
- Avoid unnecessary will-change declarations.
- Prevent layout shifts during animation.
- Clean up all event listeners and animation instances.

### 8. Reusable Animation Utilities

- Search existing animation utilities before creating new ones.
- Reuse common animation patterns.
- Create shared animation helpers when there is clear reuse.
- Avoid duplicating identical timeline configurations.
- Keep animation configuration maintainable.
- Do not build an unnecessarily complicated animation framework.

### 9. Accessibility

- Respect prefers-reduced-motion.
- Provide appropriate reduced-motion alternatives.
- Do not hide important information behind animations.
- Avoid flashing or excessively fast transitions.
- Keep navigation and interactions accessible without animations.
- Ensure animations do not interfere with keyboard interactions.

### 10. Animation Cleanup

- Revert GSAP contexts when components unmount.
- Kill unnecessary timelines.
- Clean up ScrollTriggers.
- Avoid duplicated animations after navigation.
- Avoid memory leaks.
- Ensure route transitions do not leave stale animations behind.

### 11. Before Completing Any Animation Task

1. Verify the animation works correctly.
2. Check React lifecycle behavior.
3. Verify GSAP cleanup.
4. Check ScrollTrigger behavior.
5. Test desktop and mobile.
6. Test reduced-motion behavior.
7. Check browser console errors.
8. Verify that animation does not break existing interactions.

## Final Animation Principle

The website should feel smooth, elegant, and premium.

Use animation to guide attention, reveal fashion imagery, and improve interactions.

The goal is not to show off GSAP. The goal is to make the entire shopping experience feel effortless and sophisticated.

