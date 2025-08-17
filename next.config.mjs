import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'rickandmortyapi.com', pathname: '/api/character/**' }
    ]
  }
};

export default withNextIntl(nextConfig);
