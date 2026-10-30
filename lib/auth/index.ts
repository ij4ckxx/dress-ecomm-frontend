import NextAuth from "next-auth";
import { redirect } from "next/navigation";
import { authConfig } from "./auth.config";
import { SafeUser, UserRole } from "./types";
import { logoutUser } from "../api/auth.api";

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);

/**
 * Retrieves the currently authenticated user from the server session.
 * Returns null if the user is unauthenticated.
 */
export const getCurrentUser = async (): Promise<SafeUser | null> => {
  const session = await auth();
  if (!session?.user?.id) {
    return null;
  }
  return session.user as unknown as SafeUser;
};

/**
 * Requires an authenticated user session.
 * Redirects to the login page if unauthenticated.
 */
export const requireAuth = async (redirectTo: string = "/login"): Promise<SafeUser> => {
  const user = await getCurrentUser();
  if (!user) {
    redirect(redirectTo);
  }
  return user;
};

/**
 * Validates whether the user has one of the required roles.
 */
export const hasRole = (
  user: SafeUser | null | undefined,
  allowedRoles: UserRole[]
): boolean => {
  if (!user) return false;
  return allowedRoles.includes(user.role);
};

/**
 * Enforces role-based authorization for protected server operations.
 * Throws an authorization error if the user lacks the required permission.
 */
export const requireRole = async (allowedRoles: UserRole[]): Promise<SafeUser> => {
  const user = await requireAuth();
  if (!hasRole(user, allowedRoles)) {
    throw new Error("Forbidden: Insufficient privileges to perform this action");
  }
  return user;
};

/**
 * Server-only helper to terminate both Auth.js session and backend refresh token.
 */
export const logoutServerSession = async (refreshToken?: string): Promise<void> => {
  if (refreshToken) {
    await logoutUser(refreshToken);
  }
  await signOut({ redirect: false });
};

