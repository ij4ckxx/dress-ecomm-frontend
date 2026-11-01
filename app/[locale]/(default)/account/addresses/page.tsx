import React from "react";
import { getServerAccessToken, requireAuth } from "@/lib/auth";
import { getCustomerAddresses } from "@/lib/api/customer.api";
import { AddressManager } from "@/components/account/AddressManager";

/**
 * Customer Shipping & Delivery Addresses Page.
 */
export default async function AccountAddressesPage() {
  await requireAuth();
  let token = await getServerAccessToken();
  let addresses = token ? await getCustomerAddresses(token) : [];

  if (addresses.length === 0 && token) {
    const refreshedToken = await getServerAccessToken({ forceRefresh: true });
    if (refreshedToken) {
      addresses = await getCustomerAddresses(refreshedToken);
    }
  }

  return (
    <div className="bg-surface-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
      <AddressManager initialAddresses={addresses} />
    </div>
  );
}
