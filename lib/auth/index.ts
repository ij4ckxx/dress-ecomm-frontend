import NextAuth from "next-auth";
import { getToken, encode } from "next-auth/jwt";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { authConfig } from "./auth.config";
import { BackendTokens, SafeUser, UserRole } from "./types";
import { logoutUser, refreshAccessToken } from "../api/auth.api";

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
 * Server-only helper to safely retrieve the backend access token for API communications.
 * Checks token expiration and automatically executes rotation/refresh when expired or
 * close to expiry (within 60 seconds of expiration).
 * In Server Actions or Route Handlers, writes the newly encrypted session cookie back to the response.
 * In Server Components, safely returns the fresh access token for immediate API fetching.
 * Never exposed to client-side bundles.
 */
export const getServerAccessToken = async (options?: {
  forceRefresh?: boolean;
}): Promise<string | null> => {
  const reqCookies = await cookies();
  const reqHeaders = await headers();

  const secret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET;
  if (!secret) {
    return null;
  }

  // Decrypt current session token from cookie
  const token = await getToken({
    req: {
      headers: Object.fromEntries(reqHeaders.entries()),
      cookies: Object.fromEntries(reqCookies.getAll().map((c) => [c.name, c.value])),
    } as unknown as Request,
    secret,
  });

  if (!token) {
    return null;
  }

  const backendTokens = token.backendTokens as BackendTokens | undefined;
  if (!backendTokens?.accessToken) {
    return null;
  }

  // Check if token is still valid (with a 60-second grace window)
  const isExpiringSoon =
    options?.forceRefresh ||
    !backendTokens.accessTokenExpiresAt ||
    Date.now() >= backendTokens.accessTokenExpiresAt - 60_000;

  if (!isExpiringSoon) {
    return backendTokens.accessToken;
  }

  // If expired or expiring soon, refresh token via backend refresh endpoint
  if (!backendTokens.refreshToken) {
    return null;
  }

  try {
    const refreshed = await refreshAccessToken(backendTokens.refreshToken, {
      userAgent: reqHeaders.get("user-agent") || undefined,
      ipAddress: reqHeaders.get("x-forwarded-for") || undefined,
    });
    const updatedBackendTokens: BackendTokens = {
      accessToken: refreshed.accessToken,
      refreshToken: refreshed.refreshToken,
      accessTokenExpiresAt: Date.now() + 14 * 60 * 1000,
    };

    token.backendTokens = updatedBackendTokens;
    if (refreshed.user) {
      token.user = refreshed.user;
    }

    // Attempt to persist the rotated token in the session cookie if supported in current context
    // (Allowed in Server Actions and Route Handlers; safely caught in Server Component render phase)
    try {
      const isSecure =
        process.env.NODE_ENV === "production" &&
        !reqHeaders.get("host")?.includes("localhost");

      const candidateNames = isSecure
        ? ["__Secure-authjs.session-token", "__Secure-next-auth.session-token", "authjs.session-token", "next-auth.session-token"]
        : ["authjs.session-token", "next-auth.session-token", "__Secure-authjs.session-token", "__Secure-next-auth.session-token"];

      let activeCookieName = isSecure ? "__Secure-authjs.session-token" : "authjs.session-token";
      for (const name of candidateNames) {
        if (reqCookies.get(name)) {
          activeCookieName = name;
          break;
        }
      }

      const encodedToken = await encode({
        token,
        secret,
        salt: activeCookieName,
        maxAge: 7 * 24 * 60 * 60,
      });

      reqCookies.set(activeCookieName, encodedToken, {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: isSecure,
        maxAge: 7 * 24 * 60 * 60,
      });
    } catch {
      // Cookies cannot be mutated in Server Components during render.
      // The refreshed accessToken is returned directly for use in the current render.
    }

    return refreshed.accessToken;
  } catch (error) {
    console.warn("Unable to refresh backend access token:", error);
    return null;
  }
};

/**
 * Server-only helper to update the authenticated user's session cookie with fresh profile data.
 * Must be called in Server Actions or Route Handlers where cookies can be mutated.
 */
export const updateServerSessionUser = async (
  updatedUser: Partial<SafeUser>
): Promise<void> => {
  const reqCookies = await cookies();
  const reqHeaders = await headers();

  const secret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET;
  if (!secret) return;

  const token = await getToken({
    req: {
      headers: Object.fromEntries(reqHeaders.entries()),
      cookies: Object.fromEntries(reqCookies.getAll().map((c) => [c.name, c.value])),
    } as unknown as Request,
    secret,
  });

  if (!token || !token.user) return;

  const currentSafe = token.user as SafeUser;
  token.user = {
    ...currentSafe,
    ...updatedUser,
  };

  try {
    const isSecure =
      process.env.NODE_ENV === "production" &&
      !reqHeaders.get("host")?.includes("localhost");

    const candidateNames = isSecure
      ? ["__Secure-authjs.session-token", "__Secure-next-auth.session-token", "authjs.session-token", "next-auth.session-token"]
      : ["authjs.session-token", "next-auth.session-token", "__Secure-authjs.session-token", "__Secure-next-auth.session-token"];

    let activeCookieName = isSecure ? "__Secure-authjs.session-token" : "authjs.session-token";
    for (const name of candidateNames) {
      if (reqCookies.get(name)) {
        activeCookieName = name;
        break;
      }
    }

    const encodedToken = await encode({
      token,
      secret,
      salt: activeCookieName,
      maxAge: 7 * 24 * 60 * 60,
    });

    reqCookies.set(activeCookieName, encodedToken, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      secure: isSecure,
      maxAge: 7 * 24 * 60 * 60,
    });
  } catch (error) {
    console.warn("Could not persist session update to cookies:", error);
  }
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
