"use client";

import React, { useActionState } from "react";
import { updateProfileAction } from "@/app/actions/customer.actions";
import { ActionState, SafeUser } from "@/lib/auth/types";

export interface ProfileEditFormProps {
  user: SafeUser;
}

/**
 * Accessible client form for updating customer profile details.
 */
export const ProfileEditForm: React.FC<ProfileEditFormProps> = ({ user }) => {
  const [state, formAction, isPending] = useActionState<ActionState | null, FormData>(
    updateProfileAction,
    null
  );

  return (
    <div className="w-full">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Full Name */}
          <div>
            <label
              htmlFor="profile-name"
              className="block text-xs uppercase tracking-wider font-semibold text-text-main mb-1.5"
            >
              Full Name <span className="text-error" aria-hidden="true">*</span>
            </label>
            <input
              id="profile-name"
              name="name"
              type="text"
              defaultValue={user.name}
              required
              disabled={isPending}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-surface-card text-text-main text-sm focus-ring disabled:opacity-50"
            />
          </div>

          {/* Phone Number */}
          <div>
            <label
              htmlFor="profile-phone"
              className="block text-xs uppercase tracking-wider font-semibold text-text-main mb-1.5"
            >
              Phone Number
            </label>
            <input
              id="profile-phone"
              name="phone"
              type="tel"
              defaultValue={user.phone || ""}
              placeholder="+91 98765 43210"
              disabled={isPending}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-surface-card text-text-main placeholder-text-subtle text-sm focus-ring disabled:opacity-50"
            />
          </div>
        </div>

        {/* Email Address (Read-only) */}
        <div>
          <label
            htmlFor="profile-email"
            className="block text-xs uppercase tracking-wider font-semibold text-text-main mb-1.5"
          >
            Email Address <span className="text-[10px] text-text-subtle normal-case font-normal">(Primary account identity)</span>
          </label>
          <input
            id="profile-email"
            type="email"
            value={user.email}
            disabled
            readOnly
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-surface-soft text-text-secondary text-sm cursor-not-allowed"
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isPending}
            className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-primary-contrast font-medium text-xs uppercase tracking-widest transition-all shadow-sm focus-ring disabled:opacity-50"
          >
            {isPending ? "Saving Changes..." : "Save Profile Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileEditForm;

