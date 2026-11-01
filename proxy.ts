import createMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";
import { getToken, encode } from "next-auth/jwt";
import { refreshAccessToken } from "./lib/api/auth.api";
import { routing } from "./i18n/routing";
import type { BackendTokens } from "./lib/auth/types";

const handleI18n = createMiddleware(routing);

/**
 * Access token expiration buffer (14 minutes).
 */
const ACCESS_TOKEN_EXPIRY_BUFFER_MS = 14 * 60 * 1000;

/**
 * Proactive refresh threshold (refresh if expiring within 2 minutes).
 */
const PROACTIVE_REFRESH_WINDOW_MS = 2 * 60 * 1000;

/**
 * Next.js 16 Edge / Server middleware proxying localized storefront navigation
 * and ensuring active user session access tokens are refreshed proactively.
 */
export default async function proxy(request: NextRequest) {
  // 1. Process internationalization routing first
  const response = handleI18n(request);

  // If next-intl generated a redirect or special response, return immediately
  if (response.headers.get("location")) {
    return response;
  }

  // 2. Identify active session cookie name
  const isSecure =
    process.env.NODE_ENV === "production" &&
    !request.headers.get("host")?.includes("localhost");

  const candidateNames = isSecure
    ? [
        "__Secure-authjs.session-token",
        "__Secure-next-auth.session-token",
        "authjs.session-token",
        "next-auth.session-token",
      ]
    : [
        "authjs.session-token",
        "next-auth.session-token",
        "__Secure-authjs.session-token",
        "__Secure-next-auth.session-token",
      ];

  let activeCookieName: string | null = null;
  for (const name of candidateNames) {
    if (request.cookies.get(name)) {
      activeCookieName = name;
      break;
    }
  }

  if (!activeCookieName) {
    return response;
  }

  const secret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET;
  if (!secret) {
    return response;
  }

  // 3. Inspect session token for impending expiration
  try {
    let token = await getToken({
      req: request,
      secret,
      cookieName: activeCookieName,
      salt: activeCookieName,
      secureCookie: isSecure,
    });

    if (!token) {
      token = await getToken({
        req: request,
        secret,
      });
    }

    if (!token) {
      return response;
    }

    const backendTokens = token.backendTokens as BackendTokens | undefined;
    if (!backendTokens?.refreshToken) {
      return response;
    }

    const isExpiringSoon =
      !backendTokens.accessTokenExpiresAt ||
      Date.now() >= backendTokens.accessTokenExpiresAt - PROACTIVE_REFRESH_WINDOW_MS;

    if (!isExpiringSoon) {
      return response;
    }

    // Proactively rotate and refresh the backend access token before downstream SSR renders
    const refreshed = await refreshAccessToken(backendTokens.refreshToken, {
      userAgent: request.headers.get("user-agent") || undefined,
      ipAddress: request.headers.get("x-forwarded-for") || undefined,
    });

    token.user = refreshed.user;
    token.backendTokens = {
      accessToken: refreshed.accessToken,
      refreshToken: refreshed.refreshToken,
      accessTokenExpiresAt: Date.now() + ACCESS_TOKEN_EXPIRY_BUFFER_MS,
    };
    delete token.error;

    const encodedToken = await encode({
      token,
      secret,
      salt: activeCookieName,
      maxAge: 7 * 24 * 60 * 60,
    });

    // 1. Update outgoing response cookies so browser receives the fresh session
    response.cookies.set(activeCookieName, encodedToken, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      secure: isSecure,
      maxAge: 7 * 24 * 60 * 60,
    });

    // 2. Update incoming request cookies so downstream Server Components read the fresh token
    request.cookies.set(activeCookieName, encodedToken);
  } catch (error) {
    // Gracefully continue without interrupting storefront navigation on transient errors
    console.warn("Middleware proactive token refresh skipped:", error);
  }

  return response;
}

export const config = {
  // Match only internationalized pathnames, skipping Next.js internals, static files, and api routes
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
