"use client";

import React, { useActionState } from "react";
import { changePasswordAction } from "@/app/actions/customer.actions";
import { ActionState } from "@/lib/auth/types";
import { Input } from "@/components/ui/Input";

/**
 * Accessible client form for changing customer account password
 * with animated lightning shooting star border inputs.
 */
export const ChangePasswordForm: React.FC = () => {
  const [state, formAction, isPending] = useActionState<ActionState | null, FormData>(
    changePasswordAction,
    null
  );

  return (
    <div className="w-full max-w-xl">
      {state?.success && state?.message && (
        <div
          role="status"
          aria-live="polite"
          className="mb-6 p-4 rounded-xl border border-success-border bg-success-bg text-sm text-success flex items-start gap-3"
        >
          <svg className="w-5 h-5 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
              clipRule="evenodd"
            />
          </svg>
          <p className="font-semibold">{state.message}</p>
        </div>
      )}

      {state?.message && !state.success && (
        <div
          role="alert"
          aria-live="polite"
          className="mb-6 p-4 rounded-xl border border-error-border bg-error-bg text-sm text-error flex items-start gap-3"
        >
          <svg className="w-5 h-5 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
              clipRule="evenodd"
            />
          </svg>
          <p className="font-medium">{state.message}</p>
        </div>
      )}

      <form action={formAction} className="space-y-5">
        {/* Current Password */}
        <Input
          id="currentPassword"
          name="currentPassword"
          type="password"
          label="Current Password"
          required
          disabled={isPending}
          placeholder="Enter current password"
          error={state?.errors?.currentPassword?.[0]}
          startIcon={
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          }
        />

        {/* New Password */}
        <Input
          id="newPassword"
          name="newPassword"
          type="password"
          label="New Password"
          required
          disabled={isPending}
          placeholder="Enter new password"
          error={state?.errors?.newPassword?.[0]}
          hint="Must be at least 8 characters long with letters and numbers."
          startIcon={
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          }
        />

        {/* Confirm New Password */}
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          label="Confirm New Password"
          required
          disabled={isPending}
          placeholder="Re-enter new password"
          error={state?.errors?.confirmPassword?.[0]}
          startIcon={
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          }
        />

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={isPending}
            className="py-2.5 px-6 rounded-xl bg-primary hover:bg-primary-hover text-primary-contrast font-medium text-xs uppercase tracking-widest transition-all shadow-sm focus-ring disabled:opacity-50 cursor-pointer flex items-center gap-2"
          >
            {isPending ? "Updating Password..." : "Update Password"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePasswordForm;
