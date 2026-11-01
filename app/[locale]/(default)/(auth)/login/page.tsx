import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { AuthCard } from "@/components/auth/AuthCard";
import { LoginForm } from "@/components/auth/LoginForm";
import { Streamable } from "@/components/shared/Streamable";
import { Skeleton } from "@/components/shared/Skeleton";

/**
 * Fallback skeleton for streaming the login form.
 */
const LoginFormSkeleton = () => (
  <div className="space-y-5" aria-hidden="true">
    <Skeleton height={42} width="100%" className="rounded-xl" />
    <Skeleton height={42} width="100%" className="rounded-xl" />
    <Skeleton height={46} width="100%" className="rounded-xl mt-4" />
  </div>
);

/**
 * Customer login page providing credentials and social OAuth options.
 */
export default async function LoginPage() {
  const currentUser = await getCurrentUser();
  if (currentUser) {
    redirect("/account");
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <AuthCard
        title="Sign In"
        subtitle="Access your boutique account, wishlist, and orders"
        footer={
          <p>
            Don&apos;t have an account yet?{" "}
            <Link
              href="/register"
              className="font-semibold text-primary hover:text-accent underline underline-offset-4 transition-colors focus-ring rounded"
            >
              Create an account
            </Link>
          </p>
        }
      >
        <Streamable fallback={<LoginFormSkeleton />} label="Loading sign in form...">
          <LoginForm />
        </Streamable>
      </AuthCard>
    </div>
  );
}
