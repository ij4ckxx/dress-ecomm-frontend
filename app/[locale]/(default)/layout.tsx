import React from "react";
import { connection } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { SessionKeeper } from "@/components/auth/SessionKeeper";
import { getCategoriesAction } from "@/app/actions/category.actions";

interface DefaultLayoutProps {
  children: React.ReactNode;
}

/**
 * Shared storefront layout providing the unified luxury fashion header and footer
 * with dynamically loaded categories across authentication, account, and storefront pages.
 *
 * @param {DefaultLayoutProps} props
 * @returns {Promise<React.ReactElement>}
 */
export default async function DefaultStorefrontLayout({
  children,
}: DefaultLayoutProps) {
  await connection();
  const [currentUser, categories] = await Promise.all([
    getCurrentUser(),
    getCategoriesAction({ tree: true }),
  ]);

  return (
    <div className="flex flex-col min-h-screen">
      <SessionKeeper isLoggedIn={Boolean(currentUser)} />
      <Header currentUser={currentUser} categories={categories} />
      <main className="flex-1 flex flex-col">{children}</main>
      <Footer currentUser={currentUser} />
    </div>
  );
}
