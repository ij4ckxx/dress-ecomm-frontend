"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServerAccessToken, requireAuth } from "@/lib/auth";
import {
  updateCustomerProfile,
  updateCustomerProfileWithFormData,
  changeCustomerPassword,
  createCustomerAddress,
  deleteCustomerAddress,
  setDefaultCustomerAddress,
  removeWishlistItem,
} from "@/lib/api/customer.api";
import { ActionState } from "@/lib/auth/types";

/**
 * Reusable helper executing an authenticated customer operation.
 * Automatically attempts token rotation and retries the operation once
 * if an "Invalid or expired access token" error is returned by the backend.
 */
async function withTokenRetry<T>(
  operation: (token: string) => Promise<T>
): Promise<T> {
  const initialToken = await getServerAccessToken();
  if (!initialToken) {
    throw new Error("Session expired. Please log in again.");
  }

  try {
    return await operation(initialToken);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message.toLowerCase() : "";
    const isTokenError =
      message.includes("invalid or expired access token") ||
      message.includes("invalid_token") ||
      message.includes("unauthorized");

    if (isTokenError) {
      const refreshedToken = await getServerAccessToken({ forceRefresh: true });
      if (refreshedToken) {
        return await operation(refreshedToken);
      }
    }
    throw error;
  }
}

/**
 * Server action to update customer personal profile details.
 * Supports firstName, lastName, email, phone, and avatar upload to Cloudinary.
 */
export const updateProfileAction = async (
  _prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> => {
  await requireAuth();

  // Extract fields
  const firstName = (formData.get("firstName") as string)?.trim() || "";
  const lastName = (formData.get("lastName") as string)?.trim() || "";
  const email = (formData.get("email") as string)?.trim()?.toLowerCase() || "";
  const phone = (formData.get("phone") as string)?.trim() || "";
  const avatarUrl = (formData.get("avatarUrl") as string)?.trim() || "";
  const avatarFile = formData.get("avatar") as File | null;

  if (!firstName) {
    return {
      success: false,
      message: "First name is required.",
      errors: { firstName: ["First name is required."] },
    };
  }

  if (!lastName) {
    return {
      success: false,
      message: "Last name is required.",
      errors: { lastName: ["Last name is required."] },
    };
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return {
      success: false,
      message: "A valid email address is required.",
      errors: { email: ["Please enter a valid email address."] },
    };
  }

  if (phone && !/^[+]?[0-9\s\-()]{7,20}$/.test(phone)) {
    return {
      success: false,
      message: "Please enter a valid phone number (7-20 digits).",
      errors: { phone: ["Please enter a valid phone number (7-20 digits)."] },
    };
  }

  try {
    const hasValidFile =
      avatarFile instanceof File &&
      avatarFile.size > 0 &&
      avatarFile.name !== "undefined" &&
      avatarFile.name !== "";

    await withTokenRetry(async (token) => {
      if (hasValidFile) {
        // Build multipart FormData for direct Cloudinary upload via backend
        const uploadData = new FormData();
        uploadData.append("firstName", firstName);
        uploadData.append("lastName", lastName);
        uploadData.append("email", email);
        if (phone) uploadData.append("phone", phone);
        uploadData.append("avatar", avatarFile);

        await updateCustomerProfileWithFormData(token, uploadData);
      } else {
        // JSON update
        await updateCustomerProfile(token, {
          firstName,
          lastName,
          email,
          phone: phone || undefined,
          avatarUrl: avatarUrl || undefined,
        });
      }
    });

    revalidatePath("/account/profile");
    revalidatePath("/account");

    return {
      success: true,
      message: "Your profile details have been saved successfully.",
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to update profile.",
    };
  }
};

/**
 * Server action to change customer account password securely.
 */
export const changePasswordAction = async (
  _prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> => {
  await requireAuth();

  const currentPassword = (formData.get("currentPassword") as string) || "";
  const newPassword = (formData.get("newPassword") as string) || "";
  const confirmPassword = (formData.get("confirmPassword") as string) || "";

  if (!currentPassword) {
    return {
      success: false,
      message: "Please enter your current password.",
    };
  }

  if (newPassword.length < 8) {
    return {
      success: false,
      message: "New password must be at least 8 characters long.",
    };
  }

  if (!/[A-Za-z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
    return {
      success: false,
      message: "New password must contain at least one letter and one number.",
    };
  }

  if (newPassword !== confirmPassword) {
    return {
      success: false,
      message: "New passwords do not match.",
    };
  }

  if (newPassword === currentPassword) {
    return {
      success: false,
      message: "New password must be different from your current password.",
    };
  }

  try {
    const res = await withTokenRetry(async (token) => {
      return await changeCustomerPassword(token, {
        currentPassword,
        newPassword,
      });
    });

    return {
      success: true,
      message: res.message || "Your password has been changed successfully.",
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to change password.",
    };
  }
};

/**
 * Server action to create a new delivery address for the customer.
 */
export const createAddressAction = async (
  _prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> => {
  await requireAuth();
  const accessToken = await getServerAccessToken();

  if (!accessToken) {
    return {
      success: false,
      message: "Session expired. Please log in again.",
    };
  }

  const firstName = (formData.get("firstName") as string) || "";
  const lastName = (formData.get("lastName") as string) || "";
  const address1 = (formData.get("address1") as string) || "";
  const address2 = (formData.get("address2") as string) || "";
  const city = (formData.get("city") as string) || "";
  const state = (formData.get("state") as string) || "";
  const postalCode = (formData.get("postalCode") as string) || "";
  const country = (formData.get("country") as string) || "India";
  const phone = (formData.get("phone") as string) || "";
  const isDefault = formData.get("isDefault") === "on";

  if (!firstName.trim() || !lastName.trim()) {
    return { success: false, message: "First and last name are required." };
  }
  if (!address1.trim()) {
    return { success: false, message: "Street address is required." };
  }
  if (!city.trim() || !state.trim()) {
    return { success: false, message: "City and State are required." };
  }
  if (!postalCode.trim()) {
    return { success: false, message: "Pincode / Postal code is required." };
  }

  try {
    await withTokenRetry(async (token) => {
      await createCustomerAddress(token, {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        address1: address1.trim(),
        address2: address2.trim() || undefined,
        city: city.trim(),
        state: state.trim(),
        postalCode: postalCode.trim(),
        country: country.trim(),
        phone: phone.trim() || undefined,
        isDefault,
      });
    });

    revalidatePath("/account/addresses");
    revalidatePath("/account");

    return {
      success: true,
      message: "Address saved to your boutique address book.",
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to save address.",
    };
  }
};

/**
 * Server action to delete an address.
 */
export const deleteAddressAction = async (
  addressId: string
): Promise<ActionState> => {
  await requireAuth();

  try {
    await withTokenRetry(async (token) => {
      await deleteCustomerAddress(token, addressId);
    });
    revalidatePath("/account/addresses");
    revalidatePath("/account");

    return {
      success: true,
      message: "Address deleted successfully.",
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to delete address.",
    };
  }
};

/**
 * Server action to set an address as the default.
 */
export const setDefaultAddressAction = async (
  addressId: string
): Promise<ActionState> => {
  await requireAuth();

  try {
    await withTokenRetry(async (token) => {
      await setDefaultCustomerAddress(token, addressId);
    });
    revalidatePath("/account/addresses");
    revalidatePath("/account");

    return {
      success: true,
      message: "Default delivery address updated.",
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to set default address.",
    };
  }
};

/**
 * Server action to remove a product from customer wishlist.
 */
export const removeWishlistItemAction = async (
  productId: string
): Promise<ActionState> => {
  await requireAuth();

  try {
    await withTokenRetry(async (token) => {
      await removeWishlistItem(token, productId);
    });
    revalidatePath("/account/wishlist");
    revalidatePath("/account");

    return {
      success: true,
      message: "Item removed from your wishlist.",
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to update wishlist.",
    };
  }
};

/**
 * Server action to handle newsletter subscription requests.
 */
export const subscribeNewsletterAction = async (
  _prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> => {
  const email = (formData.get("email") as string) || "";

  if (!email || !email.includes("@")) {
    return {
      success: false,
      message: "Please provide a valid email address.",
    };
  }

  return {
    success: true,
    message: "Thank you for joining The Vanya Privé. Invitations will be sent to your inbox.",
  };
};

/**
 * Server action to process store search query and route to search results.
 */
export const searchProductsAction = async (formData: FormData): Promise<void> => {
  const query = (formData.get("q") as string) || "";
  const trimmed = query.trim();
  if (trimmed) {
    redirect(`/search?q=${encodeURIComponent(trimmed)}`);
  }
};
