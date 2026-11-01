import React from "react";
import { getServerAccessToken, requireAuth } from "@/lib/auth";
import { getCustomerWishlist } from "@/lib/api/customer.api";
import { WishlistManager } from "@/components/account/WishlistManager";

/**
 * Customer Saved Wishlist Page.
 */
export default async function AccountWishlistPage() {
  await requireAuth();
  let token = await getServerAccessToken();
  let wishlist = token ? await getCustomerWishlist(token) : [];

  if (wishlist.length === 0 && token) {
    const refreshedToken = await getServerAccessToken({ forceRefresh: true });
    if (refreshedToken) {
      wishlist = await getCustomerWishlist(refreshedToken);
    }
  }

  return (
    <div className="bg-surface-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
      <WishlistManager initialItems={wishlist} />
    </div>
  );
}
