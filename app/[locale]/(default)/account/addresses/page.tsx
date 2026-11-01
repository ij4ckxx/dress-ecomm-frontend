import React from "react";
import { getServerAccessToken, requireAuth } from "@/lib/auth";
import { getCustomerAddresses } from "@/lib/api/customer.api";
import { AddressManager } from "@/components/account/AddressManager";

interface AccountAddressesPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

/**
 * Customer Shipping & Delivery Addresses Page with server-side pagination support.
 */
export default async function AccountAddressesPage({
  searchParams,
}: AccountAddressesPageProps) {
  await requireAuth();
  const params = await searchParams;
  const page = Math.max(1, parseInt(String(params?.page || "1"), 10) || 1);
  const limit = 10;

  const token = await getServerAccessToken();
  const result = token
    ? await getCustomerAddresses(token, { page, limit })
    : {
        addresses: [],
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 1,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      };

  return (
    <div className="bg-surface-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
      <AddressManager
        initialAddresses={result.addresses}
        pagination={result.pagination}
      />
    </div>
  );
}
