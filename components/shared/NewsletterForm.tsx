"use client";

import React, { useActionState } from "react";
import { subscribeNewsletterAction } from "@/app/actions/customer.actions";
import { ActionState } from "@/lib/auth/types";

/**
 * Accessible newsletter subscription form powered by a Next.js Server Action.
 */
export const NewsletterForm: React.FC = () => {
  const [state, formAction, isPending] = useActionState<ActionState | null, FormData>(
    subscribeNewsletterAction,
    null
  );

  if (state?.success) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="max-w-md mx-auto p-4 rounded-xl bg-success-bg border border-success-border text-xs text-success font-medium flex items-center justify-center gap-2"
      >
        <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        <span>{state.message}</span>
      </div>
    );
  }

  return (
    <form action={formAction} className="max-w-md mx-auto flex items-center gap-2">
      <label htmlFor="newsletter-email" className="sr-only">
        Email Address for Newsletter
      </label>
      <input
        id="newsletter-email"
        name="email"
        type="email"
        required
        disabled={isPending}
        placeholder="Enter your email address..."
        className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-surface-card text-text-main placeholder-text-subtle text-sm focus-ring disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={isPending}
        className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-primary-contrast text-xs uppercase tracking-wider font-semibold transition-colors focus-ring shrink-0 disabled:opacity-50"
      >
        {isPending ? "Subscribing..." : "Subscribe"}
      </button>
    </form>
  );
};

export default NewsletterForm;
