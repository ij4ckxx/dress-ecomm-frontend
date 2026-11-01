import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { loginWithCredentials, loginWithSocial } from "../api/auth.api";
import { loginSchema } from "../validations/auth.schema";
import { BackendTokens, SafeUser } from "./types";

/**
 * Access token lifespan in milliseconds (14 minutes, giving 1-minute buffer before 15m backend expiry).
 */
const ACCESS_TOKEN_EXPIRY_BUFFER_MS = 14 * 60 * 1000;

export const authConfig: NextAuthConfig = {
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days (matching backend refresh token cookie)
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      /**
       * Validates incoming credentials against the backend service.
       */
      authorize: async (credentials) => {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) {
          return null;
        }

        try {
          const authResult = await loginWithCredentials(parsed.data);
          return {
            id: authResult.user.id,
            name: authResult.user.name,
            email: authResult.user.email,
            image: authResult.user.avatarUrl || null,
            // Pass server-only backend credentials into initial JWT callback
            userProfile: authResult.user,
            backendTokens: {
              accessToken: authResult.accessToken,
              refreshToken: authResult.refreshToken,
              accessTokenExpiresAt: Date.now() + ACCESS_TOKEN_EXPIRY_BUFFER_MS,
            },
          };
        } catch {
          return null;
        }
      },
    }),
    ...(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET
      ? [
          Google({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
          }),
        ]
      : []),
  ],
  callbacks: {
    /**
     * Server-side JWT callback managing user session and backend token initialization.
     * Note: Token rotation is handled in Middleware (`proxy.ts`), Server Actions (`getServerAccessToken`),
     * and the `/api/auth/refresh` route where cookies can be safely persisted to the browser.
     * Auto-refresh is omitted here to prevent desynchronization in read-only Server Component renders.
     */
    async jwt({ token, user, account }) {
      // 1. Initial login with Credentials
      if (user && "userProfile" in user && "backendTokens" in user) {
        token.user = user.userProfile as SafeUser;
        token.backendTokens = user.backendTokens as BackendTokens;
        return token;
      }

      // 2. Initial login with Social Provider (Google)
      if (account && account.provider === "google" && user) {
        try {
          const socialResult = await loginWithSocial({
            provider: "google",
            token: account.id_token || account.access_token,
            providerAccountId: account.providerAccountId,
            email: user.email || undefined,
            name: user.name || undefined,
            avatarUrl: user.image || null,
          });

          token.user = socialResult.user;
          token.backendTokens = {
            accessToken: socialResult.accessToken,
            refreshToken: socialResult.refreshToken,
            accessTokenExpiresAt: Date.now() + ACCESS_TOKEN_EXPIRY_BUFFER_MS,
          };
          return token;
        } catch {
          token.error = "RefreshTokenError";
          return token;
        }
      }

      // 3. Subsequent invocations: return existing token without mutating cookies in read-only contexts
      return token;
    },

    /**
     * Session callback projecting ONLY safe user information.
     * Raw access and refresh tokens are strictly prevented from reaching the client.
     */
    async session({ session, token }) {
      if (token.user) {
        const safe = token.user as SafeUser;
        session.user = {
          ...session.user,
          id: safe.id,
          name: safe.name,
          email: safe.email,
          role: safe.role,
          avatarUrl: safe.avatarUrl || null,
          phone: safe.phone || null,
        } as unknown as typeof session.user;
      }

      if (token.error) {
        (session as unknown as { error?: string }).error = token.error as string;
      }

      return session;
    },
  },
};

