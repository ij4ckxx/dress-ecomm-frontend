"use client";

import React, { useState, useTransition, useActionState } from "react";
import { CustomerAddress } from "@/lib/api/customer.api";
import {
  createAddressAction,
  deleteAddressAction,
  setDefaultAddressAction,
} from "@/app/actions/customer.actions";
import { ActionState } from "@/lib/auth/types";
import { Input } from "@/components/ui/Input";
import { Checkbox } from "@/components/ui/Checkbox";

export interface AddressManagerProps {
  initialAddresses: CustomerAddress[];
}

/**
 * Interactive Address Book manager component supporting address creation, deletion, and default toggling.
 * Features luxury boutique layout and animated lightning shooting star form inputs.
 */
export const AddressManager: React.FC<AddressManagerProps> = ({
  initialAddresses,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [settingDefaultId, setSettingDefaultId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const [createState, formAction, isCreating] = useActionState<ActionState | null, FormData>(
    async (prev, formData) => {
      const res = await createAddressAction(prev, formData);
      if (res?.success) {
        setIsModalOpen(false);
      }
      return res;
    },
    null
  );

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to remove this delivery address?")) return;
    setDeletingId(id);
    startTransition(async () => {
      await deleteAddressAction(id);
      setDeletingId(null);
    });
  };

  const handleSetDefault = (id: string) => {
    setSettingDefaultId(id);
    startTransition(async () => {
      await setDefaultAddressAction(id);
      setSettingDefaultId(null);
    });
  };

  return (
    <div>
      <div className="mb-6 pb-4 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-serif font-bold text-primary">
            Saved Delivery Addresses
          </h2>
          <p className="text-xs text-text-secondary mt-1">
            Manage your residences, boutique delivery locations, and gift destinations.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="self-start sm:self-auto px-5 py-2.5 rounded-xl bg-primary text-primary-contrast text-xs uppercase tracking-wider font-semibold hover:bg-primary-hover transition-colors shadow-sm focus-ring flex items-center gap-2 cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          <span>Add New Address</span>
        </button>
      </div>

      {createState?.message && !createState.success && (
        <div
          role="alert"
          aria-live="polite"
          className="mb-6 p-4 rounded-xl border border-error-border bg-error-bg text-xs text-error flex items-start gap-2"
        >
          <svg className="w-4 h-4 shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
              clipRule="evenodd"
            />
          </svg>
          <span>{createState.message}</span>
        </div>
      )}

      {/* Addresses Grid */}
      {initialAddresses && initialAddresses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {initialAddresses.map((address) => (
            <div
              key={address.id}
              className={`p-5 rounded-2xl border transition-all duration-200 relative flex flex-col justify-between ${
                address.isDefault
                  ? "border-accent bg-surface-card shadow-xs ring-1 ring-accent/30"
                  : "border-border bg-surface-card hover:border-accent/40"
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-text-main text-sm">
                      {address.firstName} {address.lastName}
                    </span>
                    {address.isDefault && (
                      <span className="px-2 py-0.5 rounded-full bg-surface-tint/40 text-primary text-[10px] font-bold uppercase tracking-wider">
                        Default
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-text-subtle capitalize">
                    {address.city}
                  </span>
                </div>

                <div className="text-xs text-text-secondary space-y-0.5 leading-relaxed">
                  <p>{address.address1}</p>
                  {address.address2 && <p>{address.address2}</p>}
                  <p>
                    {address.city}, {address.state} - {address.postalCode}
                  </p>
                  <p>{address.country}</p>
                  {address.phone && (
                    <p className="pt-2 text-text-subtle font-medium flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      {address.phone}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-border/60 flex items-center justify-between gap-3">
                {!address.isDefault ? (
                  <button
                    type="button"
                    onClick={() => handleSetDefault(address.id)}
                    disabled={settingDefaultId === address.id}
                    className="text-xs font-semibold text-primary hover:text-primary-hover transition-colors focus-ring disabled:opacity-50 cursor-pointer"
                  >
                    {settingDefaultId === address.id ? "Updating..." : "Make Default"}
                  </button>
                ) : (
                  <span className="text-xs text-text-subtle italic">Primary destination</span>
                )}

                <button
                  type="button"
                  onClick={() => handleDelete(address.id)}
                  disabled={deletingId === address.id}
                  className="text-xs font-semibold text-text-subtle hover:text-error transition-colors focus-ring disabled:opacity-50 cursor-pointer"
                >
                  {deletingId === address.id ? "Removing..." : "Remove"}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <svg className="w-12 h-12 text-muted mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <h3 className="text-base font-serif font-bold text-primary mb-1">
            No Addresses Saved
          </h3>
          <p className="text-xs text-text-secondary max-w-sm mx-auto mb-6">
            Save your shipping addresses for seamless, single-click checkout on all future purchases.
          </p>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-block px-6 py-2.5 rounded-xl bg-primary text-primary-contrast text-xs uppercase tracking-wider font-semibold hover:bg-primary-hover transition-colors focus-ring cursor-pointer"
          >
            Add Your First Address
          </button>
        </div>
      )}

      {/* Accessible Add Address Slide-over / Modal */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-add-address-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-text-main/50 backdrop-blur-xs"
        >
          <div className="bg-surface-card border border-border rounded-2xl w-full max-w-lg p-6 sm:p-8 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-border">
              <h3 id="modal-add-address-title" className="text-lg font-serif font-bold text-primary">
                Add New Delivery Address
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-text-subtle hover:text-text-main hover:bg-surface-soft transition-colors focus-ring cursor-pointer"
                aria-label="Close modal"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form action={formAction} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  id="address-firstName"
                  name="firstName"
                  type="text"
                  label="First Name"
                  required
                  disabled={isCreating}
                />
                <Input
                  id="address-lastName"
                  name="lastName"
                  type="text"
                  label="Last Name"
                  required
                  disabled={isCreating}
                />
              </div>

              <Input
                id="address-line1"
                name="address1"
                type="text"
                label="Street Address"
                placeholder="Flat / Villa / House No., Street, Landmark"
                required
                disabled={isCreating}
              />

              <Input
                id="address-line2"
                name="address2"
                type="text"
                label="Apartment / Suite"
                optional
                disabled={isCreating}
              />

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <Input
                  id="address-city"
                  name="city"
                  type="text"
                  label="City"
                  required
                  disabled={isCreating}
                />
                <Input
                  id="address-state"
                  name="state"
                  type="text"
                  label="State"
                  required
                  disabled={isCreating}
                />
                <div className="col-span-2 sm:col-span-1">
                  <Input
                    id="address-postalCode"
                    name="postalCode"
                    type="text"
                    label="Pincode"
                    required
                    disabled={isCreating}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  id="address-country"
                  name="country"
                  type="text"
                  label="Country"
                  defaultValue="India"
                  required
                  disabled={isCreating}
                />
                <Input
                  id="address-phone"
                  name="phone"
                  type="tel"
                  label="Phone for Delivery"
                  placeholder="+91 98765 43210"
                  disabled={isCreating}
                />
              </div>

              <div className="pt-2">
                <Checkbox
                  id="address-isDefault"
                  name="isDefault"
                  disabled={isCreating}
                  label="Set as default shipping address"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isCreating}
                  className="px-4 py-2 rounded-xl border border-border text-xs uppercase tracking-wider font-semibold text-text-secondary hover:bg-surface-soft transition-colors focus-ring cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="px-6 py-2 rounded-xl bg-primary text-primary-contrast text-xs uppercase tracking-widest font-semibold hover:bg-primary-hover transition-colors shadow-sm focus-ring disabled:opacity-50 cursor-pointer"
                >
                  {isCreating ? "Saving..." : "Save Address"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressManager;
