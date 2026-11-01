import React from "react";
import { requireAuth } from "@/lib/auth";
import { AccountCenterView } from "@/components/account/AccountCenterView";

/**
 * Account Center Overview Page inspired by HomeClick.
 * Authenticates the customer session without unnecessary background API calls,
 * and renders the 4-card interactive Account Center hub.
 */
export default async function AccountCenterPage() {
  const user = await requireAuth();

  return <AccountCenterView user={user} />;
}
