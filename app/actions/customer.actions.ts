"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServerAccessToken, requireAuth } from "@/lib/auth";
import {
  updateCustomerProfile,
  changeCustomerPassword,
  createCustomerAddress,
  deleteCustomerAddress,
  setDefaultCustomerAddress,
  removeWishlistItem,
} from "@/lib/api/customer.api";
import { ActionState } from "@/lib/auth/types";

/**
 * Server action to update customer personal profile details.
 */
export const updateProfileAction = async (
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

  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;

  if (!name || name.trim().length < 2) {
    return {
      success: false,
      message: "Full name must be at least 2 characters.",
    };
  }

  try {
    await updateCustomerProfile(accessToken, {
      name: name.trim(),
      phone: phone ? phone.trim() : undefined,
    });

    revalidatePath("/account/profile");
    revalidatePath("/account");

    return {
      success: true,
      message: "Your profile has been updated successfully.",
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
  const accessToken = await getServerAccessToken();

  if (!accessToken) {
    return {
      success: false,
      message: "Session expired. Please log in again.",
    };
  }

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
    const res = await changeCustomerPassword(accessToken, {
      currentPassword,
      newPassword,
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
    await createCustomerAddress(accessToken, {
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
  const accessToken = await getServerAccessToken();

  if (!accessToken) {
    return {
      success: false,
      message: "Session expired. Please log in again.",
    };
  }

  try {
    await deleteCustomerAddress(accessToken, addressId);
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
  const accessToken = await getServerAccessToken();

  if (!accessToken) {
    return {
      success: false,
      message: "Session expired. Please log in again.",
    };
  }

  try {
    await setDefaultCustomerAddress(accessToken, addressId);
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
  const accessToken = await getServerAccessToken();

  if (!accessToken) {
    return {
      success: false,
      message: "Session expired. Please log in again.",
    };
  }

  try {
    await removeWishlistItem(accessToken, productId);
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
