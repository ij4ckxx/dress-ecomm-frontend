"use client";

import React, { useActionState } from "react";
import Link from "next/link";
import { forgotPasswordAction } from "@/app/actions/auth.actions";
import { ActionState } from "@/lib/auth/types";

/**
 * Accessible forgot-password form for requesting a password reset link.
 */
export const ForgotPasswordForm: React.FC = () => {
  const [state, formAction, isPending] = useActionState<ActionState | null, FormData>(
    forgotPasswordAction,
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
            <p className="mt-1 text-xs text-text-secondary">
              Check your inbox and spam folder for instructions.
            </p>
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

      <form action={formAction} noValidate className="space-y-5">
        <div>
          <label
            htmlFor="forgot-email"
            className="block text-sm font-medium text-text-main mb-1.5"
          >
            Account Email Address <span className="text-error" aria-hidden="true">*</span>
          </label>
          <input
            id="forgot-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            aria-required="true"
            aria-invalid={Boolean(state?.errors?.email)}
            aria-describedby={state?.errors?.email ? "forgot-email-error" : "forgot-email-desc"}
            placeholder="you@example.com"
            disabled={isPending}
            className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-surface-card text-text-main placeholder-text-subtle text-sm focus-ring transition-colors disabled:opacity-50"
          />
          <p id="forgot-email-desc" className="mt-1.5 text-xs text-text-subtle">
            We will send a secure one-time password reset link to this address.
          </p>
          {state?.errors?.email && (
            <p id="forgot-email-error" role="alert" className="mt-1 text-xs text-error font-medium">
              {state.errors.email[0]}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isPending}
          aria-busy={isPending}
          className="w-full py-3 px-4 rounded-xl bg-primary hover:bg-primary-hover text-primary-contrast font-medium text-sm tracking-wide transition-all shadow-sm focus-ring disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isPending ? (
            <>
              <svg className="animate-spin w-4 h-4 text-current" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Sending reset link...</span>
            </>
          ) : (
            <span>Send Reset Instructions</span>
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <Link
          href="/login"
          className="text-xs text-text-secondary hover:text-primary font-medium underline underline-offset-4 transition-colors focus-ring rounded"
        >
          &larr; Return to Sign In
        </Link>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
