import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ locale, requestLocale }) => {
  const active = locale ?? (await requestLocale) ?? 'en';
  const messages = (await import(`./messages/${active}.json`)).default;
  return { locale: active, messages };
});
