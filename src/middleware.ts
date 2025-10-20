import createMiddleware from 'next-intl/middleware';
import { locales } from './i18n';

export default createMiddleware({
  // A list of all locales that are supported
  locales: locales as unknown as string[],

  // Used when no locale matches
  defaultLocale: 'en',

  // Automatically detect user's locale based on browser settings
  localeDetection: true,

  // Disable locale prefix in the URL (optional)
  localePrefix: 'as-needed',
});

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(pl|en)/:path*', '/((?!_next|_vercel|.*\\..*).*)'],
};

