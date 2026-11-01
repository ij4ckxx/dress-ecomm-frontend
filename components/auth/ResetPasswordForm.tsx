"use client";

import React, { useActionState } from "react";
import Link from "next/link";
import { resetPasswordAction } from "@/app/actions/auth.actions";
import { ActionState } from "@/lib/auth/types";
import { Input } from "@/components/ui/Input";

export interface ResetPasswordFormProps {
  initialEmail?: string;
  initialToken?: string;
}

/**
 * Accessible reset-password form allowing users to finalize password recovery with a token,
 * password confirmation, and glowing lightning shooting star inputs.
 */
export const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({
  initialEmail = "",
  initialToken = "",
}) => {
  const [state, formAction, isPending] = useActionState<ActionState | null, FormData>(
    resetPasswordAction,
    null
  );

  return (
    <div className="w-full">
      {/* Success banner */}
      {state?.success && state?.message && (
        <div
          role="status"
          aria-live="polite"
          className="mb-6 p-4 rounded-xl border border-success-border bg-success-bg text-sm text-success flex items-start gap-3"
        >
          <svg
            className="w-5 h-5 flex-shrink-0 mt-0.5"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
              clipRule="evenodd"
            />
          </svg>
          <div>
            <p className="font-semibold">{state.message}</p>
            <Link
              href="/login"
              className="mt-2 inline-block font-bold underline underline-offset-2 hover:opacity-80"
            >
              Sign in with your new password &rarr;
            </Link>
          </div>
        </div>
      )}

      {/* Error banner */}
      {state?.message && !state.success && (
        <div
          role="alert"
          aria-live="polite"
          className="mb-6 p-4 rounded-xl border border-error-border bg-error-bg text-sm text-error flex items-start gap-3"
        >
          <svg
            className="w-5 h-5 flex-shrink-0 mt-0.5"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
              clipRule="evenodd"
            />
          </svg>
          <span className="font-medium">{state.message}</span>
        </div>
      )}

      <form action={formAction} noValidate className="space-y-4">
        {/* Email Address (Pre-filled if in query param) */}
        <Input
          id="reset-email"
          name="email"
          type="email"
          label="Account Email"
          required
          autoComplete="email"
          defaultValue={initialEmail}
          placeholder="name@example.com"
          disabled={isPending || Boolean(initialEmail)}
          error={state?.errors?.email?.[0]}
          startIcon={
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.75}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          }
        />

        {/* Security Reset Token */}
        <Input
          id="reset-token"
          name="token"
          type="text"
          label="Verification Code / Token"
          required
          defaultValue={initialToken}
          placeholder="Enter the code sent to your email"
          disabled={isPending || Boolean(initialToken)}
          error={state?.errors?.token?.[0]}
          startIcon={
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.75}
                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
              />
            </svg>
          }
        />

        {/* New Password */}
        <Input
          id="reset-new-password"
          name="newPassword"
          type="password"
          label="New Password"
          required
          autoComplete="new-password"
          placeholder="••••••••"
          disabled={isPending}
          error={state?.errors?.newPassword?.[0]}
          hint="At least 8 characters, containing both letters and numbers."
          startIcon={
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.75}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          }
        />

        {/* Confirm New Password */}
        <Input
          id="reset-confirm-password"
          name="confirmPassword"
          type="password"
          label="Confirm New Password"
          required
          autoComplete="new-password"
          placeholder="••••••••"
          disabled={isPending}
          error={state?.errors?.confirmPassword?.[0]}
          startIcon={
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.75}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          }
        />

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isPending}
          aria-busy={isPending}
          className="w-full mt-2 py-3 px-4 rounded-xl bg-primary hover:bg-primary-hover text-primary-contrast font-medium text-xs uppercase tracking-widest transition-all shadow-sm focus-ring disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group cursor-pointer"
        >
          {isPending ? (
            <>
              <svg
                className="animate-spin w-4 h-4 text-current"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span>Updating password...</span>
            </>
          ) : (
            <span className="flex items-center gap-1.5">
              <span>Set New Password</span>
              <span className="transition-transform duration-200 group-hover:translate-x-1">
                &rarr;
              </span>
            </span>
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <Link
          href="/login"
          className="text-xs font-semibold text-primary hover:text-primary-hover underline underline-offset-2"
        >
          &larr; Back to sign in
        </Link>
      </div>
    </div>
  );
};

export default ResetPasswordForm;
