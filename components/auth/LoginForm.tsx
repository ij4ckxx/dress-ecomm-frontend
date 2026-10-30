"use client";

import React, { useActionState, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loginAction } from "@/app/actions/auth.actions";
import { ActionState } from "@/lib/auth/types";
import { SocialLoginButtons } from "./SocialLoginButtons";

export interface LoginFormProps {
  redirectUrl?: string;
}

/**
 * Production-ready accessible credentials login form with live error announcements
 * and boutique luxury styling.
 */
export const LoginForm: React.FC<LoginFormProps> = ({
  redirectUrl = "/account/profile",
}) => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const handleAction = async (
    prevState: ActionState | null,
    formData: FormData
  ): Promise<ActionState> => {
    const result = await loginAction(prevState, formData);
    if (result.success) {
      router.push(redirectUrl);
      router.refresh();
    }
    return result;
  };

  const [state, formAction, isPending] = useActionState<ActionState | null, FormData>(
    handleAction,
    null
  );

  return (
    <div className="w-full">
      {/* Alert banner for authentication failure or general errors */}
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
        {/* Email Field */}
        <div>
          <label
            htmlFor="login-email"
            className="block text-xs uppercase tracking-wider font-semibold text-text-main mb-1.5"
          >
            Email Address <span className="text-error" aria-hidden="true">*</span>
          </label>
          <input
            id="login-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            aria-required="true"
            aria-invalid={Boolean(state?.errors?.email)}
            aria-describedby={state?.errors?.email ? "login-email-error" : undefined}
            placeholder="name@example.com"
            disabled={isPending}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-surface-card text-text-main placeholder-text-subtle text-sm focus-ring transition-colors disabled:opacity-50"
          />
          {state?.errors?.email && (
            <p
              id="login-email-error"
              role="alert"
              className="mt-1.5 text-xs text-error font-medium"
            >
              {state.errors.email[0]}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <label
            htmlFor="login-password"
            className="block text-xs uppercase tracking-wider font-semibold text-text-main mb-1.5"
          >
            Password <span className="text-error" aria-hidden="true">*</span>
          </label>
          <div className="relative">
            <input
              id="login-password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              aria-required="true"
              aria-invalid={Boolean(state?.errors?.password)}
              aria-describedby={state?.errors?.password ? "login-password-error" : undefined}
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
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"
                  />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              )}
            </button>
          </div>
          {state?.errors?.password && (
            <p
              id="login-password-error"
              role="alert"
              className="mt-1.5 text-xs text-error font-medium"
            >
              {state.errors.password[0]}
            </p>
          )}
        </div>

        {/* Remember me & Forgot Password links */}
        <div className="flex items-center justify-between text-xs pt-1">
          <label className="flex items-center gap-2 cursor-pointer text-text-secondary select-none">
            <input
              type="checkbox"
              name="remember"
              className="w-4 h-4 rounded border-border text-primary accent-primary focus:ring-accent"
            />
            <span>Remember me</span>
          </label>
          <Link
            href="/forgot-password"
            className="text-accent hover:text-accent-hover font-medium underline underline-offset-2 transition-colors focus-ring rounded"
          >
            Forgot password?
          </Link>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isPending}
          aria-busy={isPending}
          className="w-full py-3 px-4 rounded-xl bg-primary hover:bg-primary-hover text-primary-contrast font-medium text-xs uppercase tracking-widest transition-all shadow-sm focus-ring disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
              <span>Authenticating...</span>
            </>
          ) : (
            <span>Sign In to Account</span>
          )}
        </button>
      </form>

      {/* Social OAuth Alternative */}
      <SocialLoginButtons />
    </div>
  );
};

export default LoginForm;
