import { hasLocale } from 'next-intl';
import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ locale: explicitLocale, requestLocale }) => {
  let locale = explicitLocale;

  if (!locale) {
    const raw = await requestLocale;
    if (raw && hasLocale(routing.locales, raw)) {
      locale = raw;
    }
  }

  // Fallback to default locale if not resolved or invalid
  if (!locale || !hasLocale(routing.locales, locale)) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
