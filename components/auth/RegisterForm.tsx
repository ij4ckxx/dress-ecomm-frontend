"use client";

import React, { useActionState } from "react";
import Link from "next/link";
import { registerAction } from "@/app/actions/auth.actions";
import { ActionState } from "@/lib/auth/types";
import { SocialLoginButtons } from "./SocialLoginButtons";
import { Input } from "@/components/ui/Input";

export interface RegisterFormProps {
  onSuccessRedirect?: string;
}

/**
 * Production-ready accessible registration form validating user credentials
 * with luxury boutique aesthetic and animated glowing train border inputs.
 */
export const RegisterForm: React.FC<RegisterFormProps> = () => {
  const [state, formAction, isPending] = useActionState<ActionState | null, FormData>(
    registerAction,
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
              Click here to sign in &rarr;
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
        {/* Full Name Field */}
        <Input
          id="register-name"
          name="name"
          type="text"
          label="Full Name"
          required
          autoComplete="name"
          placeholder="Jane Doe"
          disabled={isPending}
          error={state?.errors?.name?.[0]}
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
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          }
        />

        {/* Email Address Field */}
        <Input
          id="register-email"
          name="email"
          type="email"
          label="Email Address"
          required
          autoComplete="email"
          placeholder="name@example.com"
          disabled={isPending}
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

        {/* Phone Number Field (Optional) */}
        <Input
          id="register-phone"
          name="phone"
          type="tel"
          label="Phone Number"
          optional
          autoComplete="tel"
          placeholder="+91 98765 43210"
          disabled={isPending}
          hint="Optional for dispatch and delivery status notifications"
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
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
          }
        />

        {/* Password Field */}
        <Input
          id="register-password"
          name="password"
          type="password"
          label="Password"
          required
          autoComplete="new-password"
          placeholder="••••••••"
          disabled={isPending}
          error={state?.errors?.password?.[0]}
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

        {/* Confirm Password Field */}
        <Input
          id="register-confirm-password"
          name="confirmPassword"
          type="password"
          label="Confirm Password"
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
              <span>Creating your account...</span>
            </>
          ) : (
            <span className="flex items-center gap-1.5">
              <span>Create Account</span>
              <span className="transition-transform duration-200 group-hover:translate-x-1">
                &rarr;
              </span>
            </span>
          )}
        </button>
      </form>

      {/* Social Registration Alternative */}
      <SocialLoginButtons label="Sign up with Google" />
    </div>
  );
};

export default RegisterForm;
