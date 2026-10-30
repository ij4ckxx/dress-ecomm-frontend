"use client";

import React, { useActionState, useState } from "react";
import Link from "next/link";
import { registerAction } from "@/app/actions/auth.actions";
import { ActionState } from "@/lib/auth/types";
import { SocialLoginButtons } from "./SocialLoginButtons";

export interface RegisterFormProps {
  onSuccessRedirect?: string;
}

/**
 * Production-ready accessible registration form validating user credentials
 * with luxury boutique aesthetic and password confirmation.
 */
export const RegisterForm: React.FC<RegisterFormProps> = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
        {/* Full Name */}
        <div>
          <label
            htmlFor="register-name"
            className="block text-xs uppercase tracking-wider font-semibold text-text-main mb-1.5"
          >
            Full Name <span className="text-error" aria-hidden="true">*</span>
          </label>
          <input
            id="register-name"
            name="name"
            type="text"
            autoComplete="name"
            required
            aria-required="true"
            aria-invalid={Boolean(state?.errors?.name)}
            aria-describedby={state?.errors?.name ? "register-name-error" : undefined}
            placeholder="Jane Doe"
            disabled={isPending}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-surface-card text-text-main placeholder-text-subtle text-sm focus-ring transition-colors disabled:opacity-50"
          />
          {state?.errors?.name && (
            <p id="register-name-error" role="alert" className="mt-1 text-xs text-error font-medium">
              {state.errors.name[0]}
            </p>
          )}
        </div>

        {/* Email Address */}
        <div>
          <label
            htmlFor="register-email"
            className="block text-xs uppercase tracking-wider font-semibold text-text-main mb-1.5"
          >
            Email Address <span className="text-error" aria-hidden="true">*</span>
          </label>
          <input
            id="register-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            aria-required="true"
            aria-invalid={Boolean(state?.errors?.email)}
            aria-describedby={state?.errors?.email ? "register-email-error" : undefined}
            placeholder="name@example.com"
            disabled={isPending}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-surface-card text-text-main placeholder-text-subtle text-sm focus-ring transition-colors disabled:opacity-50"
          />
          {state?.errors?.email && (
            <p id="register-email-error" role="alert" className="mt-1 text-xs text-error font-medium">
              {state.errors.email[0]}
            </p>
          )}
        </div>

        {/* Phone Number (Optional) */}
        <div>
          <label
            htmlFor="register-phone"
            className="block text-xs uppercase tracking-wider font-semibold text-text-main mb-1.5"
          >
            Phone Number <span className="text-[10px] text-text-subtle normal-case font-normal">(Optional for delivery updates)</span>
          </label>
          <input
            id="register-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="+91 98765 43210"
            disabled={isPending}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-surface-card text-text-main placeholder-text-subtle text-sm focus-ring transition-colors disabled:opacity-50"
          />
        </div>

        {/* Password */}
        <div>
          <label
            htmlFor="register-password"
            className="block text-xs uppercase tracking-wider font-semibold text-text-main mb-1.5"
          >
            Password <span className="text-error" aria-hidden="true">*</span>
          </label>
          <div className="relative">
            <input
              id="register-password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              required
              aria-required="true"
              aria-invalid={Boolean(state?.errors?.password)}
              aria-describedby="register-password-hint register-password-error"
              placeholder="••••••••"
              disabled={isPending}
              className="w-full px-4 py-2.5 pr-11 rounded-xl border border-border bg-surface-card text-text-main placeholder-text-subtle text-sm focus-ring transition-colors disabled:opacity-50"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-text-subtle hover:text-text-main focus-ring rounded-lg my-1"
            >
              {showPassword ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
          <p id="register-password-hint" className="mt-1 text-xs text-text-subtle">
            At least 8 characters, containing both letters and numbers.
          </p>
          {state?.errors?.password && (
            <p id="register-password-error" role="alert" className="mt-1 text-xs text-error font-medium">
              {state.errors.password[0]}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label
            htmlFor="register-confirm-password"
            className="block text-xs uppercase tracking-wider font-semibold text-text-main mb-1.5"
          >
            Confirm Password <span className="text-error" aria-hidden="true">*</span>
          </label>
          <div className="relative">
            <input
              id="register-confirm-password"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              autoComplete="new-password"
              required
              aria-required="true"
              aria-invalid={Boolean(state?.errors?.confirmPassword)}
              aria-describedby={state?.errors?.confirmPassword ? "register-confirm-error" : undefined}
              placeholder="••••••••"
              disabled={isPending}
              className="w-full px-4 py-2.5 pr-11 rounded-xl border border-border bg-surface-card text-text-main placeholder-text-subtle text-sm focus-ring transition-colors disabled:opacity-50"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-text-subtle hover:text-text-main focus-ring rounded-lg my-1"
            >
              {showConfirmPassword ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
          {state?.errors?.confirmPassword && (
            <p id="register-confirm-error" role="alert" className="mt-1 text-xs text-error font-medium">
              {state.errors.confirmPassword[0]}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isPending}
          aria-busy={isPending}
          className="w-full mt-2 py-3 px-4 rounded-xl bg-primary hover:bg-primary-hover text-primary-contrast font-medium text-xs uppercase tracking-widest transition-all shadow-sm focus-ring disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isPending ? (
            <>
              <svg className="animate-spin w-4 h-4 text-current" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Creating your account...</span>
            </>
          ) : (
            <span>Create Account</span>
          )}
        </button>
      </form>

      {/* Social Registration Alternative */}
      <SocialLoginButtons label="Sign up with Google" />
    </div>
  );
};

export default RegisterForm;
