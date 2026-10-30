import { handlers } from "@/lib/auth";

/**
 * NextAuth route handler for authentication endpoints (sign in, callback, sign out).
 */
export const { GET, POST } = handlers;

