import React from "react";
import { requireAuth } from "@/lib/auth";
import { ChangePasswordForm } from "@/components/account/ChangePasswordForm";

/**
 * Customer Account Password & Security Page.
 */
export default async function AccountPasswordPage() {
  await requireAuth();

  return (
    <div className="bg-surface-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
      <div className="mb-6 pb-4 border-b border-border">
        <h2 className="text-xl font-serif font-bold text-primary">
          Security & Password
        </h2>
        <p className="text-xs text-text-secondary mt-1">
          Ensure your boutique account is protected with a unique, robust password.
        </p>
      </div>

      <ChangePasswordForm />
    </div>
  );
}

