import React from "react";
import Link from "next/link";
import { getServerAccessToken, requireAuth } from "@/lib/auth";
import {
  getCustomerAddresses,
  getCustomerOrders,
  getCustomerWishlist,
} from "@/lib/api/customer.api";

/**
 * Account Overview Dashboard displaying recent orders, default shipping address,
 * and quick-access customer concierge links.
 */
export default async function AccountOverviewPage() {
  const user = await requireAuth();
  const token = await getServerAccessToken();

  const [orders, addresses, wishlist] = await Promise.all([
    token ? getCustomerOrders(token) : Promise.resolve([]),
    token ? getCustomerAddresses(token) : Promise.resolve([]),
    token ? getCustomerWishlist(token) : Promise.resolve([]),
  ]);

  const defaultAddress = addresses.find((a) => a.isDefault) || addresses[0];
  const recentOrder = orders[0];

  return (
    <div className="space-y-6">
      {/* Quick Summary Metric Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          href="/account/orders"
          className="p-5 rounded-2xl bg-surface-card border border-border hover:border-accent transition-all shadow-sm group focus-ring"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider font-semibold text-text-subtle">
              Total Orders
            </span>
            <span className="text-2xl font-serif font-bold text-primary group-hover:text-accent transition-colors">
              {orders.length}
            </span>
          </div>
          <p className="mt-2 text-xs text-text-secondary">
            {recentOrder ? `Latest on ${new Date(recentOrder.createdAt).toLocaleDateString()}` : "No purchases yet"}
          </p>
        </Link>

        <Link
          href="/account/addresses"
          className="p-5 rounded-2xl bg-surface-card border border-border hover:border-accent transition-all shadow-sm group focus-ring"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider font-semibold text-text-subtle">
              Saved Locations
            </span>
            <span className="text-2xl font-serif font-bold text-primary group-hover:text-accent transition-colors">
              {addresses.length}
            </span>
          </div>
          <p className="mt-2 text-xs text-text-secondary">
            {defaultAddress ? `${defaultAddress.city}, ${defaultAddress.state}` : "Add delivery address"}
          </p>
        </Link>

        <Link
          href="/account/wishlist"
          className="p-5 rounded-2xl bg-surface-card border border-border hover:border-accent transition-all shadow-sm group focus-ring"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider font-semibold text-text-subtle">
              Saved Wishlist
            </span>
            <span className="text-2xl font-serif font-bold text-primary group-hover:text-accent transition-colors">
              {wishlist.length}
            </span>
          </div>
          <p className="mt-2 text-xs text-text-secondary">
            {wishlist.length > 0 ? "Saved for private purchase" : "Explore handcrafted items"}
          </p>
        </Link>
      </div>

      {/* Recent Orders Overview */}
      <div className="bg-surface-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
          <h2 className="text-lg sm:text-xl font-serif font-bold text-primary">
            Recent Order Activity
          </h2>
          <Link
            href="/account/orders"
            className="text-xs font-semibold uppercase tracking-wider text-accent hover:text-accent-hover transition-colors focus-ring rounded"
          >
            View All ({orders.length}) &rarr;
          </Link>
        </div>

        {recentOrder ? (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 rounded-xl bg-surface-soft border border-border">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-text-main">
                    #{recentOrder.orderNumber}
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-surface-tint/50 text-primary">
                    {recentOrder.status}
                  </span>
                </div>
                <p className="text-xs text-text-subtle mt-0.5">
                  Placed on {new Date(recentOrder.createdAt).toLocaleDateString()} • {recentOrder.itemCount || 1} item(s)
                </p>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-sm font-serif font-bold text-primary">
                  {recentOrder.currency || "₹"} {recentOrder.totalAmount?.toLocaleString()}
                </span>
                <Link
                  href={`/account/orders/${recentOrder.orderNumber}`}
                  className="px-3.5 py-1.5 rounded-lg border border-border text-xs font-semibold text-text-main hover:bg-surface-card transition-colors focus-ring"
                >
                  Order Details &rarr;
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <svg className="w-10 h-10 text-muted mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <p className="text-sm text-text-secondary font-medium">No order history available yet.</p>
            <p className="text-xs text-text-subtle mt-1 mb-4">
              Explore our exquisite handcrafted sarees, lehengas, and couture dresses.
            </p>
            <Link
              href="/category/sarees"
              className="inline-block px-5 py-2.5 rounded-xl bg-primary text-primary-contrast text-xs uppercase tracking-wider font-semibold hover:bg-primary-hover transition-colors focus-ring"
            >
              Explore Collections
            </Link>
          </div>
        )}
      </div>

      {/* Profile & Default Address Snapshot */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Details Snapshot */}
        <div className="bg-surface-card border border-border rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-serif font-bold text-primary">
                Personal Information
              </h3>
              <Link
                href="/account/profile"
                className="text-xs font-semibold text-accent hover:text-accent-hover transition-colors focus-ring rounded"
              >
                Edit
              </Link>
            </div>
            <dl className="space-y-2 text-xs">
              <div>
                <dt className="text-text-subtle uppercase">Name</dt>
                <dd className="font-medium text-text-main text-sm">{user.name}</dd>
              </div>
              <div>
                <dt className="text-text-subtle uppercase">Email</dt>
                <dd className="font-medium text-text-main text-sm">{user.email}</dd>
              </div>
              <div>
                <dt className="text-text-subtle uppercase">Phone</dt>
                <dd className="font-medium text-text-main text-sm">{user.phone || "Not provided"}</dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Default Shipping Address Snapshot */}
        <div className="bg-surface-card border border-border rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-serif font-bold text-primary">
                Primary Shipping Address
              </h3>
              <Link
                href="/account/addresses"
                className="text-xs font-semibold text-accent hover:text-accent-hover transition-colors focus-ring rounded"
              >
                Manage
              </Link>
            </div>

            {defaultAddress ? (
              <address className="not-italic text-xs text-text-secondary space-y-1">
                <p className="font-bold text-text-main text-sm">{defaultAddress.fullName}</p>
                <p>{defaultAddress.addressLine1}</p>
                {defaultAddress.addressLine2 && <p>{defaultAddress.addressLine2}</p>}
                <p>{defaultAddress.city}, {defaultAddress.state} {defaultAddress.postalCode}</p>
                <p>{defaultAddress.country}</p>
                <p className="pt-1 text-text-subtle">Phone: {defaultAddress.phone}</p>
              </address>
            ) : (
              <div className="text-xs text-text-subtle py-4">
                <p>No default address saved.</p>
                <Link
                  href="/account/addresses"
                  className="mt-2 inline-block font-semibold text-accent hover:text-accent-hover underline"
                >
                  Add a delivery address
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
