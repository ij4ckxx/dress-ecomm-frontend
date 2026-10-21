import createMiddleware from 'next-intl/middleware';
import type { NextRequest } from 'next/server';
import { routing } from './i18n/routing';

const handleI18n = createMiddleware(routing);

export default function proxy(request: NextRequest) {
  return handleI18n(request);
}

export const config = {
  // Match only internationalized pathnames, skipping Next.js internals, static files, and api routes
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
