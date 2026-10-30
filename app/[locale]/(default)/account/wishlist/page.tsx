import React from "react";
import { getServerAccessToken, requireAuth } from "@/lib/auth";
import { getCustomerWishlist } from "@/lib/api/customer.api";
import { WishlistManager } from "@/components/account/WishlistManager";

/**
 * Customer Saved Wishlist Page.
 */
export default async function AccountWishlistPage() {
  await requireAuth();
  const token = await getServerAccessToken();
  const wishlist = token ? await getCustomerWishlist(token) : [];

  return (
    <div className="bg-surface-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
      <WishlistManager initialItems={wishlist} />
    </div>
  );
}
