import React from "react";
import { requireAuth } from "@/lib/auth";
import { AccountProfileView } from "@/components/account/AccountProfileView";
import { Streamable } from "@/components/shared/Streamable";
import { Skeleton } from "@/components/shared/Skeleton";

/**
 * Fallback skeleton for account profile view.
 */
const AccountSkeleton = () => (
  <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8" aria-hidden="true">
    <Skeleton height={80} width="60%" className="rounded-2xl" />
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <Skeleton height={200} className="lg:col-span-1 rounded-2xl" />
      <Skeleton height={320} className="lg:col-span-3 rounded-2xl" />
    </div>
  </div>
);

/**
 * Protected user account profile page requiring valid server-side authentication.
 */
export default async function AccountProfilePage() {
  const user = await requireAuth();

  return (
    <Streamable fallback={<AccountSkeleton />} label="Loading account profile...">
      <AccountProfileView user={user} />
    </Streamable>
  );
}
