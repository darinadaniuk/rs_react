import { createNavigation } from 'next-intl/navigation';

export const locales = ['en', 'ru'] as const;

export const { Link, useRouter, usePathname, redirect, permanentRedirect } =
  createNavigation({
    locales,
    defaultLocale: 'en',
    localePrefix: 'always',
  });
