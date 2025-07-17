import path from 'path';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  base: '/rs_react/',
  plugins: [react()],
  resolve: {
    alias: {
      '@rs-react': path.resolve(__dirname, 'src'),
    },
  },
});
