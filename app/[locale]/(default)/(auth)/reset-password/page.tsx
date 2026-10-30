import React from "react";
import Link from "next/link";
import { AuthCard } from "@/components/auth/AuthCard";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import { Streamable } from "@/components/shared/Streamable";
import { Skeleton } from "@/components/shared/Skeleton";

interface ResetPasswordPageProps {
  searchParams: Promise<{
    token?: string;
    email?: string;
  }>;
}

/**
 * Fallback skeleton for password reset form.
 */
const ResetPasswordSkeleton = () => (
  <div className="space-y-4" aria-hidden="true">
    <Skeleton height={42} width="100%" className="rounded-xl" />
    <Skeleton height={42} width="100%" className="rounded-xl" />
    <Skeleton height={42} width="100%" className="rounded-xl" />
    <Skeleton height={46} width="100%" className="rounded-xl mt-4" />
  </div>
);

/**
 * Password reset completion page verifying one-time tokens.
 */
export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const params = await searchParams;
  const initialEmail = typeof params.email === "string" ? params.email : "";
  const initialToken = typeof params.token === "string" ? params.token : "";

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <AuthCard
        title="Set New Password"
        subtitle="Create a new secure password for your account"
        footer={
          <p>
            Cancel and return to{" "}
            <Link
              href="/login"
              className="font-semibold text-primary hover:text-accent underline underline-offset-4 transition-colors focus-ring rounded"
            >
              Sign In
            </Link>
          </p>
        }
      >
        <Streamable fallback={<ResetPasswordSkeleton />} label="Loading password reset form...">
          <ResetPasswordForm
            initialEmail={initialEmail}
            initialToken={initialToken}
          />
        </Streamable>
      </AuthCard>
    </div>
  );
}
