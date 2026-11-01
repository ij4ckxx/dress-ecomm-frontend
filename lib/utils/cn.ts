/**
 * Merges class names safely, filtering out falsy values and trimming extra whitespace.
 * Pure functional utility adhering to project clean-code-standards without external dependencies.
 */
export const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(" ").trim();
};

export default cn;

