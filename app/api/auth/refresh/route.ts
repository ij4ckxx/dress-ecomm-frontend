import { NextRequest, NextResponse } from "next/server";
import { getToken, encode } from "next-auth/jwt";
import { refreshAccessToken } from "@/lib/api/auth.api";
import type { BackendTokens } from "@/lib/auth/types";

/**
 * Access token expiration buffer (14 minutes).
 */
const ACCESS_TOKEN_EXPIRY_BUFFER_MS = 14 * 60 * 1000;

/**
 * Silent session refresh route handler.
 * Called periodically by client-side SessionKeeper or on foreground tab focus
 * to maintain active user session seamlessly without sudden logouts.
 */
export async function POST(request: NextRequest) {
  const secret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET;
  if (!secret) {
    return NextResponse.json(
      { success: false, authenticated: false, message: "Missing auth secret" },
      { status: 500 }
    );
  }

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
    return NextResponse.json(
      { success: false, authenticated: false, message: "No active session" },
      { status: 401 }
    );
  }

  const token = await getToken({
    req: request,
    secret,
  });

  if (!token) {
    return NextResponse.json(
      { success: false, authenticated: false, message: "Invalid session token" },
      { status: 401 }
    );
  }

  const backendTokens = token.backendTokens as BackendTokens | undefined;
  if (!backendTokens?.refreshToken) {
    return NextResponse.json(
      {
        success: false,
        authenticated: false,
        message: "No refresh token available",
      },
      { status: 401 }
    );
  }

  try {
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

    const response = NextResponse.json({
      success: true,
      authenticated: true,
      user: refreshed.user,
    });

    response.cookies.set(activeCookieName, encodedToken, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      secure: isSecure,
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Token refresh failed";
    return NextResponse.json(
      { success: false, authenticated: false, message },
      { status: 401 }
    );
  }
}

