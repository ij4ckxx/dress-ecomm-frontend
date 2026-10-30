"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SOCIAL_LINKS } from "./constants";

/**
 * Newsletter subscription and social channels block matching reference image 1.
 */
export const FooterNewsletter: React.FC = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) return;
    setSubscribed(true);
  };

  return (
    <div>
      <p className="text-xs sm:text-sm font-medium text-white/95 leading-relaxed mb-3">
        Be the first to know about new arrivals, sales, and more.
      </p>

      {/* Subscription Form */}
      {subscribed ? (
        <div className="p-2.5 rounded bg-white/10 text-xs text-white border border-white/20">
          ✨ Thank you for subscribing to our private catalog releases!
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex items-stretch gap-1 w-full max-w-sm">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="flex-1 min-w-0 h-9 px-3 text-xs bg-white text-text-main rounded-xs focus:outline-none focus:ring-1 focus:ring-accent"
            aria-label="Email subscription input"
          />
          <button
            type="submit"
            className="h-9 px-4 bg-[#1f1214] hover:bg-[#341d20] text-white text-[11px] font-bold uppercase tracking-wider rounded-xs border border-white/20 hover:border-white/40 transition-colors shrink-0"
          >
            Sign Up
          </button>
        </form>
      )}

      {/* Privacy Policy Link */}
      <p className="mt-2 text-[11px] text-white/60">
        View our{" "}
        <Link
          href="/policies/privacy"
          className="underline hover:text-white transition-colors"
        >
          Privacy Policy
        </Link>
      </p>

      {/* Social Follow Links */}
      <div className="mt-5">
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted mb-2.5">
          Follow Us
        </p>
        <div className="flex items-center gap-3">
          {SOCIAL_LINKS.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Visit our ${s.label} page`}
              className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-colors"
            >
              {s.icon === "pinterest" && (
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.427 7.627 11.174-.105-.95-.2-2.41.042-3.447.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.03-.655 2.569-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.25 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
                </svg>
              )}
              {s.icon === "instagram" && (
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              )}
              {s.icon === "facebook" && (
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              )}
            </a>
          ))}
        </div>
      </div>

      {/* Auxiliary Concierge links as seen in reference */}
      <div className="mt-5 pt-3 border-t border-white/10 flex flex-col gap-1 text-[11px] text-white/50">
        <Link href="/login" className="hover:text-white transition-colors">
          Agent Login
        </Link>
        <p className="text-[10px]">
          Session Id: <span className="text-white/70">Secure Encrypted</span>
        </p>
      </div>
    </div>
  );
};

