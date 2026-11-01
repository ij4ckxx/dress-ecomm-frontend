"use client";

import React, { useActionState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loginAction } from "@/app/actions/auth.actions";
import { ActionState } from "@/lib/auth/types";
import { SocialLoginButtons } from "./SocialLoginButtons";
import { Input } from "@/components/ui/Input";

export interface LoginFormProps {
  redirectUrl?: string;
}

/**
 * Production-ready accessible credentials login form with live error announcements,
 * animated lightning shooting star border inputs, and luxury aesthetic.
 */
export const LoginForm: React.FC<LoginFormProps> = ({
  redirectUrl = "/account/profile",
}) => {
  const router = useRouter();

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

      <form action={formAction} noValidate className="space-y-4">
        {/* Email Field */}
        <Input
          id="login-email"
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

        {/* Password Field */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span />
            <Link
              href="/forgot-password"
              className="text-xs font-semibold text-primary hover:text-primary-hover transition-colors underline-offset-2 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <Input
            id="login-password"
            name="password"
            type="password"
            label="Password"
            required
            autoComplete="current-password"
            placeholder="••••••••"
            disabled={isPending}
            error={state?.errors?.password?.[0]}
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
        </div>

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
              <span>Signing in...</span>
            </>
          ) : (
            <span className="flex items-center gap-1.5">
              <span>Sign In</span>
              <span className="transition-transform duration-200 group-hover:translate-x-1">
                &rarr;
              </span>
            </span>
          )}
        </button>
      </form>

      {/* Social Login Options */}
      <SocialLoginButtons />
    </div>
  );
};

export default LoginForm;
