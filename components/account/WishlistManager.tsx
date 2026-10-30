"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { WishlistItem } from "@/lib/api/customer.api";
import { removeWishlistItemAction } from "@/app/actions/customer.actions";

export interface WishlistManagerProps {
  initialItems: WishlistItem[];
}

/**
 * Interactive Wishlist manager component supporting real-time removal and boutique routing.
 */
export const WishlistManager: React.FC<WishlistManagerProps> = ({ initialItems }) => {
  const [items, setItems] = useState<WishlistItem[]>(initialItems);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const handleRemove = (productId: string) => {
    setRemovingId(productId);
    startTransition(async () => {
      await removeWishlistItemAction(productId);
      setItems((prev) => prev.filter((it) => it.productId !== productId));
      setRemovingId(null);
    });
  };

  return (
    <div>
      <div className="mb-6 pb-4 border-b border-border flex items-center justify-between">
        <div>
          <h2 className="text-xl font-serif font-bold text-primary">
            Saved Wishlist
          </h2>
          <p className="text-xs text-text-secondary mt-1">
            Curated sarees, lehengas, and couture dresses saved for your upcoming celebrations.
          </p>
        </div>
        <span className="text-xs font-semibold uppercase tracking-wider text-text-subtle">
          {items.length} Item(s)
        </span>
      </div>

      {items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {items.map((item) => (
            <div
              key={item.id || item.productId}
              className="group border border-border rounded-2xl overflow-hidden bg-surface-card hover:border-accent transition-all flex flex-col justify-between"
            >
              <div className="aspect-[3/4] bg-surface-soft relative overflow-hidden">
                {item.product.primaryImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.product.primaryImage}
                    alt={item.product.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-text-subtle">
                    Boutique Couture Piece
                  </div>
                )}

                {/* Remove from wishlist button */}
                <button
                  type="button"
                  onClick={() => handleRemove(item.productId)}
                  disabled={removingId === item.productId}
                  aria-label={`Remove ${item.product.name} from wishlist`}
                  className="absolute top-2.5 right-2.5 p-2 rounded-full bg-surface-card/90 backdrop-blur-xs text-text-subtle hover:text-error hover:bg-surface-card transition-colors shadow-sm focus-ring disabled:opacity-50"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-4 flex flex-col justify-between flex-1">
                <div>
                  <h3 className="text-sm font-serif font-bold text-primary line-clamp-1 group-hover:text-accent transition-colors">
                    {item.product.name}
                  </h3>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-xs font-bold text-text-main">
                      ₹{item.product.price?.toLocaleString()}
                    </span>
                    {item.product.compareAtPrice && (
                      <span className="text-[11px] text-text-subtle line-through">
                        ₹{item.product.compareAtPrice?.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-border flex items-center gap-2">
                  <Link
                    href={`/product/${item.product.slug}`}
                    className="flex-1 text-center py-2 px-3 rounded-xl bg-primary text-primary-contrast text-xs uppercase font-semibold hover:bg-primary-hover transition-colors focus-ring"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <svg className="w-12 h-12 text-muted mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
          <h3 className="text-base font-serif font-bold text-primary mb-1">
            Your Wishlist is Empty
          </h3>
          <p className="text-xs text-text-secondary max-w-sm mx-auto mb-6">
            Save your favorite handcrafted sarees, designer gowns, and kurtis while exploring our couture collections.
          </p>
          <Link
            href="/category/sarees"
            className="inline-block px-6 py-2.5 rounded-xl bg-primary text-primary-contrast text-xs uppercase tracking-wider font-semibold hover:bg-primary-hover transition-colors focus-ring"
          >
            Explore Handloom Sarees
          </Link>
        </div>
      )}
    </div>
  );
};

export default WishlistManager;

