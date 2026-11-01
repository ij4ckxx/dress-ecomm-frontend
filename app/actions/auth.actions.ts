"use server";

import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { signIn, signOut } from "@/lib/auth";
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
} from "@/lib/validations/auth.schema";
import {
  registerUser,
  requestPasswordReset,
  resetPasswordWithToken,
} from "@/lib/api/auth.api";
import { ActionState } from "@/lib/auth/types";

/**
 * Server action to authenticate a user with email and password.
 */
export const loginAction = async (
  _prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> => {
  const rawData = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const parsed = loginSchema.safeParse(rawData);
  if (!parsed.success) {
    return {
      success: false,
      message: "Please correct the form errors.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirect: false,
    });

    return {
      success: true,
      message: "Login successful",
    };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return {
            success: false,
            message: "Invalid email or password.",
          };
        default:
          return {
            success: false,
            message: "An unexpected authentication error occurred.",
          };
      }
    }

    // Re-throw Next.js redirect errors if any
    const err = error as { digest?: string };
    if (err?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }

    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to sign in.",
    };
  }
};

/**
 * Server action to register a new customer account.
 */
export const registerAction = async (
  _prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> => {
  const rawData = {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
    phone: formData.get("phone") || undefined,
  };

  const parsed = registerSchema.safeParse(rawData);
  if (!parsed.success) {
    return {
      success: false,
      message: "Please correct the form errors.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await registerUser(parsed.data);

    // Automatically sign in the user immediately after account creation
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirect: false,
    });

    return {
      success: true,
      message: "Account created successfully! Welcome to Saayal Stories.",
    };
  } catch (error) {
    const err = error as { digest?: string };
    if (err?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }

    return {
      success: false,
      message: error instanceof Error ? error.message : "Registration failed.",
    };
  }
};

/**
 * Server action to initiate password recovery for a user.
 */
export const forgotPasswordAction = async (
  _prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> => {
  const rawData = {
    email: formData.get("email"),
  };

  const parsed = forgotPasswordSchema.safeParse(rawData);
  if (!parsed.success) {
    return {
      success: false,
      message: "Please enter a valid email address.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const message = await requestPasswordReset(parsed.data);
    return {
      success: true,
      message,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to send reset email.",
    };
  }
};

/**
 * Server action to reset password using token sent to user's email.
 */
export const resetPasswordAction = async (
  _prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> => {
  const rawData = {
    email: formData.get("email"),
    token: formData.get("token"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  };

  const parsed = resetPasswordSchema.safeParse(rawData);
  if (!parsed.success) {
    return {
      success: false,
      message: "Please verify all fields.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const message = await resetPasswordWithToken({
      email: parsed.data.email,
      token: parsed.data.token,
      newPassword: parsed.data.newPassword,
    });
    return {
      success: true,
      message,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to reset password.",
    };
  }
};

/**
 * Server action to log out the user and clear session cookies.
 */
export const logoutAction = async (): Promise<void> => {
  await signOut({ redirect: false });
  redirect("/login");
};

/**
 * Server action to initiate Google OAuth sign-in.
 */
export const initiateGoogleSignInAction = async (): Promise<void> => {
  await signIn("google", { redirectTo: "/account" });
};
