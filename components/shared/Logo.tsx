import React from "react";
import Image from "next/image";

export interface LogoProps {
  /**
   * "default": Signature bold Plum Wine emblem for light/ivory backgrounds
   * "white": Crisp white emblem for dark/plum backgrounds
   * "dark": High-contrast dark emblem
   * "monogram": Pure flower + sweeping 'S' icon mark
   */
  variant?: "default" | "white" | "dark" | "monogram";
  className?: string;
  height?: number;
  width?: number;
  priority?: boolean;
}

/**
 * Brand Logo component rendering the authentic Saayal Stories luxury calligraphy emblem
 * with clean, bold, high-contrast strokes.
 */
export const Logo: React.FC<LogoProps> = ({
  variant = "default",
  className = "",
  height = 48,
  width,
  priority = false,
}) => {
  const storeName = process.env.NEXT_PUBLIC_STORE_NAME || "SAAYAL STORIES";

  if (variant === "monogram") {
    const dim = width || height || 44;
    return (
      <div className={`relative inline-flex items-center shrink-0 ${className}`}>
        <Image
          src="/saayal-monogram.png"
          alt={`${storeName} Monogram`}
          width={dim}
          height={dim}
          priority={priority}
          className="object-contain"
        />
      </div>
    );
  }

  // Exact aspect ratio of the bold calligraphy emblem: 850 / 388 ≈ 2.19
  const calcWidth = width || Math.round(height * 2.19);

  let src = "/logo.png";
  if (variant === "white") {
    src = "/logo-white.png";
  } else if (variant === "dark") {
    src = "/logo-dark.png";
  }

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 select-none ${className}`}
      style={{ width: calcWidth, height }}
    >
      <Image
        src={src}
        alt={storeName}
        width={calcWidth}
        height={height}
        priority={priority}
        className="object-contain w-full h-full"
      />
      <span className="sr-only">{storeName}</span>
    </div>
  );
};

export default Logo;
