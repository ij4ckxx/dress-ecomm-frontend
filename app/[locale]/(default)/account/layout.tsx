import React from "react";
import { requireAuth } from "@/lib/auth";
import { AccountShell } from "@/components/account/AccountShell";

interface AccountLayoutProps {
  children: React.ReactNode;
}

/**
 * Account Layout wrapping customer pages with secure authentication validation
 * and dynamic responsive shell switching between full-width Account Center and subpage navigation.
 */
export default async function AccountLayout({ children }: AccountLayoutProps) {
  const user = await requireAuth();

  return <AccountShell user={user}>{children}</AccountShell>;
}
