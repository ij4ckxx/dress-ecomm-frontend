import {
  BackendApiResponse,
  BackendAuthData,
  SafeUser,
} from "../auth/types";
import {
  ForgotPasswordInput,
  LoginInput,
  RegisterInput,
  ResetPasswordInput,
} from "../validations/auth.schema";

/**
 * Resolves the base URL for backend API requests from environment variables.
 */
export const getBackendBaseUrl = (): string => {
  return (
    process.env.AUTH_API_BASE_URL ||
    "https://dress-ecomm-backend.onrender.com/api/v1"
  );
};

/**
 * Extracts the refresh token string from backend Set-Cookie headers.
 */
export const extractRefreshTokenFromHeaders = (headers: Headers): string | null => {
  const getSetCookie = (headers as unknown as { getSetCookie?: () => string[] }).getSetCookie;
  const cookieHeaders = typeof getSetCookie === "function"
    ? getSetCookie.call(headers)
    : [headers.get("set-cookie") || ""];

  for (const cookieHeader of cookieHeaders) {
    if (!cookieHeader) continue;
    const match = cookieHeader.match(/refreshToken=([^;]+)/);
    if (match?.[1]) {
      return decodeURIComponent(match[1]);
    }
  }

  return null;
};

/**
 * Authenticates user credentials with the backend service.
 */
export const loginWithCredentials = async (
  credentials: LoginInput,
  clientMeta?: { userAgent?: string; ipAddress?: string }
): Promise<{
  user: SafeUser;
  accessToken: string;
  refreshToken: string;
}> => {
  const baseUrl = getBackendBaseUrl();
  const response = await fetch(`${baseUrl}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(clientMeta?.userAgent ? { "User-Agent": clientMeta.userAgent } : {}),
      ...(clientMeta?.ipAddress ? { "X-Forwarded-For": clientMeta.ipAddress } : {}),
    },
    body: JSON.stringify(credentials),
    cache: "no-store",
  });

  const payload: BackendApiResponse<BackendAuthData> = await response.json();

  if (!response.ok || !payload.success || !payload.data) {
    const errorMessage = payload.message || "Invalid email or password";
    throw new Error(errorMessage);
  }

  const setCookieToken = extractRefreshTokenFromHeaders(response.headers);
  const refreshToken = setCookieToken || "";

  return {
    user: payload.data.user,
    accessToken: payload.data.accessToken,
    refreshToken,
  };
};

/**
 * Registers a new customer account via the backend API.
 */
export const registerUser = async (
  data: RegisterInput
): Promise<SafeUser> => {
  const baseUrl = getBackendBaseUrl();
  const response = await fetch(`${baseUrl}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: data.name,
      email: data.email,
      password: data.password,
      ...(data.phone ? { phone: data.phone } : {}),
      ...(data.avatarUrl ? { avatarUrl: data.avatarUrl } : {}),
    }),
    cache: "no-store",
  });

  const payload: BackendApiResponse<{ user: SafeUser }> = await response.json();

  if (!response.ok || !payload.success || !payload.data?.user) {
    const errorMessage = payload.message || "Failed to register account";
    throw new Error(errorMessage);
  }

  return payload.data.user;
};

/**
 * Authenticates or links a social OAuth account with the backend service.
 */
export const loginWithSocial = async (
  socialPayload: {
    provider: "google" | "facebook" | "github" | "apple";
    token?: string;
    providerAccountId?: string;
    email?: string;
    name?: string;
    avatarUrl?: string | null;
  },
  clientMeta?: { userAgent?: string; ipAddress?: string }
): Promise<{
  user: SafeUser;
  accessToken: string;
  refreshToken: string;
}> => {
  const baseUrl = getBackendBaseUrl();
  const response = await fetch(`${baseUrl}/auth/social-login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(clientMeta?.userAgent ? { "User-Agent": clientMeta.userAgent } : {}),
      ...(clientMeta?.ipAddress ? { "X-Forwarded-For": clientMeta.ipAddress } : {}),
    },
    body: JSON.stringify(socialPayload),
    cache: "no-store",
  });

  const payload: BackendApiResponse<BackendAuthData> = await response.json();

  if (!response.ok || !payload.success || !payload.data) {
    const errorMessage = payload.message || "Social login failed";
    throw new Error(errorMessage);
  }

  const setCookieToken = extractRefreshTokenFromHeaders(response.headers);

  return {
    user: payload.data.user,
    accessToken: payload.data.accessToken,
    refreshToken: setCookieToken || "",
  };
};

export interface RefreshResult {
  user: SafeUser;
  accessToken: string;
  refreshToken: string;
}

// In-flight refresh promise map to prevent parallel/competing refreshes for the same token
const inFlightRefreshes = new Map<string, Promise<RefreshResult>>();

// Recent rotation cache (30-second TTL) so concurrent requests reusing the old token get the fresh result
const recentRotationCache = new Map<
  string,
  { result: RefreshResult; expiresAt: number }
>();

const CACHE_TTL_MS = 30 * 1000; // 30 seconds

/**
 * Cleans up expired entries from the recent rotation cache.
 */
const cleanupRotationCache = (): void => {
  const now = Date.now();
  for (const [key, value] of recentRotationCache.entries()) {
    if (value.expiresAt <= now) {
      recentRotationCache.delete(key);
    }
  }
};

/**
 * Refreshes an expired backend access token using a valid refresh token.
 * Leverages single-flight deduplication and recent rotation caching to prevent
 * concurrency races and premature 401 session terminations under strict token rotation.
 */
export const refreshAccessToken = async (
  refreshToken: string,
  clientMeta?: { userAgent?: string; ipAddress?: string }
): Promise<RefreshResult> => {
  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  cleanupRotationCache();

  // 1. Check if this token was already rotated in the last 30 seconds
  const cached = recentRotationCache.get(refreshToken);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.result;
  }

  // 2. Check if a refresh request for this token is currently in flight
  const existingPromise = inFlightRefreshes.get(refreshToken);
  if (existingPromise) {
    return await existingPromise;
  }

  // 3. Initiate single-flight refresh operation
  const refreshPromise = (async (): Promise<RefreshResult> => {
    try {
      const baseUrl = getBackendBaseUrl();
      const response = await fetch(`${baseUrl}/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: `refreshToken=${refreshToken}`,
          ...(clientMeta?.userAgent ? { "User-Agent": clientMeta.userAgent } : {}),
          ...(clientMeta?.ipAddress ? { "X-Forwarded-For": clientMeta.ipAddress } : {}),
        },
        body: JSON.stringify({ refreshToken }),
        cache: "no-store",
      });

      const payload: BackendApiResponse<BackendAuthData> = await response.json();

      if (!response.ok || !payload.success || !payload.data) {
        throw new Error(payload.message || "Token refresh failed");
      }

      const newSetCookieToken = extractRefreshTokenFromHeaders(response.headers);
      const newRefreshToken =
        newSetCookieToken || payload.data.refreshToken || refreshToken;

      const result: RefreshResult = {
        user: payload.data.user,
        accessToken: payload.data.accessToken,
        refreshToken: newRefreshToken,
      };

      // Cache rotation result for 30s under BOTH old and new refresh tokens
      const expiresAt = Date.now() + CACHE_TTL_MS;
      recentRotationCache.set(refreshToken, { result, expiresAt });
      if (newRefreshToken && newRefreshToken !== refreshToken) {
        recentRotationCache.set(newRefreshToken, { result, expiresAt });
      }

      return result;
    } finally {
      inFlightRefreshes.delete(refreshToken);
    }
  })();

  inFlightRefreshes.set(refreshToken, refreshPromise);
  return await refreshPromise;
};

/**
 * Revokes backend refresh token and session on logout.
 */
export const logoutUser = async (refreshToken?: string): Promise<void> => {
  if (!refreshToken) return;

  const baseUrl = getBackendBaseUrl();
  try {
    await fetch(`${baseUrl}/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `refreshToken=${refreshToken}`,
      },
      body: JSON.stringify({ refreshToken }),
      cache: "no-store",
    });
  } catch {
    // Gracefully ignore network errors on logout so local session always clears
  }
};

/**
 * Dispatches a password reset link to the user's email address.
 */
export const requestPasswordReset = async (
  payload: ForgotPasswordInput
): Promise<string> => {
  const baseUrl = getBackendBaseUrl();
  const response = await fetch(`${baseUrl}/auth/forgot-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  const resData: BackendApiResponse = await response.json();

  if (!response.ok) {
    throw new Error(resData.message || "Failed to process password reset request");
  }

  return (
    resData.message ||
    "If an account exists with that email, a password reset link has been dispatched."
  );
};

/**
 * Resets user password using the verification token sent via email.
 */
export const resetPasswordWithToken = async (
  payload: { email: string; token: string; newPassword: string }
): Promise<string> => {
  const baseUrl = getBackendBaseUrl();
  const response = await fetch(`${baseUrl}/auth/reset-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: payload.email,
      token: payload.token,
      newPassword: payload.newPassword,
    }),
    cache: "no-store",
  });

  const resData: BackendApiResponse = await response.json();

  if (!response.ok || !resData.success) {
    throw new Error(resData.message || "Failed to reset password");
  }

  return resData.message || "Password has been successfully reset.";
};

/**
 * Fetches the authenticated user profile from the backend using access token.
 */
export const fetchCurrentUserProfile = async (
  accessToken: string
): Promise<SafeUser> => {
  const baseUrl = getBackendBaseUrl();
  const response = await fetch(`${baseUrl}/auth/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  const resData: BackendApiResponse<{ user: SafeUser }> = await response.json();

  if (!response.ok || !resData.success || !resData.data?.user) {
    throw new Error(resData.message || "Failed to fetch user profile");
  }

  return resData.data.user;
};

