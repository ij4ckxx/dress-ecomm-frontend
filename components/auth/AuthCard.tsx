import React from "react";
import { GsapFadeIn } from "@/components/shared/GsapFadeIn";

export interface AuthCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

/**
 * Accessible luxury card container for authentication forms inspired by high-end ecommerce designs
 * with smooth GSAP entrance animation.
 */
export const AuthCard: React.FC<AuthCardProps> = ({
  title,
  subtitle,
  children,
  footer,
}) => {
  return (
    <div className="w-full max-w-md mx-auto">
      <GsapFadeIn y={20} duration={0.6}>
        <section
          aria-labelledby="auth-card-title"
          className="bg-surface-card border border-border rounded-2xl shadow-sm px-6 py-8 sm:px-10 sm:py-10 transition-all"
        >
          <header className="text-center mb-8">
            <span className="text-[10px] uppercase tracking-[0.25em] text-accent font-semibold block mb-1">
              Maison Account
            </span>
            <h1
              id="auth-card-title"
              className="text-2xl sm:text-3xl font-serif tracking-tight text-primary font-bold"
            >
              {title}
            </h1>
            {subtitle && (
              <p className="mt-2 text-xs sm:text-sm text-text-secondary leading-relaxed">
                {subtitle}
              </p>
            )}
          </header>

          <main className="space-y-6">{children}</main>

          {footer && (
            <footer className="mt-8 pt-6 border-t border-border text-center text-xs sm:text-sm text-text-secondary">
              {footer}
            </footer>
          )}
        </section>
      </GsapFadeIn>
    </div>
  );
};

export default AuthCard;
