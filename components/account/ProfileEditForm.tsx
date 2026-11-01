"use client";

import React, { useActionState } from "react";
import { updateProfileAction } from "@/app/actions/customer.actions";
import { ActionState, SafeUser } from "@/lib/auth/types";
import { Input } from "@/components/ui/Input";

export interface ProfileEditFormProps {
  user: SafeUser;
}

/**
 * Accessible client form for updating customer profile details with
 * animated lightning shooting star borders and luxury boutique styling.
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
          <Input
            id="profile-name"
            name="name"
            type="text"
            label="Full Name"
            required
            defaultValue={user.name}
            disabled={isPending}
            error={state?.errors?.name?.[0]}
            startIcon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            }
          />

          {/* Phone Number */}
          <Input
            id="profile-phone"
            name="phone"
            type="tel"
            label="Phone Number"
            optional
            defaultValue={user.phone || ""}
            placeholder="+91 98765 43210"
            disabled={isPending}
            error={state?.errors?.phone?.[0]}
            startIcon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            }
          />
        </div>

        {/* Email Address (Read-only for security) */}
        <Input
          id="profile-email"
          type="email"
          label="Email Address"
          value={user.email}
          disabled
          hint="Account email address cannot be changed directly."
          startIcon={
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          }
        />

        {/* Avatar URL (Optional) */}
        <Input
          id="profile-avatar"
          name="avatarUrl"
          type="url"
          label="Profile Picture URL"
          optional
          defaultValue={user.avatarUrl || ""}
          placeholder="https://images.example.com/photo.jpg"
          disabled={isPending}
          error={state?.errors?.avatarUrl?.[0]}
          hint="Link to your publicly hosted portrait photo."
          startIcon={
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          }
        />

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={isPending}
            className="py-2.5 px-6 rounded-xl bg-primary hover:bg-primary-hover text-primary-contrast font-medium text-xs uppercase tracking-widest transition-all shadow-sm focus-ring disabled:opacity-50 cursor-pointer flex items-center gap-2"
          >
            {isPending ? "Saving Changes..." : "Save Profile Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileEditForm;
