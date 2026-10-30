import React from "react";
import { getServerAccessToken, requireAuth } from "@/lib/auth";
import { getCustomerAddresses } from "@/lib/api/customer.api";
import { AddressManager } from "@/components/account/AddressManager";

/**
 * Customer Shipping & Delivery Addresses Page.
 */
export default async function AccountAddressesPage() {
  await requireAuth();
  const token = await getServerAccessToken();
  const addresses = token ? await getCustomerAddresses(token) : [];

  return (
    <div className="bg-surface-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
      <AddressManager initialAddresses={addresses} />
    </div>
  );
}
