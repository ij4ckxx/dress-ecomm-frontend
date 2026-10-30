import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getServerAccessToken, requireAuth } from "@/lib/auth";
import { getCustomerOrderByNumber } from "@/lib/api/customer.api";

interface OrderDetailPageProps {
  params: Promise<{
    locale: string;
    orderId: string;
  }>;
}

/**
 * Customer Order Details & Itemized Tracking Page.
 */
export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  await requireAuth();
  const { orderId } = await params;
  const token = await getServerAccessToken();

  if (!token) {
    notFound();
  }

  const order = await getCustomerOrderByNumber(token, orderId);

  if (!order) {
    return (
      <div className="bg-surface-card border border-border rounded-2xl p-8 shadow-sm text-center">
        <h2 className="text-xl font-serif font-bold text-primary mb-2">Order Not Found</h2>
        <p className="text-xs text-text-secondary max-w-md mx-auto mb-6">
          We could not locate order #{orderId}. It may belong to another account or the order number is invalid.
        </p>
        <Link
          href="/account/orders"
          className="inline-block px-5 py-2.5 rounded-xl bg-primary text-primary-contrast text-xs uppercase tracking-wider font-semibold hover:bg-primary-hover transition-colors"
        >
          &larr; Back to Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Navigation & Status */}
      <div className="bg-surface-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-border gap-4">
          <div>
            <Link
              href="/account/orders"
              className="inline-flex items-center gap-1.5 text-xs text-accent hover:text-accent-hover font-semibold transition-colors mb-2 focus-ring rounded"
            >
              &larr; Back to Order History
            </Link>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-serif font-bold text-primary">
                Order #{order.orderNumber}
              </h2>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
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
            <p className="text-xs text-text-subtle mt-1">
              Placed on{" "}
              {new Date(order.createdAt).toLocaleDateString("en-IN", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>

          {order.trackingNumber && (
            <div className="p-3.5 rounded-xl bg-surface-soft border border-border sm:text-right">
              <span className="text-[10px] font-bold uppercase tracking-wider text-text-subtle block">
                Courier Tracking
              </span>
              <span className="text-xs font-semibold text-text-main block mt-0.5">
                {order.courierPartner || "Express Courier"}: {order.trackingNumber}
              </span>
              {order.estimatedDelivery && (
                <span className="text-[11px] text-accent block mt-0.5">
                  Est. Delivery: {order.estimatedDelivery}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Order Items List */}
        <div className="space-y-4">
          <h3 className="text-xs uppercase tracking-widest font-bold text-text-main pb-2 border-b border-border/60">
            Handcrafted Items ({order.items.length})
          </h3>

          <div className="divide-y divide-border/60">
            {order.items.map((item) => (
              <div key={item.id} className="py-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-20 rounded-xl bg-surface-soft border border-border overflow-hidden shrink-0">
                    {item.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.imageUrl}
                        alt={item.title || "Couture garment"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] text-text-subtle text-center p-1">
                        Couture
                      </div>
                    )}
                  </div>

                  <div>
                    <h4 className="text-sm font-serif font-bold text-primary">
                      {item.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-1 text-xs text-text-secondary">
                      {item.size && <span>Size: {item.size}</span>}
                      {item.size && item.color && <span>•</span>}
                      {item.color && <span>Color: {item.color}</span>}
                    </div>
                    <span className="text-xs text-text-subtle mt-0.5 block">
                      Qty: {item.quantity} &times; ₹{item.price?.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-sm font-serif font-bold text-primary">
                    ₹{item.totalPrice?.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing & Delivery Summary */}
        <div className="mt-8 pt-6 border-t border-border grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Shipping Address */}
          <div>
            <h4 className="text-xs uppercase tracking-widest font-bold text-text-main mb-3">
              Delivery Address
            </h4>
            {order.shippingAddress ? (
              <address className="not-italic text-xs text-text-secondary space-y-1 bg-surface-soft/60 p-4 rounded-xl border border-border">
                <p className="font-bold text-text-main">{order.shippingAddress.fullName}</p>
                <p>{order.shippingAddress.addressLine1}</p>
                {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                </p>
                <p>{order.shippingAddress.country}</p>
                {order.shippingAddress.phone && (
                  <p className="pt-1 text-text-subtle font-medium">Contact: {order.shippingAddress.phone}</p>
                )}
              </address>
            ) : (
              <p className="text-xs text-text-subtle italic">
                Boutique delivery details recorded on file.
              </p>
            )}
          </div>

          {/* Price Breakdown */}
          <div className="bg-surface-soft/60 p-4 rounded-xl border border-border space-y-2.5">
            <h4 className="text-xs uppercase tracking-widest font-bold text-text-main mb-3">
              Payment Summary
            </h4>

            <div className="flex items-center justify-between text-xs text-text-secondary">
              <span>Subtotal</span>
              <span>₹{(order.subtotal || order.totalAmount).toLocaleString()}</span>
            </div>

            {order.shippingFee !== undefined && (
              <div className="flex items-center justify-between text-xs text-text-secondary">
                <span>Shipping & Handloom Packaging</span>
                <span>{order.shippingFee === 0 ? "Complimentary" : `₹${order.shippingFee}`}</span>
              </div>
            )}

            {order.taxAmount ? (
              <div className="flex items-center justify-between text-xs text-text-secondary">
                <span>Estimated GST</span>
                <span>₹{order.taxAmount.toLocaleString()}</span>
              </div>
            ) : null}

            {order.discountAmount ? (
              <div className="flex items-center justify-between text-xs text-success">
                <span>Boutique Promotion</span>
                <span>-₹{order.discountAmount.toLocaleString()}</span>
              </div>
            ) : null}

            <div className="pt-2 border-t border-border flex items-center justify-between">
              <span className="text-sm font-bold text-text-main">Total Paid</span>
              <span className="text-lg font-serif font-bold text-primary">
                ₹{order.totalAmount.toLocaleString()}
              </span>
            </div>

            {order.paymentMethod && (
              <p className="text-[11px] text-text-subtle pt-1">
                Paid via {order.paymentMethod.toUpperCase()}
                {order.paymentStatus ? ` • Status: ${order.paymentStatus}` : ""}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
