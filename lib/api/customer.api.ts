import { getBackendBaseUrl } from "./auth.api";
import { BackendApiResponse } from "../auth/types";

/**
 * Customer profile structure returned by the backend.
 */
export interface CustomerProfile {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  avatarUrl?: string | null;
  role: string;
  createdAt: string;
}

/**
 * Customer address structure.
 */
export interface CustomerAddress {
  id: string;
  firstName?: string;
  lastName?: string;
  fullName: string;
  phone?: string;
  phoneNumber?: string;
  addressLine1: string;
  addressLine2?: string | null;
  address1?: string;
  address2?: string | null;
  city: string;
  state: string;
  postalCode: string;
  pincode?: string;
  country: string;
  isDefault: boolean;
}

/**
 * Customer order item preview.
 */
export interface OrderItem {
  id: string;
  title?: string;
  productName?: string;
  variantTitle?: string | null;
  quantity: number;
  price?: number;
  unitPrice?: number;
  totalPrice?: number;
  subtotal?: number;
  imageUrl?: string | null;
  size?: string | null;
  color?: string | null;
}

/**
 * Customer order tracking timeline step.
 */
export interface OrderTimelineStep {
  title: string;
  description: string;
  timestamp?: string;
  completed: boolean;
  current: boolean;
}

/**
 * Customer order summary structure.
 */
export interface CustomerOrder {
  id: string;
  orderNumber: string;
  status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  paymentStatus?: string;
  paymentMethod?: string;
  totalAmount: number;
  subtotal?: number;
  shippingFee?: number;
  taxAmount?: number;
  discountAmount?: number;
  currency: string;
  items: OrderItem[];
  itemCount: number;
  itemsCount?: number;
  courierPartner?: string | null;
  trackingNumber?: string | null;
  estimatedDelivery?: string | null;
  shippingAddress?: CustomerAddress | null;
  timeline?: OrderTimelineStep[];
  createdAt: string;
}

/**
 * Wishlist item structure.
 */
export interface WishlistItem {
  id: string;
  productId: string;
  product: {
    id: string;
    name: string;
    slug: string;
    primaryImage?: string | null;
    price: number;
    compareAtPrice?: number | null;
  };
  addedAt: string;
}

/**
 * Fetches the authenticated customer account profile from the backend.
 */
export const getCustomerProfile = async (
  accessToken: string
): Promise<CustomerProfile | null> => {
  if (!accessToken) return null;

  const baseUrl = getBackendBaseUrl();
  try {
    const res = await fetch(`${baseUrl}/customer/account`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    });

    if (!res.ok) return null;
    const json: BackendApiResponse<{
      account?: CustomerProfile & { firstName?: string; lastName?: string; phoneNumber?: string };
      user?: CustomerProfile & { firstName?: string; lastName?: string; phoneNumber?: string };
      customer?: CustomerProfile & { firstName?: string; lastName?: string; phoneNumber?: string };
    }> = await res.json();

    const account = json.data?.account || json.data?.user || json.data?.customer;
    if (!account) return null;

    return {
      id: account.id,
      name: account.name || `${account.firstName || ""} ${account.lastName || ""}`.trim(),
      email: account.email,
      phone: account.phone || account.phoneNumber || null,
      avatarUrl: account.avatarUrl || null,
      role: account.role || "USER",
      createdAt: account.createdAt,
    };
  } catch {
    return null;
  }
};

/**
 * Updates the authenticated customer profile via JSON payload.
 */
export const updateCustomerProfile = async (
  accessToken: string,
  data: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    phoneNumber?: string;
    avatarUrl?: string;
  }
): Promise<CustomerProfile> => {
  const baseUrl = getBackendBaseUrl();
  const res = await fetch(`${baseUrl}/customer/account`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(data),
    cache: "no-store",
  });

  const json: BackendApiResponse<{
    account?: CustomerProfile & { firstName?: string; lastName?: string; phoneNumber?: string };
    user?: CustomerProfile & { firstName?: string; lastName?: string; phoneNumber?: string };
    customer?: CustomerProfile & { firstName?: string; lastName?: string; phoneNumber?: string };
  }> = await res.json();

  if (!res.ok || !json.success) {
    throw new Error(json.message || "Failed to update profile");
  }

  const updated = json.data?.account || json.data?.user || json.data?.customer;
  if (!updated) {
    throw new Error("Invalid response from server");
  }

  return {
    id: updated.id,
    name: updated.name || `${updated.firstName || ""} ${updated.lastName || ""}`.trim(),
    email: updated.email,
    phone: updated.phone || updated.phoneNumber || null,
    avatarUrl: updated.avatarUrl || null,
    role: updated.role || "USER",
    createdAt: updated.createdAt,
  };
};

/**
 * Updates the authenticated customer profile via multipart/form-data
 * supporting direct avatar image uploads to Cloudinary.
 */
export const updateCustomerProfileWithFormData = async (
  accessToken: string,
  formData: FormData
): Promise<CustomerProfile> => {
  const baseUrl = getBackendBaseUrl();
  const res = await fetch(`${baseUrl}/customer/account`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: formData,
    cache: "no-store",
  });

  const json: BackendApiResponse<{
    account?: CustomerProfile & { firstName?: string; lastName?: string; phoneNumber?: string };
    user?: CustomerProfile & { firstName?: string; lastName?: string; phoneNumber?: string };
    customer?: CustomerProfile & { firstName?: string; lastName?: string; phoneNumber?: string };
  }> = await res.json();

  if (!res.ok || !json.success) {
    throw new Error(json.message || "Failed to upload avatar and update profile");
  }

  const updated = json.data?.account || json.data?.user || json.data?.customer;
  if (!updated) {
    throw new Error("Invalid response from server");
  }

  return {
    id: updated.id,
    name: updated.name || `${updated.firstName || ""} ${updated.lastName || ""}`.trim(),
    email: updated.email,
    phone: updated.phone || updated.phoneNumber || null,
    avatarUrl: updated.avatarUrl || null,
    role: updated.role || "USER",
    createdAt: updated.createdAt,
  };
};

/**
 * Changes the authenticated customer's password.
 */
export const changeCustomerPassword = async (
  accessToken: string,
  data: { currentPassword: string; newPassword: string }
): Promise<{ success: boolean; message: string }> => {
  const baseUrl = getBackendBaseUrl();
  const res = await fetch(`${baseUrl}/customer/account/password`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(data),
    cache: "no-store",
  });

  const json: BackendApiResponse = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || "Failed to change password");
  }

  return { success: true, message: json.message || "Password changed successfully" };
};

/**
 * Normalizes backend address object to unified CustomerAddress.
 */
const normalizeAddress = (raw: Record<string, unknown>): CustomerAddress => {
  const firstName = (raw.firstName as string) || "";
  const lastName = (raw.lastName as string) || "";
  const fullName =
    (raw.fullName as string) ||
    `${firstName} ${lastName}`.trim() ||
    "Valued Customer";
  const addressLine1 = (raw.address1 as string) || (raw.addressLine1 as string) || "";
  const addressLine2 = (raw.address2 as string) || (raw.addressLine2 as string) || null;
  const phone = (raw.phoneNumber as string) || (raw.phone as string) || "";

  return {
    id: (raw.id as string) || "",
    firstName,
    lastName,
    fullName,
    phone,
    phoneNumber: phone,
    addressLine1,
    addressLine2,
    address1: addressLine1,
    address2: addressLine2,
    city: (raw.city as string) || "",
    state: (raw.state as string) || "",
    postalCode: (raw.postalCode as string) || (raw.pincode as string) || "",
    pincode: (raw.postalCode as string) || (raw.pincode as string) || "",
    country: (raw.country as string) || "India",
    isDefault: Boolean(raw.isDefault),
  };
};

/**
 * Fetches all saved shipping addresses for the authenticated customer.
 */
export const getCustomerAddresses = async (
  accessToken: string
): Promise<CustomerAddress[]> => {
  if (!accessToken) return [];

  const baseUrl = getBackendBaseUrl();
  try {
    const res = await fetch(`${baseUrl}/customer/addresses`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    });

    if (!res.ok) return [];
    const json = await res.json();
    const rawList = Array.isArray(json.data)
      ? json.data
      : json.data?.addresses || [];
    return (rawList as Record<string, unknown>[]).map(normalizeAddress);
  } catch {
    return [];
  }
};

/**
 * Creates a new saved address for the customer.
 */
export const createCustomerAddress = async (
  accessToken: string,
  data: {
    firstName: string;
    lastName: string;
    address1: string;
    address2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone?: string;
    isDefault?: boolean;
  }
): Promise<CustomerAddress> => {
  const baseUrl = getBackendBaseUrl();
  const res = await fetch(`${baseUrl}/customer/addresses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(data),
    cache: "no-store",
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || "Failed to create address");
  }

  const rawAddress = json.data?.address || json.data;
  return normalizeAddress(rawAddress as Record<string, unknown>);
};

/**
 * Deletes a saved address by ID.
 */
export const deleteCustomerAddress = async (
  accessToken: string,
  addressId: string
): Promise<void> => {
  const baseUrl = getBackendBaseUrl();
  const res = await fetch(`${baseUrl}/customer/addresses/${addressId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || "Failed to delete address");
  }
};

/**
 * Marks an existing address as default.
 */
export const setDefaultCustomerAddress = async (
  accessToken: string,
  addressId: string
): Promise<void> => {
  const baseUrl = getBackendBaseUrl();
  const res = await fetch(`${baseUrl}/customer/addresses/${addressId}/default`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || "Failed to set default address");
  }
};

/**
 * Normalizes backend order object to unified CustomerOrder.
 */
const normalizeOrder = (raw: Record<string, unknown>): CustomerOrder => {
  const rawItems = Array.isArray(raw.items) ? raw.items : [];
  const items: OrderItem[] = (rawItems as Record<string, unknown>[]).map((it) => {
    const unitPrice = Number(it.price || it.unitPrice || 0);
    const quantity = Number(it.quantity || 1);
    const totalPrice = Number(it.totalPrice || it.subtotal || unitPrice * quantity);
    const productName = (it.title as string) || (it.productName as string) || "Couture Garment";

    return {
      id: (it.id as string) || "",
      title: productName,
      productName,
      quantity,
      price: unitPrice,
      unitPrice,
      totalPrice,
      subtotal: totalPrice,
      imageUrl: (it.imageUrl as string) || null,
      size: (it.size as string) || null,
      color: (it.color as string) || null,
    };
  });

  const totalAmount = Number(raw.totalAmount || 0);
  const itemCount = items.reduce((acc, it) => acc + it.quantity, 0);

  return {
    id: (raw.id as string) || "",
    orderNumber: String(raw.orderNumber || ""),
    status: (raw.status as CustomerOrder["status"]) || "PENDING",
    paymentStatus: (raw.paymentStatus as string) || undefined,
    paymentMethod: (raw.paymentMethod as string) || undefined,
    totalAmount,
    subtotal: raw.subtotal ? Number(raw.subtotal) : undefined,
    shippingFee: raw.shippingFee ? Number(raw.shippingFee) : 0,
    taxAmount: raw.taxAmount ? Number(raw.taxAmount) : 0,
    discountAmount: raw.discountAmount ? Number(raw.discountAmount) : 0,
    currency: (raw.currency as string) || "₹",
    items,
    itemCount,
    itemsCount: itemCount,
    courierPartner: (raw.courierPartner as string) || null,
    trackingNumber: (raw.trackingNumber as string) || null,
    estimatedDelivery: (raw.estimatedDelivery as string) || null,
    shippingAddress: raw.shippingAddress
      ? normalizeAddress(raw.shippingAddress as Record<string, unknown>)
      : null,
    createdAt: (raw.createdAt as string) || new Date().toISOString(),
  };
};

/**
 * Fetches the order history for the authenticated customer.
 */
export const getCustomerOrders = async (
  accessToken: string
): Promise<CustomerOrder[]> => {
  if (!accessToken) return [];

  const baseUrl = getBackendBaseUrl();
  try {
    const res = await fetch(`${baseUrl}/orders`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    });

    if (!res.ok) return [];
    const json = await res.json();
    const rawList = Array.isArray(json.data)
      ? json.data
      : json.data?.orders || [];
    return (rawList as Record<string, unknown>[]).map(normalizeOrder);
  } catch {
    return [];
  }
};

/**
 * Fetches single order details by human-readable order number.
 */
export const getCustomerOrderByNumber = async (
  accessToken: string,
  orderNumber: string
): Promise<CustomerOrder | null> => {
  if (!accessToken || !orderNumber) return null;

  const baseUrl = getBackendBaseUrl();
  try {
    const res = await fetch(`${baseUrl}/orders/${encodeURIComponent(orderNumber)}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    });

    if (!res.ok) return null;
    const json = await res.json();
    const rawOrder = json.data?.order || json.data;
    if (!rawOrder) return null;
    return normalizeOrder(rawOrder as Record<string, unknown>);
  } catch {
    return null;
  }
};

/**
 * Normalizes backend wishlist item to unified WishlistItem.
 */
const normalizeWishlistItem = (raw: Record<string, unknown>): WishlistItem => {
  const wishlistItemId = (raw.wishlistItemId as string) || (raw.id as string) || "";
  const productId = (raw.productId as string) || ((raw.product as Record<string, unknown>)?.id as string) || "";
  const name =
    (raw.name as string) ||
    ((raw.product as Record<string, unknown>)?.name as string) ||
    "Boutique Handloom Ensemble";
  const slug =
    (raw.slug as string) ||
    ((raw.product as Record<string, unknown>)?.slug as string) ||
    "";
  const primaryImage =
    (raw.thumbnail as string) ||
    ((raw.product as Record<string, unknown>)?.primaryImage as string) ||
    null;

  let price = 0;
  let compareAtPrice: number | null = null;

  if (raw.pricing && typeof raw.pricing === "object") {
    const pr = raw.pricing as Record<string, unknown>;
    price = Number(pr.effectivePrice || pr.regularPrice || 0);
    if (pr.salePrice && pr.regularPrice && Number(pr.regularPrice) > Number(pr.salePrice)) {
      compareAtPrice = Number(pr.regularPrice);
    }
  } else if (raw.product && typeof raw.product === "object") {
    const prod = raw.product as Record<string, unknown>;
    price = Number(prod.price || 0);
    compareAtPrice = prod.compareAtPrice ? Number(prod.compareAtPrice) : null;
  }

  return {
    id: wishlistItemId,
    productId,
    product: {
      id: productId,
      name,
      slug,
      primaryImage,
      price,
      compareAtPrice,
    },
    addedAt: (raw.addedAt as string) || new Date().toISOString(),
  };
};

/**
 * Fetches saved wishlist items for the authenticated customer.
 */
export const getCustomerWishlist = async (
  accessToken: string
): Promise<WishlistItem[]> => {
  if (!accessToken) return [];

  const baseUrl = getBackendBaseUrl();
  try {
    const res = await fetch(`${baseUrl}/wishlist`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    });

    if (!res.ok) return [];
    const json = await res.json();
    const rawList = Array.isArray(json.data)
      ? json.data
      : json.data?.items || [];
    return (rawList as Record<string, unknown>[]).map(normalizeWishlistItem);
  } catch {
    return [];
  }
};

/**
 * Removes an item from the customer's wishlist by product ID.
 */
export const removeWishlistItem = async (
  accessToken: string,
  productId: string
): Promise<void> => {
  const baseUrl = getBackendBaseUrl();
  const res = await fetch(`${baseUrl}/wishlist/${productId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || "Failed to remove item from wishlist");
  }
};
