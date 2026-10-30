import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { AuthCard } from "@/components/auth/AuthCard";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { Streamable } from "@/components/shared/Streamable";
import { Skeleton } from "@/components/shared/Skeleton";

/**
 * Fallback skeleton for streaming the registration form.
 */
const RegisterFormSkeleton = () => (
  <div className="space-y-4" aria-hidden="true">
    <Skeleton height={42} width="100%" className="rounded-xl" />
    <Skeleton height={42} width="100%" className="rounded-xl" />
    <Skeleton height={42} width="100%" className="rounded-xl" />
    <Skeleton height={46} width="100%" className="rounded-xl mt-4" />
  </div>
);

/**
 * Customer registration page for creating a new boutique shopping profile.
 */
export default async function RegisterPage() {
  const currentUser = await getCurrentUser();
  if (currentUser) {
    redirect("/account/profile");
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <AuthCard
        title="Create Account"
        subtitle="Join our community for exclusive access to new collections"
        footer={
          <p>
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-primary hover:text-accent underline underline-offset-4 transition-colors focus-ring rounded"
            >
              Sign in
            </Link>
          </p>
        }
      >
        <Streamable fallback={<RegisterFormSkeleton />} label="Loading registration form...">
          <RegisterForm />
        </Streamable>
      </AuthCard>
    </div>
  );
}
