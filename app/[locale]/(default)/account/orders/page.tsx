import React from "react";
import Link from "next/link";
import { getServerAccessToken, requireAuth } from "@/lib/auth";
import { getCustomerOrders } from "@/lib/api/customer.api";

/**
 * Customer Orders & Shipment Tracking Page.
 */
export default async function AccountOrdersPage() {
  await requireAuth();
  const token = await getServerAccessToken();
  const orders = token ? await getCustomerOrders(token) : [];

  return (
    <div className="bg-surface-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
      <div className="mb-6 pb-4 border-b border-border flex items-center justify-between">
        <div>
          <h2 className="text-xl font-serif font-bold text-primary">
            Orders & Shipments
          </h2>
          <p className="text-xs text-text-secondary mt-1">
            Review previous purchases, current production status, and courier tracking details.
          </p>
        </div>
        <span className="text-xs font-semibold uppercase tracking-wider text-text-subtle">
          {orders.length} Order(s)
        </span>
      </div>

      {orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="p-5 rounded-xl border border-border bg-surface-soft/60 hover:bg-surface-soft transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-3 border-b border-border/60 gap-2">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-bold text-text-main">
                      #{order.orderNumber}
                    </span>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        order.status === "DELIVERED"
                          ? "bg-success-bg text-success border border-success-border"
                          : order.status === "CANCELLED"
                          ? "bg-error-bg text-error border border-error-border"
                          : "bg-surface-tint/60 text-primary border border-border"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <p className="text-xs text-text-subtle mt-0.5">
                    Ordered on {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-base font-serif font-bold text-primary block">
                    {order.currency || "₹"} {order.totalAmount?.toLocaleString()}
                  </span>
                  <span className="text-[11px] text-text-subtle">
                    {order.itemCount || 1} Item(s)
                  </span>
                </div>
              </div>

              {/* Order Actions */}
              <div className="flex items-center justify-end gap-4 pt-1">
                <Link
                  href={`/account/orders/${order.orderNumber}`}
                  className="text-xs font-semibold text-primary hover:text-primary-hover transition-colors focus-ring rounded"
                >
                  View Order Details &rarr;
                </Link>
                {order.trackingNumber && (
                  <Link
                    href={`/orders/track?orderNumber=${order.orderNumber}`}
                    className="text-xs font-semibold text-accent hover:text-accent-hover transition-colors focus-ring rounded"
                  >
                    Track Courier
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <svg className="w-12 h-12 text-muted mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <h3 className="text-base font-serif font-bold text-primary mb-1">
            No Orders Placed Yet
          </h3>
          <p className="text-xs text-text-secondary max-w-sm mx-auto mb-6">
            When you purchase handcrafted sarees, bridal couture, or designer dresses, their production updates and tracking will appear here.
          </p>
          <Link
            href="/category/sarees"
            className="inline-block px-6 py-2.5 rounded-xl bg-primary text-primary-contrast text-xs uppercase tracking-wider font-semibold hover:bg-primary-hover transition-colors focus-ring"
          >
            Explore Handloom Sarees
          </Link>
        </div>
      )}
    </div>
  );
}
