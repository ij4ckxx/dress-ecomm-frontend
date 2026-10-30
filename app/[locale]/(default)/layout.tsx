import React from "react";
import { getCurrentUser } from "@/lib/auth";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";

interface DefaultLayoutProps {
  children: React.ReactNode;
}

/**
 * Shared storefront layout providing the unified luxury fashion header and footer
 * across authentication, account, and content pages.
 */
export default async function DefaultStorefrontLayout({
  children,
}: DefaultLayoutProps) {
  const currentUser = await getCurrentUser();

  return (
    <div className="flex flex-col min-h-screen">
      <Header currentUser={currentUser} />
      <main className="flex-1 flex flex-col">{children}</main>
      <Footer currentUser={currentUser} />
    </div>
  );
}

