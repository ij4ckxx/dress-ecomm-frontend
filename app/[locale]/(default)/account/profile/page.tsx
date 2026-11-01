import React from "react";
import { requireAuth } from "@/lib/auth";
import { ProfileEditForm } from "@/components/account/ProfileEditForm";
import { ChangePasswordForm } from "@/components/account/ChangePasswordForm";

/**
 * Customer Account Details Page.
 * Houses Personal Details (username, contact information) and Change Password form
 * together at the bottom for unified account credential management.
 */
export default async function AccountProfilePage() {
  const user = await requireAuth();

  return (
    <div className="space-y-8">
      {/* 1. Personal Details Form */}
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

      {/* 2. Change Password Form at the Bottom */}
      <div className="bg-surface-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="mb-6 pb-4 border-b border-border">
          <h3 className="text-xl font-serif font-bold text-primary">
            Change Password
          </h3>
          <p className="text-xs text-text-secondary mt-1">
            Update your password to keep your boutique account secure.
          </p>
        </div>

        <ChangePasswordForm />
      </div>
    </div>
  );
}
