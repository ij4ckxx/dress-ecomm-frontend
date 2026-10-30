import React from "react";
import { requireAuth } from "@/lib/auth";
import { ProfileEditForm } from "@/components/account/ProfileEditForm";

/**
 * Customer profile details management page.
 */
export default async function AccountProfilePage() {
  const user = await requireAuth();

  return (
    <div className="space-y-6">
      <div className="bg-surface-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="mb-6 pb-4 border-b border-border">
          <h2 className="text-xl font-serif font-bold text-primary">
            Personal Details
          </h2>
          <p className="text-xs text-text-secondary mt-1">
            Update your contact information for orders, shipping updates, and boutique communications.
          </p>
        </div>

        <ProfileEditForm user={user} />
      </div>

      {/* Account Security & Password Info */}
      <div className="bg-surface-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-serif font-bold text-primary">
              Account Password & Security
            </h3>
            <p className="text-xs text-text-secondary mt-1">
              Ensure your account is protected with a secure password.
            </p>
          </div>

          <a
            href="/forgot-password"
            className="self-start sm:self-auto px-4 py-2 rounded-xl border border-border text-xs uppercase font-semibold text-text-main hover:bg-surface-soft transition-colors focus-ring"
          >
            Reset Password
          </a>
        </div>
      </div>
    </div>
  );
}
