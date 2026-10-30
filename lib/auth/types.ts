/**
 * Role hierarchy constants matching backend definitions.
 */
export const USER_ROLES = {
  CUSTOMER: "CUSTOMER",
  STAFF: "STAFF",
  STORE_ADMIN: "STORE_ADMIN",
  SUPER_ADMIN: "SUPER_ADMIN",
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

/**
 * Clean user profile representation exposed to server components and UI.
 * Never includes raw access or refresh tokens.
 */
export interface SafeUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string | null;
  phone?: string | null;
}

/**
 * Server-only tokens received from the backend authentication service.
 * Kept strictly inside encrypted server-side JWT / storage.
 */
export interface BackendTokens {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: number;
}

/**
 * Extended token stored securely in Auth.js encrypted JWT.
 */
export interface ExtendedJWT {
  user?: SafeUser;
  backendTokens?: BackendTokens;
  error?: "RefreshTokenError" | "InvalidSessionError";
}

/**
 * Standard backend response format.
 */
export interface BackendApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string | Record<string, unknown>;
}

/**
 * Backend login/refresh success payload.
 */
export interface BackendAuthData {
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    avatarUrl?: string | null;
    phone?: string | null;
  };
  accessToken: string;
}

/**
 * Form action state returned by server actions to client form components.
 */
export interface ActionState<T = unknown> {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
  data?: T;
}

