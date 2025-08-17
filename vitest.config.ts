import path from 'path';

import { defineConfig } from 'vitest/config';

export default defineConfig({
  esbuild: { jsx: 'automatic' },
  resolve: {
    alias: {
      '@rs-react': path.resolve(__dirname, 'src'),
      '@rs-react/components': path.resolve(__dirname, 'src/components'),
      '@rs-react/hooks': path.resolve(__dirname, 'src/hooks'),
      '@rs-react/store': path.resolve(__dirname, 'src/store'),
      '@rs-react/interfaces': path.resolve(__dirname, 'src/interfaces'),
      '@rs-react/constants': path.resolve(__dirname, 'src/constants'),
      '@rs-react/context': path.resolve(__dirname, 'src/context'),
      '@rs-react/assets': path.resolve(__dirname, 'src/assets'),
      'next/navigation': 'next/dist/client/components/navigation.js',
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setup-tests.ts',
    include: ['src/**/*.test.{ts,tsx}'],
    exclude: ['node_modules', 'dist'],
    deps: {
      inline: [/next-intl/],
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: ['src/**/*.{js,jsx,ts,tsx}'],
      exclude: [
        'src/**/*.test.{js,jsx,ts,tsx}',
        'src/**/*.spec.{js,jsx,ts,tsx}',
        'src/setup-tests.{js,ts}',
        'src/**/*.d.ts',
        '**/interfaces/**',
        '**/*.hook.ts',
        '**/context/**',
        '**/*.config.ts',
        'src/app/*',
        'src/i18n/*',
      ],
      thresholds: {
        global: { statements: 80, branches: 50, functions: 50, lines: 50 },
      },
    },
  },
});
