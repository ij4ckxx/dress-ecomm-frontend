import React from "react";
import Link from "next/link";
import { AuthCard } from "@/components/auth/AuthCard";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { Streamable } from "@/components/shared/Streamable";
import { Skeleton } from "@/components/shared/Skeleton";

/**
 * Fallback skeleton for password recovery form.
 */
const ForgotPasswordSkeleton = () => (
  <div className="space-y-4" aria-hidden="true">
    <Skeleton height={42} width="100%" className="rounded-xl" />
    <Skeleton height={46} width="100%" className="rounded-xl mt-4" />
  </div>
);

/**
 * Password recovery request page.
 */
export default function ForgotPasswordPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <AuthCard
        title="Reset Password"
        subtitle="Enter your email to receive recovery instructions"
        footer={
          <p>
            Remember your credentials?{" "}
            <Link
              href="/login"
              className="font-semibold text-primary hover:text-accent underline underline-offset-4 transition-colors focus-ring rounded"
            >
              Back to sign in
            </Link>
          </p>
        }
      >
        <Streamable fallback={<ForgotPasswordSkeleton />} label="Loading recovery form...">
          <ForgotPasswordForm />
        </Streamable>
      </AuthCard>
    </div>
  );
}
