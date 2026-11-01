import React from "react";
import { getServerAccessToken, requireAuth } from "@/lib/auth";
import { getCustomerProfile } from "@/lib/api/customer.api";
import { ProfileEditForm } from "@/components/account/ProfileEditForm";
import { ChangePasswordForm } from "@/components/account/ChangePasswordForm";

/**
 * Customer Account Details Page.
 * Fetches fresh customer account data directly from the backend, providing
 * personal details (with direct Cloudinary image upload) and password management.
 */
export default async function AccountProfilePage() {
  const user = await requireAuth();
  const token = await getServerAccessToken();
  const freshProfile = token ? await getCustomerProfile(token) : null;
  const activeUser = freshProfile || user;

  return (
    <div className="space-y-8">
      {/* 1. Personal Details & Avatar Form */}
      <div className="bg-surface-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="mb-6 pb-4 border-b border-border">
          <h2 className="text-xl font-serif font-bold text-primary">
            Personal Details
          </h2>
          <p className="text-xs text-text-secondary mt-1">
            Update your portrait photo, name, email, and contact phone number.
          </p>
        </div>

        <ProfileEditForm user={activeUser} />
      </div>

      {/* 2. Change Password Form at the Bottom */}
      <div className="bg-surface-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="mb-6 pb-4 border-b border-border">
          <h3 className="text-xl font-serif font-bold text-primary">
            Change Password
          </h3>
          <p className="text-xs text-text-secondary mt-1">
            Ensure your boutique account is protected with a secure password.
          </p>
        </div>

        <ChangePasswordForm />
      </div>
    </div>
  );
}
