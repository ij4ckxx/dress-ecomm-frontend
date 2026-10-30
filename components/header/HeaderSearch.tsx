"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { HeaderSearchProps } from "./types";

/**
 * Modern header search input bar with clean aesthetics, quick submit,
 * and keyboard accessibility.
 */
export const HeaderSearch: React.FC<HeaderSearchProps> = ({
  className = "",
  placeholder = "What can we help you find?",
  onSearchSubmit,
}) => {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  /**
   * Handles search form submission and routes to product discovery.
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    if (onSearchSubmit) {
      onSearchSubmit(trimmed);
    } else {
      router.push(`/products?search=${encodeURIComponent(trimmed)}`);
    }
  };

  /**
   * Clears the active search query and refocuses input.
   */
  const handleClear = () => {
    setQuery("");
    inputRef.current?.focus();
  };

  return (
    <form
      onSubmit={handleSubmit}
      role="search"
      className={`relative flex items-center w-full max-w-2xl ${className}`}
    >
      <div className="relative w-full flex items-center">
        {/* Search Magnifying Glass Icon */}
        <span className="absolute left-3.5 text-text-subtle pointer-events-none flex items-center justify-center">
          <svg
            className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-text-subtle/80"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
        </span>

        {/* Input Field */}
        <input
          ref={inputRef}
          type="search"
          name="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          autoComplete="off"
          className="w-full h-10 sm:h-11 pl-10 pr-10 text-xs sm:text-sm bg-surface-card text-text-main placeholder:text-text-subtle/70 rounded-md border border-border/90 hover:border-border transition-colors focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30"
          aria-label="Search storefront products"
        />

        {/* Clear Button (Visible when typing) */}
        {query.length > 0 && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 p-1 rounded-full text-text-subtle hover:text-text-main hover:bg-surface-soft transition-colors"
            aria-label="Clear search input"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </form>
  );
};

